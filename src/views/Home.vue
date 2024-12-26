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
        <!-- Ahmed Zewail Profile Card -->
        <div class="bg-white shadow-lg rounded-lg p-8 text-blue-900">
          <div class="flex items-center justify-center bg-blue-100 rounded-lg p-8 shadow-md">
            <div class="w-1/3 flex justify-center">
              <img
                src="https://th.bing.com/th/id/OIP.oeWm-w4wMFv7HuLPmTCyCwHaEi?rs=1&pid=ImgDetMain"
                alt="Profile Picture"
                class="h-32 w-32 rounded-full object-cover"
              />
            </div>
            <div class="w-2/3 space-y-4">
              <h2 class="text-2xl font-bold">Ahmed Zewail</h2>
              <p class="text-sm">
                <strong>Quote:</strong> "Science and youth represent the brightest hope for the future."
              </p>
              <p class="text-sm italic">Professor Ahmed Zewail</p>
              <div class="flex space-x-4">
                <div class="bg-blue-300 h-6 w-6 rounded-full flex items-center justify-center">F</div>
                <div class="bg-blue-300 h-6 w-6 rounded-full flex items-center justify-center">T</div>
                <div class="bg-blue-300 h-6 w-6 rounded-full flex items-center justify-center">I</div>
              </div>
            </div>
          </div>
        </div>

        <!-- "Create Post" Button -->
        <div class="flex justify-end mt-8 mb-4">
          <button
            class="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            @click="toggleCreatePostModal"
          >
            Create Post
          </button>
        </div>

        <!-- CREATE POST MODAL -->
        <div
          v-if="showCreatePostModal"
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div class="bg-white rounded-lg p-6 w-[400px]">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold">Create a New Post</h3>
              <button
                @click="toggleCreatePostModal"
                class="text-gray-500 hover:text-gray-800"
              >
                ✖
              </button>
            </div>
            <textarea
              v-model="newPostContent"
              class="w-full p-3 border rounded-lg text-sm resize-none"
              placeholder="What's on your mind?"
            ></textarea>
            <div class="flex justify-end mt-4 space-x-2">
              <button
                @click="toggleCreatePostModal"
                class="px-3 py-1.5 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                @click="createPost"
                class="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Post
              </button>
            </div>
          </div>
        </div>

        <!-- Loop over posts and display each in a PostCard -->
        <div v-for="(post, index) in posts" :key="index" class="mt-8">
          <PostCard
            :key="post.id"
            :authorName="post.authorName"
            :authorRole="post.authorRole"
            :postContent="post.postContent"
            :postTime="post.postTime"
            :comments="post.comments"
            :likesCount="post.likesCount"
            :isLiked="post.isLiked"
            :postId="post.id"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

import Navbar from '../components/layout/NavbarHome.vue'
import Sidebar from '../components/layout/Sidebar.vue'
import PostCard from '../components/ui/PostCard.vue'

const router = useRouter()
/* ---------------- Existing Example: Like/Comment States ---------------- */
const isLiked = ref(false)
const isCommented = ref(false)
const showCommentModal = ref(false)



/* ---------------- CREATE POST LOGIC ---------------- */
const showCreatePostModal = ref(false)
const newPostContent = ref('')

// Updated posts array WITHOUT postImage
const posts = ref<any[]>([])

const toggleCreatePostModal = () => {
  showCreatePostModal.value = !showCreatePostModal.value
}
const fetchPosts = async () => {
  try {
    const response = await axios.get('http://localhost:5000/feed', {
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
    });
    posts.value = response.data.map((post: any) => ({
      id: post.id,
      authorName: post.author_name,
      authorRole: post.author_role,
      postContent: post.content,
      postTime: new Date(post.created_at).toLocaleString(),
      likesCount: post.likes_count,
      isLiked: post.is_liked,
      comments: (post.comments || []).map((comment: any) => ({
        author_name: comment.author_name,
        content: comment.content,
        created_at: comment.created_at
      })),
    }));
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
};


const createPost = async () => {
  if (newPostContent.value.trim() !== '') {
    try {
      const response = await axios.post('http://localhost:5000/feed', {
        content: newPostContent.value
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      })

      // Add the new post at the beginning of the list (to display it right after creating)
      posts.value.unshift({
        id: response.data.id,
        authorName: 'Your Name', // Replace with actual user info
        authorRole: 'User',
        postContent: response.data.content,
        postTime: new Date(response.data.created_at).toLocaleString(),
        likesCount: 0,
        comments: [],
        isLiked: false
      })

      // Reset modal and content
      newPostContent.value = ''
      showCreatePostModal.value = false
    } catch (error) {
      console.error('Error creating post:', error)
    }
  }
}

onMounted(() => {
  fetchPosts() // Fetch posts when the component is mounted
})
</script>

<style scoped>
.fixed {
  border-right: 1px solid rgba(0, 0, 255, 0.2);
}
.ml-60 {
  margin-left: 15rem;
}
</style>
