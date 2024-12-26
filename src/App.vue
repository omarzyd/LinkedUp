<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

// Check if the token is in the URL on initial load and store it in localStorage
onMounted(() => {
  const token = new URLSearchParams(window.location.search).get('token');
  if (token) {
    localStorage.setItem('accessToken', token);
    router.push('/home'); // Redirect to home if token exists
  }
});
</script>


<template>
  <router-view></router-view>
</template>
