<template>
  <aside
    :class="asideClass"
    class="w-64 h-screen p-4 flex flex-col justify-between shadow-xl transition-all duration-300"
  >
    <!-- Navegación -->
    <nav class="space-y-6">
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
        :items="[{ icon: '❓', label: 'Question Feedback', path: '/feedback' }]"
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
    <div
      class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4"
    >
      <ThemeSwitcher />
      <LanguageSwitcher />
    </div>
  </aside>
</template>

<script setup>
import { computed } from "vue";
import { useUIStore } from "@/stores/ui";
import SidebarSection from "@/components/navbar/SidebarSection.vue";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher.vue";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher.vue";

const ui = useUIStore();

const asideClass = computed(() => ({
  "bg-white text-black": ui.theme === "light",
  "bg-gray-900 text-white": ui.theme === "dark",
  "bg-neon-bg text-neon-text": ui.theme === "neon",
}));
</script>
