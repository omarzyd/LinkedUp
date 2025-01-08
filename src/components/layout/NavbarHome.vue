<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import {
  HomeIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  BriefcaseIcon,
  GlobeAltIcon,
  BellIcon,
  UserCircleIcon,
} from '@heroicons/vue/24/outline';

// Navigation bar icons and labels
const navbarItems = [
  { icon: HomeIcon, label: 'Home', path: '/home' },
  { icon: ChatBubbleOvalLeftEllipsisIcon, label: 'Messaging', path: '/messaging' },
  { icon: BriefcaseIcon, label: 'Jobs', path: '/jobs' },
  { icon: GlobeAltIcon, label: 'My Network', path: '/network' },
  { icon: BellIcon, label: 'Notifications', path: '/notifications' },
  { icon: UserCircleIcon, label: 'Me', path: '/profile' }, // Added Profile path
];

const router = useRouter();
const route = useRoute();

// Navigation function
const navigate = (path: string) => {
  router.push(path);
};
</script>

<template>
  <div class="bg-gradient-to-r from-[#52a7ce] via-[#00A1B2] to-[#026a94] text-white shadow-lg">
    <!-- Transparent Navigation Bar -->
    <div class="relative z-10 flex items-center justify-between px-8 py-4">
      <h1 class="text-2xl font-bold">LinkedUp Zewail City</h1>
      <div class="flex space-x-14">
        <!-- Render Navigation Bar Items -->
        <div
          v-for="item in navbarItems"
          :key="item.label"
          @click="navigate(item.path)"
          class="flex flex-col items-center space-y-1 cursor-pointer hover:text-blue-300 transition duration-300"
        >
          <component
            :is="item.icon"
            class="h-8 w-8"
            :class="route.path === item.path ? 'text-cyan-400' : 'text-cyan-300'"
          />
          <span
            class="text-sm font-semibold"
            :class="route.path === item.path ? 'text-cyan-400' : 'text-white'"
          >
            {{ item.label }}
          </span>
          <!-- Active Indicator Line -->
          <div
            v-if="route.path === item.path"
            class="w-full h-1 bg-cyan-400 rounded-full mt-1"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add styles for active indicators or hover states */
</style>
