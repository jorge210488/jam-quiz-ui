<template>
  <Teleport to="body">
    <div
      v-show="true"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      @click.self="$emit('close')"
    >
      <!-- Fondo decorativo opcional -->
      <div
        class="absolute inset-0 bg-[url('/images/stars.gif')] opacity-20 z-0 pointer-events-none"
      />

      <!-- Animación de entrada/salida -->
      <Transition
        enter-active-class="transition transform duration-300 ease-out"
        enter-from-class="opacity-0 -translate-y-10 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition transform duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 -translate-y-10 scale-95"
      >
        <div
          v-show="true"
          class="relative z-10 rounded-xl shadow-2xl p-6 w-[380px] border font-gamer"
          :class="modalClass"
        >
          <!-- Botón de cerrar -->
          <button
            @click="$emit('close')"
            class="absolute top-3 right-3 text-2xl transition-colors"
            :class="closeBtnClass"
          >
            ×
          </button>

          <!-- Título -->
          <h3
            class="text-2xl font-bold mb-6 text-center tracking-wide"
            :class="titleClass"
          >
            {{
              question.quiz && typeof question.quiz === "object"
                ? question.quiz.title
                : t("feedback.unknownQuiz")
            }}
            <span class="block text-base font-normal mt-2 font-gamer">{{
              question.questionText
            }}</span>
          </h3>

          <!-- Claridad -->
          <div class="mb-4">
            <p class="font-medium" :class="labelClass">
              {{ t("feedback.questionClear") }}
            </p>
            <label class="mr-4">
              <input
                type="radio"
                :value="true"
                v-model="isClear"
                class="mr-1"
              />
              {{ t("feedback.yes") }}
            </label>
            <label>
              <input
                type="radio"
                :value="false"
                v-model="isClear"
                class="mr-1"
              />
              {{ t("feedback.no") }}
            </label>
          </div>

          <!-- Comentario -->
          <div class="mb-6">
            <label
              for="comment"
              class="block font-medium mb-1"
              :class="labelClass"
            >
              {{ t("feedback.commentLabel") }}
            </label>
            <textarea
              id="comment"
              v-model="comment"
              rows="3"
              class="w-full px-4 py-2 rounded-md focus:ring-2 focus:outline-none transition"
              :class="inputClass"
              :placeholder="t('feedback.commentPlaceholder')"
            ></textarea>
          </div>

          <!-- Botones -->
          <div class="text-right">
            <button
              @click="$emit('close')"
              class="px-4 py-2 mr-2 rounded transition"
              :class="closeBtnClass"
            >
              {{ t("feedback.cancel") }}
            </button>
            <button
              @click="submitFeedback"
              class="px-4 py-2 rounded font-bold shadow-md transform transition-transform duration-200 hover:scale-105 active:scale-95"
              :class="submitBtnClass"
            >
              {{ t("feedback.submit") }}
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useUIStore } from "@/stores/ui";
import type { Question } from "@/types/question";

const { t } = useI18n();
const ui = useUIStore();

const props = defineProps<{ question: Question }>();

const emit = defineEmits<{
  (
    e: "submitFeedback",
    payload: { questionId: string; isClear: boolean; comment?: string }
  ): void;
  (e: "close"): void;
}>();

const isClear = ref<boolean | null>(null);
const comment = ref<string>("");

const submitFeedback = () => {
  if (isClear.value === null) return;
  emit("submitFeedback", {
    questionId: props.question._id!,
    isClear: isClear.value,
    comment: comment.value.trim() || undefined,
  });
};

/* ---------------------------
 *  CLASES DINÁMICAS POR TEMA
 * --------------------------- */
const modalClass = computed(() => {
  switch (ui.theme) {
    case "light":
      return "bg-white text-black border-pink-600";
    case "neon":
      return "bg-neon-bg text-neon-text border-neon-pink";
    default:
      return "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white border-pink-700";
  }
});

const titleClass = computed(() => {
  switch (ui.theme) {
    case "light":
      return "text-pink-600";
    case "neon":
      return "text-neon-pink";
    default:
      return "text-pink-300";
  }
});

const labelClass = computed(() => {
  switch (ui.theme) {
    case "light":
      return "text-pink-600";
    case "neon":
      return "text-neon-pink";
    default:
      return "text-pink-400";
  }
});

const inputClass = computed(() => {
  switch (ui.theme) {
    case "light":
      return "bg-white border border-pink-400 text-black placeholder-gray-500 focus:ring-pink-500";
    case "neon":
      return "bg-black border border-neon-pink text-neon-text placeholder-neon-pink/60 focus:ring-neon-pink";
    default:
      return "bg-black border border-pink-600 text-white placeholder-gray-400 focus:ring-pink-500";
  }
});

const submitBtnClass = computed(() => {
  switch (ui.theme) {
    case "light":
      return "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white hover:shadow-pink-400/60";
    case "neon":
      return "bg-neon-glow/20 border border-neon-pink text-neon-text hover:bg-neon-glow/40 hover:shadow-neon-pink/60";
    default:
      return "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white hover:shadow-pink-400/60";
  }
});

const closeBtnClass = computed(() => {
  switch (ui.theme) {
    case "light":
      return "text-gray-500 hover:text-pink-600";
    case "neon":
      return "text-neon-text/70 hover:text-neon-pink";
    default:
      return "text-gray-400 hover:text-pink-400";
  }
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap");

.font-gamer {
  font-family: "Press Start 2P", cursive;
}
</style>
