import xIcon from "../assets/X.png";
import igIcon from "../assets/Instagram.png";
import noteIcon from "../assets/note.png";
import fbIcon from "../assets/Facebook.png";

export type SnsLinkId = "x" | "instagram" | "note" | "facebook";

export type SnsLink = {
  id: SnsLinkId;
  label: string;
  icon: ImageMetadata;
  /** 濃色背景の上で白抜き表示させる必要があるか（Footer など） */
  invert: boolean;
};

/**
 * SNSリンク一覧（唯一の定義元）。
 * HamburgerMenu / Footer / RepresentativeSection はここから必要な項目だけを取り出して使う。
 */
export const SNS_LINKS: SnsLink[] = [
  { id: "x", label: "X (Twitter)", icon: xIcon, invert: true },
  { id: "instagram", label: "Instagram", icon: igIcon, invert: false },
  { id: "note", label: "note", icon: noteIcon, invert: true },
  { id: "facebook", label: "Facebook", icon: fbIcon, invert: false },
];

/** id の配列で指定した順に SNS_LINKS から抽出する */
export function pickSnsLinks(ids: SnsLinkId[]): SnsLink[] {
  return ids
    .map((id) => SNS_LINKS.find((link) => link.id === id))
    .filter((link): link is SnsLink => Boolean(link));
}
