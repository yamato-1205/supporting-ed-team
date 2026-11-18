import type { APIRoute } from "astro";
import { SITE_URL } from "../data/site";
import { PLACES_IS_PUBLIC } from "../data/places-visibility";

export const GET: APIRoute = () => {
  const lines = ["User-agent: *", "Allow: /"];

  if (!PLACES_IS_PUBLIC) {
    lines.push(
      "Disallow: /places",
      "Disallow: /places/",
      "Disallow: /places2",
      "Disallow: /places2/",
    );
  }

  lines.push(
    "Disallow: /contact/thanks",
    "Disallow: /contact/thanks/",
    "",
    `Sitemap: ${SITE_URL}/sitemap-index.xml`,
    "",
  );

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
