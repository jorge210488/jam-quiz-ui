<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div
      class="w-full max-w-md p-6 rounded-lg shadow-lg"
      :class="[
        uiStore.theme === 'dark' ? 'bg-gray-800 text-gray-100' : '',
        uiStore.theme === 'light' ? 'bg-white text-gray-900' : '',
        uiStore.theme === 'neon'
          ? 'bg-gray-900 text-neon-pink font-gamer border-2 border-neon-pink'
          : '',
      ]"
    >
      <h3 class="text-xl font-bold mb-4">
        {{
          question.quiz && typeof question.quiz === "object"
            ? question.quiz.title
            : "Sin título"
        }}
        <span class="block text-base font-normal mt-1">{{
          question.questionText
        }}</span>
      </h3>
      <div class="mb-4">
        <p class="font-medium">{{ $t("feedback.wasQuestionClear") }}</p>
        <label class="mr-4">
          <input type="radio" :value="true" v-model="isClear" class="mr-1" />
          {{ $t("common.yes") }}
        </label>
        <label>
          <input type="radio" :value="false" v-model="isClear" class="mr-1" />
          {{ $t("common.no") }}
        </label>
      </div>
      <div class="mb-6">
        <label for="comment" class="block font-medium mb-1">
          {{ $t("feedback.commentLabel") }}
        </label>
        <textarea
          id="comment"
          v-model="comment"
          rows="3"
          class="w-full p-2 rounded border"
          :placeholder="$t('feedback.commentPlaceholder')"
        ></textarea>
      </div>
      <div class="text-right">
        <button
          @click="$emit('close')"
          class="px-4 py-2 mr-2 rounded"
          :class="
            uiStore.theme === 'neon'
              ? 'text-neon-pink border border-neon-pink'
              : 'text-gray-600'
          "
        >
          {{ $t("feedback.cancel") }}
        </button>
        <button
          @click="submitFeedback"
          class="px-4 py-2 rounded font-bold"
          :class="
            uiStore.theme === 'neon'
              ? 'bg-neon-pink text-black'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          "
        >
          {{ $t("feedback.submit") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useUIStore } from "@/stores/ui";
import type { Question } from "@/types/question";

const props = defineProps<{
  question: Question;
}>();

const emit = defineEmits<{
  (
    e: "submitFeedback",
    payload: { questionId: string; isClear: boolean; comment?: string }
  ): void;
  (e: "close"): void;
}>();

const uiStore = useUIStore();
const isClear = ref<boolean | null>(null);
const comment = ref<string>("");

const submitFeedback = () => {
  if (isClear.value === null) return;
  emit("submitFeedback", {
    questionId: props.question._id!, // siempre _id
    isClear: isClear.value,
    comment: comment.value.trim() || undefined,
  });
};
</script>
