<template>
  <div class="w-full flex justify-center px-4 py-20">
    <div class="w-full max-w-6xl">
      <template v-if="!selectedQuizId">
        <h1
          class="text-4xl md:text-5xl font-gamer mb-10 text-center"
          :class="titleClass"
        >
          🎮 {{ t("quizzes.selectTitle") }}
        </h1>
        <QuizList :quizzes="quizzes" @play-now="openQuiz" />
      </template>

      <template v-else>
        <QuizPage :quizId="selectedQuizId" @go-back="selectedQuizId = null" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useQuizService } from "@/services/quizService";
import { useUIStore } from "@/stores/ui";
import QuizList from "@/components/quizzes/QuizzesList.vue";
import QuizPage from "@/components/quizzes/QuizPage.vue";
import type { Quiz } from "@/types/quiz";

const { t } = useI18n();
const { getAllQuizzes } = useQuizService();
const ui = useUIStore();

const quizzes = ref<Quiz[]>([]);
const selectedQuizId = ref<string | null>(null);

onMounted(async () => {
  quizzes.value = await getAllQuizzes();
});

const openQuiz = (quizId: string) => {
  selectedQuizId.value = quizId;
};

const titleClass = computed(() => {
  return ui.theme === "neon" ? "text-neon-pink" : "text-purple-400";
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap");

.font-gamer {
  font-family: "Press Start 2P", cursive;
}
</style>
