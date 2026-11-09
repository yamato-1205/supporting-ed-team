/**
 * 任意団体としての「この1年」タイムライン（2025-11〜2026-11）。
 * 6年史は載せない。リンク先は note のイベント報告。
 */
export type AnniversaryYearItem = {
  dateLabel: string;
  title: string;
  href?: string;
};

export const ANNIVERSARY_YEAR = {
  id: "anniversary-year",
  title: "任意団体としての、この1年",
  lead: "設立から1周年までのできごとを、ざっと振り返ります。",
  items: [
    {
      dateLabel: "2025.11",
      title: "任意団体としてスタート／GVフェスタ",
      href: "https://note.com/sapochimu/n/nff00a33343f5",
    },
    {
      dateLabel: "2025.12",
      title: "大阪大学茶道部とのお茶会",
      href: "https://note.com/sapochimu/n/n990222853077",
    },
    {
      dateLabel: "2026.01",
      title: "「居場所」コミュニティ運営者の放課後（WelCaMe）",
      href: "https://note.com/sapochimu/n/nc08e25fe3f1e",
    },
    {
      dateLabel: "2026.02",
      title: "KtoY×さぽちむ座談会",
      href: "https://note.com/sapochimu/n/n8e08ab88f9e8",
    },
    {
      dateLabel: "2026.03",
      title: "公務員福祉職の座談会（WelCaMe）",
      href: "https://note.com/sapochimu/n/n01cea9369711",
    },
    {
      dateLabel: "2026.04",
      title: "阪大合同新歓",
      href: "https://note.com/sapochimu/n/ne861e7a0af75",
    },
    {
      dateLabel: "2026.05",
      title: "茶道体験イベント",
      href: "https://note.com/sapochimu/n/n3037815b6f20",
    },
    {
      dateLabel: "2026.07",
      title: "「居場所」コミュニティ運営者の放課後 No.2",
      href: "https://note.com/sapochimu/n/n2a7656581de7",
    },
    {
      dateLabel: "2026夏〜",
      title: "「福祉」を発掘！プロジェクト開始",
      href: "https://note.com/sapochimu/n/n992f0c743d27",
    },
    {
      dateLabel: "2026.11",
      title: "設立1周年／マンスリーサポーター募集",
      href: "https://syncable.biz/campaign/11070",
    },
  ] satisfies AnniversaryYearItem[],
} as const;
