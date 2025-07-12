<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      @click.self="closeModal"
    >
      <!-- Fondo decorativo opcional -->
      <div
        class="absolute inset-0 bg-[url('/images/stars.gif')] opacity-20 z-0"
      />

      <!-- Modal con animación -->
      <motion-div
        class="relative z-10 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white rounded-xl shadow-2xl p-6 w-[370px] border border-purple-700"
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
          class="absolute top-3 right-3 text-gray-400 hover:text-purple-400 text-2xl"
        >
          ×
        </button>

        <!-- Título -->
        <h2
          class="text-2xl font-bold mb-6 text-center tracking-wide text-purple-300 font-gamer"
        >
          🎮 {{ t("login.title") }}
        </h2>

        <!-- Formulario -->
        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-purple-400 mb-1">
              {{ t("login.email") }}
            </label>
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full px-4 py-2 bg-black border border-purple-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none text-white placeholder-gray-400"
              :placeholder="t('login.emailPlaceholder')"
            />
          </div>

          <!-- Contraseña -->
          <div>
            <label class="block text-sm font-medium text-purple-400 mb-1">
              {{ t("login.password") }}
            </label>
            <input
              v-model="form.password"
              type="password"
              required
              class="w-full px-4 py-2 bg-black border border-purple-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none text-white placeholder-gray-400"
              :placeholder="t('login.passwordPlaceholder')"
            />
          </div>

          <!-- Botón animado -->
          <motion-div :hover="{ scale: 1.05 }" :tap="{ scale: 0.95 }">
            <button
              type="submit"
              class="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white py-2 mt-2 rounded-md font-bold shadow-md hover:shadow-purple-400/60 transition duration-300 flex items-center justify-center"
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useAuthService } from "@/services/authService";
import { useUserStore } from "@/stores/user";

const { t } = useI18n();

const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits(["close"]);

const form = ref({ email: "", password: "" });
const router = useRouter();
const { login } = useAuthService();
const userStore = useUserStore();

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
