<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      @click.self="closeModal"
    >
      <div
        class="absolute inset-0 bg-[url('/images/stars.gif')] opacity-20 z-0"
      />

      <motion-div
        class="relative z-10 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white rounded-xl shadow-2xl p-6 w-[370px] border border-green-700"
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
        <button
          @click="closeModal"
          class="absolute top-3 right-3 text-gray-400 hover:text-green-400 text-2xl"
        >
          ×
        </button>

        <h2
          class="text-2xl font-bold mb-6 text-center tracking-wide text-green-300 font-gamer"
        >
          🌟 {{ t("register.title") }}
        </h2>

        <form @submit.prevent="handleRegister" class="space-y-4">
          <!-- Name -->
          <div>
            <label class="block text-sm font-medium text-green-400 mb-1">
              {{ t("register.name") }}
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full px-4 py-2 bg-black border border-green-600 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none text-white placeholder-gray-400"
              :placeholder="t('register.namePlaceholder')"
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-green-400 mb-1">
              {{ t("register.email") }}
            </label>
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full px-4 py-2 bg-black border border-green-600 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none text-white placeholder-gray-400"
              :placeholder="t('register.emailPlaceholder')"
            />
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-green-400 mb-1">
              {{ t("register.password") }}
            </label>
            <input
              v-model="form.password"
              type="password"
              required
              class="w-full px-4 py-2 bg-black border border-green-600 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none text-white placeholder-gray-400"
              :placeholder="t('register.passwordPlaceholder')"
            />
          </div>

          <!-- Confirm Password -->
          <div>
            <label class="block text-sm font-medium text-green-400 mb-1">
              {{ t("register.confirmPassword") }}
            </label>
            <input
              v-model="confirmPassword"
              type="password"
              required
              class="w-full px-4 py-2 bg-black border border-green-600 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none text-white placeholder-gray-400"
              :placeholder="t('register.confirmPasswordPlaceholder')"
            />
          </div>

          <motion-div :hover="{ scale: 1.05 }" :tap="{ scale: 0.95 }">
            <button
              type="submit"
              class="w-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white py-2 mt-2 rounded-md font-bold shadow-md hover:shadow-green-400/60 transition duration-300 flex items-center justify-center"
            >
              💾 {{ t("register.button") }}
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
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap");

.font-gamer {
  font-family: "Press Start 2P", cursive;
}
</style>
