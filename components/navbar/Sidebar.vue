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
      <!-- OPCIONAL: stars.gif -->
      <div
        class="absolute inset-0 bg-[url('/images/stars.gif')] opacity-10 z-0"
      />
    </div>

    <!-- Sidebar animado -->
    <aside
      :class="[
        'fixed top-0 left-0 h-full w-fit border-r border-purple-600 rounded-r-2xl shadow-2xl z-50 p-4 transform transition-transform duration-300 flex flex-col justify-between',
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
      <nav class="space-y-4 font-gamer text-xs md:text-sm">
        <SidebarSection
          title="sidebar.general"
          :items="generalItems"
          @close-sidebar="isOpen = false"
        />
        <SidebarSection
          title="sidebar.quizzes"
          :items="quizItems"
          @close-sidebar="isOpen = false"
        />
        <SidebarSection
          title="sidebar.results"
          :items="resultsItems"
          @close-sidebar="isOpen = false"
        />
        <SidebarSection
          title="sidebar.feedback"
          :items="feedbackItems"
          @close-sidebar="isOpen = false"
        />
        <SidebarSection
          title="sidebar.admin"
          :items="adminItems"
          @close-sidebar="isOpen = false"
        />
      </nav>

      <!-- Switches -->
      <div class="mt-4 pt-4 space-y-2">
        <ThemeSwitcher />
        <LanguageSwitcher />
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useUIStore } from "@/stores/ui";
import SidebarSection from "@/components/navbar/SidebarSection.vue";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher.vue";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher.vue";

const { t } = useI18n();
const isOpen = ref(false);
const ui = useUIStore();

// Fondo según tema
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

// Items traducidos
const generalItems = computed(() => [
  { icon: "🏠", label: t("sidebar.home"), path: "/" },
]);
const quizItems = computed(() => [
  { icon: "🧠", label: t("sidebar.liveQuiz"), path: "/livequiz" },
  { icon: "✍️", label: t("sidebar.createQuiz"), path: "/createquiz" },
]);
const resultsItems = computed(() => [
  { icon: "📈", label: t("sidebar.myHistory"), path: "/history" },
  { icon: "🎖️", label: t("sidebar.badges"), path: "/badges" },
]);
const feedbackItems = computed(() => [
  { icon: "❓", label: t("sidebar.feedback"), path: "/feedback" },
]);
const adminItems = computed(() => [
  { icon: "📊", label: t("sidebar.adminDashboard"), path: "/admin" },
  { icon: "🛠️", label: t("sidebar.manageQuizzes"), path: "/admin/quizzes" },
]);
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap");

.font-gamer {
  font-family: "Press Start 2P", cursive;
  font-size: 0.8rem; /* un pelín más pequeña */
}
</style>
