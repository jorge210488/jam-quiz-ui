<template>
  <!-- Navbar Header: fixed at top, full width, no background -->
  <header
    class="fixed top-2 md:top-1 left-0 right-2 z-50 px-0 py-0 flex justify-end items-center pointer-events-none bg-transparent"
  >
    <!-- Container for nav items, with gamer font and theme-based text color -->
    <div
      class="flex items-center gap-4 pointer-events-auto font-gamer"
      :class="{
        'text-black': ui.theme === 'light',
        'text-white': ui.theme === 'dark',
        'text-neon-text': ui.theme === 'neon',
      }"
    >
      <div v-if="userStore.user">
        <!-- Avatar + Dropdown Menu -->
        <div class="relative">
          <!-- User Avatar (click to toggle menu) -->
          <img
            :src="userAvatarUrl"
            class="w-9 h-9 rounded-full cursor-pointer"
            alt="avatar"
            @click="showMenu = !showMenu"
          />
          <!-- Dropdown Menu -->
          <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <div
              v-if="showMenu"
              class="absolute right-0 mt-2 w-48 border rounded-lg shadow-xl z-50"
              :class="{
                'bg-white border-gray-200 text-black': ui.theme === 'light',
                'bg-gray-800 border-gray-700 text-white': ui.theme === 'dark',
                'bg-neon-bg border-neon-accent text-neon-text':
                  ui.theme === 'neon',
              }"
            >
              <!-- User Name (display only) -->
              <p class="px-4 py-2 text-sm">
                {{ userStore.user.name }}
              </p>
              <!-- Profile Link -->
              <NuxtLink
                to="/profile"
                class="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <!-- 👤 Perfil (icon optional) -->
                {{ t("profile") }}
              </NuxtLink>
              <!-- Logout Button -->
              <button
                @click="logout"
                class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <!-- 🚪 Cerrar sesión (icon optional) -->
                {{ t("logout") }}
              </button>
            </div>
          </transition>
        </div>
      </div>

      <div v-else>
        <!-- Not logged in: Login and Register buttons -->
        <button
          @click="$emit('showLogin')"
          class="text-xs md:text-sm font-medium hover:underline cursor-pointer"
        >
          {{ t("loginTitle") }}
        </button>
        <button
          @click="$emit('showRegister')"
          class="ml-3 text-xs md:text-sm font-medium hover:underline cursor-pointer"
        >
          {{ t("registerTitle") }}
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useUIStore } from "@/stores/ui";
import { useI18n } from "vue-i18n";

// Stores and utilities
const userStore = useUserStore();
const ui = useUIStore();
const router = useRouter();
const { t } = useI18n();

// Reactive state for dropdown menu
const showMenu = ref(false);

// Derive avatar URL (game character or default) for logged-in user
// (If you have a user profile avatar, use that; otherwise use a placeholder or dynamic image)
const userAvatarUrl = computed(() => {
  const seed = userStore.user?.id || "guest";
  return `https://api.dicebear.com/6.x/bottts/svg?seed=${encodeURIComponent(
    seed
  )}`;
});

// Logout function
const logout = () => {
  userStore.logout();
  showMenu.value = false;
  router.push("/");
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap");

.font-gamer {
  font-family: "Press Start 2P", cursive;
}

/* (Opcional) Efecto glow para texto neón */
.text-neon-text {
  /* Ejemplo de brillo azul-neón */
  text-shadow: 0 0 6px #33faff, 0 0 12px #33faff, 0 0 18px #33faff;
}
</style>
