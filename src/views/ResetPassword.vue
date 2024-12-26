<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
// If you have a Navbar or other layout components:
import Navbar from '../components/layout/Navbar.vue';
import ContactInfo from '../components/ui/ContactInfo.vue';

// State
const router = useRouter();
const email = ref('');
const errorMessage = ref('');

// Sends a request to your backend to generate a reset link and email it
const handleSendResetEmail = async () => {
  if (!email.value.trim()) {
    errorMessage.value = 'Please enter your email.';
    return;
  }
  try {
    // Example: POST to your backend route
    const response = await axios.post('http://localhost:5000/forgot-password', {
      email: email.value
    });
    // If successful, show a success message or redirect
    alert('A reset link has been sent to your email.');
    router.push('/login'); // Go back to login or wherever you want
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'An error occurred.';
  }
};
</script>

<template>
  <div class="min-h-screen relative">
    <!-- Optional: same background/overlay style as your auth pages -->
    <div 
      class="absolute inset-0 bg-cover bg-center bg-no-repeat"
      style="background-image: url('/background.jpg')"
    ></div>
    <div class="absolute inset-0 bg-gradient-to-r from-[#1a4d6e]/20 to-[#1a4d6e]/75"></div>
    
    <div class="relative z-10">
      <!-- If you want the same navbar as your login page -->
      <Navbar :isAuthenticated="false" />

      <div class="container mx-auto px-4 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div class="bg-[#1a4d6e]/80 backdrop-blur-lg rounded-lg p-8 shadow-xl w-96 text-white">
          <h2 class="text-2xl font-bold text-center mb-4">Reset Password</h2>

          <p class="text-center text-sm mb-4">
            Enter your email address to receive a reset link.
          </p>

          <!-- Error Message -->
          <div v-if="errorMessage" class="text-red-300 text-center mb-4">
            {{ errorMessage }}
          </div>

          <!-- Email Input -->
          <input
            v-model="email"
            type="email"
            placeholder="Email Address"
            class="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30
                   text-white placeholder-white/70 focus:outline-none focus:ring-2
                   focus:ring-cyan-400 mb-4"
          />

          <!-- Send Reset Email Button -->
          <button
            @click="handleSendResetEmail"
            class="w-full bg-cyan-400 text-[#1a4d6e] font-bold py-3 px-4 rounded-lg 
                   hover:bg-cyan-300 transition duration-300"
          >
            Send Reset Email
          </button>
        </div>
      </div>

      <!-- Optionally reuse the contact info section -->
      <ContactInfo />
    </div>
  </div>
</template>

<style scoped>
/* Add any custom styles here */
</style>