<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { RouterLink } from "vue-router";
import { defineEmits, defineProps } from "vue";

const { t } = useI18n();

// Aquí renombramos titleKey → title
const props = defineProps<{
  title: string;
  items: { icon: string; label: string; path: string }[];
}>();

const emit = defineEmits<{
  (e: "close-sidebar"): void;
}>();

function closeSidebar() {
  emit("close-sidebar");
}
</script>

<template>
  <div>
    <p class="text-xs font-semibold uppercase text-gray-500 mb-2">
      <!-- antes: t(titleKey), ahora: t(title) -->
      {{ t(props.title) }}
    </p>
    <ul class="space-y-0">
      <li v-for="item in props.items" :key="item.path">
        <RouterLink
          :to="item.path"
          class="flex items-center space-x-2 px-2 py-1 rounded hover:bg-purple-600 hover:text-white transition-colors"
          @click.native="closeSidebar"
        >
          <span class="text-lg">{{ item.icon }}</span>
          <span class="font-gamer">{{ item.label }}</span>
        </RouterLink>
      </li>
    </ul>
  </div>
</template>
