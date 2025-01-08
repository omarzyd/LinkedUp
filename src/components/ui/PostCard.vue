<template>
  <div class="bg-white rounded-lg shadow-sm p-4 mb-4 max-w-xl mx-auto">
    <!-- Author / Header -->
    <div class="flex items-start space-x-2">
      <div class="flex-1">
        <div class="flex items-center justify-between">
          <h3 class="font-semibold text-sm">{{ authorName }}</h3>
          <span class="text-xs text-gray-500">{{ postTime }}</span>
        </div>
        <p class="text-xs text-gray-600">{{ authorRole }}</p>
      </div>
    </div>

    <!-- Post Content Text -->
    <p class="mt-2.5 text-sm">
      {{ postContent }}
    </p>

    <!-- Buttons (Like, Comment, Share) -->
    <div class="flex justify-between mt-2.5 pt-2.5 border-t">
      <button
        class="flex items-center space-x-1.5 text-xs px-2 py-1 rounded-md transition-colors"
        :class="isLiked ? 'text-blue-500 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'"
        @click="toggleLike"
      >
        👍
        <span>{{ isLiked ? 'Liked' : 'Like' }}</span>
      </button>
      <button
        class="flex items-center space-x-1.5 text-xs px-2 py-1 rounded-md text-gray-600 hover:bg-gray-50"
        @click="showCommentInput = !showCommentInput"
      >
        💬
        <span>Comment</span>
      </button>
      <button
        class="flex items-center space-x-1.5 text-xs px-2 py-1 rounded-md transition-colors"
        :class="isShared ? 'text-blue-500 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'"
        @click="toggleShare"
      >
        🔗
        <span>{{ isShared ? 'Shared' : 'Share' }}</span>
      </button>
    </div>

    <!-- Comments Section -->
    <div v-if="comments.length > 0" class="mt-3 space-y-2">
      <h4 class="font-semibold text-gray-700 text-base mb-3">Comments</h4>
      <div
        v-for="(comment, index) in comments"
        :key="index"
        class="bg-gray-50 p-2.5 rounded-md"
      >
        <p class="text-xs text-gray-800">
          <strong>{{ comment.author_name }}:</strong> {{ comment.content }}
        </p>
        <span class="text-xs text-gray-500">{{ new Date(comment.created_at).toLocaleString() }}</span>
      </div>
    </div>

    <!-- Comment Input -->
    <div v-if="showCommentInput" class="mt-3">
      <input
        v-model="newCommentContent"
        type="text"
        placeholder="Write a comment..."
        class="w-full p-2 border border-gray-300 rounded-md"
      />
      <button @click="submitComment" class="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md">Post Comment</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Props
const props = defineProps({
  authorName: { type: String, required: true },
  authorRole: { type: String, required: true },
  postContent: { type: String, required: true },
  postTime: { type: String, required: true },
  comments: { type: Array as PropType<Comment[]>, required: true },
  postId: { type: [String, Number], required: true },
});

// Local states
const isLiked = ref(false);
const isShared = ref(false);
const showCommentInput = ref(false);
const newCommentContent = ref('');

// Fetch like status when component mounts
onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:5000/like-status', {
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      params: { post_id: props.postId }
    });

    isLiked.value = response.data.isLiked;
  } catch (error) {
    console.error('Error fetching like status:', error);
  }
});

// Toggle like state
const toggleLike = async () => {
  isLiked.value = !isLiked.value;

  try {
    await axios.post('http://localhost:5000/like', {
      post_id: props.postId
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
    });
  } catch (error) {
    console.error('Error liking/unliking post:', error);
  }
};

// Toggle share state
const toggleShare = () => {
  isShared.value = !isShared.value;
};

// Submit a new comment
const submitComment = async () => {
  if (newCommentContent.value.trim() !== '') {
    const newComment = {
      content: newCommentContent.value.trim(),
      post_id: props.postId,
    };

    try {
      const response = await axios.post('http://localhost:5000/comment', newComment, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });

      // Add the new comment to the comments array
      props.comments.push(response.data);
      newCommentContent.value = '';
      showCommentInput.value = false;
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  }
};
</script>

<style scoped>
/* Custom CSS can go here */
</style>
