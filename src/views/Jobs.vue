<template>
    <!-- Outer container with minimal styling -->
    <div class="min-h-screen text-blue-900">
      <Navbar :isAuthenticated="true" />
  
      <div class="relative z-10 flex">
        <Sidebar />
  
        <!-- Main Content: White background so no "blue screen" -->
        <div class="flex-1 p-8 bg-white">
          <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold">Job Opportunities</h1>
            <!-- "Post Job" Button (updated color) -->
            <button
              class="bg-[#026a94] text-white px-4 py-2 rounded hover:bg-[#026a94] text-sm"
              @click="showPostModal = true"
            >
              Post Job
            </button>
          </div>
  
          <!-- Job Cards -->
          <div
            v-for="job in jobs"
            :key="job.id"
            class="bg-white shadow-md p-4 rounded-lg mb-4 border"
          >
            <h2 class="text-lg font-semibold mb-2">{{ job.title }}</h2>
            <p class="text-gray-700 mb-3">{{ job.description }}</p>
  
            <!-- Skills -->
            <div class="flex space-x-2 overflow-x-auto mb-4">
              <div
                v-for="(skill, idx) in job.skills"
                :key="idx"
                class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm whitespace-nowrap"
              >
                {{ skill }}
              </div>
            </div>
  
            <!-- Buttons (Apply & Join Group) -->
            <div class="flex space-x-2">
              <button
                class="bg-[#026a94] text-white px-4 py-2 rounded hover:bg-[#026a94] text-sm"
                @click="applyJob(job.id)"
              >
                Apply Job
              </button>
  
              <button
                class="bg-[#026a94] text-white px-4 py-2 rounded hover:bg-[#026a94] text-sm"
                @click="joinGroup(job)"
              >
                Join Group
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Post Job Modal -->
      <div
        v-if="showPostModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg p-6 w-[400px]">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">Post a New Job</h3>
            <button
              class="text-gray-500 hover:text-gray-800"
              @click="showPostModal = false"
            >
              ✖
            </button>
          </div>
          <!-- Title -->
          <input
            v-model="newJobTitle"
            type="text"
            placeholder="Job Title"
            class="border rounded w-full mb-2 px-2 py-1"
          />
          <!-- Description -->
          <textarea
            v-model="newJobDescription"
            placeholder="Job Description"
            class="border rounded w-full mb-2 px-2 py-1"
          ></textarea>
          <!-- Skills (comma-separated) -->
          <input
            v-model="newJobSkills"
            type="text"
            placeholder="Skills (comma separated)"
            class="border rounded w-full mb-2 px-2 py-1"
          />
  
          <div class="flex justify-end space-x-2">
            <button
              class="px-4 py-2 text-gray-600 hover:text-gray-800"
              @click="showPostModal = false"
            >
              Cancel
            </button>
            <button
              class="px-4 py-2 bg-[#026a94] text-white rounded hover:bg-[#026a94]"
              @click="postJob"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import Navbar from '../components/layout/NavbarHome.vue'
  import Sidebar from '../components/layout/Sidebar.vue'
  
  const router = useRouter()
  
  const currentUser = { id: 1, name: 'Current User' }
  
  const jobs = ref([
    {
      id: 1,
      title: 'Front-End Developer',
      description: 'Looking for a front-end developer...',
      skills: ['Vue.js', 'JavaScript', 'TailwindCSS', 'HTML', 'CSS'],
      ownerId: 2,
      groupId: 101
    },
    {
      id: 2,
      title: 'Back-End Developer',
      description: 'We need a Node.js expert...',
      skills: ['Node.js', 'Express', 'MongoDB', 'RESTful APIs', 'Microservices'],
      ownerId: 3,
      groupId: 102
    }
  ])
  
  const showPostModal = ref(false)
  const newJobTitle = ref('')
  const newJobDescription = ref('')
  const newJobSkills = ref('')
  
  let nextId = 3
  
  // Apply Job
  function applyJob(jobId: number) {
    const job = jobs.value.find(j => j.id === jobId)
    if (!job) return
  
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]')
    notifications.push({
      type: 'job_application',
      jobId: jobId,
      content: `User has applied to your job: ${job.title}`,
      fromUser: { ...currentUser },
      toUser: { id: job.ownerId, name: 'Job Owner' }
    })
    localStorage.setItem('notifications', JSON.stringify(notifications))
  
    alert(`You applied to job: ${job.title}`)
  }
  
  // Join Group
  function joinGroup(job: any) {
    const groupId = job.groupId
    const groups = JSON.parse(localStorage.getItem('groups') || '[]')
  
    let group = groups.find((g: any) => g.id === groupId)
    if (!group) {
      group = {
        id: groupId,
        name: `${job.title} Team`,
        members: [],
        messages: []
      }
      groups.push(group)
    }
    const isMember = group.members.some((m: any) => m.id === currentUser.id)
    if (!isMember) {
      group.members.push({ id: currentUser.id, name: currentUser.name })
    }
    localStorage.setItem('groups', JSON.stringify(groups))
  
    router.push(`/groups?groupId=${groupId}`)
  }
  
  // Post Job
  function postJob() {
    if (!newJobTitle.value.trim() || !newJobDescription.value.trim()) {
      alert('Please provide a job title and description.')
      return
    }
  
    const skillArr = newJobSkills.value
      .split(',')
      .map(s => s.trim())
      .filter(s => s)
  
    const newJob = {
      id: nextId++,
      title: newJobTitle.value,
      description: newJobDescription.value,
      skills: skillArr,
      ownerId: currentUser.id,
      groupId: 200 + nextId
    }
  
    jobs.value.push(newJob)
  
    newJobTitle.value = ''
    newJobDescription.value = ''
    newJobSkills.value = ''
    showPostModal.value = false
  
    alert(`Job "${newJob.title}" posted successfully!`)
  }
  </script>
  
  <style scoped></style>
  