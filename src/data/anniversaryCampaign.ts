/**
 * TOP 専用：任意団体設立1周年 × マンスリーサポーター募集。
 *
 * Syncable URL の使い分け（混ぜない）:
 * - このバナー → campaign/11070（1周年マンスリー）
 * - PUBLIC_DONATE_URL / 応援ページ → associate/.../donate（通常寄付）
 * - 旧出産ドネーション → campaign/10436（終了・再利用しない）
 */
export const ANNIVERSARY_CAMPAIGN = {
  href: "https://syncable.biz/campaign/11070",
  imageAlt:
    "11月3日 任意団体として1周年。さぽちむのこれからを、一緒に育てる。マンスリーサポーター募集",
  untilLabel: "先着5名",
  title: "任意団体設立1周年",
  headline: "さぽちむのこれからを、一緒に育てる。",
  body: [
    "11月3日に任意団体として1周年を迎えました。",
    "活動スタートから数えると6周年。いつもありがとうございます！",
    "この節目に、マンスリーサポーターを募集しています（月額500円から）。",
  ].join("\n"),
  buttonLabel: "詳しく見る",
  /** バナー背景（サイトの #fffbec と差がつくミント） */
  bannerBg: "#cfe8d3",
} as const;
