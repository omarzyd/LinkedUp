<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const emit = defineEmits(['toggle'])

const handleSignup = async () => {
  if (password.value !== confirmPassword.value) {
    alert("Passwords do not match!");
    return;
  }

  const userData = {
    username: username.value,
    email: email.value,
    password: password.value,
    confirmPassword: confirmPassword.value,
  }

  try {
    const response = await axios.post('http://localhost:5000/signup', userData);
    console.log(response.data.message);
    localStorage.setItem('accessToken', response.data.access_token);

    router.push('/home');
  } catch (error: unknown) {
    // Type the error as AxiosError
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data?.message || error.message);
      alert(error.response?.data?.message || "An error occurred!");
    } else {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred.");
    }
  }
}
</script>

<template>
  <div class="bg-[#1a4d6e]/80 backdrop-blur-lg rounded-lg p-8 shadow-xl">
    <h2 class="text-2xl font-bold text-center text-white mb-8">CREATE ACCOUNT</h2>
    
    <form @submit.prevent="handleSignup" class="space-y-6">
      <div>
        <input
          v-model="username"
          type="text"
          placeholder="Username"
          class="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
      </div>
      
      <div>
        <input
          v-model="email"
          type="email"
          placeholder="Email Address"
          class="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
      </div>
      
      <div>
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
      </div>
      
      <div>
        <input
          v-model="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          class="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
      </div>
      
      <button
        type="submit"
        class="w-full bg-cyan-400 text-[#1a4d6e] font-bold py-3 px-4 rounded-lg hover:bg-cyan-300 transition duration-300"
      >
        SIGN UP
      </button>
    </form>
    
    <div class="mt-6 text-center text-white">
      <p>
        Already have an account?
        <button @click="emit('toggle')" class="text-cyan-400 hover:text-cyan-300">Login here</button>
      </p>
    </div>
  </div>
</template>
