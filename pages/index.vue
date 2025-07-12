<template>
  <div
    class="relative w-full h-full text-white overflow-hidden"
    :class="themeClass"
  >
    <!-- Fondo de estrellas -->
    <div
      class="absolute inset-0 z-0 bg-[url('/images/stars.gif')] opacity-20 pointer-events-none"
    ></div>

    <!-- Glow -->
    <div
      class="absolute w-[600px] h-[600px] blur-3xl top-[-100px] left-[-150px] animate-pulse z-0 pointer-events-none"
      :class="glowColor"
    ></div>

    <!-- Contenido principal -->
    <div
      class="relative z-10 flex flex-col items-center justify-center text-center min-h-[calc(100vh-4rem)] py-20"
    >
      <!-- Título -->
      <motion
        tag="div"
        :initial="{ opacity: 0, y: -30 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 0.6 } }"
      >
        <h1
          class="text-4xl md:text-6xl font-gamer drop-shadow-xl"
          :class="titleClass"
        >
          🎮 {{ t("home.title") }}
        </h1>
      </motion>

      <!-- Subtítulo -->
      <motion
        tag="div"
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.6 } }"
      >
        <p class="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl">
          {{ t("home.subtitle") }}
        </p>
      </motion>

      <!-- Botones -->
      <motion
        tag="div"
        :initial="{ opacity: 0, scale: 0.9 }"
        :enter="{
          opacity: 1,
          scale: 1,
          transition: { delay: 0.6, duration: 0.5 },
        }"
        class="mt-10 flex flex-col md:flex-row gap-4"
      >
        <button
          class="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:scale-105 transform transition duration-300 px-6 py-3 rounded-xl font-bold shadow-lg"
        >
          🚀 {{ t("home.cta1") }}
        </button>

        <button
          class="bg-black/50 border border-purple-500 hover:scale-105 transform transition duration-300 px-6 py-3 rounded-xl font-bold text-purple-300 shadow-md"
        >
          🌐 {{ t("home.cta2") }}
        </button>
      </motion>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useUIStore } from "@/stores/ui";
import { computed } from "vue";

const { t } = useI18n();
const ui = useUIStore();

const themeClass = computed(() => {
  switch (ui.theme) {
    case "light":
      return "bg-white text-black";
    case "dark":
      return "bg-gray-900 text-white";
    case "neon":
      return "bg-black text-neon-text";
    default:
      return "";
  }
});

const glowColor = computed(() => {
  switch (ui.theme) {
    case "light":
      return "bg-purple-300/20";
    case "dark":
      return "bg-purple-500/20";
    case "neon":
      return "bg-neon-glow/40";
    default:
      return "bg-purple-500/20";
  }
});

const titleClass = computed(() => {
  switch (ui.theme) {
    case "neon":
      return "text-neon-pink";
    default:
      return "text-purple-400";
  }
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap");

.font-gamer {
  font-family: "Press Start 2P", cursive;
}
</style>
