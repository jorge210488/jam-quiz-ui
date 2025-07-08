import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/i18n"],
  i18n: {
    locales: [
      { code: "es", name: "Español", iso: "es-ES", file: "es.json" },
      { code: "en", name: "English", iso: "en-US", file: "en.json" },
    ],
    defaultLocale: "es",
    lazy: true,
    langDir: "locales/",
    // 👇 Esta línea ya no va, porque vueI18n viene de i18n.config.ts
    // vueI18n: { legacy: false, globalInjection: true }
  },
});
