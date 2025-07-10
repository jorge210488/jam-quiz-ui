import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
    },
  },
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/i18n", "@pinia/nuxt"],
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
