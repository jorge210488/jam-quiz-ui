// services/questionFeedbackService.ts
import { useNuxtApp } from "#app";
import { useUserStore } from "@/stores/user";
import type { QuestionFeedback } from "@/types/questionFeedback";

export const useQuestionFeedbackService = () => {
  const api = useNuxtApp().$api;
  const userStore = useUserStore();

  const authHeaders = () => ({
    headers: {
      Authorization: `Bearer ${userStore.token}`,
    },
  });

  // Obtener todos los feedbacks (solo admin)
  const getAllFeedbacks = async (): Promise<QuestionFeedback[]> => {
    return await api("/question-feedbacks/admin", {
      method: "GET",
      ...authHeaders(),
    });
  };

  // Obtener los feedbacks del usuario autenticado
  const getMyFeedbacks = async (): Promise<QuestionFeedback[]> => {
    return await api("/question-feedbacks/my-feedbacks", {
      method: "GET",
      ...authHeaders(),
    });
  };

  // Crear nuevo feedback
  const createFeedback = async (data: {
    question: string;
    isClear: boolean;
    comment?: string;
  }) => {
    return await api("/question-feedbacks", {
      method: "POST",
      body: data,
      ...authHeaders(),
    });
  };

  return {
    getAllFeedbacks,
    getMyFeedbacks,
    createFeedback,
  };
};
