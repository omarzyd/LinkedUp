<script setup lang="ts">
import { useRouter } from 'vue-router';
import {
  UsersIcon,
  BriefcaseIcon as SidebarBriefcaseIcon,
  CalendarIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/vue/24/outline';

// If you store user profile data in 'profile.vue' or a store, adapt as needed
import profile from '../../views/Profile.vue';  

const router = useRouter();

// Logout logic
const handleLogout = () => {
  // Remove JWT from localStorage
  localStorage.removeItem('accessToken');
  // Clear profile data if needed
  profile.value = {};

  // Redirect to login
  router.push('/login');
};

// Sidebar icons and labels
// - "Groups" item navigates to /groups
// - "Jobs" item navigates to /jobs
// - "Internships", "Events", "Settings" are placeholders (no actions) or you could add real routes
// - "Log Out" calls `handleLogout`
const sidebarItems = [
  { icon: UsersIcon, label: 'Groups', action: () => router.push('/groups') },
  { icon: CalendarIcon, label: 'Events' },
  { icon: Cog6ToothIcon, label: 'Settings' },
  { icon: ArrowLeftOnRectangleIcon, label: 'Log Out', action: handleLogout },
];
</script>

<template>
  <!-- Sidebar -->
  <div
    class="min-h-screen w-60 bg-gradient-to-b from-[#52a7ce] via-[#00A1B2] to-[#026a94] shadow-lg p-4 text-white flex flex-col"
  >
    <div class="space-y-6 mt-4">
      <!-- Render Sidebar Items -->
      <div
        v-for="item in sidebarItems"
        :key="item.label"
        @click="item.action ? item.action() : null"
        class="flex items-center space-x-5 px-3 py-2 hover:bg-cyan-500 rounded-md cursor-pointer"
      >
        <component
          :is="item.icon"
          class="h-6 w-6 text-cyan-300 hover:text-cyan-300 transition duration-300"
        />
        <span class="text-lg">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Ensure the sidebar stretches to full page height */
.min-h-screen {
  min-height: 100vh; 
}
</style>
