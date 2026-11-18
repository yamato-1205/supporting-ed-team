/**
 * 天気予報スタイルの分布図。
 * x / y は land-main.jpg の左上 0、右下 100。沖縄は別枠。
 * 構図を差し替えたら、この数字だけ合わせる。
 */
export type JapanMapAnchor = {
  prefecture: string;
  x: number;
  y: number;
};

export type JapanMapView = {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
};

export type JapanMapRegion = {
  id: string;
  name: string;
  prefectures: string[];
  /** 全国図での印 */
  x: number;
  y: number;
  /** 地方を開いたときの表示範囲 */
  view: JapanMapView;
  /** true のとき land-okinawa.jpg を全面に使う */
  inset?: boolean;
};

export const JAPAN_MAP_ANCHORS: JapanMapAnchor[] = [
  { prefecture: "北海道", x: 83, y: 14 },
  { prefecture: "青森県", x: 75, y: 28 },
  { prefecture: "岩手県", x: 81, y: 36 },
  { prefecture: "宮城県", x: 78, y: 42 },
  { prefecture: "秋田県", x: 70, y: 36 },
  { prefecture: "山形県", x: 72, y: 42 },
  { prefecture: "福島県", x: 75, y: 49 },
  { prefecture: "茨城県", x: 81, y: 55 },
  { prefecture: "栃木県", x: 74, y: 54 },
  { prefecture: "群馬県", x: 69, y: 55 },
  { prefecture: "埼玉県", x: 73, y: 58 },
  { prefecture: "千葉県", x: 75, y: 47 },
  { prefecture: "東京都", x: 69, y: 51 },
  { prefecture: "神奈川県", x: 70, y: 54 },
  { prefecture: "新潟県", x: 64, y: 54 },
  { prefecture: "富山県", x: 57, y: 59 },
  { prefecture: "石川県", x: 52, y: 57 },
  { prefecture: "福井県", x: 50, y: 62 },
  { prefecture: "山梨県", x: 70, y: 64 },
  { prefecture: "長野県", x: 65, y: 59 },
  { prefecture: "岐阜県", x: 60, y: 64 },
  { prefecture: "静岡県", x: 68, y: 67 },
  { prefecture: "愛知県", x: 63, y: 58 },
  { prefecture: "三重県", x: 57, y: 62 },
  { prefecture: "滋賀県", x: 54, y: 53 },
  { prefecture: "京都府", x: 50, y: 59 },
  { prefecture: "大阪府", x: 46, y: 59 },
  { prefecture: "兵庫県", x: 38, y: 58 },
  { prefecture: "奈良県", x: 47, y: 72 },
  { prefecture: "和歌山県", x: 45, y: 76 },
  { prefecture: "鳥取県", x: 34, y: 64 },
  { prefecture: "島根県", x: 27, y: 62 },
  { prefecture: "岡山県", x: 37, y: 70 },
  { prefecture: "広島県", x: 32, y: 72 },
  { prefecture: "山口県", x: 24, y: 72 },
  { prefecture: "徳島県", x: 42, y: 75 },
  { prefecture: "香川県", x: 39, y: 72 },
  { prefecture: "愛媛県", x: 34, y: 77 },
  { prefecture: "高知県", x: 37, y: 81 },
  { prefecture: "福岡県", x: 21, y: 75 },
  { prefecture: "佐賀県", x: 16, y: 77 },
  { prefecture: "長崎県", x: 12, y: 80 },
  { prefecture: "熊本県", x: 19, y: 83 },
  { prefecture: "大分県", x: 24, y: 79 },
  { prefecture: "宮崎県", x: 21, y: 88 },
  { prefecture: "鹿児島県", x: 16, y: 93 },
  { prefecture: "沖縄県", x: 50, y: 55 },
];

export const JAPAN_MAP_REGIONS: JapanMapRegion[] = [
  {
    id: "hokkaido",
    name: "北海道",
    prefectures: ["北海道"],
    x: 82,
    y: 16,
    view: { x0: 68, y0: 2, x1: 98, y1: 28 },
  },
  {
    id: "tohoku",
    name: "東北",
    prefectures: ["青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県"],
    x: 76,
    y: 38,
    view: { x0: 62, y0: 22, x1: 92, y1: 56 },
  },
  {
    id: "kanto",
    name: "関東",
    prefectures: ["茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県"],
    x: 74,
    y: 52,
    view: { x0: 60, y0: 42, x1: 92, y1: 66 },
  },
  {
    id: "chubu",
    name: "中部",
    prefectures: ["新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県", "静岡県", "愛知県"],
    x: 60,
    y: 60,
    view: { x0: 44, y0: 48, x1: 78, y1: 74 },
  },
  {
    id: "kinki",
    name: "近畿",
    prefectures: ["三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県"],
    x: 48,
    y: 62,
    view: { x0: 30, y0: 46, x1: 68, y1: 84 },
  },
  {
    id: "chugoku",
    name: "中国",
    prefectures: ["鳥取県", "島根県", "岡山県", "広島県", "山口県"],
    x: 32,
    y: 66,
    view: { x0: 14, y0: 52, x1: 50, y1: 82 },
  },
  {
    id: "shikoku",
    name: "四国",
    prefectures: ["徳島県", "香川県", "愛媛県", "高知県"],
    x: 38,
    y: 76,
    view: { x0: 26, y0: 66, x1: 52, y1: 90 },
  },
  {
    id: "kyushu",
    name: "九州",
    prefectures: ["福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県"],
    x: 20,
    y: 82,
    view: { x0: 4, y0: 66, x1: 40, y1: 99 },
  },
  {
    id: "okinawa",
    name: "沖縄",
    prefectures: ["沖縄県"],
    x: 18,
    y: 88,
    view: { x0: 0, y0: 0, x1: 100, y1: 100 },
    inset: true,
  },
];
