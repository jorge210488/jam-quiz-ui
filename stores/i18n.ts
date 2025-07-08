import { defineStore } from "pinia";

export const useI18nStore = defineStore("i18n", {
  state: () => ({
    locale: "es" as "es" | "en",
  }),
  actions: {
    setLocale(locale: "es" | "en") {
      this.locale = locale;
    },
  },
  persist: true,
});
