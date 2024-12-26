<script setup lang="ts">
import { onMounted } from 'vue'
import Navbar from '../components/layout/Navbar.vue'
import AuthContainer from '../components/auth/AuthContainer.vue'
import ContactInfo from '../components/ui/ContactInfo.vue'

onMounted(() => {
  // Preload the background image
  const img = new Image()
  img.src = '/background.jpg'
})
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
      <Navbar />
      
      <div class="container mx-auto px-4 flex items-center justify-end min-h-[calc(100vh-80px)]">
        <AuthContainer />
      </div>
      
      <ContactInfo />
    </div>
  </div>
</template>