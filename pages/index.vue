<script setup lang="ts">
import { useUIStore } from "@/stores/ui";

const ui = useUIStore();
</script>

<template>
  <div>Tema actual: {{ ui.theme }}</div>
</template>
