<template>
  <aside :class="asideClass" class="w-64 h-screen p-4">
    <nav class="space-y-2">
      <div
        v-for="item in ['Home', 'Quiz', 'Settings']"
        :key="item"
        class="block px-3 py-2 rounded transition cursor-pointer"
        :class="linkClass"
      >
        {{ $t(item) }}
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { useUIStore } from "@/stores/ui";
const ui = useUIStore();

const linkClass = computed(() => {
  return [
    ui.theme === "light" && "hover:bg-gray-200",
    ui.theme === "dark" && "hover:bg-gray-800",
    ui.theme === "neon" && "hover:bg-neon-accent text-neon-text",
  ];
});

const asideClass = computed(() => {
  return {
    "bg-white text-black": ui.theme === "light",
    "bg-gray-900 text-white": ui.theme === "dark",
    "bg-neon-bg text-neon-text": ui.theme === "neon",
  };
});
</script>
