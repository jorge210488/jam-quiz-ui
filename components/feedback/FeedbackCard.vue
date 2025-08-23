<template>
  <div
    class="p-4 rounded-lg shadow border border-gray-300 mb-4 bg-white text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
  >
    <div class="flex justify-between items-start">
      <div>
        <h4
          class="font-semibold font-gamer"
          :class="
            ui.theme === 'neon'
              ? 'text-neon-pink'
              : ui.theme === 'dark'
              ? 'text-purple-400'
              : 'text-purple-700'
          "
        >
          <!-- Título del quiz -->
          {{ feedback.question.quiz?.title || $t("feedback.unknownQuiz") }}
        </h4>
        <p>
          <!-- Texto de la pregunta -->
          {{ feedback.question.questionText }}
        </p>
      </div>
      <button
        @click="detailsOpen = !detailsOpen"
        class="text-sm text-blue-600 hover:underline focus:outline-none"
      >
        {{
          detailsOpen ? $t("feedback.hideDetails") : $t("feedback.viewDetails")
        }}
      </button>
    </div>
    <div v-if="detailsOpen" class="mt-3 pl-2 border-l-2 border-gray-300">
      <p>
        {{ $t("feedback.clarityLabel") }}
        <span
          :class="
            feedback.isClear
              ? 'text-green-600 dark:text-green-400'
              : 'text-red-600 dark:text-red-400'
          "
        >
          {{ feedback.isClear ? $t("feedback.clear") : $t("feedback.unclear") }}
        </span>
      </p>
      <p>
        {{ $t("feedback.commentLabel") }}
        <span>
          {{ feedback.comment ? feedback.comment : $t("feedback.noComment") }}
        </span>
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useUIStore } from "@/stores/ui";
import type { QuestionFeedback } from "@/types/questionFeedback";

const props = defineProps<{ feedback: QuestionFeedback }>();
const ui = useUIStore();
const detailsOpen = ref(false);
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap");

.font-gamer {
  font-family: "Press Start 2P", cursive;
}
.text-neon-pink {
  color: #ff1ad9;
}
</style>
