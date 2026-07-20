import xIcon from "../assets/X.png";
import igIcon from "../assets/Instagram.png";
import noteIcon from "../assets/note.png";
import fbIcon from "../assets/Facebook.png";

export type SnsId = "x" | "instagram" | "note" | "facebook";

export type SnsPlacement = "hamburger" | "footer" | "representative";

type SnsUrls = Partial<Record<SnsId, string>>;

/**
 * ============================================================
 * SNSのリンク先（編集するのはここだけ）
 * ============================================================
 *
 * 場所ごとにURLを分けています。同じサービスでも、
 * 団体アカウント／代表アカウントなどで差し替え可能です。
 *
 * - hamburger      … ハンバーガーメニュー下部のアイコン
 * - footer         … フッターの家型アイコン
 * - representative … TOP「代表の思い」のSNSアイコン
 *
 * ※ 活動実績に埋め込む「おすすめ投稿」のURLは
 *    src/data/socialLinks.ts 側で設定します。
 */
export const SNS_URLS: Record<SnsPlacement, SnsUrls> = {
  hamburger: {
    x: "https://x.com/sapochimu",
    instagram: "https://www.instagram.com/sapochimu/",
    note: "https://note.com/sapochimu",
    facebook: "https://www.facebook.com/people/%E3%81%95%E3%81%BD%E3%81%A1%E3%82%80supporTEAM/100063885861972/", // TODO: 団体のFacebook URLに差し替え
  },
  footer: {
    x: "https://x.com/sapochimu",
    instagram: "https://www.instagram.com/sapochimu/",
    note: "https://note.com/sapochimu",
    facebook: "https://www.facebook.com/people/%E3%81%95%E3%81%BD%E3%81%A1%E3%82%80supporTEAM/100063885861972/", // TODO: 団体のFacebook URLに差し替え
  },
  /** 代表ふうか用（個人アカウントがある場合はここを変更） */
  representative: {
    x: "https://x.com/fuka88_726",
    instagram: "https://www.instagram.com/fuka88_726/",
    note: "https://note.com/fuka88_726",
  },
};

/** 各場所で表示するSNSの順番 */
const SNS_ORDER: Record<SnsPlacement, SnsId[]> = {
  hamburger: ["x", "instagram", "note", "facebook"],
  footer: ["x", "instagram", "note", "facebook"],
  representative: ["x", "instagram", "note"],
};

/** アイコン・ラベルなどの見た目情報 */
const SNS_META: Record<
  SnsId,
  { label: string; icon: ImageMetadata; invert: boolean }
> = {
  x: { label: "X (Twitter)", icon: xIcon, invert: true },
  instagram: { label: "Instagram", icon: igIcon, invert: false },
  note: { label: "note", icon: noteIcon, invert: true },
  facebook: { label: "Facebook", icon: fbIcon, invert: false },
};

export type SnsLink = {
  id: SnsId;
  label: string;
  href: string;
  icon: ImageMetadata;
  invert: boolean;
};

/** 指定した場所用のSNSリンク一覧を返す */
export function getSnsLinks(placement: SnsPlacement): SnsLink[] {
  const urls = SNS_URLS[placement];
  return SNS_ORDER[placement]
    .filter((id) => Boolean(urls[id]))
    .map((id) => ({
      id,
      href: urls[id]!,
      ...SNS_META[id],
    }));
}

/** @deprecated getSnsLinks を使ってください */
export type SnsLinkId = SnsId;
export function pickSnsLinks(ids: SnsId[]): Omit<SnsLink, "href">[] {
  return ids.map((id) => ({ id, ...SNS_META[id] }));
}
