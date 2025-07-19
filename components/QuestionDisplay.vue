<!-- components/QuestionDisplay.vue -->
<template>
  <div class="question-display" v-if="question">
    <h3>{{ question.text }}</h3>
    <div class="options">
      <label v-for="(opt, index) in question.options" :key="index">
        <input type="radio" :value="opt" v-model="selectedAnswer" />
        {{ opt }}
      </label>
    </div>
    <div class="powerup">
      <label
        >Power-Up:
        <select v-model="powerUpUsed">
          <option value="none">Ninguno</option>
          <option value="double_points">Doblar Puntos</option>
          <option value="skip">Omitir</option>
        </select>
      </label>
    </div>
    <button @click="submit">Enviar Respuesta</button>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
const props = defineProps({
  question: Object,
});
const emit = defineEmits(["answer"]);
const selectedAnswer = ref("");
const powerUpUsed = ref("none");

// Resetear respuesta seleccionada cuando cambia la pregunta
watch(
  () => props.question,
  () => {
    selectedAnswer.value = "";
    powerUpUsed.value = "none";
  }
);

// Enviar respuesta seleccionada al componente padre
function submit() {
  if (!selectedAnswer.value) {
    alert("Por favor selecciona una respuesta.");
    return;
  }
  emit("answer", selectedAnswer.value, powerUpUsed.value);
}
</script>

<style>
.question-display {
  margin-bottom: 20px;
}
.options label {
  display: block;
  margin: 5px 0;
}
.powerup {
  margin: 10px 0;
}
.question-display button {
  padding: 8px 12px;
}
</style>
