// stores/user.ts
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as null | { name: string; email: string; role: string },
    token: null as null | string,
  }),

  actions: {
    setUser(payload: any) {
      this.user = payload.user;
      this.token = payload.token;

      // Persistir en localStorage
      localStorage.setItem("token", payload.token);
      localStorage.setItem("user", JSON.stringify(payload.user));
    },

    loadFromStorage() {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      if (token && user) {
        this.token = token;
        this.user = JSON.parse(user);
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});
