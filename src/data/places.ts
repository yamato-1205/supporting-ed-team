/**
 * 居場所マップページの静的テキスト・都道府県定義。
 * コンテンツ本体は microCMS の location エンドポイント。
 */
import japanMapImg from "../assets/places/japan-map.png";
import xIcon from "../assets/icons/x.png";
import igIcon from "../assets/icons/instagram.png";
import fbIcon from "../assets/icons/facebook.png";
import type { Location } from "../lib/microcms";

export type LocationSnsLink = {
  id: "twitter" | "instagram" | "facebook";
  label: string;
  href: string;
  icon: ImageMetadata;
  invert: boolean;
};

export const PLACES_PAGE = {
  title: "居場所マップ",
  description:
    "さぽちむがつなぐ全国の居場所を、地図とキーワードから探せます。凸凹を抱えたまま関われる場との出会いを応援します。",
  lead: "誰もが福祉の一員である",
  intro:
    "凸凹を抱えたまま関われる場は、思いのほかたくさんあります。\n地図やキーワードから、あなたにちょうどいい居場所を見つけてみてください。",
  mapTitle: "マップから探す",
  mapLead:
    "都道府県のシャボン玉で地域から探せます。場所にとらわれず関わりたいときは、地図の近くの「オンライン」もどうぞ。",
  onlineLabel: "オンライン",
  onlineLead: "地域を問わず、オンラインで関われる居場所",
  /** オンライン絞り込みに使う genre / field タグ名 */
  onlineTag: "オンライン",
  listTitle: "居場所一覧",
  fieldLabel: "分野",
  genreLabel: "カテゴリ",
  openMap: "詳細",
  closeMap: "閉じる",
  openInGoogle: "Googleマップで開く",
  noteLabel: "居場所の紹介",
  hpLabel: "公式サイト",
  linksLabel: "リンク",
  addressLabel: "所在地",
  empty: "条件に合う居場所がまだありません。条件を変えてみてください。",
  clearFilter: "絞り込みを解除",
  allPrefectures: "すべて",
  statsPrefLabel: "掲載のある都道府県",
  statsCountLabel: "掲載居場所",
  diagram: japanMapImg,
} as const;

/** 地方区分（マップUIの並び用） */
export const REGION_GROUPS: { name: string; prefectures: string[] }[] = [
  {
    name: "北海道・東北",
    prefectures: [
      "北海道",
      "青森県",
      "岩手県",
      "宮城県",
      "秋田県",
      "山形県",
      "福島県",
    ],
  },
  {
    name: "関東",
    prefectures: [
      "茨城県",
      "栃木県",
      "群馬県",
      "埼玉県",
      "千葉県",
      "東京都",
      "神奈川県",
    ],
  },
  {
    name: "中部",
    prefectures: [
      "新潟県",
      "富山県",
      "石川県",
      "福井県",
      "山梨県",
      "長野県",
      "岐阜県",
      "静岡県",
      "愛知県",
    ],
  },
  {
    name: "近畿",
    prefectures: [
      "三重県",
      "滋賀県",
      "京都府",
      "大阪府",
      "兵庫県",
      "奈良県",
      "和歌山県",
    ],
  },
  {
    name: "中国",
    prefectures: ["鳥取県", "島根県", "岡山県", "広島県", "山口県"],
  },
  {
    name: "四国",
    prefectures: ["徳島県", "香川県", "愛媛県", "高知県"],
  },
  {
    name: "九州・沖縄",
    prefectures: [
      "福岡県",
      "佐賀県",
      "長崎県",
      "熊本県",
      "大分県",
      "宮崎県",
      "鹿児島県",
      "沖縄県",
    ],
  },
];

export function countByPrefecture(locations: Location[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const loc of locations) {
    for (const pref of loc.prefectures ?? []) {
      counts.set(pref, (counts.get(pref) ?? 0) + 1);
    }
  }
  return counts;
}

/** オンラインタグを持つ居場所数 */
export function countOnline(locations: Location[]): number {
  const tag = PLACES_PAGE.onlineTag;
  return locations.filter((loc) =>
    [...(loc.field ?? []), ...(loc.genre ?? [])].includes(tag),
  ).length;
}

export function countByTag(
  locations: Location[],
  key: "field" | "genre",
): Map<string, number> {
  const counts = new Map<string, number>();
  for (const loc of locations) {
    for (const tag of loc[key] ?? []) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "ja"))
    .reduce((map, [tag, n]) => map.set(tag, n), new Map<string, number>());
}

export function googleMapsEmbedUrl(lat: number, lng: number, zoom = 15): string {
  const q = encodeURIComponent(`${lat},${lng}`);
  return `https://maps.google.com/maps?q=${q}&z=${zoom}&output=embed&hl=ja`;
}

export function googleMapsLink(address: string): string {
  const q = encodeURIComponent(address);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

/** 居場所に設定されている SNS だけ返す（未設定は省略） */
export function getLocationSnsLinks(location: {
  twitter?: string;
  instagram?: string;
  facebook?: string;
}): LocationSnsLink[] {
  const entries: {
    id: LocationSnsLink["id"];
    label: string;
    href?: string;
    icon: ImageMetadata;
    invert: boolean;
  }[] = [
    {
      id: "twitter",
      label: "X (Twitter)",
      href: location.twitter,
      icon: xIcon,
      // x.png は黒地に白ロゴ。invert すると黒一色に見えるので付けない
      invert: false,
    },
    {
      id: "instagram",
      label: "Instagram",
      href: location.instagram,
      icon: igIcon,
      invert: false,
    },
    {
      id: "facebook",
      label: "Facebook",
      href: location.facebook,
      icon: fbIcon,
      invert: false,
    },
  ];

  return entries
    .filter((e): e is typeof e & { href: string } => Boolean(e.href))
    .map(({ id, label, href, icon, invert }) => ({
      id,
      label,
      href,
      icon,
      invert,
    }));
}
