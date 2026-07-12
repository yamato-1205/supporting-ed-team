/** note の記事1件（RSS由来） */
export type NoteArticle = {
  title: string;
  link: string;
  thumbnail: string;
  pubDate: string;
  description: string;
};

/** タグ間テキストを取得するヘルパー */
function getTag(xml: string, tag: string): string {
  const escaped = tag.replace(":", "\\:"); // media:thumbnail などのエスケープ
  return (
    xml.match(new RegExp(`<${escaped}>([\\s\\S]*?)<\\/${escaped}>`))?.[1]?.trim() ?? ""
  );
}

/** HTMLタグを除去してプレーンテキストに変換 */
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/続きをみる/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** note の RSS フィードを取得し、記事一覧を返す（失敗時は空配列） */
export async function fetchNoteArticles(
  account: string,
  limit = 10,
): Promise<NoteArticle[]> {
  try {
    const res = await fetch(`https://note.com/${account}/rss`, {
      headers: { Accept: "application/rss+xml, text/xml" },
    });
    const xml = await res.text();

    return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)]
      .map((m) => {
        const s = m[1];
        const descCdata =
          s.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/)?.[1] ?? "";
        return {
          title: getTag(s, "title"),
          link: getTag(s, "link"),
          thumbnail: getTag(s, "media:thumbnail"),
          pubDate: getTag(s, "pubDate"),
          description: descCdata,
        };
      })
      .slice(0, limit);
  } catch (e) {
    console.warn("[note] RSS の取得に失敗しました:", e);
    return [];
  }
}
