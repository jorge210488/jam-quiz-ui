// services/userService.ts
import { useUserStore } from "@/stores/user";

type UpdateUserResponse = {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  token: string;
};

export const useUserService = () => {
  const api = useNuxtApp().$api;
  const userStore = useUserStore();

  const authHeaders = () => ({
    headers: {
      Authorization: `Bearer ${userStore.token}`,
    },
  });

  const getAllUsers = async () => {
    return await api("/users", {
      method: "GET",
      ...authHeaders(),
    });
  };

  const getUserById = async (id: string) => {
    return await api(`/users/${id}`, {
      method: "GET",
      ...authHeaders(),
    });
  };

  const updateUser = async (
    id: string,
    data: {
      name?: string;
      email?: string;
      password?: string;
      role?: string;
    }
  ): Promise<UpdateUserResponse> => {
    return await api(`/users/${id}`, {
      method: "PUT",
      body: data,
      ...authHeaders(),
    });
  };

  const deleteUser = async (id: string) => {
    return await api(`/users/${id}`, {
      method: "DELETE",
      ...authHeaders(),
    });
  };

  return {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
  };
};
