<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      @click.self="closeModal"
    >
      <div
        class="absolute inset-0 bg-[url('/images/stars.gif')] opacity-20 z-0 pointer-events-none"
      />

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
          <motion
            :animate="{ rotate: rotateDegrees }"
            :transition="{ duration: 0.5 }"
          >
            <img
              :src="userAvatarUrl"
              class="w-16 h-16 rounded-full border-2 border-white shadow-md"
              alt="avatar"
            />
          </motion>
        </div>
        <div class="flex justify-center mb-6">
          <motion-div :hover="{ scale: 1.05 }">
            <button
              @click="rotateAvatar"
              class="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-1 px-3 rounded-md font-semibold shadow-md hover:shadow-blue-400/60 transition duration-300"
            >
              🔄 {{ t("profile.rotateAvatar") }}
            </button>
          </motion-div>
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
          <motion-div :hover="{ scale: 1.05 }" :tap="{ scale: 0.95 }">
            <button
              type="submit"
              class="w-full py-2 mt-2 rounded-md font-bold shadow-md flex items-center justify-center transition duration-300"
              :class="submitBtnClass"
            >
              💾 {{ t("profile.updateButton") }}
            </button>
          </motion-div>
        </form>

        <!-- Botón Eliminar Cuenta -->
        <div class="mt-4">
          <motion-div :hover="{ scale: 1.05 }" :tap="{ scale: 0.95 }">
            <button
              type="button"
              @click="handleDelete"
              class="w-full bg-gradient-to-r from-red-600 to-red-400 text-white py-2 mt-2 rounded-md font-bold shadow-md hover:shadow-red-400/60 transition duration-300 flex items-center justify-center"
            >
              🗑️ {{ t("profile.delete") }}
            </button>
          </motion-div>
        </div>
      </motion-div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
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

const userAvatarUrl = computed(() => {
  return `https://api.dicebear.com/6.x/bottts/svg?seed=${encodeURIComponent(
    userStore.avatarSeed
  )}`;
});

onMounted(() => {
  userStore.loadFromStorage();
});

const user = computed(() => userStore.user);

const form = ref({
  name: user.value?.name || "",
  email: user.value?.email || "",
  password: "",
});
const confirmPassword = ref("");

// Avatar
const rotateDegrees = ref(0);
const avatarColors = [
  "bg-green-500",
  "bg-blue-500",
  "bg-red-500",
  "bg-yellow-500",
];
const currentColor = ref(avatarColors[0]);
const userInitial = computed(() =>
  user.value?.name ? user.value.name.charAt(0).toUpperCase() : ""
);

function generateRandomSeed() {
  return Math.random().toString(36).substring(2, 10);
}

function rotateAvatar() {
  rotateDegrees.value += 360;
  const newSeed = generateRandomSeed();
  userStore.updateAvatarSeed(newSeed);
}

// Actualizar usuario
const handleUpdate = async () => {
  if (form.value.password !== confirmPassword.value) {
    alert("❌ " + t("profile.passwordMismatch"));
    return;
  }

  const payload: { name?: string; email?: string; password?: string } = {};
  if (form.value.name.trim()) payload.name = form.value.name.trim();
  if (form.value.email.trim()) payload.email = form.value.email.trim();
  if (form.value.password.trim()) payload.password = form.value.password.trim();

  try {
    const id = user.value?.id;
    if (!id) throw new Error("User ID not found");

    const response = await updateUser(id, payload);
    userStore.setUser({
      user: response.user,
      token: response.token,
    });

    alert("✅ " + t("profile.success"));
    emit("close");
  } catch (err) {
    console.error(err);
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
 *  THEME CLASSES
 * --------------------------- */
const modalClass = computed(() => {
  switch (ui.theme) {
    case "light":
      return "bg-white text-black border-green-600";
    case "neon":
      return "bg-neon-bg text-neon-text border-neon-green";
    case "dark":
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
    case "dark":
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
    case "dark":
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
    case "dark":
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
    case "dark":
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
    case "dark":
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
