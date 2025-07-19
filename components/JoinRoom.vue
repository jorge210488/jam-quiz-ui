<template>
  <div
    class="join-room w-full max-w-md mx-auto p-6 rounded-xl shadow-xl space-y-4 font-gamer"
    :class="containerClass"
  >
    <!-- Título -->
    <h2 class="text-3xl font-bold text-center drop-shadow" :class="titleClass">
      🎮 {{ t("quiz.joinTitle") }}
    </h2>

    <!-- ID de Sala -->
    <input
      v-model="room"
      :placeholder="t('quiz.roomId')"
      class="w-full px-4 py-3 rounded-md transition focus:outline-none focus:ring-2"
      :class="inputClass"
    />

    <!-- ID de Sesión -->
    <input
      v-model="session"
      :placeholder="t('quiz.sessionId')"
      class="w-full px-4 py-3 rounded-md transition focus:outline-none focus:ring-2"
      :class="inputClass"
    />

    <!-- ID de Usuario -->
    <input
      v-model="user"
      :placeholder="t('quiz.userId')"
      class="w-full px-4 py-3 rounded-md transition focus:outline-none focus:ring-2"
      :class="inputClass"
    />

    <!-- Botones -->
    <div class="flex justify-between gap-4 pt-2">
      <button
        @click="joinRoom"
        class="w-full py-2 rounded-md font-bold shadow-md transition duration-300"
        :class="joinBtnClass"
      >
        🎯 {{ t("quiz.joinButton") }}
      </button>
      <button
        @click="initGame"
        class="w-full py-2 rounded-md font-bold shadow-md transition duration-300"
        :class="startBtnClass"
      >
        🚀 {{ t("quiz.startGame") }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useUIStore } from "@/stores/ui";

const { t } = useI18n();
const ui = useUIStore();

// Inputs
const room = ref("");
const session = ref("");
const user = ref("");

// Emits
const emit = defineEmits(["joined", "start"]);

// Lógica botones
const joinRoom = () => {
  if (!room.value || !user.value) {
    alert(t("quiz.validation"));
    return;
  }
  emit("joined", { room: room.value, user: user.value });
};

const initGame = () => {
  if (!session.value || !room.value) {
    alert(t("quiz.validation"));
    return;
  }
  emit("start", { session: session.value, room: room.value });
};

// Estilos según tema
const containerClass = computed(() => {
  switch (ui.theme) {
    case "light":
      return "bg-white text-black border border-purple-500";
    case "neon":
      return "bg-black text-neon-text border border-neon-pink";
    case "dark":
    default:
      return "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white border border-purple-700";
  }
});

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

const joinBtnClass = computed(() => {
  switch (ui.theme) {
    case "light":
      return "bg-purple-500 text-white hover:bg-purple-600";
    case "neon":
      return "bg-neon-glow/20 border border-neon-pink text-neon-text hover:bg-neon-glow/40";
    case "dark":
    default:
      return "bg-blue-600 text-white hover:bg-blue-700";
  }
});

const startBtnClass = computed(() => {
  switch (ui.theme) {
    case "light":
      return "bg-green-500 text-white hover:bg-green-600";
    case "neon":
      return "bg-neon-glow/20 border border-neon-green text-neon-text hover:bg-neon-glow/40";
    case "dark":
    default:
      return "bg-green-600 text-white hover:bg-green-700";
  }
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap");

.font-gamer {
  font-family: "Press Start 2P", cursive;
}

.text-neon-text {
  color: #39ff14;
}

.border-neon-pink {
  border-color: #ff00ff;
}

.border-neon-green {
  border-color: #39ff14;
}

.bg-neon-glow\/20 {
  background-color: rgba(255, 0, 255, 0.2);
}

.bg-neon-glow\/40 {
  background-color: rgba(255, 0, 255, 0.4);
}
</style>
