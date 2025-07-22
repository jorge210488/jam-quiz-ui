<template>
  <div class="grid gap-6 md:grid-cols-2">
    <div
      v-for="quiz in quizzes"
      :key="quiz._id"
      class="border rounded-xl p-6 shadow-lg transition hover:scale-105 cursor-pointer bg-black/50"
      :class="cardClass"
    >
      <h2 class="text-xl font-bold mb-2">{{ quiz.title }}</h2>
      <p class="text-sm text-gray-300 mb-4">{{ quiz.description }}</p>
      <button
        @click="$emit('play-now', quiz._id)"
        class="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:scale-105 transition px-5 py-2 rounded-xl font-bold text-white"
      >
        🎮 {{ t("quizzes.playNow") }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useUIStore } from "@/stores/ui";
import type { Quiz } from "@/types/quiz";

const { t } = useI18n();
const ui = useUIStore();

defineProps<{
  quizzes: Quiz[];
}>();

const emit = defineEmits<{
  (e: "play-now", quizId: string): void;
}>();

const cardClass = computed(() => {
  switch (ui.theme) {
    case "light":
      return "bg-white text-black border border-purple-300";
    case "dark":
      return "bg-gray-800 text-white border border-purple-700";
    case "neon":
      return "bg-black text-neon-text border border-neon-pink";
    default:
      return "";
  }
});
</script>
