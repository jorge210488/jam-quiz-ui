<template>
  <NuxtLink
    :to="path"
    class="flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer"
    :class="activeClass"
  >
    <span class="text-xl">{{ icon }}</span>
    <span>{{ translatedLabel }}</span>
  </NuxtLink>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { computed } from "vue";

const props = defineProps<{
  label: string;
  icon?: string;
  path: string;
}>();

const route = useRoute();
const { t } = useI18n();

const translatedLabel = computed(() => t(props.label));

const activeClass = computed(() =>
  route.path === props.path ? "bg-blue-600 text-white" : ""
);
</script>
