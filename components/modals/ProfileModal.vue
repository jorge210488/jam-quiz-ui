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
          <!-- Botón de cierre -->
          <button
            @click="closeModal"
            class="absolute top-3 right-3 text-2xl transition-colors"
            :class="closeBtnClass"
          >
            ×
          </button>

          <!-- Título del modal -->
          <h2
            class="text-2xl font-bold mb-6 text-center tracking-wide"
            :class="titleClass"
          >
            👤 {{ t("profile.title") }}
          </h2>

          <!-- Avatar actual y botón de rotar -->
          <div class="flex justify-center mb-4">
            <img
              :src="avatarUrl"
              class="w-16 h-16 rounded-full border-2 border-white shadow-md transform transition-transform duration-500"
              :style="{ transform: `rotate(${rotateDegrees}deg)` }"
              alt="avatar"
            />
          </div>
          <div class="flex justify-center mb-6">
            <button
              @click="rotateAvatar"
              class="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-1 px-3 rounded-md font-semibold shadow-md transform transition-transform duration-200 hover:scale-105 active:scale-95"
            >
              🔄 {{ t("profile.rotateAvatar") }}
            </button>
          </div>

          <!-- Formulario de perfil -->
          <form @submit.prevent="handleUpdate" class="space-y-4">
            <!-- Nombre -->
            <div>
              <label class="block text-sm font-medium mb-1" :class="labelClass">
                {{ t("profile.name") }}
              </label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full px-4 py-2 rounded-md focus:ring-2 focus:outline-none transition"
                :class="inputClass"
                :placeholder="t('profile.namePlaceholder')"
              />
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium mb-1" :class="labelClass">
                {{ t("profile.email") }}
              </label>
              <input
                v-model="form.email"
                type="email"
                required
                class="w-full px-4 py-2 rounded-md focus:ring-2 focus:outline-none transition"
                :class="inputClass"
                :placeholder="t('profile.emailPlaceholder')"
              />
            </div>

            <!-- Contraseña -->
            <div>
              <label class="block text-sm font-medium mb-1" :class="labelClass">
                {{ t("profile.password") }}
              </label>
              <input
                v-model="form.password"
                type="password"
                class="w-full px-4 py-2 rounded-md focus:ring-2 focus:outline-none transition"
                :class="inputClass"
                :placeholder="t('profile.passwordPlaceholder')"
              />
            </div>

            <!-- Confirmar Contraseña -->
            <div>
              <label class="block text-sm font-medium mb-1" :class="labelClass">
                {{ t("profile.confirmPassword") }}
              </label>
              <input
                v-model="confirmPassword"
                type="password"
                class="w-full px-4 py-2 rounded-md focus:ring-2 focus:outline-none transition"
                :class="inputClass"
                :placeholder="t('profile.confirmPasswordPlaceholder')"
              />
            </div>

            <!-- Botón Guardar -->
            <button
              type="submit"
              class="w-full py-2 mt-2 rounded-md font-bold shadow-md flex items-center justify-center transform transition-transform duration-200 hover:scale-105 active:scale-95"
              :class="submitBtnClass"
            >
              💾 {{ t("profile.updateButton") }}
            </button>
          </form>

          <!-- Botón Eliminar Cuenta -->
          <div class="mt-4">
            <button
              @click="handleDelete"
              class="w-full bg-gradient-to-r from-red-600 to-red-400 text-white py-2 mt-2 rounded-md font-bold shadow-md transform transition-transform duration-200 hover:scale-105 active:scale-95 flex items-center justify-center"
            >
              🗑️ {{ t("profile.delete") }}
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useUserStore } from "@/stores/user";
import { useUserService } from "@/services/userService";
import { useUIStore } from "@/stores/ui";

const { t } = useI18n();
const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits(["close"]);
const router = useRouter();
const { updateUser } = useUserService();
const userStore = useUserStore();
const ui = useUIStore();

// Avatar URL reactivo
const avatarUrl = ref("");
watch(
  () => userStore.avatarSeed,
  (newSeed) => {
    avatarUrl.value = `https://api.dicebear.com/6.x/bottts/svg?seed=${encodeURIComponent(
      newSeed
    )}&r=${Date.now()}`;
  },
  { immediate: true }
);
onMounted(() => {
  userStore.loadFromStorage();
});

// Form data
const user = computed(() => userStore.user);
const form = ref({
  name: user.value?.name || "",
  email: user.value?.email || "",
  password: "",
});
const confirmPassword = ref("");

// Rotación del avatar
const rotateDegrees = ref(0);
function generateRandomSeed() {
  return Math.random().toString(36).substring(2, 10);
}
function rotateAvatar() {
  rotateDegrees.value += 360;
  const newSeed = generateRandomSeed();
  userStore.updateAvatarSeed(newSeed);
}

// Handlers
const handleUpdate = async () => {
  if (form.value.password !== confirmPassword.value) {
    alert("❌ " + t("profile.passwordMismatch"));
    return;
  }
  const payload: any = {};
  if (form.value.name.trim()) payload.name = form.value.name.trim();
  if (form.value.email.trim()) payload.email = form.value.email.trim();
  if (form.value.password.trim()) payload.password = form.value.password.trim();
  try {
    const id = user.value?.id!;
    const response = await updateUser(id, payload);
    userStore.setUser({ user: response.user, token: response.token });
    alert("✅ " + t("profile.success"));
    emit("close");
  } catch {
    alert("❌ " + t("profile.error"));
  }
};

const handleDelete = () => {
  if (confirm(t("profile.confirmDelete"))) {
    userStore.logout();
    emit("close");
    router.push("/");
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
