import xIcon from "../assets/icons/x.png";
import igIcon from "../assets/icons/instagram.png";
import noteIcon from "../assets/icons/note.png";
import fbIcon from "../assets/icons/facebook.png";

export type SnsId = "x" | "instagram" | "note" | "facebook";

export type SnsPlacement = "hamburger" | "footer" | "representative";

type SnsUrls = Partial<Record<SnsId, string>>;

/**
 * SNS のリンク先（編集するのはここだけ）。
 *
 * - hamburger      … ハンバーガーメニュー下部
 * - footer         … フッターの家型アイコン
 * - representative … TOP「代表の思い」
 *
 * 活動実績の埋め込み投稿は FEATURED_*_POST_URL を編集する。
 */
export const SNS_URLS: Record<SnsPlacement, SnsUrls> = {
  hamburger: {
    x: "https://x.com/sapochimu",
    instagram: "https://www.instagram.com/sapochimu/",
    note: "https://note.com/sapochimu",
    facebook:
      "https://www.facebook.com/people/%E3%81%95%E3%81%BD%E3%81%A1%E3%82%80supporTEAM/100063885861972/",
  },
  footer: {
    x: "https://x.com/sapochimu",
    instagram: "https://www.instagram.com/sapochimu/",
    note: "https://note.com/sapochimu",
    facebook:
      "https://www.facebook.com/people/%E3%81%95%E3%81%BD%E3%81%A1%E3%82%80supporTEAM/100063885861972/",
  },
  /** 代表ふうか用（個人アカウントがある場合はここを変更） */
  representative: {
    x: "https://x.com/fuka88_726",
    instagram: "https://www.instagram.com/fuka88_726/",
    note: "https://note.com/fuka88_726",
  },
};

/** 各場所で表示する SNS の順番 */
const SNS_ORDER: Record<SnsPlacement, SnsId[]> = {
  hamburger: ["x", "instagram", "note", "facebook"],
  footer: ["x", "instagram", "note", "facebook"],
  representative: ["x", "instagram", "note"],
};

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

/** 指定した場所用の SNS リンク一覧を返す */
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

/**
 * トップ「活動実績」に埋め込むおすすめ投稿。
 * 投稿ページで「リンクをコピー」して差し替える。
 */
export const FEATURED_X_POST_URL =
  "https://x.com/sapochimu/status/2065288911526740400?s=20";
export const FEATURED_INSTAGRAM_POST_URL =
  "https://www.instagram.com/p/DW0jLfegRoj/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==";
