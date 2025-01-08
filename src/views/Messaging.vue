<template>
  <div class="min-h-screen relative bg-gradient-to-b from-blue-100 to-white text-blue-900">
    <!-- Navbar -->
    <Navbar :isAuthenticated="true" />

    <div class="relative z-10 flex">
      <!-- Sidebar -->
      <Sidebar />

      <!-- Main Content: Chat Layout -->
      <div class="flex-1 p-8 flex space-x-4">
        <!-- Friends List -->
        <div class="w-1/4 bg-white shadow-md p-4 rounded-lg">
          <h2 class="text-lg font-semibold mb-2">Your Friends</h2>
          <ul v-if="friends.length > 0" class="space-y-1">
            <li
              v-for="(friend, index) in friends"
              :key="friend.id"
              class="p-2 rounded hover:bg-blue-50 cursor-pointer"
              :class="{'bg-blue-200': selectedFriend && selectedFriend.id === friend.id}"
              @click="selectFriend(friend)"
            >
              {{ friend.username }}
            </li>
          </ul>
          <div v-else class="text-gray-500 mt-4">
            No friends found. Start connecting with others!
          </div>
        </div>

        <!-- Chat Window -->
        <div class="flex-1 bg-white shadow-md p-4 rounded-lg flex flex-col">
          <div v-if="!selectedFriend" class="text-gray-500 flex-1">
            Select a friend to start chatting.
          </div>
          <div v-else class="flex flex-col flex-1">
            <h2 class="text-lg font-semibold mb-2">{{ selectedFriend.username }}</h2>
            <!-- Messages List -->
            <div class="flex-1 overflow-y-auto border rounded p-2 mb-2" ref="messagesContainer" :style="chatContainerStyle">
              <div
                v-for="(message, index) in conversation"
                :key="index"
                class="mb-4 flex"
              >
                <div :class="{
                  'ml-auto': message.from_user_id === currentUser.id,
                  'mr-auto': message.from_user_id !== currentUser.id
                }">
                  <div class="bg-blue-200 text-blue-900 px-4 py-2 rounded-lg max-w-xs break-words">
                    {{ message.content }}
                  </div>
                  <div class="text-xs text-gray-400 mt-1 text-right">
                    {{ formatTimestamp(message.timestamp) }}
                  </div>
                </div>
              </div>
            </div>
            <!-- Input to send new message -->
            <div class="flex space-x-2">
              <input
                v-model="newMessage"
                type="text"
                placeholder="Type a message..."
                class="border px-2 py-1 rounded w-full"
              />
              <button
                class="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                @click="sendMessage"
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
import { onMounted, ref, computed, watch, nextTick } from 'vue';
import axios from 'axios';
import Navbar from '../components/layout/NavbarHome.vue';
import Sidebar from '../components/layout/Sidebar.vue';

const API_BASE_URL = 'http://127.0.0.1:5000';

const currentUser = ref<any>(null);

const fetchCurrentUser = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/user`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    currentUser.value = response.data;
  } catch (error) {
    console.error("Error fetching current user data:", error);
  }
};

onMounted(fetchCurrentUser);

const friends = ref<any[]>([]);
const selectedFriend = ref<any>(null);
const newMessage = ref('');
const messages = ref<any[]>([]);
const isUserManuallyScrolling = ref(false);

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

async function fetchConversation(friendId: number) {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/messages/conversation/${friendId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
    });
    messages.value = res.data.conversation;
  } catch (error) {
    console.error('Error fetching conversation:', error);
  }
}

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

const conversation = computed(() => {
  if (!selectedFriend.value || !currentUser.value) return [];
  return messages.value.filter((msg) => {
    const isSender = msg.from_user_id === currentUser.value.id && msg.to_user_id === selectedFriend.value.id;
    const isReceiver = msg.to_user_id === currentUser.value.id && msg.from_user_id === selectedFriend.value.id;
    return isSender || isReceiver;
  });
});

function selectFriend(friend: any) {
  selectedFriend.value = friend;
  fetchConversation(friend.id);
}

async function sendMessage() {
  if (!newMessage.value.trim() || !selectedFriend.value) return;

  try {
    const res = await axios.post(
      `${API_BASE_URL}/api/messages`,
      { to_user_id: selectedFriend.value.id, content: newMessage.value },
      { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
    );

    messages.value.push({
      from_user_id: currentUser.id,
      to_user_id: selectedFriend.value.id,
      content: newMessage.value,
      timestamp: new Date().toISOString()
    });

    newMessage.value = '';
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

onMounted(fetchFriends);

const messagesContainer = ref<HTMLElement | null>(null);

const chatContainerStyle = computed(() => ({
  maxHeight: '550px', // Fixed height of 550px
  overflowY: 'auto',  // Allow vertical scrolling
}));

const scrollToBottom = () => {
  if (messagesContainer.value && !isUserManuallyScrolling.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

watch(conversation, () => {
  nextTick(scrollToBottom);
});

watch(newMessage, () => {
  nextTick(scrollToBottom);
});

const handleScroll = () => {
  if (messagesContainer.value) {
    const { scrollTop, scrollHeight, clientHeight } = messagesContainer.value;
    isUserManuallyScrolling.value = scrollTop + clientHeight < scrollHeight;
  }
};

watch(messagesContainer, () => {
  if (messagesContainer.value) {
    messagesContainer.value.addEventListener('scroll', handleScroll);
  }
});
</script>
