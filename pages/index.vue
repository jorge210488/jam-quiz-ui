<template>
  <div class="p-10 text-white">
    <h1 class="text-3xl font-bold">{{ $t("welcome") }}</h1>

    <div class="mt-6 flex gap-4">
      <button
        class="bg-white text-purple-700 px-4 py-2 rounded"
        @click="switchLang('es')"
      >
        🇪🇸 Español
      </button>
      <button
        class="bg-white text-purple-700 px-4 py-2 rounded"
        @click="switchLang('en')"
      >
        🇬🇧 English
      </button>
    </div>
  </div>
</template>

<script setup>
const { locale } = useI18n();

function switchLang(lang) {
  locale.value = lang;
  console.log("Idioma cambiado a:", lang);
}
</script>
