<template>
  <div>
    <!-- Botón hamburguesa -->
    <button
      class="fixed top-4 left-4 z-50 text-3xl text-purple-500"
      @click="isOpen = true"
    >
      ☰
    </button>

    <!-- Fondo oscuro con blur -->
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
      @click="isOpen = false"
    >
      <!-- Fondo decorativo opcional tipo stars.gif -->
      <div
        class="absolute inset-0 bg-[url('/images/stars.gif')] opacity-10 z-0"
      />
    </div>

    <!-- Sidebar animado -->
    <aside
      :class="[
        'fixed top-0 left-0 h-1/2 md:h-full w-fit border-r border-purple-600 rounded-r-2xl shadow-2xl z-50 p-4 transform transition-transform duration-300 flex flex-col justify-between',
        sidebarBg,
        { 'translate-x-0': isOpen, '-translate-x-full': !isOpen },
      ]"
      :style="{ zIndex: 9999 }"
    >
      <!-- Cierre -->
      <div class="flex justify-end mb-4">
        <button
          @click="isOpen = false"
          class="text-2xl text-gray-400 hover:text-purple-400"
        >
          ✕
        </button>
      </div>

      <!-- Navegación -->
      <nav class="space-y-6 font-gamer">
        <SidebarSection
          title="General"
          :items="[
            { icon: '🏠', label: 'Home', path: '/home' },
            { icon: '⚙️', label: 'Settings', path: '/settings' },
          ]"
        />

        <SidebarSection
          title="Quizzes"
          :items="[
            { icon: '🧠', label: 'Live Quiz', path: '/livequiz' },
            { icon: '✍️', label: 'Create Quiz', path: '/createquiz' },
            { icon: '📂', label: 'Open Quiz', path: '/openquiz' },
          ]"
        />

        <SidebarSection
          title="Resultados"
          :items="[
            { icon: '📈', label: 'My History', path: '/history' },
            { icon: '🏆', label: 'Ranking', path: '/ranking' },
            { icon: '🎖️', label: 'Badges', path: '/badges' },
          ]"
        />

        <SidebarSection
          title="Feedback"
          :items="[
            { icon: '❓', label: 'Question Feedback', path: '/feedback' },
          ]"
        />

        <SidebarSection
          title="Admin"
          :items="[
            { icon: '📊', label: 'Admin Dashboard', path: '/admin' },
            { icon: '🛠️', label: 'Manage Quizzes', path: '/admin/quizzes' },
            { icon: '📉', label: 'User Stats', path: '/admin/stats' },
          ]"
        />
      </nav>

      <!-- Switches -->
      <div class="mt-6 pt-4 space-y-4">
        <ThemeSwitcher />
        <LanguageSwitcher />
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useUIStore } from "@/stores/ui";
import SidebarSection from "@/components/navbar/SidebarSection.vue";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher.vue";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher.vue";

const isOpen = ref(false);
const ui = useUIStore();

// Computed para el fondo según el tema
const sidebarBg = computed(() => {
  switch (ui.theme) {
    case "light":
      return "bg-white text-black";
    case "neon":
      return "bg-black text-neon-text";
    default:
      return "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white";
  }
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap");
.font-gamer {
  font-family: "Press Start 2P", cursive;
}
</style>
