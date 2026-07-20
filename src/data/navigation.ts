export type NavLink = {
  id: string;
  label: string;
  href: string;
};

export type NavGroup = {
  label: string;
  href: string;
  children: { label: string; href: string }[];
};

/**
 * サイト全体のナビゲーションリンク（唯一の定義元）。
 * Header / HamburgerMenu / Footer はここから必要な項目だけを取り出して使う。
 */
export const NAV_LINKS: NavLink[] = [
  { id: "top", label: "TOP", href: "/" },
  { id: "activity", label: "活動内容", href: "/#activity" },
  { id: "about", label: "代表の思い", href: "/#about" },
  { id: "news", label: "お知らせ", href: "/#news" },
  { id: "results", label: "活動実績", href: "/#results" },
  { id: "overview", label: "団体概要", href: "/overview" },
  { id: "support", label: "応援する", href: "/support" },
];

/**
 * フッター・ハンバーガー共通の階層ナビ。
 * ページ構成やアンカーを変えるときはここだけ編集する。
 */
export const NAV_GROUPS: NavGroup[] = [
  {
    label: "ホーム",
    href: "/",
    children: [
      { label: "活動内容", href: "/#activity" },
      { label: "代表の思い", href: "/#about" },
      { label: "お知らせ", href: "/#news" },
      { label: "活動実績", href: "/#results" },
    ],
  },
  {
    label: "団体概要",
    href: "/overview",
    children: [
      { label: "存在意義", href: "/overview#existence" },
      { label: "文化", href: "/overview#existence-1" },
      { label: "チーム名の由来", href: "/overview#origin" },
    ],
  },
  {
    label: "応援する",
    href: "/support",
    children: [
      { label: "ご寄付が支えるもの", href: "/support#why" },
      { label: "ご寄付の使い道", href: "/support#usage" },
      { label: "寄付の方法", href: "/support#donate" },
    ],
  },
];

/** id の配列で指定した順に NAV_LINKS から抽出する */
export function pickNavLinks(ids: string[]): NavLink[] {
  return ids
    .map((id) => NAV_LINKS.find((link) => link.id === id))
    .filter((link): link is NavLink => Boolean(link));
}
