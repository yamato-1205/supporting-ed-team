/** 地図 ↔ 絞り込みの CustomEvent 名（唯一の定義元） */
export const PLACES_EVENTS = {
  filterChanged: "places:filter-changed",
  focusMarker: "places:focus-marker",
  openCard: "places:open-card",
} as const;

export type PlacesEventName =
  (typeof PLACES_EVENTS)[keyof typeof PLACES_EVENTS];
