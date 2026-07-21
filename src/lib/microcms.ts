import { createClient } from "microcms-js-sdk";
import { MICROCMS_API_KEY, MICROCMS_SERVICE_DOMAIN } from "astro:env/server";

export const client = createClient({
  serviceDomain: MICROCMS_SERVICE_DOMAIN,
  apiKey: MICROCMS_API_KEY,
});

/** お知らせ1件の型 */
export type News = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  title: string;
  date: string;
  content: string;
  link?: string;
};

/** 一覧取得レスポンスの型 */
export type NewsListResponse = {
  contents: News[];
  totalCount: number;
  offset: number;
  limit: number;
};

/** 画像（microCMS の画像フィールド共通形） */
export type MicroCMSImage = {
  url: string;
  height: number;
  width: number;
};

/** メンバー1件の型（microCMS の member エンドポイント） */
export type Member = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  name: string;
  /** 複数選択（文字列）。背景画像はローカル assets でロール名から割り当てる */
  roll: string[];
  icon: MicroCMSImage;
};

/** 外部レポート1件の型 */
export type ExternalReport = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  title: string;
  media: string[];
  link: string;
  date: string;
};

/** 居場所1件の型（microCMS の location エンドポイント） */
export type Location = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  locationName: string;
  address: string;
  prefectures: string[];
  field: string[];
  genre: string[];
  lat: number;
  lng: number;
};
