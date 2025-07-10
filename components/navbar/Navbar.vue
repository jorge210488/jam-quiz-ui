<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 px-4 py-0 flex justify-end items-center pointer-events-none"
  >
    <div
      class="flex items-center gap-4 pointer-events-auto"
      :class="{
        'text-black': ui.theme === 'light',
        'text-white': ui.theme === 'dark',
        'text-neon-text': ui.theme === 'neon',
      }"
    >
      <div v-if="userStore.user">
        <!-- Avatar & dropdown -->
        <div class="relative" @click="showMenu = !showMenu">
          <img
            src="https://i.pravatar.cc/40"
            class="w-9 h-9 rounded-full cursor-pointer"
            alt="avatar"
          />
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
            <p class="px-4 py-2 text-sm">{{ userStore.user.name }}</p>
            <NuxtLink
              to="/profile"
              class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
            >
              Perfil
            </NuxtLink>
            <button
              @click="logout"
              class="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      <div v-else>
        <button
          @click="emit('showLogin')"
          class="text-sm font-medium hover:underline"
        >
          {{ $t("loginTitle") }}
        </button>
        <NuxtLink
          to="/register"
          class="ml-3 text-sm font-medium hover:underline"
        >
          {{ $t("register") }}
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useUIStore } from "@/stores/ui";
import { useI18n } from "vue-i18n";

const emit = defineEmits(["showLogin"]);
const userStore = useUserStore();
const ui = useUIStore();
const router = useRouter();
const { t } = useI18n();

const showMenu = ref(false);

const logout = () => {
  userStore.logout();
  showMenu.value = false;
  router.push("/");
};
</script>
