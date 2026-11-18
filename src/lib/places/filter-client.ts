/**
 * 「福祉」マップの絞り込み・バナー開閉・地図連動。
 */
import { PLACES_EVENTS } from "./events";

export type PlacesFilterLabels = {
  openMapLabel: string;
  closeMapLabel: string;
};

function parseJsonArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function setPressed(btn: Element, pressed: boolean) {
  btn.setAttribute("aria-pressed", pressed ? "true" : "false");
}

export function initPlacesFilter(labels: PlacesFilterLabels) {
  const { openMapLabel, closeMapLabel } = labels;
  const cards = [...document.querySelectorAll(".place-card")];
  const prefButtons = [...document.querySelectorAll(".place-pref-btn")];
  const clearButtons = [...document.querySelectorAll(".place-clear-btn")];
  const emptyEls = [...document.querySelectorAll("[data-place-empty]")];
  const countEls = [...document.querySelectorAll("[data-place-result-count]")];

  let activePrefecture: string | null = null;
  const activeTags = new Set<string>();

  function closeAllBanners(exceptId?: string) {
    for (const card of cards) {
      if (!(card instanceof HTMLElement)) continue;
      if (exceptId && card.dataset.placeId === exceptId) continue;
      setBannerOpen(card, false);
    }
  }

  function setBannerOpen(card: HTMLElement, open: boolean) {
    const toggle = card.querySelector(".place-banner-toggle");
    const panel = card.querySelector(".place-banner-panel");
    const hint = card.querySelector(".place-banner-hint");
    const iframe = card.querySelector(".place-banner-embed");

    card.dataset.open = open ? "true" : "false";
    if (toggle) toggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (hint) hint.textContent = open ? closeMapLabel : openMapLabel;

    if (panel instanceof HTMLElement) {
      panel.hidden = !open;
      panel.classList.toggle("hidden", !open);
    }

    if (open && iframe instanceof HTMLIFrameElement) {
      const src = iframe.dataset.src;
      if (src && !iframe.getAttribute("src")) {
        iframe.src = src;
      }
    }
  }

  function syncChipPressed() {
    for (const chip of document.querySelectorAll(
      ".place-filter-chip, .place-online-btn",
    )) {
      if (!(chip instanceof HTMLElement)) continue;
      const type = chip.dataset.filterType;
      const value = chip.dataset.filterValue;
      const pressed =
        (type === "prefecture" && value === activePrefecture) ||
        (type === "tag" && Boolean(value) && activeTags.has(value!));
      setPressed(chip, pressed);
    }
  }

  function notifyMap() {
    document.dispatchEvent(new CustomEvent(PLACES_EVENTS.filterChanged));
  }

  function applyFilter() {
    let visible = 0;
    for (const card of cards) {
      if (!(card instanceof HTMLElement)) continue;
      const prefs = parseJsonArray(card.dataset.prefectures ?? null);
      const tags = parseJsonArray(card.dataset.tags ?? null);
      const prefOk = !activePrefecture || prefs.includes(activePrefecture);
      const tagsOk =
        activeTags.size === 0 ||
        [...activeTags].every((tag) => tags.includes(tag));
      const show = prefOk && tagsOk;
      card.hidden = !show;
      if (!show) setBannerOpen(card, false);
      if (show) visible += 1;
    }

    for (const el of countEls) el.textContent = String(visible);
    for (const el of emptyEls) el.classList.toggle("hidden", visible > 0);

    const filtering = Boolean(activePrefecture) || activeTags.size > 0;
    for (const btn of clearButtons) {
      if (btn instanceof HTMLElement) btn.hidden = !filtering;
    }

    for (const b of prefButtons) {
      if (!(b instanceof HTMLElement)) continue;
      setPressed(b, b.dataset.prefecture === activePrefecture);
    }

    syncChipPressed();
    notifyMap();
  }

  function clearFilters() {
    activePrefecture = null;
    activeTags.clear();
    applyFilter();
  }

  function togglePrefecture(value: string) {
    activePrefecture = activePrefecture === value ? null : value;
    applyFilter();
  }

  function setPrefecture(value: string | null) {
    activePrefecture = value;
    applyFilter();
  }

  function toggleTag(value: string) {
    if (activeTags.has(value)) activeTags.delete(value);
    else activeTags.add(value);
    applyFilter();
  }

  for (const btn of prefButtons) {
    btn.addEventListener("click", () => {
      if (!(btn instanceof HTMLElement)) return;
      const pref = btn.dataset.prefecture;
      if (!pref) return;
      togglePrefecture(pref);
    });
  }

  for (const card of cards) {
    if (!(card instanceof HTMLElement)) continue;
    const toggle = card.querySelector(".place-banner-toggle");
    toggle?.addEventListener("click", () => {
      const willOpen = card.dataset.open !== "true";
      if (willOpen) closeAllBanners(card.dataset.placeId);
      setBannerOpen(card, willOpen);
      if (willOpen && card.dataset.placeId) {
        document.dispatchEvent(
          new CustomEvent(PLACES_EVENTS.focusMarker, {
            detail: { id: card.dataset.placeId },
          }),
        );
      }
    });

    card.addEventListener(PLACES_EVENTS.openCard, () => {
      closeAllBanners(card.dataset.placeId);
      setBannerOpen(card, true);
    });
  }

  for (const chip of document.querySelectorAll(".place-filter-chip")) {
    chip.addEventListener("click", (event) => {
      event.stopPropagation();
      if (!(chip instanceof HTMLElement)) return;
      const type = chip.dataset.filterType;
      const value = chip.dataset.filterValue;
      if (!type || !value) return;
      if (type === "prefecture") togglePrefecture(value);
      else if (type === "tag") toggleTag(value);
    });
  }

  for (const btn of document.querySelectorAll(".place-online-btn")) {
    btn.addEventListener("click", () => {
      if (!(btn instanceof HTMLElement)) return;
      const value = btn.dataset.filterValue;
      if (!value) return;
      toggleTag(value);
    });
  }

  document.addEventListener(PLACES_EVENTS.selectPrefecture, (event) => {
    const detail = (event as CustomEvent<{ prefecture?: string | null }>).detail;
    const name = detail?.prefecture;
    setPrefecture(name ? name : null);
  });

  for (const btn of clearButtons) {
    btn.addEventListener("click", clearFilters);
  }

  applyFilter();
}
