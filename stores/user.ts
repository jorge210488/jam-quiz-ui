import { defineStore } from "pinia";
import type { User } from "@/types/user";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
    avatarSeed: "guest" as string,
  }),

  actions: {
    // 👉 Establece usuario + token + avatar (al loguearse)
    setUser(payload: { user: User; token: string }) {
      this.user = payload.user;
      this.token = payload.token;

      // Si no hay avatar previo, usa el ID del usuario
      this.avatarSeed = payload.user.id;

      // Guardar en localStorage
      localStorage.setItem("token", payload.token);
      localStorage.setItem("user", JSON.stringify(payload.user));
      localStorage.setItem("avatarSeed", this.avatarSeed);
    },

    // 👉 Cargar usuario y avatar desde localStorage
    loadFromStorage() {
      const token = localStorage.getItem("token");
      const userRaw = localStorage.getItem("user");
      const avatarSeed = localStorage.getItem("avatarSeed");

      if (token && userRaw) {
        try {
          const parsedUser = JSON.parse(userRaw) as User;

          this.token = token;
          this.user = parsedUser;

          // Usa avatar guardado, o el id del usuario como seed
          this.avatarSeed = avatarSeed || parsedUser.id || "guest";
        } catch (err) {
          console.error("Error parsing user from localStorage", err);
          this.logout(); // limpia todo si hay datos corruptos
        }
      }
    },

    // 👉 Cambiar avatar dinámicamente
    updateAvatarSeed(newSeed: string) {
      this.avatarSeed = newSeed;
      localStorage.setItem("avatarSeed", newSeed);
    },

    // 👉 Cerrar sesión
    logout() {
      this.user = null;
      this.token = null;
      this.avatarSeed = "guest";
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("avatarSeed");
    },
  },
});
