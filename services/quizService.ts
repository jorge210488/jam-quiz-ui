// services/quizService.ts
import type { Quiz } from "@/types/quiz";
import type { Question } from "@/types/question";
import { useNuxtApp } from "#app";
import { useUserStore } from "@/stores/user";

export interface QuizWithQuestions {
  quiz: Quiz;
  questions: Question[];
}

export const useQuizService = () => {
  const api = useNuxtApp().$api;
  const userStore = useUserStore();

  const authHeaders = () => ({
    headers: {
      Authorization: `Bearer ${userStore.token}`,
    },
  });

  const getAllQuizzes = async (): Promise<Quiz[]> => {
    return await api("/quizzes", { method: "GET" });
  };

  const getActiveQuizzes = async (): Promise<Quiz[]> => {
    return await api("/quizzes/active", { method: "GET" });
  };

  const getQuizById = async (id: string): Promise<QuizWithQuestions> => {
    return await api(`/quizzes/${id}`, { method: "GET" });
  };

  const createQuiz = async (data: {
    title: string;
    description?: string;
    isOpen?: boolean;
    isLive?: boolean;
    questions?: Question[];
  }) => {
    return await api("/quizzes", {
      method: "POST",
      body: data,
      ...authHeaders(),
    });
  };

  const updateQuiz = async (
    id: string,
    data: {
      title?: string;
      description?: string;
      isOpen?: boolean;
      isLive?: boolean;
      isActive?: boolean;
      questions?: Question[];
    }
  ) => {
    return await api(`/quizzes/${id}`, {
      method: "PUT",
      body: data,
      ...authHeaders(),
    });
  };

  return {
    getAllQuizzes,
    getActiveQuizzes,
    getQuizById,
    createQuiz,
    updateQuiz,
  };
};
