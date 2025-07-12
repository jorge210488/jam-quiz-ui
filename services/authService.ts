// services/authService.ts
export const useAuthService = () => {
  const api = useNuxtApp().$api;

  const login = async (credentials: { email: string; password: string }) => {
    return await api("/auth/login", {
      method: "POST",
      body: credentials,
    });
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }) => {
    return await api("/auth/register", {
      method: "POST",
      body: {
        ...data,
        role: "player",
      },
    });
  };

  return {
    login,
    register,
  };
};
