// services/badgeService.ts
import type { Badge } from "@/types/badge";
import { useNuxtApp } from "#app";
import { useUserStore } from "@/stores/user";

export const useBadgeService = () => {
  const api = useNuxtApp().$api;
  const userStore = useUserStore();

  const authHeaders = () => ({
    headers: {
      Authorization: `Bearer ${userStore.token}`,
    },
  });

  // Obtener todas las insignias (requiere autenticación)
  const getAllBadges = async (): Promise<Badge[]> => {
    return await api("/badges", {
      method: "GET",
      ...authHeaders(),
    });
  };

  // Obtener una insignia por ID (requiere autenticación)
  const getBadgeById = async (id: string): Promise<Badge> => {
    return await api(`/badges/${id}`, {
      method: "GET",
      ...authHeaders(),
    });
  };

  // Crear una nueva insignia (solo admin)
  const createBadge = async (data: {
    name: string;
    description?: string;
    iconUrl?: string;
    condition: string;
  }) => {
    return await api("/badges", {
      method: "POST",
      body: data,
      ...authHeaders(),
    });
  };

  // Editar una insignia existente (solo admin)
  const updateBadge = async (
    id: string,
    data: {
      name?: string;
      description?: string;
      iconUrl?: string;
      condition?: string;
    }
  ) => {
    return await api(`/badges/${id}`, {
      method: "PUT",
      body: data,
      ...authHeaders(),
    });
  };

  // Eliminar una insignia (solo admin)
  const deleteBadge = async (id: string) => {
    return await api(`/badges/${id}`, {
      method: "DELETE",
      ...authHeaders(),
    });
  };

  return {
    getAllBadges,
    getBadgeById,
    createBadge,
    updateBadge,
    deleteBadge,
  };
};
