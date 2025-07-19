import { useUserStore } from "@/stores/user";

type Quiz = {
  _id: string;
  title: string;
  description?: string;
  createdBy: {
    username: string;
  };
  isActive: boolean;
  isLive: boolean;
  isOpen: boolean;
  createdAt: string;
  updatedAt: string;
};

type Question = {
  _id?: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
};

type QuizWithQuestions = {
  quiz: Quiz;
  questions: Question[];
};

export const useQuizService = () => {
  const api = useNuxtApp().$api;
  const userStore = useUserStore();

  const authHeaders = () => ({
    headers: {
      Authorization: `Bearer ${userStore.token}`,
    },
  });

  // Obtener todos los quizzes
  const getAllQuizzes = async (): Promise<Quiz[]> => {
    return await api("/quizzes", {
      method: "GET",
    });
  };

  // Obtener quizzes activos
  const getActiveQuizzes = async (): Promise<Quiz[]> => {
    return await api("/quizzes/active", {
      method: "GET",
    });
  };

  // Obtener un quiz por ID (incluye preguntas)
  const getQuizById = async (id: string): Promise<QuizWithQuestions> => {
    return await api(`/quizzes/${id}`, {
      method: "GET",
    });
  };

  // Crear un nuevo quiz
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

  // Actualizar un quiz existente (y agregar preguntas si se envían)
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
