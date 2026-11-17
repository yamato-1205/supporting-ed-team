// @ts-check
import { defineConfig, envField } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { PLACES_IS_PUBLIC } from "./src/data/places-visibility.ts";

const site = (process.env.PUBLIC_SITE_URL || "https://supporting-ed-team.pages.dev").replace(
  /\/$/,
  "",
);

// https://astro.build/config
export default defineConfig({
  site,
  integrations: [
    sitemap({
      filter: (page) => {
        if (page.includes("/contact/thanks")) return false;
        if (!PLACES_IS_PUBLIC && page.includes("/places")) return false;
        return true;
      },
    }),
  ],
  env: {
    validateSecrets: true,
    schema: {
      MICROCMS_API_KEY: envField.string({
        context: "server",
        access: "secret",
      }),
      MICROCMS_SERVICE_DOMAIN: envField.string({
        context: "server",
        access: "public",
      }),
      PUBLIC_SITE_URL: envField.string({
        context: "server",
        access: "public",
        url: true,
        startsWith: "https://",
      }),
      PUBLIC_CONTACT_FORM_URL: envField.string({
        context: "server",
        access: "public",
        url: true,
        startsWith: "https://",
      }),
      PUBLIC_DONATE_URL: envField.string({
        context: "server",
        access: "public",
        url: true,
        startsWith: "https://",
      }),
      PUBLIC_CONTACT_EMAIL: envField.string({
        context: "server",
        access: "public",
      }),
      PUBLIC_NOTE_ACCOUNT: envField.string({
        context: "server",
        access: "public",
      }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
