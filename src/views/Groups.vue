<template>
    <div class="min-h-screen relative bg-gradient-to-b from-blue-100 to-white text-blue-900">
      <!-- Navbar & Sidebar for same layout -->
      <Navbar :isAuthenticated="true" />
      <div class="relative z-10 flex">
        <Sidebar />
  
        <!-- Main Content -->
        <div class="flex-1 p-8">
          <h1 class="text-2xl font-bold mb-4">Group</h1>
  
          <!-- If no group selected or not found, show a message -->
          <div v-if="!currentGroup" class="text-gray-500">
            No group found.
          </div>
          <div v-else>
            <h2 class="text-xl font-semibold mb-2">{{ currentGroup.name }}</h2>
  
            <!-- Members List -->
            <div class="mb-4 bg-white p-4 rounded shadow">
              <h3 class="text-lg font-semibold mb-2">Members</h3>
              <ul>
                <li
                  v-for="(member, index) in currentGroup.members"
                  :key="index"
                  class="py-1 text-sm"
                >
                  {{ member.name }}
                </li>
              </ul>
            </div>
  
            <!-- Chat Section -->
            <div class="bg-white p-4 rounded shadow flex flex-col" style="height: 400px;">
              <div class="flex-1 overflow-y-auto mb-2 border rounded p-2">
                <div
                  v-for="(msg, i) in groupMessages"
                  :key="i"
                  class="mb-2"
                  :class="{
                    'text-right': msg.fromUser.id === currentUser.id,
                    'text-left': msg.fromUser.id !== currentUser.id
                  }"
                >
                  <span
                    class="inline-block px-2 py-1 rounded"
                    :class="{
                      'bg-blue-200': msg.fromUser.id === currentUser.id,
                      'bg-gray-200': msg.fromUser.id !== currentUser.id
                    }"
                  >
                    <strong>{{ msg.fromUser.name }}:</strong> {{ msg.content }}
                  </span>
                </div>
              </div>
              <!-- Input Box -->
              <div class="flex space-x-2">
                <input
                  v-model="newMessage"
                  type="text"
                  placeholder="Type a message..."
                  class="border px-2 py-1 rounded w-full"
                />
                <button
                  class="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-sm"
                  @click="sendGroupMessage"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import Navbar from '../components/layout/NavbarHome.vue';
  import Sidebar from '../components/layout/Sidebar.vue';
  
  // Fake current user
  const currentUser = {
    id: 1,
    name: 'Current User'
  };
  
  const groups = ref<any[]>([]);
  const currentGroup = ref<any>(null);
  
  const route = useRoute();
  const newMessage = ref('');
  
  // On mounted, load groups from localStorage and find the correct group by ID
  onMounted(() => {
    const storedGroups = JSON.parse(localStorage.getItem('groups') || '[]');
    groups.value = storedGroups;
  
    const gId = Number(route.query.groupId);
    if (gId) {
      const found = groups.value.find((g: any) => g.id === gId);
      if (found) {
        currentGroup.value = found;
  
        // Optionally ensure currentUser is in members
        const isInGroup = currentGroup.value.members.some((m: any) => m.id === currentUser.id);
        if (!isInGroup) {
          currentGroup.value.members.push({ id: currentUser.id, name: currentUser.name });
          saveGroups();
        }
      }
    }
  });
  
  // The messages for the current group
  const groupMessages = computed(() => {
    return currentGroup.value ? currentGroup.value.messages : [];
  });
  
  // Send a chat message in the group
  function sendGroupMessage() {
    if (!newMessage.value.trim() || !currentGroup.value) return;
  
    const msg = {
      fromUser: { ...currentUser },
      content: newMessage.value,
      time: new Date().toISOString()
    };
    currentGroup.value.messages.push(msg);
  
    // Save to localStorage
    saveGroups();
  
    newMessage.value = '';
  }
  
  // Helper to save updated groups array
  function saveGroups() {
    localStorage.setItem('groups', JSON.stringify(groups.value));
  }
  </script>
  
  <style scoped>
  /* Basic styling. The chat is 400px tall, can be customized. */
  </style>
  