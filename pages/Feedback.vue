<template>
  <div class="w-full flex justify-center px-4 py-20">
    <div class="w-full max-w-4xl">
      <!-- Título -->
      <h1
        class="text-4xl md:text-5xl font-gamer mb-10 text-center"
        :class="titleClass"
      >
        💬 {{ $t("feedback.title") }}
      </h1>

      <!-- Campo de búsqueda -->
      <input
        v-model="searchQuery"
        :placeholder="$t('feedback.searchPlaceholder')"
        class="w-full mb-10 px-4 py-3 rounded-lg border-2 focus:outline-none transition-all duration-200 text-lg"
        :class="
          ui.theme === 'neon'
            ? 'border-neon-pink focus:ring-2 focus:ring-neon-pink bg-gray-900 text-neon-pink placeholder-neon-pink'
            : 'border-gray-300 bg-white text-gray-900'
        "
        type="text"
      />

      <!-- Feedbacks del usuario -->
      <h2 class="text-2xl font-bold mb-4 mt-8" :class="subtitleClass">
        {{ $t("feedback.yourFeedbacks") }}
      </h2>
      <div class="mb-10">
        <div
          v-if="feedbacksFiltered.length === 0"
          class="text-gray-400 text-lg"
        >
          {{ $t("feedback.noFeedback") }}
        </div>
        <div v-else>
          <FeedbackCard
            v-for="fb in feedbacksFiltered"
            :key="fb._id"
            :feedback="fb"
          />
        </div>
      </div>

      <!-- Preguntas por evaluar -->
      <h2 class="text-2xl font-bold mb-4" :class="subtitleClass">
        {{ $t("feedback.questionsToEvaluate") }}
      </h2>
      <div>
        <div v-if="groupedQuestions.length === 0" class="text-gray-400 text-lg">
          {{
            searchQuery ? $t("feedback.noResults") : $t("feedback.noQuestions")
          }}
        </div>
        <div v-else>
          <div
            v-for="group in groupedQuestions"
            :key="group.quizTitle"
            class="mb-6"
          >
            <h3
              class="font-gamer text-xl md:text-2xl mb-2 cursor-pointer px-2 py-2 rounded transition"
              :class="[
                'select-none',
                ui.theme === 'neon'
                  ? 'bg-gray-900 text-neon-pink border-l-4 border-neon-pink shadow-neon'
                  : 'bg-purple-100 text-purple-700',
              ]"
              @click="toggleGroup(group.quizTitle)"
            >
              {{ group.quizTitle }}
              <span v-if="!expandedGroups[group.quizTitle]">▼</span>
              <span v-else>▲</span>
            </h3>
            <transition name="fade">
              <ul v-if="expandedGroups[group.quizTitle]" class="space-y-2 ml-4">
                <li
                  v-for="q in group.questions"
                  :key="q._id"
                  class="flex justify-between items-center bg-gray-900/70 rounded-lg px-4 py-2 shadow-md"
                >
                  <span class="text-lg font-medium text-gray-100">
                    {{ q.questionText }}
                  </span>
                  <button
                    class="ml-2 font-gamer px-4 py-1 rounded transition-all duration-150"
                    :class="
                      ui.theme === 'neon'
                        ? 'bg-neon-pink text-black hover:bg-neon-pink/80 shadow-neon'
                        : 'bg-blue-600 text-white hover:bg-blue-800'
                    "
                    @click="openModal(q)"
                  >
                    {{ $t("feedback.evaluate") }}
                  </button>
                </li>
              </ul>
            </transition>
          </div>
        </div>
      </div>

      <!-- Modal de evaluación -->
      <EvaluateModal
        v-if="showModal && selectedQuestion"
        :question="selectedQuestion"
        @submitFeedback="handleSubmitFeedback"
        @close="showModal = false"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useUIStore } from "@/stores/ui";
import { useQuestionService } from "@/services/questionService";
import { useQuestionFeedbackService } from "@/services/questionFeedbackService";
import FeedbackCard from "@/components/feedback/FeedbackCard.vue";
import EvaluateModal from "@/components/feedback/EvaluateModal.vue";
import type { Question } from "@/types/question";
import type { QuestionFeedback } from "@/types/questionFeedback";

const ui = useUIStore();

const searchQuery = ref("");
const showModal = ref(false);
const selectedQuestion = ref<Question | null>(null);
const expandedGroups = ref<Record<string, boolean>>({});

const questionService = useQuestionService();
const feedbackService = useQuestionFeedbackService();

const allQuestions = ref<Question[]>([]);
const feedbacks = ref<QuestionFeedback[]>([]);

onMounted(async () => {
  allQuestions.value = await questionService.getAllQuestions();
  feedbacks.value = await feedbackService.getMyFeedbacks();
});

const feedbacksFiltered = computed(() =>
  feedbacks.value.filter((fb) => {
    const quizTitle = fb.question.quiz?.title || "";
    return (
      quizTitle.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      fb.question.questionText
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase())
    );
  })
);

const filteredQuestions = computed(() =>
  allQuestions.value.filter((q) => {
    const quizTitle =
      q.quiz && typeof q.quiz === "object" && q.quiz.title ? q.quiz.title : "";
    return (
      quizTitle.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      q.questionText.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  })
);

const groupedQuestions = computed(() => {
  const groups: Record<string, Question[]> = {};
  for (const q of filteredQuestions.value) {
    const quizTitle =
      q.quiz && typeof q.quiz === "object" && q.quiz.title
        ? q.quiz.title
        : "Sin título";
    if (!groups[quizTitle]) groups[quizTitle] = [];
    groups[quizTitle].push(q);
  }
  return Object.entries(groups).map(([quizTitle, questions]) => ({
    quizTitle,
    questions,
  }));
});

const titleClass = computed(() =>
  ui.theme === "neon" ? "text-neon-pink" : "text-purple-400"
);
const subtitleClass = computed(() =>
  ui.theme === "neon" ? "text-neon-pink font-gamer" : "text-purple-700"
);

const toggleGroup = (quizTitle: string) => {
  expandedGroups.value[quizTitle] = !expandedGroups.value[quizTitle];
};

const openModal = (question: Question) => {
  selectedQuestion.value = question;
  showModal.value = true;
};

const handleSubmitFeedback = async (data: {
  questionId: string;
  isClear: boolean;
  comment?: string;
}) => {
  await feedbackService.createFeedback({
    question: data.questionId,
    isClear: data.isClear,
    comment: data.comment,
  });

  feedbacks.value = await feedbackService.getMyFeedbacks();
  allQuestions.value = allQuestions.value.filter(
    (q) => q._id !== data.questionId
  );
  showModal.value = false;
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap");

.font-gamer {
  font-family: "Press Start 2P", cursive;
}

.text-neon-pink {
  color: #ff1ad9;
}
.bg-neon-pink {
  background: #ff1ad9;
}
.border-neon-pink {
  border-color: #ff1ad9;
}
.placeholder-neon-pink::placeholder {
  color: #ff1ad9;
}
.shadow-neon {
  box-shadow: 0 0 12px 0 #ff1ad9cc, 0 1.5px 8px 0 #ff1ad950;
}
</style>
