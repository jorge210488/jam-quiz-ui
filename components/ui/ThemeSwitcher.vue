<template>
  <div class="flex justify-center gap-2">
    <button
      v-for="t in themes"
      :key="t"
      :class="buttonClass(t)"
      @click="changeTheme(t)"
      :title="$t(t)"
    >
      <span>{{ getIcon(t) }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useUIStore } from "@/stores/ui";

const ui = useUIStore();
const themes = ["light", "dark", "neon"] as const;

const changeTheme = (theme: (typeof themes)[number]) => {
  ui.setTheme(theme);
};

const getIcon = (theme: string) => {
  switch (theme) {
    case "light":
      return "🌞";
    case "dark":
      return "🌙";
    case "neon":
      return "🌈";
    default:
      return "❔";
  }
};

const buttonClass = (theme: string) =>
  `px-1 py-1 rounded text-sm transition ${
    ui.theme === theme
      ? "bg-blue-600 text-white"
      : "bg-gray-200 dark:bg-gray-700"
  }`;
</script>
