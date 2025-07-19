// plugins/socket.client.js
import { io } from "socket.io-client";
import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    // Configurar la conexión con el servidor (ajuste la URL según corresponda)
    const socket = io("http://localhost:4000", {
      transports: ["websocket"],
      // Incluir autenticación si aplica (e.g., token JWT)
      auth: { token: localStorage.getItem("authToken") || "" },
    });
    // Inyectar para poder usarlo con const { $socket } = useNuxtApp()
    nuxtApp.provide("socket", socket);
  }
});
