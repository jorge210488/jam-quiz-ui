<template>
  <Teleport to="body">
    <div
      v-show="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      @click.self="closeModal"
    >
      <!-- Fondo decorativo opcional -->
      <div
        class="absolute inset-0 bg-[url('/images/stars.gif')] opacity-20 z-0 pointer-events-none"
      />

      <!-- Animación de entrada/salida con Transition nativa -->
      <Transition
        enter-active-class="transition transform duration-300 ease-out"
        enter-from-class="opacity-0 -translate-y-10 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition transform duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 -translate-y-10 scale-95"
      >
        <div
          v-show="isOpen"
          class="relative z-10 rounded-xl shadow-2xl p-6 w-[370px] border font-gamer"
          :class="modalClass"
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
            🌟 {{ t("register.title") }}
          </h2>

          <!-- Formulario sin motion extra -->
          <form @submit.prevent="handleRegister" class="space-y-4">
            <!-- Name -->
            <div>
              <label class="block text-sm font-medium mb-1" :class="labelClass">
                {{ t("register.name") }}
              </label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full px-4 py-2 rounded-md focus:ring-2 focus:outline-none transition"
                :class="inputClass"
                :placeholder="t('register.namePlaceholder')"
              />
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium mb-1" :class="labelClass">
                {{ t("register.email") }}
              </label>
              <input
                v-model="form.email"
                type="email"
                required
                class="w-full px-4 py-2 rounded-md focus:ring-2 focus:outline-none transition"
                :class="inputClass"
                :placeholder="t('register.emailPlaceholder')"
              />
            </div>

            <!-- Password -->
            <div>
              <label class="block text-sm font-medium mb-1" :class="labelClass">
                {{ t("register.password") }}
              </label>
              <input
                v-model="form.password"
                type="password"
                required
                class="w-full px-4 py-2 rounded-md focus:ring-2 focus:outline-none transition"
                :class="inputClass"
                :placeholder="t('register.passwordPlaceholder')"
              />
            </div>

            <!-- Confirm Password -->
            <div>
              <label class="block text-sm font-medium mb-1" :class="labelClass">
                {{ t("register.confirmPassword") }}
              </label>
              <input
                v-model="confirmPassword"
                type="password"
                required
                class="w-full px-4 py-2 rounded-md focus:ring-2 focus:outline-none transition"
                :class="inputClass"
                :placeholder="t('register.confirmPasswordPlaceholder')"
              />
            </div>

            <!-- Botón de enviar con solo CSS para hover/active -->
            <button
              type="submit"
              class="w-full py-2 mt-2 rounded-md font-bold shadow-md flex items-center justify-center transform transition-transform duration-200 hover:scale-105 active:scale-95"
              :class="submitBtnClass"
            >
              💾 {{ t("register.button") }}
            </button>
          </form>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useAuthService } from "@/services/authService";
import { useUIStore } from "@/stores/ui";

const { t } = useI18n();
const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits(["close"]);

const form = ref({
  name: "",
  email: "",
  password: "",
});
const confirmPassword = ref("");

const router = useRouter();
const { register } = useAuthService();
const ui = useUIStore();

const handleRegister = async () => {
  if (form.value.password !== confirmPassword.value) {
    alert("❌ " + t("register.passwordMismatch"));
    return;
  }

  try {
    await register(form.value);
    alert("✅ " + t("register.success"));
    emit("close");
    router.push("/");
  } catch (err: any) {
    alert("❌ " + t("register.error"));
  }
};

const closeModal = () => {
  emit("close");
};

/* ---------------------------
 *  CLASES DINÁMICAS POR TEMA
 * --------------------------- */
const modalClass = computed(() => {
  switch (ui.theme) {
    case "light":
      return "bg-white text-black border-green-600";
    case "neon":
      return "bg-neon-bg text-neon-text border-neon-green";
    default:
      return "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white border-green-700";
  }
});

const titleClass = computed(() => {
  switch (ui.theme) {
    case "light":
      return "text-green-600";
    case "neon":
      return "text-neon-green";
    default:
      return "text-green-300";
  }
});

const labelClass = computed(() => {
  switch (ui.theme) {
    case "light":
      return "text-green-600";
    case "neon":
      return "text-neon-green";
    default:
      return "text-green-400";
  }
});

const inputClass = computed(() => {
  switch (ui.theme) {
    case "light":
      return "bg-white border border-green-400 text-black placeholder-gray-500 focus:ring-green-500";
    case "neon":
      return "bg-black border border-neon-green text-neon-text placeholder-neon-green/60 focus:ring-neon-green";
    default:
      return "bg-black border border-green-600 text-white placeholder-gray-400 focus:ring-green-500";
  }
});

const submitBtnClass = computed(() => {
  switch (ui.theme) {
    case "light":
      return "bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white hover:shadow-green-400/60";
    case "neon":
      return "bg-neon-glow/20 border border-neon-green text-neon-text hover:bg-neon-glow/40 hover:shadow-neon-green/60";
    default:
      return "bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white hover:shadow-green-400/60";
  }
});

const closeBtnClass = computed(() => {
  switch (ui.theme) {
    case "light":
      return "text-gray-500 hover:text-green-600";
    case "neon":
      return "text-neon-text/70 hover:text-neon-green";
    default:
      return "text-gray-400 hover:text-green-400";
  }
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap");

.font-gamer {
  font-family: "Press Start 2P", cursive;
}
</style>
