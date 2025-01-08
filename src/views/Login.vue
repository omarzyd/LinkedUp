<script setup lang="ts">
import LoginForm from '../components/auth/LoginForm.vue';
import ContactInfo from '../components/ui/ContactInfo.vue';
import Navbar from '../components/layout/Navbar.vue'; // Import Navbar
</script>

<template>
  <div class="min-h-screen relative">
    <!-- Background image with proper sizing and positioning -->
    <div 
      class="absolute inset-0 bg-cover bg-center bg-no-repeat"
      style="background-image: url('/background.jpg')"
    ></div>
    
    <!-- Overlay with adjusted opacity to match the design -->
    <div class="absolute inset-0 bg-gradient-to-r from-[#1a4d6e]/20 to-[#1a4d6e]/75"></div>
    
    <div class="relative z-10">
      <!-- Navbar with isAuthenticated prop -->
      <Navbar :isAuthenticated="false" />
      
      <div class="container mx-auto px-4 flex items-center justify-end min-h-[calc(100vh-80px)]">
        <LoginForm />
      </div>
      
      <ContactInfo />
    </div>
  </div>
</template>
