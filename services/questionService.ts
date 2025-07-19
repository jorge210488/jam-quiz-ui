import { useUserStore } from "@/stores/user";

export type Question = {
  _id?: string;
  quiz: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  timeLimit?: number;
  translations?: Record<
    string,
    {
      questionText: string;
      options: string[];
      correctAnswer: string;
    }
  >;
};

export const useQuestionService = () => {
  const api = useNuxtApp().$api;
  const userStore = useUserStore();

  const authHeaders = () => ({
    headers: {
      Authorization: `Bearer ${userStore.token}`,
    },
  });

  // Crear una pregunta
  const createQuestion = async (
    data: Question
  ): Promise<{ question: Question }> => {
    return await api("/questions", {
      method: "POST",
      body: data,
      ...authHeaders(),
    });
  };

  // Obtener todas las preguntas
  const getAllQuestions = async (): Promise<Question[]> => {
    return await api("/questions", {
      method: "GET",
    });
  };

  // Obtener preguntas de un quiz
  const getQuestionsByQuiz = async (quizId: string): Promise<Question[]> => {
    return await api(`/questions/quiz/${quizId}`, {
      method: "GET",
    });
  };

  // Actualizar una pregunta
  const updateQuestion = async (
    id: string,
    data: Partial<Question>
  ): Promise<{ question: Question }> => {
    return await api(`/questions/${id}`, {
      method: "PUT",
      body: data,
      ...authHeaders(),
    });
  };

  // Eliminar una pregunta
  const deleteQuestion = async (id: string): Promise<{ message: string }> => {
    return await api(`/questions/${id}`, {
      method: "DELETE",
      ...authHeaders(),
    });
  };

  return {
    createQuestion,
    getAllQuestions,
    getQuestionsByQuiz,
    updateQuestion,
    deleteQuestion,
  };
};
