<template>
    <div class="min-h-screen relative bg-gradient-to-b from-blue-100 to-white text-blue-900">
      <!-- Navbar -->
      <Navbar :isAuthenticated="true" />
      
      <div class="relative z-10 flex">
        <!-- Sidebar -->
        <Sidebar />
    
        <!-- Main Content -->
        <div class="flex-1 p-8">
          <h1 class="text-2xl font-bold mb-4">Notifications</h1>
    
          <!-- If we have no valid notifications left, show "No notifications." -->
          <div v-if="filteredNotifications.length === 0" class="text-gray-500">
            No notifications.
          </div>
    
          <!-- Otherwise, display the filtered notifications -->
          <div v-else class="space-y-4">
            <div
              v-for="(notif, index) in filteredNotifications"
              :key="index"
              class="bg-white border rounded p-4 flex justify-between items-center shadow-md"
            >
              <div>
                <!-- Friend Request Notification (Received) -->
                <div v-if="notif.type === 'friend_request' && notif.toUser.id === currentUser.id">
                  <strong>{{ notif.fromUser.name }}</strong>
                  <span class="text-gray-500 text-sm"> wants to connect with you!</span>
                </div>
  
                <!-- Friend Request Notification (Sent) -->
                <div v-if="notif.type === 'friend_request' && notif.fromUser.id === currentUser.id">
                  <strong>You</strong>
                  <span class="text-gray-500 text-sm"> sent a friend request to {{ notif.toUser.name }}.</span>
                </div>
      
                <!-- Message Notification -->
                <div v-else-if="notif.type === 'message'">
                  <strong>{{ notif.fromUser.name }}</strong>
                  <span class="text-gray-500 text-sm"> sent you a message:</span>
                  <p class="mt-1 text-sm text-gray-700 italic">{{ notif.content }}</p>
                </div>
              </div>
      
              <!-- Only received friend requests get Accept/Decline buttons -->
              <div
                class="space-x-2"
                v-if="notif.type === 'friend_request' && notif.toUser.id === currentUser.id && notif.status !== 'accepted' && notif.status !== 'declined'"
              >
                <button
                  class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                  @click="acceptRequest(index)"
                >
                  Accept
                </button>
                <button
                  class="bg-gray-300 text-black px-3 py-1 rounded hover:bg-gray-400 text-sm"
                  @click="declineRequest(index)"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import Navbar from '../components/layout/NavbarHome.vue'
import Sidebar from '../components/layout/Sidebar.vue'
import axios from 'axios'

// Define API base URL for convenience
const API_BASE_URL = 'http://127.0.0.1:5000'

// We'll pretend the user logged in here is user #2
const currentUser = {
  id: 2,
  name: 'Jane Doe',
  role: 'Student'
}

// Store all notifications from localStorage:
const allNotifications = ref<any[]>([])

onMounted(async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/friendrequest`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });

    console.log('Response data:', response.data);  // Log the response to verify it

    const { sent_requests, received_requests } = response.data;

    // Check if the data exists
    if (sent_requests && received_requests) {
      const notifications = [
        // Sent Requests
        ...sent_requests.map((request: any) => ({
          id: request.id,
          type: 'friend_request',
          fromUser: { 
            id: currentUser.id, // You are the sender
            name: currentUser.name // Your name is the sender's name
          },
          toUser: { 
            id: request.friend_id, // The person you sent the request to
            name: request.friend_username || "Unknown" // The receiver's name
          },
          createdAt: request.created_at
        })),
        
        // Received Requests
        ...received_requests.map((request: any) => ({
          id: request.id,
          type: 'friend_request',
          fromUser: { 
            id: request.user_id, // The person who sent the request
            name: request.sender_username // The sender's name
          },
          toUser: { 
            id: currentUser.id, // You are the receiver
            name: currentUser.name // Your name is the receiver's name
          },
          createdAt: request.created_at
        }))
      ];

      // Update localStorage with the notifications
      localStorage.setItem('notifications', JSON.stringify(notifications));
      allNotifications.value = notifications;
    }
  } catch (error) {
    console.error("Error fetching friend requests:", error.response?.data?.message || error.message);
  }
});




const filteredNotifications = computed(() => {
  return allNotifications.value.filter(
    (notif: any) =>
      (notif.toUser.id === currentUser.id || notif.fromUser.id === currentUser.id) && 
      (notif.type === 'friend_request' || notif.type === 'message')
  );
});


// Accept a friend request
const acceptRequest = async (index: number) => {
  const notif = filteredNotifications.value[index]
  try {
    // Send API request to accept the friend request
    const response = await axios.post(`${API_BASE_URL}/friendrequest/${notif.id}/accept`, {}, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    })

    // Update the notification status after successful acceptance
    notif.status = 'accepted'

    // Update notification in localStorage
    updateNotification(notif)

    // Remove the notification from the list
    filteredNotifications.value.splice(index, 1)

    alert(response.data.message) // Show success message

    // Optionally, you can also trigger a refresh of the friends list here to show the new friendship
    fetchFriends()
  } catch (error) {
    console.error("Error accepting friend request:", error)
    alert(error.response?.data?.message || "Error accepting friend request.")
  }
}

// Decline a friend request
const declineRequest = async (index: number) => {
  const notif = filteredNotifications.value[index]
  try {
    // Send API request to decline the friend request
    const response = await axios.post(`${API_BASE_URL}/friendrequest/${notif.id}/decline`, {}, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    })

    // Update the notification status after successful decline
    notif.status = 'declined'

    // Update notification in localStorage
    updateNotification(notif)

    // Remove the notification from the list
    filteredNotifications.value.splice(index, 1)

    alert(response.data.message) // Show success message
  } catch (error) {
    console.error("Error declining friend request:", error)
    alert(error.response?.data?.message || "Error declining friend request.")
  }
}

// Helper: update the notification in localStorage
function updateNotification(updatedNotif: any) {
  const notifications = JSON.parse(localStorage.getItem('notifications') || '[]')
  const i = notifications.findIndex((n: any) =>
    n.fromUser &&
    n.toUser &&
    n.fromUser.id === updatedNotif.fromUser.id &&
    n.toUser.id === updatedNotif.toUser.id &&
    n.type === 'friend_request' &&
    n.status === 'pending'
  )
  if (i !== -1) {
    notifications[i] = updatedNotif
  }
  localStorage.setItem('notifications', JSON.stringify(notifications))
}

// Fetch friends function (you can trigger this after accepting or declining a request to refresh the friends list)
const fetchFriends = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/friends`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    })
    console.log('Friends list:', response.data)
  } catch (error) {
    console.error("Error fetching friends:", error.response?.data?.message || error.message)
  }
}
</script>

  
  <style scoped>
  /* Add any custom styles here */
  </style>
  