<script setup lang="ts">
defineProps<{
  title?: string;
}>();
</script>

<template>
  <nav class="bg-transparent p-4">
    <div class="container mx-auto flex justify-between items-center">
      <div class="flex space-x-4 text-white">
        <a href="#" class="hover:text-cyan-400">Home</a>
        <a href="#" class="hover:text-cyan-400">About Us</a>
        <a href="#" class="hover:text-cyan-400">Help</a>
      </div>

      <div class="flex items-center space-x-2">
        <img src="/logo.png" alt="Logo" class="h-8 w-8" />
        <span class="text-white font-semibold">LinkedUp Zewail City</span>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* Add custom styles if needed */
</style>
