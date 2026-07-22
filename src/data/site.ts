/**
 * サイト全体の設定。
 * 連絡先・外部サービス関連の値はすべて .env 必須（astro:env 経由）。
 * OG 画像・ファビコンは全ページ共通。title / description はページごとに変えて SEO を強化する。
 */
import {
  PUBLIC_CONTACT_EMAIL,
  PUBLIC_CONTACT_FORM_URL,
  PUBLIC_DONATE_URL,
  PUBLIC_NOTE_ACCOUNT,
  PUBLIC_SITE_URL,
  MICROCMS_SERVICE_DOMAIN,
} from "astro:env/server";
import { SNS_URLS } from "./sns";

/** サイトの正規 URL（末尾スラッシュなし） */
export const SITE_URL = PUBLIC_SITE_URL.replace(/\/$/, "");

/** サイト名・タイトル接尾辞 */
export const SITE_NAME = "任意団体 さぽちむ HP";

/** TOP / デフォルトの meta description */
export const SITE_DESCRIPTION =
  "さぽちむは、「誰もが福祉の一員である」を表現する任意団体です。イベント・コミュニティ運営を通して、誰もが抱える/抱えうる弱さや痛みを受容できる社会を目指して活動します。";

/** URL 共有時のサムネイル（public/og-banner.png） */
export const OG_IMAGE_PATH = "/og-banner.png";

export const OG_IMAGE_URL = `${SITE_URL}${OG_IMAGE_PATH}`;

/** お問い合わせメール（フッター表示・mailto） */
export const CONTACT_EMAIL = PUBLIC_CONTACT_EMAIL;

/** Google Apps Script お問い合わせフォーム送信先 */
export const CONTACT_FORM_URL = PUBLIC_CONTACT_FORM_URL;

/** Syncable 寄付フォーム */
export const DONATE_URL = PUBLIC_DONATE_URL;

/** note アカウント名（RSS・「もっと見る」リンク） */
export const NOTE_ACCOUNT = PUBLIC_NOTE_ACCOUNT;

/** microCMS サービスドメイン */
export { MICROCMS_SERVICE_DOMAIN };

/** フッターの著作表示年 */
export const COPYRIGHT_YEAR = 2025;

/** ブラウザ UI のテーマ色（ブランド primary） */
export const THEME_COLOR = "#628963";

/** X の @（twitter:site 用） */
export const TWITTER_SITE = "@sapochimu";

/** 構造化データ sameAs（公式 SNS） */
export const ORGANIZATION_SAME_AS = [
  SNS_URLS.footer.x,
  SNS_URLS.footer.instagram,
  SNS_URLS.footer.note,
  SNS_URLS.footer.facebook,
].filter((url): url is string => Boolean(url));

/** ページ別 SEO メタ */
export const PAGE_META = {
  home: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  overview: {
    title: `団体概要 | ${SITE_NAME}`,
    description:
      "さぽちむの存在意義・文化・チーム名の由来をご紹介します。誰もが福祉の一員である社会を目指す任意団体です。",
  },
  support: {
    title: `応援する | ${SITE_NAME}`,
    description:
      "さぽちむの活動を、ご寄付で応援していただけます。イベントや居場所づくりを支える使い道をご紹介します。",
  },
  member: {
    title: `メンバー募集 | ${SITE_NAME}`,
    description:
      "さぽちむのメンバー募集。イベント・SNS・その他チームの活動内容と、現在のメンバーを紹介します。",
  },
  contact: {
    title: `お問い合わせ | ${SITE_NAME}`,
    description:
      "さぽちむへのお問い合わせはこちらのフォームからお願いします。イベント・コラボ・取材などお気軽にご連絡ください。",
  },
  places: {
    title: `居場所マップ | ${SITE_NAME}`,
    description:
      "さぽちむがつなぐ全国の居場所を、地図とキーワードから探せます。",
  },
} as const;

export type PageMetaKey = keyof typeof PAGE_META;

/** パンくず用 */
export type BreadcrumbItem = {
  name: string;
  path: string;
};

/** 絶対 URL を組み立てる */
export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

export function pageTitle(section?: string): string {
  return section ? `${section} | ${SITE_NAME}` : SITE_NAME;
}
