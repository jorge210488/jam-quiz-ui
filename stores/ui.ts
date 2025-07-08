// stores/ui.ts
import { defineStore } from "pinia";

type Theme = "light" | "dark" | "neon";

export const useUIStore = defineStore("ui", {
  state: () => ({
    theme: "light" as Theme,
  }),
  actions: {
    setTheme(newTheme: Theme) {
      this.theme = newTheme;
      document.documentElement.classList.remove("dark");
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark");
      }
    },
  },
  persist: true,
});
