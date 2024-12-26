<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Navbar from '../components/layout/Navbar.vue'; // Import Navbar
import ContactInfo from '../components/ui/ContactInfo.vue';

const router = useRouter();
const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');

const handleSignup = () => {
  console.log('Signup attempt:', {
    username: username.value,
    email: email.value,
    password: password.value,
    confirmPassword: confirmPassword.value,
  });
  router.push('/login');
};
</script>

<template>
  <div class="min-h-screen relative">
    <!-- Background image with proper sizing and positioning -->
    <div
      class="absolute inset-0 bg-cover bg-center bg-no-repeat"
      style="background-image: url('/background.jpg')"
    ></div>

    <!-- Overlay with adjusted opacity -->
    <div class="absolute inset-0 bg-gradient-to-r from-[#1a4d6e]/20 to-[#1a4d6e]/75"></div>

    <div class="relative z-10">
      <!-- Navbar with isAuthenticated prop -->
      <Navbar :isAuthenticated="false" />

      <div class="container mx-auto px-4 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div class="w-[400px] bg-[#1a4d6e]/80 backdrop-blur-lg rounded-lg p-8 shadow-xl">
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
              <router-link to="/login" class="text-cyan-400 hover:text-cyan-300">Login here</router-link>
            </p>
          </div>
        </div>
      </div>

      <ContactInfo />
    </div>
  </div>
</template>
