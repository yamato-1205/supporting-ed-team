/**
 * 代表ふうかの出産ドネーション（期間限定）。
 * 終了日時を過ぎるとビルド時に出さず、公開済みページでも開いた瞬間に消える。
 */
export const FUUKA_MAMA_CAMPAIGN = {
  /** 2026-09-30 23:59:59.999 JST */
  endsAt: "2026-09-30T23:59:59.999+09:00",
  href: "https://syncable.biz/campaign/10436",
  untilLabel: "9月30日まで",
  title: "出産ドネーションの立ち上げ",
  headline: "代表ふうかが、無事に第一子を出産しました！",
  body: "出産ドネーションを立ち上げました。\n近況報告や今後の思いを詰め込んでいるので、ぜひページをご覧ください。",
  buttonLabel: "詳しく見る",
  imageAlt:
    "さぽちむ代表ふうかが赤ちゃんを抱き、無事に第一子を出産したことを伝えるポスター",
} as const;

export function isFuukaMamaCampaignOpen(now = Date.now()): boolean {
  return now <= Date.parse(FUUKA_MAMA_CAMPAIGN.endsAt);
}
