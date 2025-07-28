<template>
  <div class="flex justify-center gap-2">
    <button
      v-for="lang in locales"
      :key="lang.code"
      @click="changeLocale(lang.code)"
      :class="[
        'px-3 py-1 rounded text-xs md:text-sm transition',
        locale === lang.code
          ? 'bg-blue-600 text-white'
          : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
      ]"
    >
      {{ lang.name }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useI18nStore } from "@/stores/i18n";
import { watch } from "vue";

const { locale, setLocale } = useI18n();
const i18nStore = useI18nStore();

const locales = [
  { code: "es" as const, name: "ES" },
  { code: "en" as const, name: "EN" },
];

function changeLocale(code: "es" | "en") {
  i18nStore.setLocale(code);
}

watch(
  () => i18nStore.locale,
  (newLocale) => {
    setLocale(newLocale);
  }
);

// Al montar, sincroniza el i18n interno con el store
setLocale(i18nStore.locale);
</script>
