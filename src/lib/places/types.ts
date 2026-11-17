/** 地図ピン用（クライアントへ JSON で渡す最小形） */
export type PlacesMapPoint = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

export type PlacesFilterChangedDetail = Record<string, never>;

export type PlacesFocusMarkerDetail = {
  id: string;
};

export type PlacesOpenCardDetail = Record<string, never>;
