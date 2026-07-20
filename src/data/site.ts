/**
 * サイト全体の設定。
 * 連絡先・外部サービス関連の値はすべて .env 必須（astro:env 経由）。
 */
import {
  PUBLIC_CONTACT_EMAIL,
  PUBLIC_CONTACT_FORM_URL,
  PUBLIC_DONATE_URL,
  PUBLIC_NOTE_ACCOUNT,
  MICROCMS_SERVICE_DOMAIN,
} from "astro:env/server";

/** ページタイトル・メタ説明の共通接尾辞 */
export const SITE_NAME = "任意団体 さぽちむ HP";

export const SITE_DESCRIPTION = `さぽちむは、「誰もが福祉の一員である」を表現する任意団体です。
  イベント・コミュニティ運営を通して、誰もが抱える/抱えうる弱さや痛みを受容できる社会を目指して活動します。`;

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

export function pageTitle(section?: string): string {
  return section ? `${section} | ${SITE_NAME}` : SITE_NAME;
}
