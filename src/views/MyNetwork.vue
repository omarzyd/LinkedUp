<template>
    <div class="min-h-screen relative bg-gradient-to-b from-blue-100 to-white text-blue-900">
      <Navbar :isAuthenticated="true" />
      <div class="relative z-10 flex">
        <Sidebar />
        <div class="flex-1 p-8">
          <h1 class="text-2xl font-bold mb-6">My Network</h1>
          
          <!-- Friends List -->
          <div class="mb-6 bg-white shadow-md p-4 rounded-lg">
            <h2 class="text-lg font-semibold mb-2">Your Friends</h2>
            <div v-if="friends.length === 0" class="text-gray-500 text-sm">No friends yet.</div>
            <ul v-else class="space-y-1">
              <li v-for="(friend, index) in friends" :key="index" class="p-2 rounded hover:bg-blue-50 flex justify-between items-center">
                <span>{{ friend.username }}</span>
                <div class="space-x-2">
                  <!-- Delete Friend Button -->
                  <button class="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600" @click="deleteFriend(index)">
                    Delete
                  </button>
                  <!-- Message Button -->
                  <button class="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600" @click="messageFriend(friend.id)">
                    Message
                  </button>
                </div>
              </li>
            </ul>
          </div>
  
          <!-- Search Section -->
          <div class="mb-4 bg-white shadow-md p-4 rounded-lg">
            <input v-model="searchTerm" type="text" placeholder="Search for users..." class="border px-2 py-1 rounded w-full mb-2" @input="fetchUsers"/>
            <div class="mt-2">
              <h2 class="text-lg font-semibold mb-2">Search Results</h2>
              <div v-if="filteredUsers.length === 0" class="text-gray-500 text-sm">No matching users.</div>
              <ul v-else class="space-y-2">
                <li v-for="(user, index) in filteredUsers" :key="index" class="border p-3 rounded flex items-center justify-center">
                    <span>{{ user.name }}</span>
                    <div class="flex space-x-2 justify-end w-full">
                        <!-- View Profile Button -->
                        <button class="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600" @click="viewProfile(user.id)">
                            View Profile
                        </button>
                    <!-- Send Friend Request Button -->
                    <button class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm" @click="sendFriendRequest(user)">
                        Send Request
                        </button>
                    </div>
                </li>
            </ul>

            </div>
            
            <!-- Profile Details -->
            <div v-if="selectedUser" class="mt-8 p-4 border rounded bg-white">
              <h2 class="text-xl font-bold">User Profile</h2>
              <p><strong>Name:</strong> {{ selectedUser.name }}</p>
              <p><strong>Bio:</strong> {{ selectedUser.Bio }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import axios from 'axios';
  import Navbar from '../components/layout/NavbarHome.vue';
  import Sidebar from '../components/layout/Sidebar.vue';
  import { useRouter } from "vue-router";
  
  // Define API base URL for simplicity
  const API_BASE_URL = 'http://127.0.0.1:5000';
  
  // Initialize state
  const currentUser = { id: 1, name: 'Current User', role: 'Member' };
  const searchTerm = ref('');
  const friends = ref<any[]>([]);
  const users = ref<any[]>([]);
  const selectedUser = ref<any>(null);
  const router = useRouter();
  
  // Fetch users from the API
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users`, {
        params: { search_term: searchTerm.value },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      users.value = response.data;
    } catch (error) {
      console.error("Error fetching users:", error.response?.data?.message || error.message);
    }
  };
  
  // Fetch friends from the API
  const fetchFriends = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/friends`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      friends.value = response.data.friends;
    } catch (error) {
      console.error("Error fetching friends:", error.response?.data?.message || error.message);
      friends.value = [];
    }
  };
  
  // Call both APIs when component is mounted
  onMounted(() => {
    fetchUsers();
    fetchFriends();
  });
  
  // Handle friend request
  const sendFriendRequest = async (selectedUser: any) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/friendrequest/${selectedUser.id}`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      alert(response.data.message);
    } catch (error) {
      console.error("Error sending friend request:", error);
      alert(error.response?.data?.message || "Error sending friend request.");
    }
  };
  
  // View profile
  const viewProfile = async (userId: number) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/profile/${userId}`);
      selectedUser.value = response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      selectedUser.value = null;
    }
  };
  
  // Filter users based on search term
  const filteredUsers = computed(() => {
    if (!searchTerm.value.trim()) {
      return users.value;
    }
    const term = searchTerm.value.toLowerCase();
    return users.value.filter(u => u.name.toLowerCase().includes(term) || u.bio.toLowerCase().includes(term));
  });
  
  // Delete friend
  const deleteFriend = async (index: number) => {
    try {
      const friend = friends.value[index];
        const response = await fetch(`${API_BASE_URL}/friend/${friend.id}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}` 
        }
      });
      const data = await response.json();
      if (response.ok) {
        friends.value.splice(index, 1);
        const friendKey = `friends_of_user_${currentUser.id}`;
        localStorage.setItem(friendKey, JSON.stringify(friends.value));
  
        console.log('Friendship deleted successfully.');
      } else {
        console.error('Error deleting friend:', data.message);
      }
    } catch (error) {
      console.error('Failed to delete friend:', error);
    }
  };
  const messageFriend = (friendId: number) => {
    router.push(`/messaging?friendId=${friendId}`);
  };
  
  </script>
  
  <style scoped>
  /* Add any custom styles here */
  </style>
  