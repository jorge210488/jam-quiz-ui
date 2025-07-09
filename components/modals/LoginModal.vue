<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      @click.self="closeModal"
    >
      <motion-div
        class="bg-white rounded-xl shadow-xl p-8 w-[350px] relative"
        :initial="{ opacity: 0, scale: 0.9 }"
        :enter="{ opacity: 1, scale: 1, transition: { duration: 0.4 } }"
        :leave="{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }"
      >
        <button
          @click="closeModal"
          class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
        >
          ×
        </button>

        <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">
          🎮 Iniciar sesión
        </h2>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Contraseña</label
            >
            <input
              v-model="form.password"
              type="password"
              required
              class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <motion-div :hover="{ scale: 1.05 }" :tap="{ scale: 0.95 }">
            <button
              type="submit"
              class="w-full bg-purple-600 text-white py-2 rounded-md font-semibold hover:bg-purple-700"
            >
              Entrar
            </button>
          </motion-div>
        </form>
      </motion-div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthService } from "@/services/authService";
import { useUserStore } from "@/stores/user";

const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits(["close"]);

const form = ref({ email: "", password: "" });

const router = useRouter();
const { login } = useAuthService();
const userStore = useUserStore();

const handleLogin = async () => {
  try {
    const res = await login(form.value);
    userStore.setUser(res); // Guardar token y user
    emit("close");
    router.push("/"); // Redirigir al home
  } catch (err: any) {
    alert("❌ Email o contraseña incorrectos");
  }
};

const closeModal = () => {
  emit("close");
};
</script>
