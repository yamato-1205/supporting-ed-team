export const X_PROFILE_URL = "https://x.com/sapochimu";
export const INSTAGRAM_PROFILE_URL = "https://www.instagram.com/sapochimu/";

/**
 * トップページ「活動実績」に埋め込むおすすめ投稿。
 *
 * ※ プロフィール／各UIのSNSボタンURLは src/data/sns.ts の SNS_URLS で設定。
 *
 * X・Instagramともに「最新投稿を自動で一覧表示するフィード」は無料のAPIキーなしでは
 * 実現できないため、投稿単位の埋め込み（無料・API不要）を採用している。
 * 新しい投稿を目立たせたいときは、それぞれの投稿ページで「リンクをコピー」し、
 * 下記のURLを差し替えるだけでよい。
 *
 * - X: 投稿右上の「…」→「リンクをコピー」
 * - Instagram: 投稿右上の「…」→「リンクをコピー」
 */
export const FEATURED_X_POST_URL =
  "https://x.com/sapochimu/status/2065288911526740400?s=20";
export const FEATURED_INSTAGRAM_POST_URL =
  "https://www.instagram.com/p/DW0jLfegRoj/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==";
