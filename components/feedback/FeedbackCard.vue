<template>
  <div class="p-4 rounded-lg shadow border mb-4">
    <div class="flex justify-between items-start">
      <div>
        <h4 class="font-semibold">
          <!-- Título del quiz -->
          {{ feedback.question.quiz?.title || "Sin título" }}
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
        <span :class="feedback.isClear ? 'text-green-600' : 'text-red-600'">
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
import type { QuestionFeedback } from "@/types/questionFeedback";

const props = defineProps<{ feedback: QuestionFeedback }>();
const detailsOpen = ref(false);
</script>
