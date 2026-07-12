export type OEmbedResult = { html: string } | null;

/**
 * X (旧Twitter) の投稿を oEmbed で取得する。
 * タイムライン埋め込みと違い、投稿単位の oEmbed は API キー不要かつ安定して動作する。
 */
export async function fetchXEmbed(postUrl: string): Promise<OEmbedResult> {
  try {
    const endpoint = `https://publish.twitter.com/oembed?url=${encodeURIComponent(postUrl)}&omit_script=true&dnt=true`;
    const res = await fetch(endpoint);
    if (!res.ok) throw new Error(`status ${res.status}`);
    const data = (await res.json()) as { html: string };
    return { html: data.html };
  } catch (e) {
    console.warn("[socialEmbed] X oEmbed の取得に失敗しました:", e);
    return null;
  }
}

/**
 * Instagram の投稿を oEmbed で取得する。
 * 2026年6月の仕様変更により、公開投稿であればアクセストークンなしで取得できる。
 * https://developers.facebook.com/blog/post/2026/06/15/tokenless-access-to-meta-oembed-apis/
 */
export async function fetchInstagramEmbed(postUrl: string): Promise<OEmbedResult> {
  try {
    const endpoint = `https://graph.facebook.com/v25.0/instagram_oembed?url=${encodeURIComponent(postUrl)}&omitscript=true`;
    const res = await fetch(endpoint);
    if (!res.ok) throw new Error(`status ${res.status}`);
    const data = (await res.json()) as { html: string };
    return { html: data.html };
  } catch (e) {
    console.warn("[socialEmbed] Instagram oEmbed の取得に失敗しました:", e);
    return null;
  }
}
