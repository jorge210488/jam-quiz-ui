<!-- components/Logs.vue -->
<template>
  <div class="logs">
    <h3>📜 Logs de la partida:</h3>
    <div class="log-line" v-for="(msg, i) in logs" :key="i">
      {{ msg }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  logs: Array,
});
</script>

<style>
.logs {
  background: #f0f0f0;
  padding: 10px;
  max-height: 200px;
  overflow-y: auto;
  white-space: pre-line;
}
.log-line {
  margin: 4px 0;
}
</style>
