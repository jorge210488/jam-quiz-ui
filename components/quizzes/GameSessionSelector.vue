<template>
  <div class="w-full flex justify-center px-4 py-20">
    <div class="w-full max-w-4xl">
      <h2
        class="text-3xl md:text-4xl font-gamer mb-10 text-center"
        :class="titleClass"
      >
        {{ t("game.joinOrCreate") }}
      </h2>

      <div class="grid md:grid-cols-2 gap-8">
        <div
          v-for="session in sessions"
          :key="session._id"
          class="p-6 rounded-2xl shadow-xl transition hover:scale-[1.02] cursor-pointer border"
          :class="cardClass"
        >
          <div class="flex flex-col gap-2">
            <p class="text-sm italic text-gray-400">
              {{ formatTimeAgo(session.createdAt) }}
            </p>
            <p class="text-xl font-bold">
              {{ session.players.length }} {{ t("game.players") }}
            </p>
          </div>
          <button
            @click="joinSession(session._id)"
            class="mt-4 w-full bg-green-600 hover:bg-green-700 transition px-4 py-3 rounded-xl font-bold text-white"
          >
            {{ t("game.joinSession") }}
          </button>
        </div>
      </div>

      <div class="mt-12 text-center">
        <button
          @click="createNew"
          class="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:scale-105 transition px-8 py-4 rounded-2xl font-bold text-white"
        >
          🎮 {{ t("game.createNewSession") }}
        </button>
      </div>

      <div class="mt-6 text-center">
        <button
          @click="$emit('go-back')"
          class="text-sm underline text-gray-400 hover:text-white"
        >
          ← {{ t("game.backToQuizzes") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useUIStore } from "@/stores/ui";
import { useGameSessionService } from "@/services/gameSessionService";

const props = defineProps<{ quizId: string }>();
const emit = defineEmits<{
  (e: "join-session", sessionId: string | null): void;
  (e: "go-back"): void;
}>();
const { t, locale } = useI18n();
const ui = useUIStore();
const { getSessionsByQuizId } = useGameSessionService();

const sessions = ref<any[]>([]);

onMounted(async () => {
  sessions.value = await getSessionsByQuizId(props.quizId);
});

const joinSession = (sessionId: string) => {
  emit("join-session", sessionId);
};

const createNew = () => {
  emit("join-session", null);
};

const titleClass = computed(() =>
  ui.theme === "neon" ? "text-neon-pink" : "text-purple-400"
);

const cardClass = computed(() => {
  switch (ui.theme) {
    case "light":
      return "bg-white text-black border border-purple-200";
    case "dark":
      return "bg-gray-900 text-white border border-purple-700";
    case "neon":
      return "bg-black text-neon-text border border-neon-pink";
    default:
      return "";
  }
});

// Utilidad para mostrar tiempo en formato relativo
function formatTimeAgo(dateString: string) {
  const now = new Date();
  const created = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - created.getTime()) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  const rtf = new Intl.RelativeTimeFormat(locale.value, { numeric: "auto" });

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      return rtf.format(-count, interval.label as Intl.RelativeTimeFormatUnit);
    }
  }
  return rtf.format(0, "second");
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap");
.font-gamer {
  font-family: "Press Start 2P", cursive;
}
</style>
