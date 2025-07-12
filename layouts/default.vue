<template>
  <div>
    <!-- Navbar fijo -->
    <Navbar @showLogin="showLogin = true" @showRegister="showRegister = true" />

    <!-- Modal de Login -->
    <LoginModal :isOpen="showLogin" @close="showLogin = false" />

    <!-- Modal de Registro -->
    <RegisterModal :isOpen="showRegister" @close="showRegister = false" />

    <!-- Layout principal con sidebar -->
    <div :class="layoutClass" class="flex min-h-screen">
      <Sidebar />
      <div class="flex-1 p-6">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useUIStore } from "@/stores/ui";

import Sidebar from "@/components/navbar/Sidebar.vue";
import Navbar from "@/components/navbar/Navbar.vue";
import LoginModal from "@/components/modals/LoginModal.vue";
import RegisterModal from "@/components/modals/RegisterModal.vue";

const showLogin = ref(false);
const showRegister = ref(false);
const ui = useUIStore();

const layoutClass = computed(() => ({
  "bg-white text-black": ui.theme === "light",
  "bg-gray-900 text-white": ui.theme === "dark",
  "bg-neon-bg text-neon-text": ui.theme === "neon",
}));
</script>
