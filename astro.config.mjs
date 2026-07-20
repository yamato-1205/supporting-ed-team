// @ts-check
import { defineConfig, envField } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
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
      PUBLIC_CONTACT_FORM_URL: envField.string({
        context: "server",
        access: "public",
      }),
      PUBLIC_DONATE_URL: envField.string({
        context: "server",
        access: "public",
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
