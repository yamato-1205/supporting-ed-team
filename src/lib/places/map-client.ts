/**
 * Leaflet + OpenFreeMap Positron の地図初期化。
 * APIキー不要。ピン色・大きさは CSS（.places-map-pin）側。
 */
import L from "leaflet";
import { setWorkerUrl } from "maplibre-gl";
import { maplibreGL } from "@maplibre/maplibre-gl-leaflet";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import "leaflet/dist/leaflet.css";
import "maplibre-gl/dist/maplibre-gl.css";
import { PLACES_EVENTS } from "./events";
import type { PlacesFocusMarkerDetail, PlacesMapPoint } from "./types";

setWorkerUrl(workerUrl);

const MAP_EL_ID = "places-leaflet-map";
const JAPAN_CENTER: L.LatLngExpression = [37.5, 137.5];
const JAPAN_ZOOM = 5;
const DETAIL_ZOOM = 13;
const JAPAN_BOUNDS = L.latLngBounds([24.0, 122.5], [46.2, 146.0]);
const MAP_STYLE = "https://tiles.openfreemap.org/styles/positron";

type MarkerEntry = {
  marker: L.Marker;
  point: PlacesMapPoint;
};

function parsePoints(raw: string | undefined): PlacesMapPoint[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (p): p is PlacesMapPoint =>
        Boolean(p) &&
        typeof p === "object" &&
        typeof (p as PlacesMapPoint).id === "string" &&
        typeof (p as PlacesMapPoint).name === "string" &&
        Number.isFinite((p as PlacesMapPoint).lat) &&
        Number.isFinite((p as PlacesMapPoint).lng),
    );
  } catch {
    return [];
  }
}

function headerOffsetPx() {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--header-height")
    .trim();
  const parsed = Number.parseFloat(raw);
  return (Number.isFinite(parsed) ? parsed : 64) + 12;
}

function scrollToPlaceCard(card: HTMLElement) {
  const top =
    window.scrollY + card.getBoundingClientRect().top - headerOffsetPx();
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}

function createPinIcon(active = false) {
  return L.divIcon({
    className: `places-map-pin${active ? " is-active" : ""}`,
    html: '<span class="places-map-pin__dot" aria-hidden="true"></span>',
    iconSize: active ? [22, 22] : [18, 18],
    iconAnchor: active ? [11, 11] : [9, 9],
    popupAnchor: [0, -10],
  });
}

function placeCardEl(id: string) {
  return document.querySelector(`.place-card[data-place-id="${CSS.escape(id)}"]`);
}

export function initPlacesMap() {
  const el = document.getElementById(MAP_EL_ID);
  if (!el || el.dataset.mapReady === "true") return;

  const points = parsePoints(el.dataset.points);
  if (points.length === 0) return;

  el.dataset.mapReady = "true";

  const map = L.map(el, {
    scrollWheelZoom: true,
    zoomControl: true,
    minZoom: 4,
    maxBounds: JAPAN_BOUNDS.pad(0.15),
    maxBoundsViscosity: 0.85,
  }).setView(JAPAN_CENTER, JAPAN_ZOOM);

  maplibreGL({
    style: MAP_STYLE,
    interactive: false,
    attributionControl: false,
  }).addTo(map);

  map.attributionControl.setPrefix("Leaflet");
  map.attributionControl.addAttribution(
    '<a href="https://openfreemap.org/" target="_blank" rel="noopener noreferrer">OpenFreeMap</a> © <a href="https://openmaptiles.org/" target="_blank" rel="noopener noreferrer">OpenMapTiles</a> Data from <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>',
  );

  const entries: MarkerEntry[] = [];
  const byId = new Map<string, MarkerEntry>();

  function setActivePin(id: string | null) {
    for (const entry of entries) {
      entry.marker.setIcon(createPinIcon(id !== null && entry.point.id === id));
    }
  }

  function openPlaceCard(id: string) {
    const card = placeCardEl(id);
    if (!(card instanceof HTMLElement) || card.hidden) return;
    scrollToPlaceCard(card);
    card.dispatchEvent(
      new CustomEvent(PLACES_EVENTS.openCard, { bubbles: true }),
    );
  }

  for (const point of points) {
    const marker = L.marker([point.lat, point.lng], {
      icon: createPinIcon(false),
      title: point.name,
      riseOnHover: true,
    });

    const popup = L.popup({ className: "places-map-popup", maxWidth: 240 });
    const wrap = document.createElement("div");
    const title = document.createElement("p");
    title.className = "font-bold";
    title.textContent = point.name;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "places-map-popup__btn";
    btn.textContent = "詳細を見る";
    btn.addEventListener("click", () => openPlaceCard(point.id));
    wrap.append(title, btn);
    popup.setContent(wrap);

    marker.bindPopup(popup);
    marker.on("click", () => setActivePin(point.id));

    const entry = { marker, point };
    entries.push(entry);
    byId.set(point.id, entry);
    marker.addTo(map);
  }

  function visibleEntries() {
    return entries.filter((entry) => {
      const card = placeCardEl(entry.point.id);
      return !(card instanceof HTMLElement) || !card.hidden;
    });
  }

  function fitToVisible(animate = true) {
    const visible = visibleEntries();
    for (const entry of entries) {
      const show = visible.includes(entry);
      if (show) {
        if (!map.hasLayer(entry.marker)) entry.marker.addTo(map);
      } else if (map.hasLayer(entry.marker)) {
        map.removeLayer(entry.marker);
      }
    }

    if (visible.length === 0) {
      map.setView(JAPAN_CENTER, JAPAN_ZOOM, { animate });
      return;
    }

    if (visible.length === 1) {
      const only = visible[0];
      map.setView([only.point.lat, only.point.lng], DETAIL_ZOOM, { animate });
      return;
    }

    const bounds = L.latLngBounds(
      visible.map((e) => [e.point.lat, e.point.lng] as L.LatLngTuple),
    );
    map.fitBounds(bounds.pad(0.18), { animate, maxZoom: 11 });
  }

  requestAnimationFrame(() => {
    map.invalidateSize();
    fitToVisible(false);
  });

  document.addEventListener(PLACES_EVENTS.filterChanged, () => {
    setActivePin(null);
    map.closePopup();
    fitToVisible(true);
  });

  document.addEventListener(PLACES_EVENTS.focusMarker, ((event: Event) => {
    const detail = (event as CustomEvent<PlacesFocusMarkerDetail>).detail;
    const id = detail?.id;
    if (!id) return;
    const entry = byId.get(id);
    if (!entry || !map.hasLayer(entry.marker)) return;

    setActivePin(id);
    map.setView([entry.point.lat, entry.point.lng], DETAIL_ZOOM, {
      animate: true,
    });
    entry.marker.openPopup();
  }) as EventListener);

  window.addEventListener("resize", () => {
    map.invalidateSize();
  });
}
