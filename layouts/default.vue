<template>
  <div :class="layoutClass" class="flex min-h-screen">
    <Sidebar />
    <div class="flex-1 p-6">
      <div class="flex justify-between items-center mb-4">
        <ThemeSwitcher />
        <LanguageSwitcher />
      </div>
      <slot />
    </div>
  </div>
</template>

<script setup>
import { useUIStore } from "@/stores/ui";
import Sidebar from "@/components/navbar/Sidebar.vue";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher.vue";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher.vue"; // 👈 nuevo

const ui = useUIStore();

const layoutClass = computed(() => {
  return {
    "bg-white text-black": ui.theme === "light",
    "bg-gray-900 text-white": ui.theme === "dark",
    "bg-neon-bg text-neon-text": ui.theme === "neon",
  };
});
</script>
