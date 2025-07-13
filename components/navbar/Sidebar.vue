<template>
  <div>
    <!-- Botón hamburguesa -->
    <button
      class="fixed top-4 left-4 z-50 text-3xl text-purple-500"
      @click="isOpen = true"
    >
      ☰
    </button>

    <!-- Fondo oscuro cuando se abre -->
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/50 z-40"
      @click="isOpen = false"
    ></div>

    <!-- Drawer lateral -->
    <aside
      :class="[
        'fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-xl z-50 p-4 transform transition-transform duration-300 flex flex-col justify-between',
        { 'translate-x-0': isOpen, '-translate-x-full': !isOpen },
      ]"
      :style="{ zIndex: 9999 }"
    >
      <!-- Cierre -->
      <div class="flex justify-end mb-4">
        <button
          @click="isOpen = false"
          class="text-2xl text-gray-500 dark:text-white"
        >
          ✕
        </button>
      </div>

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
      <div
        class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4"
      >
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

const ui = useUIStore();
const isOpen = ref(false);
</script>
