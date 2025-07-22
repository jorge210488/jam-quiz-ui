// services/gameSessionService.ts
import { useNuxtApp } from "#app";
import { useUserStore } from "@/stores/user";
import type {
  GameSession,
  GameSessionResponse,
  GameSessionSummary,
} from "@/types/gameSession";

export const useGameSessionService = () => {
  const api = useNuxtApp().$api;
  const userStore = useUserStore();

  const authHeaders = () => ({
    headers: {
      Authorization: `Bearer ${userStore.token}`,
    },
  });

  const createGameSession = async (data: {
    quiz: string;
    players?: string[];
  }): Promise<GameSession> => {
    return await api("/game-sessions", {
      method: "POST",
      body: data,
      ...authHeaders(),
    });
  };

  const getGameSessionById = async (id: string): Promise<GameSession> => {
    return await api(`/gamesessions/${id}`, {
      method: "GET",
      ...authHeaders(),
    });
  };

  const addResponse = async (
    sessionId: string,
    data: GameSessionResponse
  ): Promise<{ message: string; session: GameSession }> => {
    return await api(`/gamesessions/${sessionId}/responses`, {
      method: "POST",
      body: data,
      ...authHeaders(),
    });
  };

  const getSessionsByUser = async (
    userId: string
  ): Promise<GameSessionSummary[]> => {
    return await api(`/gamesessions?userId=${userId}`, {
      method: "GET",
      ...authHeaders(),
    });
  };

  const finishGameSession = async (
    sessionId: string
  ): Promise<{ message: string; session: GameSession }> => {
    return await api(`/gamesessions/${sessionId}/finish`, {
      method: "PUT",
      ...authHeaders(),
    });
  };

  const joinSession = async (
    sessionId: string,
    userId: string
  ): Promise<{ message: string; session: GameSession }> => {
    return await api(`/gamesessions/${sessionId}/join`, {
      method: "POST",
      body: { userId },
      ...authHeaders(),
    });
  };

  return {
    createGameSession,
    getGameSessionById,
    addResponse,
    getSessionsByUser,
    finishGameSession,
    joinSession,
  };
};
