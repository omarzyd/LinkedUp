<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

// Original references
const router = useRouter();
const email = ref('');
const password = ref('');
const errorMessage = ref('');

// Original defineEmits for toggling between login/signup
const emit = defineEmits(['toggle']);

// Original login logic
const handleLogin = async () => {
  try {
    const response = await axios.post('http://localhost:5000/login', {
      email: email.value,
      password: password.value
    });

    // Log the response to check if the token is present
    console.log('Login Response:', response);

    if (response.data && response.data.access_token) {
      // Store the access token in localStorage
      localStorage.setItem('accessToken', response.data.access_token);
      console.log('Token saved to Local Storage');
      router.push('/home'); // Redirect after successful login
    } else {
      errorMessage.value = 'Failed to retrieve token';
    }
  } catch (error: any) {
    if (error.response) {
      errorMessage.value = error.response.data.message || 'An error occurred.';
    } else {
      errorMessage.value = 'An error occurred. Please try again.';
    }
  }
};

// Original Google login logic
const handleGoogleLogin = () => {
  window.location.href = 'http://localhost:5000/login/google';
};

// Original token check from URL
const token = new URLSearchParams(window.location.search).get('token');
if (token) {
  localStorage.setItem('accessToken', token);
  router.push('/home');
}

// ----------------------------------
// ADDED: handleForgotPassword method
// ----------------------------------
const handleForgotPassword = () => {
  // Navigate to the new "Reset Password" page
  router.push('/reset-password');
};
</script>

<template>
  <div class="bg-[#1a4d6e]/80 backdrop-blur-lg rounded-lg p-8 shadow-xl">
    <h2 class="text-2xl font-bold text-center text-white mb-8">LOGIN TO YOUR ACCOUNT</h2>
    
    <!-- Existing error message display -->
    <div v-if="errorMessage" class="text-red-300 text-center mb-4">
      {{ errorMessage }}
    </div>
    
    <!-- Login form -->
    <form @submit.prevent="handleLogin" class="space-y-6">
      <div>
        <input
          v-model="email"
          type="email"
          placeholder="Email Address"
          class="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 
                 text-white placeholder-white/70 focus:outline-none focus:ring-2 
                 focus:ring-cyan-400"
        />
      </div>
      <div>
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 
                 text-white placeholder-white/70 focus:outline-none focus:ring-2 
                 focus:ring-cyan-400"
        />
      </div>

      <button
        type="submit"
        class="w-full bg-cyan-400 text-[#1a4d6e] font-bold py-3 px-4 rounded-lg 
               hover:bg-cyan-300 transition duration-300"
      >
        LOGIN
      </button>
    </form>

    <!-- Google Authentication Button -->
    <button
      @click="handleGoogleLogin"
      class="mt-6 w-full flex items-center justify-center space-x-2 
             bg-white text-[#1a4d6e] py-3 px-4 rounded-lg shadow 
             hover:bg-gray-100 transition duration-300"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        class="h-6 w-6"
      >
        <path
          fill="#EA4335"
          d="M24 9.5c3.3 0 6.2 1.2 8.5 3.3l6.4-6.4C34.5 3.2 29.5 1 24 1 
             14.8 1 7.2 6.4 3.9 14l7.6 5.9c1.8-5.3 7-9.4 12.5-9.4z"
        />
        <path
          fill="#34A853"
          d="M10.4 24c0-1.2.2-2.4.5-3.5l-7.6-5.9C1.2 17 
             0 20.4 0 24s1.2 7 3.3 9.5l7.6-5.9c-.3-1.1-.5-2.3-.5-3.6z"
        />
        <path
          fill="#4A90E2"
          d="M24 38.5c-5.6 0-10.7-3.6-12.5-9.4l-7.6 5.9c3.3 7.6 
             10.8 13 20.1 13 5.5 0 10.5-2.2 14.3-5.8l-7.2-5.6c-2.3 1.5-5.2 
             2.4-8.4 2.4z"
        />
        <path
          fill="#FBBC05"
          d="M47 24c0-1.6-.2-3.1-.6-4.6H24v9h12.9c-.5 
             2.6-1.8 4.8-3.7 6.5l7.2 5.6c4.4-4.1 7.6-10.1 7.6-16.5z"
        />
      </svg>
      <span class="font-medium">Sign in with Google</span>
    </button>

    <!-- ADDED: Forgot Password Link -->
    <div class="mt-4 text-center text-white">
      <button
        @click="handleForgotPassword"
        class="underline text-cyan-300 hover:text-cyan-200"
      >
        Forgot Password?
      </button>
    </div>

    <div class="mt-6 text-center text-white">
      <p>
        Don't have an account?
        <button 
          @click="emit('toggle')" 
          class="text-cyan-400 hover:text-cyan-300"
        >
          Sign Up now
        </button>
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Your existing styles remain intact */
</style>