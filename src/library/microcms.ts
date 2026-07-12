import { createClient } from "microcms-js-sdk";

// MICROCMS_API_KEY は .env ファイルで管理します
// 例: MICROCMS_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
if (!import.meta.env.MICROCMS_API_KEY) {
  console.warn("MICROCMS_API_KEY が設定されていません。.env ファイルを確認してください。");
}

export const client = createClient({
  serviceDomain: "sapochimu",
  apiKey: import.meta.env.MICROCMS_API_KEY,
});

/** お知らせ1件の型 */
export type News = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  title: string;
  date: string;     // 掲載日（YYYY-MM-DDTxx:xx:xx.xxxZ 形式）
  content: string;  // リッチエディタ出力の HTML 文字列
  link?: string;    // 外部リンク URL（任意）
};

/** 一覧取得レスポンスの型 */
export type NewsListResponse = {
  contents: News[];
  totalCount: number;
  offset: number;
  limit: number;
};

/** 外部レポート（他団体・大学等による掲載記事）1件の型 */
export type ExternalReport = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  title: string;
  media: string[]; // 掲載媒体名（複数可）
  link: string;    // 記事の外部リンク URL
  date: string;    // 掲載日（YYYY-MM-DDTxx:xx:xx.xxxZ 形式）
};
