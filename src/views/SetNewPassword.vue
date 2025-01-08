<template>
  <div class="min-h-screen relative">
    <!-- Background styling -->
    <div class="absolute inset-0 bg-cover bg-center bg-no-repeat" style="background-image: url('/background.jpg')"></div>
    <div class="absolute inset-0 bg-gradient-to-r from-[#1a4d6e]/20 to-[#1a4d6e]/75"></div>

    <div class="relative z-10">
      <div class="container mx-auto px-4 flex items-center justify-center min-h-screen">
        <div class="bg-[#1a4d6e]/80 backdrop-blur-lg rounded-lg p-8 shadow-xl w-96 text-white">
          <h2 class="text-2xl font-bold text-center mb-4">Set New Password</h2>

          <p class="text-center text-sm mb-4">
            Please enter your new password and confirm it.
          </p>

          <!-- Error Message -->
          <div v-if="errorMessage" class="text-red-300 text-center mb-4">
            {{ errorMessage }}
          </div>

          <!-- Success Message -->
          <div v-if="successMessage" class="text-green-300 text-center mb-4">
            {{ successMessage }}
          </div>

          <!-- New Password Input -->
          <input
            v-model="newPassword"
            type="password"
            placeholder="New Password"
            class="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30
                   text-white placeholder-white/70 focus:outline-none focus:ring-2
                   focus:ring-cyan-400 mb-4"
          />

          <!-- Confirm Password Input -->
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="Confirm New Password"
            class="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30
                   text-white placeholder-white/70 focus:outline-none focus:ring-2
                   focus:ring-cyan-400 mb-4"
          />

          <!-- Submit Button -->
          <button
            @click="handleSetNewPassword"
            class="w-full bg-cyan-400 text-[#1a4d6e] font-bold py-3 px-4 rounded-lg 
                   hover:bg-cyan-300 transition duration-300"
          >
            Set New Password
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const newPassword = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');
const successMessage = ref('');

// Extract the token from the URL query parameters
const reset_token = new URLSearchParams(window.location.search).get('reset_token');

const handleSetNewPassword = async () => {
  if (!newPassword.value || !confirmPassword.value) {
    errorMessage.value = 'Both fields are required.';
    return;
  }
  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match.';
    return;
  }
  if (!reset_token) {
    errorMessage.value = 'Invalid or missing reset token.';
    return;
  }
  try {
    const response = await axios.post('http://localhost:5000/reset-password', {
      reset_token,
      password: newPassword.value,
    });
    successMessage.value = 'Your password has been successfully updated.';
    setTimeout(() => router.push('/login'), 2000); // Redirect to login after success
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'An error occurred.';
  }
};
</script>

<style scoped>
.min-h-screen {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
