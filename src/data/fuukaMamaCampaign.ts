/**
 * 代表ふうかの出産ドネーション。
 * 終了後もセクションは残し、お礼の文言に切り替える。
 */
export const FUUKA_MAMA_CAMPAIGN = {
  /** 2026-09-30 23:59:59.999 JST */
  endsAt: "2026-09-30T23:59:59.999+09:00",
  href: "https://syncable.biz/campaign/10436",
  imageAlt:
    "さぽちむ代表ふうかが赤ちゃんを抱き、無事に第一子を出産したことを伝えるポスター",
  open: {
    untilLabel: "9月30日まで",
    title: "出産ドネーションの立ち上げ",
    headline: "代表ふうかが、無事に第一子を出産しました！",
    body: "出産ドネーションを立ち上げました。\n近況報告や今後の思いを詰め込んでいるので、ぜひページをご覧ください。",
    buttonLabel: "詳しく見る",
  },
  closed: {
    untilLabel: "募集終了",
    title: "出産ドネーション",
    headline: "出産ドネーションは終了しました。",
    body: "たくさんの応援、ありがとうございました！\n近況報告や今後の思いは、引き続きページからご覧いただけます。",
    buttonLabel: "詳しく見る",
  },
} as const;

export function isFuukaMamaCampaignOpen(now = Date.now()): boolean {
  return now <= Date.parse(FUUKA_MAMA_CAMPAIGN.endsAt);
}
