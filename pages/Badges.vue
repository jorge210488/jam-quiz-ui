<template>
  <div class="w-full flex justify-center px-4 py-20">
    <div class="w-full max-w-6xl">
      <h1
        class="text-4xl md:text-5xl font-gamer mb-10 text-center"
        :class="titleClass"
      >
        🏆 {{ t("badges.title") }}
      </h1>

      <div v-if="user" class="text-center mb-8">
        <p class="text-xl font-semibold mb-4">
          {{ t("badges.earnedBy", { name: user.name }) }}
        </p>

        <div
          v-if="user.badges?.length"
          class="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          <div
            v-for="badge in user.badges"
            :key="badge._id"
            class="bg-gray-800 rounded-xl p-4 shadow-md border-2 border-purple-500"
          >
            <img
              :src="badge.iconUrl"
              alt="badge"
              class="w-20 h-20 mx-auto mb-2 object-contain"
            />
            <p class="text-lg font-bold text-white">{{ badge.name }}</p>
            <p class="text-sm text-gray-300">{{ badge.description }}</p>
          </div>
        </div>

        <div v-else class="text-gray-400 text-lg mt-6">
          {{ t("badges.noBadges") }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useUIStore } from "@/stores/ui";
import { useUserStore } from "@/stores/user";

const { t } = useI18n();
const ui = useUIStore();
const userStore = useUserStore();

onMounted(() => {
  userStore.loadFromStorage();
  console.log("🔍 Badges cargados del store:", userStore.user?.badges);
});

const user = computed(() => userStore.user);

const titleClass = computed(() => {
  return ui.theme === "neon" ? "text-neon-pink" : "text-purple-400";
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap");

.font-gamer {
  font-family: "Press Start 2P", cursive;
}
</style>
