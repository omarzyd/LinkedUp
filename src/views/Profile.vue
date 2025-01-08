<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Navbar from '../components/layout/NavbarHome.vue';
import Sidebar from '../components/layout/Sidebar.vue';

// Router instance
const router = useRouter();

// Reactive state for profile data and form visibility
const isEditFormVisible = ref(false);
const profile = ref({
  name: '',
  bio: '',
});
const updatedName = ref('');
const updatedBio = ref('');
const errorMessage = ref('');

const fetchProfile = async () => {
  try {
    // Get the token from localStorage
    const token = localStorage.getItem('accessToken');
    console.log('JWT Token from Local Storage:', token);  // This should log the token if it's correctly saved

    if (token) {
      // Include token in Authorization header for API requests
      const response = await axios.get('http://localhost:5000/api/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Full response from /api/profile:', response.data);

      // Process the response and update the profile data
      if (response.data) {
        profile.value.name = response.data.name;
        profile.value.bio = response.data.bio;
        console.log('Profile data fetched:', response.data); // For debugging
      } else {
        console.error("No data returned from the profile API.");
        errorMessage.value = "Profile data is empty.";
      }
    } else {
      // Handle token absence (redirect to login page)
      console.error('Token not found in Local Storage');
      errorMessage.value = "No token found. Please log in again.";
      // Redirect to login page (if applicable)
      window.location.href = '/login'; // Adjust based on your routing system
    }
  } catch (error) {
    // Log the error and update the error message
    console.error("Error response:", error.response); // Log the error for debugging
    if (error.response && error.response.status === 401) {
      // Handle Unauthorized error
      errorMessagepr.value = "Unauthorized. Please log in again.";
      window.location.href = '/login'; // Redirect to login page if token is invalid or expired
    } else {
      errorMessage.value = "An error occurred. Please try again.";
    }
  }
};



// Function to handle showing the edit form
function openEditForm() {
  updatedName.value = profile.value.name;
  updatedBio.value = profile.value.bio;
  isEditFormVisible.value = true;
}

// Function to handle saving the updated profile
const saveProfile = async () => {
  try {
    const token = localStorage.getItem('accessToken'); // Get the JWT token from localStorage or wherever you store it
    const response = await axios.put('http://localhost:5000/api/profile', {
      name: updatedName.value,
      bio: updatedBio.value
    }, {
      headers: {
        Authorization: `Bearer ${token}` // Send the token in the header
      }
    });
    profile.value.name = response.data.profile.name;
    profile.value.bio = response.data.profile.bio;
    isEditFormVisible.value = false; // Close the form after saving
  } catch (error: any) {
    if (error.response) {
      errorMessage.value = error.response.data.error || "Failed to update profile.";
    } else {
      errorMessage.value = "An error occurred. Please try again.";
    }
    console.error(error);
  }
};
// Function to handle closing the edit form without saving
function closeEditForm() {
  isEditFormVisible.value = false;
}

// Fetch the profile data on component mount
onMounted(fetchProfile);
</script>

<template>
  <div class="min-h-screen relative bg-gradient-to-b from-blue-100 to-white text-blue-900">
    <!-- Include Navbar -->
    <Navbar :isAuthenticated="true" />

    <!-- Main Layout -->
    <div class="relative z-10 flex">
      <!-- Include Sidebar -->
      <Sidebar />

      <!-- Main Content -->
      <div class="flex-1 p-8">
        <div class="relative">
          <!-- Background Image -->
          <div class="relative h-64 w-full bg-gradient-to-r from-cyan-400 to-cyan-600">
            <div class="absolute bottom-10 left-8 flex items-center">
              <img
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80"
                alt="Profile picture"
                class="w-40 h-40 rounded-full border-4 border-white shadow-lg"
              />
              <div class="ml-6 text-white">
                <h1 class="text-3xl font-bold">Welcome to</h1>
                <h2 class="text-2xl font-semibold mt-1">{{ profile.name }}'s LinkedUp Portfolio</h2>
                <p class="text-white/80 mt-2">
                  {{ profile.bio }}
                </p>
              </div>
            </div>
          </div>

          <!-- Profile Content -->
          <div class="mt-16 px-8">
            <div class="flex justify-between items-start">
              <button
                @click="openEditForm"
                class="px-4 py-2 bg-blue-400 text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        <!-- Edit Profile Form -->
        <div
          v-if="isEditFormVisible"
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 class="text-xl font-semibold mb-4">Edit Profile</h2>
            <form @submit.prevent="saveProfile" class="space-y-4">
              <div>
                <label for="name" class="block text-gray-700">Name</label>
                <input
                  id="name"
                  v-model="updatedName"
                  type="text"
                  class="w-full p-2 border rounded-md"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label for="bio" class="block text-gray-700">Bio</label>
                <textarea
                  id="bio"
                  v-model="updatedBio"
                  class="w-full p-2 border rounded-md"
                  placeholder="Enter your bio"
                ></textarea>
              </div>
              <div class="flex justify-end space-x-2">
                <button
                  type="button"
                  @click="closeEditForm"
                  class="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mt-4 text-red-500 text-center">
          {{ errorMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.min-h-screen {
  display: flex;
  flex-direction: column;
}
</style>
