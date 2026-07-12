export type NavLink = {
  id: string;
  label: string;
  href: string;
};

/**
 * サイト全体のナビゲーションリンク（唯一の定義元）。
 * Header / HamburgerMenu / Footer はここから必要な項目だけを取り出して使う。
 */
export const NAV_LINKS: NavLink[] = [
  { id: "top", label: "TOP", href: "/" },
  { id: "activity", label: "活動内容", href: "#activity" },
  { id: "about", label: "代表の思い", href: "#about" },
  { id: "news", label: "お知らせ", href: "#news" },
  { id: "results", label: "活動実績", href: "#results" },
  { id: "overview", label: "団体概要", href: "#overview" },
  { id: "support", label: "応援する", href: "#support" },
];

/** id の配列で指定した順に NAV_LINKS から抽出する */
export function pickNavLinks(ids: string[]): NavLink[] {
  return ids
    .map((id) => NAV_LINKS.find((link) => link.id === id))
    .filter((link): link is NavLink => Boolean(link));
}
