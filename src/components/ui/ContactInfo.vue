<script setup lang="ts">
import { PhoneIcon, EnvelopeIcon, GlobeAltIcon, MapPinIcon } from '@heroicons/vue/24/outline'
</script>

<template>
  <div class="absolute bottom-8 left-8 text-white space-y-4">
    <div class="flex items-center space-x-2">
      <PhoneIcon class="h-5 w-5" />
      <span>123-456-7890</span>
    </div>
    <div class="flex items-center space-x-2">
      <GlobeAltIcon class="h-5 w-5" />
      <span>https://www.zewailcity.edu.eg/contact-us</span>
    </div>
    <div class="flex items-center space-x-2">
      <MapPinIcon class="h-5 w-5" />
      <span>Ahmed Zewail Road, October Gardens, Giza, Egypt</span>
    </div>
  </div>
</template>