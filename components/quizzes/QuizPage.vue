<template>
  <div
    class="w-full max-w-md mx-auto border rounded-xl p-6 shadow-lg"
    :class="waitingRoomClass"
  >
    <!-- Waiting Room / Game Session interface -->
    <!-- Waiting room state -->
    <div v-if="!gameActive" class="flex flex-col items-center">
      <!-- (Optional) Quiz Title -->
      <!-- <h2 class="text-2xl font-gamer mb-4">{{ quizTitle }}</h2> -->
      <p class="mb-2 font-bold">
        {{ t("game.playersCount", { count: players.length }) }}
      </p>
      <ul class="mb-4 w-full max-w-sm">
        <li
          v-for="player in players"
          :key="player.id"
          class="flex justify-between"
        >
          <span>{{ player.name }}</span>
          <span>{{ player.score }} pts</span>
        </li>
      </ul>
      <p v-if="players.length <= 1" class="italic text-sm mb-4">
        {{ t("game.waitingForPlayers") }}
      </p>
      <div v-if="newPlayerName" class="mb-4 text-green-400 font-semibold">
        {{ t("game.playerJoined", { name: newPlayerName }) }}
      </div>
      <div class="flex space-x-4">
        <button
          @click="startGame"
          class="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:scale-105 transition px-5 py-2 rounded-xl font-bold text-white"
        >
          🎮 {{ t("game.startGame") }}
        </button>
        <button
          @click="endGame"
          class="bg-gray-500 hover:bg-gray-600 transition px-5 py-2 rounded-xl font-bold text-white"
        >
          {{ t("game.endGame") }}
        </button>
      </div>
    </div>
    <!-- Game active state -->
    <div v-else class="mt-4">
      <div v-if="currentQuestion">
        <h2 class="text-2xl font-bold mb-4">
          {{ currentQuestion.questionText }}
        </h2>
        <ul>
          <li
            v-for="(option, idx) in currentQuestion.options"
            :key="idx"
            @click="answerQuestion(idx)"
            class="cursor-pointer p-2 my-2 rounded-md border transition hover:scale-105"
            :class="optionClass"
          >
            {{ option }}
          </li>
        </ul>
      </div>
      <div v-else class="text-center font-bold text-xl">
        <!-- This message appears briefly if waiting between questions -->
        {{ t("game.waitingForPlayers") }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useGameSessionService } from "@/services/gameSessionService";
import { useUserStore } from "@/stores/user";
import { useUIStore } from "@/stores/ui";
import { io } from "socket.io-client";
import { storeToRefs } from "pinia";

const props = defineProps<{
  quizId: string;
}>();
const emit = defineEmits(["go-back"]);

const { t, locale } = useI18n();
const userStore = useUserStore();
const { user, token } = storeToRefs(userStore);
const ui = useUIStore();
const { createGameSession } = useGameSessionService();

// State variables
const gameSession = ref<any>(null);
const players = ref<
  Array<{ id: string; name: string; email: string; score: number }>
>([]);
const gameActive = ref(false);
const currentQuestion = ref<{
  questionId: string;
  questionText: string;
  options: string[];
} | null>(null);
const newPlayerName = ref("");

// Initialize Socket.io connection (adjust URL as needed)
const socket = io(process.env.SOCKET_URL || "/", {
  auth: { token: userStore.token }, // envía el token si es necesario para autenticación
});

// Computed classes for dynamic theme styling
const waitingRoomClass = computed(() => {
  switch (ui.theme) {
    case "light":
      return "bg-white text-black border-purple-300";
    case "dark":
      return "bg-gray-800 text-white border-purple-700";
    case "neon":
      return "bg-black text-neon-text border-neon-pink";
    default:
      return "";
  }
});
const optionClass = computed(() => {
  switch (ui.theme) {
    case "light":
      return "bg-white text-black border-purple-300 hover:bg-purple-100";
    case "dark":
      return "bg-gray-700 text-white border-purple-700 hover:bg-gray-600";
    case "neon":
      return "bg-black text-neon-text border-neon-pink hover:brightness-125";
    default:
      return "";
  }
});

// Helper function to add a player to the list with default score
function addPlayer(user: any) {
  const playerObj = {
    id: user.id || user._id,
    name: user.name,
    email: user.email,
    score: 0,
  };
  players.value.push(playerObj);
}

// Emit an answer to the server
let questionStartTime: number | null = null;
const answerQuestion = (optionIndex: number) => {
  if (!gameSession.value || !currentQuestion.value) return;
  if (!user.value || !token.value) {
    throw new Error("Usuario no autenticado o token no disponible.");
  }

  const timeTaken = questionStartTime
    ? Math.floor((Date.now() - questionStartTime) / 1000)
    : 0;
  socket.emit("answer", {
    sessionId: gameSession.value._id,
    roomId: gameSession.value._id,
    user: user.value.id,
    question: currentQuestion.value.questionId,
    answer: optionIndex,
    timeTaken,
    powerUpUsed: null,
  });
};

// On mount: create session and set up socket listeners
onMounted(async () => {
  if (!user.value || !token.value) {
    throw new Error("Usuario no autenticado o token no disponible.");
  }
  try {
    // Create a new game session for this quiz
    const session = await createGameSession({ quiz: props.quizId });
    gameSession.value = session;
    // Add current user (host) to players list
    addPlayer({
      id: user.value.id,
      name: user.value.name,
      email: user.value.email,
    });
    // Join the socket room for this session
    socket.emit("joinRoom", { roomId: session._id, user: userStore.user });
    // Listen for other players joining
    socket.on("userJoined", (user) => {
      addPlayer(user);
      newPlayerName.value = user.name;
      // Mostrar el nombre del nuevo jugador por 3 segundos
      setTimeout(() => {
        newPlayerName.value = "";
      }, 3000);
    });
    // Listen for questions when game starts
    socket.on("startQuestion", (payload) => {
      gameActive.value = true;
      currentQuestion.value = {
        questionId: payload.questionId,
        questionText: payload.questionText,
        options: payload.options,
      };
      // Mark the start time of the question (for calculating response time)
      questionStartTime = Date.now();
    });
    // Listen for question timeout (time up for a question)
    socket.on("questionTimeout", () => {
      // Optionally notify that time is up (could add a visual indicator)
      currentQuestion.value = null;
    });
    // Listen for game finish event
    socket.on("gameFinished", () => {
      alert(t("game.finished"));
      // Cleanup and return to quizzes list
      socket.disconnect();
      emit("go-back");
    });
    // Listen for answer results to update scores
    socket.on("receiveAnswer", (data) => {
      // Update the score of the player who answered
      const player = players.value.find(
        (p) => p.id === (data.user.id || data.user)
      );
      if (player) {
        player.score = data.playerScore;
      }
      // If the current user answered, we can give feedback (console or UI)
      if (!user.value || !token.value) {
        throw new Error("Usuario no autenticado o token no disponible.");
      }

      if ((data.user.id || data.user) === user.value.id) {
        console.log(data.isCorrect ? "✅ Correct answer!" : "❌ Wrong answer.");
      }
    });
  } catch (error) {
    console.error("Error creating game session:", error);
  }
});

// Clean up socket when leaving the page
onBeforeUnmount(() => {
  socket.disconnect();
});

// Start the game (emit startGame to server)
const startGame = () => {
  if (!gameSession.value) return;
  const duration = 15; // segundos por pregunta
  socket.emit("startGame", {
    sessionId: gameSession.value._id,
    roomId: gameSession.value._id,
    durationPerQuestion: duration,
    lang: locale.value.startsWith("es") ? "es" : "en",
  });
};

// End the game session (leave room and go back)
const endGame = () => {
  socket.disconnect();
  emit("go-back");
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap");

.font-gamer {
  font-family: "Press Start 2P", cursive;
}
</style>
