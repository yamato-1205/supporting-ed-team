/**
 * イラスト日本地図。地方まで寄り、都道府県を押すと下の一覧を絞る。
 */
import { JAPAN_MAP_REGIONS } from "../../data/japan-map-anchors";
import { PLACES_EVENTS } from "./events";

type ViewBox = [number, number, number, number];
type Mode = "national" | "region";

function officialName(title: string) {
  const short = title.split(" / ")[0]?.trim() ?? title;
  if (short === "北海道") return "北海道";
  if (short === "東京") return "東京都";
  if (short === "大阪") return "大阪府";
  if (short === "京都") return "京都府";
  if (/[都道府県]$/.test(short)) return short;
  return `${short}県`;
}

function parseCounts(raw: string | undefined) {
  const counts = new Map<string, number>();
  if (!raw) return counts;
  try {
    const parsed = JSON.parse(raw) as Record<string, number>;
    for (const [key, value] of Object.entries(parsed)) counts.set(key, value);
  } catch {
    /* 件数なし */
  }
  return counts;
}

function svgPointBox(el: SVGGraphicsElement, svg: SVGSVGElement) {
  const local = el.getBBox();
  const elCtm = el.getScreenCTM();
  const svgCtm = svg.getScreenCTM();
  if (!elCtm || !svgCtm) return null;
  const toSvg = svgCtm.inverse().multiply(elCtm);
  const point = svg.createSVGPoint();
  const corners = [
    [local.x, local.y],
    [local.x + local.width, local.y],
    [local.x, local.y + local.height],
    [local.x + local.width, local.y + local.height],
  ].map(([x, y]) => {
    point.x = x;
    point.y = y;
    return point.matrixTransform(toSvg);
  });
  const xs = corners.map((p) => p.x);
  const ys = corners.map((p) => p.y);
  const x0 = Math.min(...xs);
  const y0 = Math.min(...ys);
  return {
    x: x0,
    y: y0,
    width: Math.max(...xs) - x0,
    height: Math.max(...ys) - y0,
  };
}

function unionBoxes(
  boxes: { x: number; y: number; width: number; height: number }[],
) {
  const x0 = Math.min(...boxes.map((b) => b.x));
  const y0 = Math.min(...boxes.map((b) => b.y));
  const x1 = Math.max(...boxes.map((b) => b.x + b.width));
  const y1 = Math.max(...boxes.map((b) => b.y + b.height));
  return { x: x0, y: y0, width: x1 - x0, height: y1 - y0 };
}

function padBox(
  box: { x: number; y: number; width: number; height: number },
  pad = 0.14,
) {
  const dx = box.width * pad;
  const dy = box.height * pad;
  return {
    x: box.x - dx,
    y: box.y - dy,
    width: box.width + dx * 2,
    height: box.height + dy * 2,
  };
}

export function initDistributionMap() {
  const root = document.getElementById("japan-dist");
  if (!root || root.dataset.ready === "true") return;
  root.dataset.ready = "true";

  const svg = root.querySelector("svg");
  const labelLayer = root.querySelector<HTMLElement>("[data-labels]");
  const back = root.querySelector<HTMLButtonElement>("[data-back-national]");
  const caption = root.querySelector<HTMLElement>("[data-map-caption]");
  if (!(svg instanceof SVGSVGElement) || !labelLayer) return;

  const counts = parseCounts(root.dataset.counts);
  const regionByPref = new Map<string, (typeof JAPAN_MAP_REGIONS)[number]>();
  for (const region of JAPAN_MAP_REGIONS) {
    for (const pref of region.prefectures) regionByPref.set(pref, region);
  }

  const prefEls = new Map<string, SVGGraphicsElement>();
  for (const group of svg.querySelectorAll<SVGGElement>(".prefecture")) {
    const title = group.querySelector("title")?.textContent ?? "";
    const name = officialName(title);
    group.dataset.pref = name;
    prefEls.set(name, group);
    if ((counts.get(name) ?? 0) > 0) group.classList.add("has-count");
    group.addEventListener("click", (event) => {
      event.stopPropagation();
      onPrefClick(name);
    });
  }

  const initial = (svg.getAttribute("viewBox") ?? "0 0 1000 1000")
    .split(/\s+/)
    .map(Number) as ViewBox;
  let mode: Mode = "national";
  let currentRegionId: string | null = null;
  let selectedPref: string | null = null;
  let animating = false;
  const prefBoxes = new Map<
    string,
    { x: number; y: number; width: number; height: number }
  >();

  function regionShapes(regionId: string) {
    const region = JAPAN_MAP_REGIONS.find((item) => item.id === regionId);
    if (!region) return [];
    return region.prefectures
      .map((name) => prefEls.get(name))
      .filter((el): el is SVGGraphicsElement => Boolean(el));
  }

  function readViewBox(): ViewBox {
    const parts = (svg.getAttribute("viewBox") ?? initial.join(" "))
      .split(/\s+/)
      .map(Number);
    return [parts[0], parts[1], parts[2], parts[3]];
  }

  function animateViewBox(to: ViewBox) {
    const from = readViewBox();
    const started = performance.now();
    animating = true;
    const step = (now: number) => {
      const t = Math.min(1, (now - started) / 420);
      const e = 1 - (1 - t) ** 3;
      const next = from.map((value, index) => value + (to[index] - value) * e);
      svg.setAttribute("viewBox", next.join(" "));
      placeLabels();
      if (t < 1) requestAnimationFrame(step);
      else animating = false;
    };
    requestAnimationFrame(step);
  }

  function targetFor(regionId: string): ViewBox | null {
    const boxes = regionShapes(regionId)
      .map((el) => prefBoxes.get(el.dataset.pref ?? ""))
      .filter((box): box is NonNullable<typeof box> => Boolean(box));
    if (boxes.length === 0) return null;
    const box = padBox(unionBoxes(boxes));
    return [box.x, box.y, box.width, box.height];
  }

  function cacheBoxes() {
    for (const [name, el] of prefEls) {
      const box = svgPointBox(el, svg);
      if (box) prefBoxes.set(name, box);
    }
  }

  function markActive() {
    for (const [pref, el] of prefEls) {
      el.classList.toggle("is-on", mode === "region" && pref === selectedPref);
    }
  }

  function setPrefecture(name: string | null) {
    selectedPref = name;
    document.dispatchEvent(
      new CustomEvent(PLACES_EVENTS.selectPrefecture, {
        detail: { prefecture: name },
      }),
    );
    markActive();
  }

  function scrollToList() {
    const list = document.getElementById("place-results");
    if (!list) return;
    const rect = list.getBoundingClientRect();
    window.scrollTo({
      top: Math.max(0, rect.top + window.scrollY - 96),
      behavior: "smooth",
    });
  }

  function setHot(name: string | null) {
    const region = name ? regionByPref.get(name) : undefined;
    for (const [pref, el] of prefEls) {
      const regionHot =
        mode === "national" && Boolean(region?.prefectures.includes(pref));
      const prefHot = mode === "region" && pref === name;
      el.classList.toggle("is-region-hot", regionHot);
      el.classList.toggle("is-pref-hot", prefHot);
    }
  }

  function placeLabels() {
    const frame = svg.getBoundingClientRect();
    if (frame.width === 0) return;
    labelLayer.replaceChildren();
    const items: { name: string; count: number; x: number; y: number }[] = [];

    if (mode === "national") {
      for (const region of JAPAN_MAP_REGIONS) {
        const count = region.prefectures.reduce(
          (sum, pref) => sum + (counts.get(pref) ?? 0),
          0,
        );
        if (count === 0) continue;
        const boxes = regionShapes(region.id)
          .map((el) => el.getBoundingClientRect())
          .filter((box) => box.width > 0);
        if (boxes.length === 0) continue;
        const left = Math.min(...boxes.map((b) => b.left));
        const top = Math.min(...boxes.map((b) => b.top));
        const right = Math.max(...boxes.map((b) => b.right));
        const bottom = Math.max(...boxes.map((b) => b.bottom));
        items.push({
          name: region.name,
          count,
          x: ((left + right) / 2 - frame.left) / frame.width,
          y: ((top + bottom) / 2 - frame.top) / frame.height,
        });
      }
    } else {
      const region = JAPAN_MAP_REGIONS.find((item) => item.id === currentRegionId);
      if (!region) return;
      for (const pref of region.prefectures) {
        const count = counts.get(pref) ?? 0;
        if (count === 0) continue;
        const el = prefEls.get(pref);
        if (!el) continue;
        const box = el.getBoundingClientRect();
        if (box.width === 0) continue;
        items.push({
          name: pref.replace(/[都道府県]$/, ""),
          count,
          x: (box.left + box.width / 2 - frame.left) / frame.width,
          y: (box.top + box.height / 2 - frame.top) / frame.height,
        });
      }
    }

    for (const item of items) {
      const node = document.createElement("div");
      node.className = "japan-map-label";
      node.style.left = `${item.x * 100}%`;
      node.style.top = `${item.y * 100}%`;
      const count = document.createElement("span");
      count.className = "japan-map-label__count";
      count.textContent = String(item.count);
      const name = document.createElement("span");
      name.className = "japan-map-label__name";
      name.textContent = item.name;
      node.append(count, name);
      labelLayer.append(node);
    }
  }

  function showNational() {
    mode = "national";
    currentRegionId = null;
    setHot(null);
    if (back) back.hidden = true;
    if (caption) caption.textContent = "地方をタップ";
    setPrefecture(null);
    animateViewBox(initial);
  }

  function zoomRegion(regionId: string) {
    const next = targetFor(regionId);
    const region = JAPAN_MAP_REGIONS.find((item) => item.id === regionId);
    if (!next || !region) return;
    mode = "region";
    currentRegionId = regionId;
    setHot(null);
    if (back) {
      back.hidden = false;
      back.textContent = "全国へ";
    }
    if (caption) caption.textContent = region.name;
    markActive();
    animateViewBox(next);
  }

  function onPrefClick(name: string) {
    if (animating) return;
    if (prefBoxes.size === 0) cacheBoxes();
    const region = regionByPref.get(name);
    if (!region) return;
    if (mode === "national" || currentRegionId !== region.id) {
      setPrefecture(null);
      zoomRegion(region.id);
      return;
    }
    if ((counts.get(name) ?? 0) === 0) return;
    setPrefecture(name);
    scrollToList();
  }

  svg.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof Element && target.closest(".prefecture")) return;
    if (mode === "national" || animating) return;
    showNational();
  });

  svg.addEventListener("mouseover", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const group = target.closest<SVGGElement>(".prefecture");
    setHot(group?.dataset.pref ?? null);
  });

  svg.addEventListener("mouseout", (event) => {
    const next = event.relatedTarget;
    if (next instanceof Element && svg.contains(next) && next.closest(".prefecture")) {
      return;
    }
    setHot(null);
  });

  back?.addEventListener("click", () => {
    if (animating) return;
    showNational();
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element) || !target.closest(".place-clear-btn")) return;
    selectedPref = null;
    markActive();
  });

  if (back) back.hidden = true;
  if (caption) caption.textContent = "地方をタップ";
  requestAnimationFrame(() => {
    cacheBoxes();
    placeLabels();
  });
  window.addEventListener("resize", placeLabels);
}
