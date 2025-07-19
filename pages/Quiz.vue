<template>
  <div class="relative w-full h-full overflow-hidden" :class="themeClass">
    <!-- Fondo animado como en Home -->
    <div
      class="absolute inset-0 z-0 bg-[url('/images/stars.gif')] opacity-20 pointer-events-none"
    ></div>

    <!-- Glow decorativo -->
    <div
      class="absolute w-[600px] h-[600px] blur-3xl top-[-100px] left-[-150px] animate-pulse z-0 pointer-events-none"
      :class="glowColor"
    ></div>

    <!-- Contenido principal -->
    <div
      class="relative z-10 flex flex-col items-center justify-center text-center min-h-[calc(100vh-4rem)] py-20 px-4"
    >
      <!-- 👾 Si aún no se ha unido a la sala -->
      <motion
        tag="div"
        v-if="!joined"
        :initial="{ opacity: 0, y: -40 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 0.6 } }"
        class="space-y-6"
      >
        <!-- Título -->
        <h2
          class="text-3xl md:text-5xl font-gamer drop-shadow-xl"
          :class="titleClass"
        >
          🕹️ {{ t("quiz.joinTitle") }}
        </h2>

        <!-- Subtítulo -->
        <p class="text-lg md:text-xl text-gray-300 max-w-xl mx-auto">
          {{ t("quiz.joinSubtitle") }}
        </p>

        <!-- Componente para unirse -->
        <JoinRoom @joined="onJoined" @start="onStartGame" />

        <!-- Botón de prueba (puedes usarlo si quieres algo llamativo) -->
        <div class="flex justify-center mt-6">
          <button
            @click="onStartGame({ session: sessionId, room: roomId })"
            class="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:scale-105 transform transition duration-300 px-6 py-3 rounded-xl font-bold shadow-lg text-white"
          >
            🚀 {{ t("quiz.startGame") }}
          </button>
        </div>
      </motion>

      <!-- ✅ Ya unido -->
      <motion
        tag="div"
        v-else
        :initial="{ opacity: 0, y: 40 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 0.5 } }"
        class="w-full max-w-4xl space-y-8"
      >
        <!-- Pregunta actual -->
        <QuestionDisplay
          v-if="currentQuestion"
          :question="currentQuestion"
          @answer="submitAnswer"
        />

        <!-- Resultado final -->
        <div v-if="gameFinished" class="bg-black/40 p-6 rounded-xl shadow-xl">
          <h2 class="text-3xl font-bold mb-2 text-green-400">
            🏁 {{ finalMessage }}
          </h2>
          <p class="text-xl">
            {{ t("quiz.finalScore") }}:
            <strong class="text-white">{{ playerScore }}</strong>
          </p>

          <!-- Botón para reiniciar o volver -->
          <div class="mt-6">
            <button
              @click="joined = false"
              class="bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-105 transition px-5 py-2 rounded-lg text-white font-semibold shadow-md"
            >
              🔁 {{ t("quiz.playAgain") }}
            </button>
          </div>
        </div>

        <!-- Historial / Logs -->
        <div
          class="bg-black/30 p-4 rounded-lg shadow-md max-h-60 overflow-y-auto text-left"
        >
          <Logs :logs="logs" />
        </div>
      </motion>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import JoinRoom from "~/components/JoinRoom.vue";
import QuestionDisplay from "~/components/QuestionDisplay.vue";
import Logs from "~/components/Logs.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const { $socket } = useNuxtApp();

const joined = ref(false);
const roomId = ref("");
const sessionId = ref("");
const userId = ref("");
const currentQuestion = ref(null);
const logs = ref([]);
const gameFinished = ref(false);
const finalMessage = ref("");
const playerScore = ref(0);

// Función para agregar mensajes al log
function log(message) {
  logs.value.push(message);
}

// Manejo del evento cuando el usuario se une a la sala
function onJoined({ room, user }) {
  joined.value = true;
  roomId.value = room;
  userId.value = user;
  log(`✅ Te has unido a la sala "${room}" como usuario "${user}".`);
  // Se podría emitir aquí el join al servidor, pero lo haremos en el back si es necesario
}

// Manejo para iniciar el juego (emitir startGame al servidor)
function onStartGame({ session, room }) {
  if (!session) {
    alert("Debe ingresar un ID de sesión.");
    return;
  }
  sessionId.value = session;
  roomId.value = room;
  $socket.emit("startGame", {
    sessionId: sessionId.value,
    roomId: roomId.value,
    durationPerQuestion: 10,
    lang: "es",
  });
  log(
    `➡️ Emitido: startGame (sesión=${sessionId.value}, sala=${roomId.value})`
  );
}

// Envío de la respuesta elegida por el jugador
function submitAnswer(answer, powerUp) {
  if (!currentQuestion.value) return;
  const data = {
    sessionId: sessionId.value,
    roomId: roomId.value,
    user: userId.value,
    question: currentQuestion.value.id,
    answer: answer,
    timeTaken: 5, // aquí se puede calcular el tiempo real transcurrido
    powerUpUsed: powerUp,
  };
  $socket.emit("answer", data);
  log(
    `➡️ Emitido: answer (pregunta=${currentQuestion.value.id}, respuesta=${answer}, powerUp=${powerUp})`
  );
}

// Configuración de eventos de Socket.IO
onMounted(() => {
  // Conexión establecida
  $socket.on("connect", () => log("🔌 Conectado al servidor."));

  // Otro jugador se une
  $socket.on("userJoined", (user) => {
    log(`⬅️ El usuario "${user}" se unió a la sala.`);
  });

  // Llega una nueva pregunta
  $socket.on("startQuestion", (data) => {
    currentQuestion.value = {
      id: data.questionId,
      text: data.questionText,
      options: data.options,
    };
    log(`⬅️ Nueva pregunta: "${data.questionText}"`);
  });

  // Se acabó el tiempo para la pregunta actual
  $socket.on("questionTimeout", (data) => {
    log(`⏰ Tiempo terminado para la pregunta ${data.questionId}.`);
  });

  // Respuesta recibida (puede ser la propia o de otro)
  $socket.on("receiveAnswer", (data) => {
    log(
      `⬅️ Respuesta de ${data.user}: "${data.answer}". Correcta: ${
        data.isCorrect ? "Sí" : "No"
      }. Puntos: ${data.pointsEarned}. Total jugador: ${data.playerScore}`
    );
    // Mantener puntaje del jugador actual si viene en data
    if (data.user === userId.value) {
      playerScore.value = data.playerScore || playerScore.value;
    }
  });

  // Fin del juego
  $socket.on("gameFinished", (data) => {
    log(`🏁 ${data.message}`);
    finalMessage.value = data.message;
    gameFinished.value = true;
  });

  // Desconexión
  $socket.on("disconnect", () => {
    log("🔴 Desconectado del servidor.");
  });
});

// Limpiar eventos al desmontar
onBeforeUnmount(() => {
  $socket.off("connect");
  $socket.off("userJoined");
  $socket.off("startQuestion");
  $socket.off("questionTimeout");
  $socket.off("receiveAnswer");
  $socket.off("gameFinished");
  $socket.off("disconnect");
});
</script>

<style>
.quiz-container {
  padding: 20px;
  font-family: Arial, sans-serif;
}
.game-finished {
  margin: 20px 0;
}
</style>
