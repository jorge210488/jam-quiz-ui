<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps<{
  title: string;
  items: { icon: string; label: string; path: string }[];
}>();
</script>

<template>
  <div>
    <p
      class="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2"
    >
      {{ t(title) }}
    </p>
    <ul class="space-y-2">
      <SidebarItem
        v-for="item in items"
        :key="item.label"
        :label="item.label"
        :icon="item.icon"
        :path="item.path"
      />
    </ul>
  </div>
</template>
