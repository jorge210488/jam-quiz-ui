<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      @click.self="closeModal"
    >
      <!-- Fondo decorativo opcional -->
      <div
        class="absolute inset-0 bg-[url('/images/stars.gif')] opacity-20 z-0 pointer-events-none"
      />

      <!-- Modal con animación -->
      <motion-div
        class="relative z-10 rounded-xl shadow-2xl p-6 w-[370px] border font-gamer"
        :class="modalClass"
        :initial="{ opacity: 0, y: -40, scale: 0.95 }"
        :enter="{
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { type: 'spring', stiffness: 300 },
        }"
        :leave="{
          opacity: 0,
          y: -40,
          scale: 0.95,
          transition: { duration: 0.3 },
        }"
      >
        <!-- Botón de cerrar -->
        <button
          @click="closeModal"
          class="absolute top-3 right-3 text-2xl transition-colors"
          :class="closeBtnClass"
        >
          ×
        </button>

        <!-- Título -->
        <h2
          class="text-2xl font-bold mb-6 text-center tracking-wide"
          :class="titleClass"
        >
          🎮 {{ t("login.title") }}
        </h2>

        <!-- Formulario -->
        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- Email -->
          <div>
            <label class="block text-sm font-medium mb-1" :class="labelClass">
              {{ t("login.email") }}
            </label>
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full px-4 py-2 rounded-md focus:ring-2 focus:outline-none transition"
              :class="inputClass"
              :placeholder="t('login.emailPlaceholder')"
            />
          </div>

          <!-- Contraseña -->
          <div>
            <label class="block text-sm font-medium mb-1" :class="labelClass">
              {{ t("login.password") }}
            </label>
            <input
              v-model="form.password"
              type="password"
              required
              class="w-full px-4 py-2 rounded-md focus:ring-2 focus:outline-none transition"
              :class="inputClass"
              :placeholder="t('login.passwordPlaceholder')"
            />
          </div>

          <!-- Botón animado -->
          <motion-div :hover="{ scale: 1.05 }" :tap="{ scale: 0.95 }">
            <button
              type="submit"
              class="w-full py-2 mt-2 rounded-md font-bold shadow-md flex items-center justify-center transition duration-300"
              :class="submitBtnClass"
            >
              🚀 {{ t("login.button") }}
            </button>
          </motion-div>
        </form>
      </motion-div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useAuthService } from "@/services/authService";
import { useUserStore } from "@/stores/user";
import { useUIStore } from "@/stores/ui";

const { t } = useI18n();

const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits(["close"]);

const form = ref({ email: "", password: "" });
const router = useRouter();
const { login } = useAuthService();
const userStore = useUserStore();
const ui = useUIStore();

/* ---------------------------
 *  THEME CLASSES
 * --------------------------- */

/**
 * Modal contenedor principal.
 * - DARK: se conserva EXACTO al original.
 * - LIGHT: fondo blanco, texto negro, borde púrpura.
 * - NEON: fondo negro (o token), texto neón, borde neón.
 */
const modalClass = computed(() => {
  switch (ui.theme) {
    case "light":
      return "bg-white text-black border-purple-600";
    case "neon":
      // Ajusta estos tokens a los que tengas definidos en tailwind.config.js
      return "bg-neon-bg text-neon-text border-neon-pink";
    case "dark":
    default:
      // Estilo original (no tocar)
      return "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white border-purple-700";
  }
});

/**
 * Título
 */
const titleClass = computed(() => {
  switch (ui.theme) {
    case "light":
      return "text-purple-600";
    case "neon":
      return "text-neon-pink";
    case "dark":
    default:
      return "text-purple-300";
  }
});

/**
 * Labels
 */
const labelClass = computed(() => {
  switch (ui.theme) {
    case "light":
      return "text-purple-600";
    case "neon":
      return "text-neon-pink";
    case "dark":
    default:
      return "text-purple-400";
  }
});

/**
 * Inputs
 * - DARK: original -> bg-black border-purple-600 text-white placeholder-gray-400
 * - LIGHT: bg-white border-purple-400 text-black placeholder-gray-500
 * - NEON: bg-black border-neon-pink text-neon-text placeholder-neon-pink/60
 */
const inputClass = computed(() => {
  switch (ui.theme) {
    case "light":
      return "bg-white border border-purple-400 text-black placeholder-gray-500 focus:ring-purple-500";
    case "neon":
      return "bg-black border border-neon-pink text-neon-text placeholder-neon-pink/60 focus:ring-neon-pink";
    case "dark":
    default:
      return "bg-black border border-purple-600 text-white placeholder-gray-400 focus:ring-purple-500";
  }
});

/**
 * Botón submit
 * - DARK: original gradiente
 * - LIGHT: gradiente similar (mantenemos coherencia) + texto blanco
 * - NEON: contorno neón / fondo neón
 */
const submitBtnClass = computed(() => {
  switch (ui.theme) {
    case "light":
      return "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white hover:shadow-purple-400/60";
    case "neon":
      return "bg-neon-glow/20 border border-neon-pink text-neon-text hover:bg-neon-glow/40 hover:shadow-neon-pink/60";
    case "dark":
    default:
      // Estilo original (no tocar)
      return "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white hover:shadow-purple-400/60";
  }
});

/**
 * Botón cerrar
 */
const closeBtnClass = computed(() => {
  switch (ui.theme) {
    case "light":
      return "text-gray-500 hover:text-purple-600";
    case "neon":
      return "text-neon-text/70 hover:text-neon-pink";
    case "dark":
    default:
      return "text-gray-400 hover:text-purple-400";
  }
});

/* ---------------------------
 *  METHODS
 * --------------------------- */
const handleLogin = async () => {
  try {
    const res = await login(form.value);
    userStore.setUser(res);
    emit("close");
    router.push("/");
  } catch (err: any) {
    alert("❌ " + t("login.error"));
  }
};

const closeModal = () => {
  emit("close");
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap");

.font-gamer {
  font-family: "Press Start 2P", cursive;
}
</style>
