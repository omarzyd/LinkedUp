import { createRouter, createWebHistory } from 'vue-router';
import Auth from '../views/Auth.vue';
import Home from '../views/Home.vue';

// Helper function to check if the token exists and is valid
const isAuthenticated = () => {
  const tokenn = localStorage.getItem('accessToken');
  return !!tokenn; // Return true if token exists, false otherwise
};

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login', // Default route
    },
    {
      path: '/login',
      component: Auth, // Load Auth.vue for Login
      meta: { requiresAuth: false }, // Public route
    },
    {
      path: '/signup',
      component: Auth, // Load Auth.vue for Sign-Up
      meta: { requiresAuth: false }, // Public route
    },
    {
      path: '/home',
      component: Home, // Home route
      meta: { requiresAuth: true }, // Protected route
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/Profile.vue'), // Profile route
      meta: { requiresAuth: true }, // Protected route
    },
    {
      path: '/network',
      name: 'MyNetwork',
      component: () => import('../views/MyNetwork.vue'), // MyNetwork route
      meta: { requiresAuth: true }, // Protected route
    },
    {
      path: '/notifications',
      name: 'Notifications',
      component: () => import('../views/Notifications.vue'), // Notifications route
      meta: { requiresAuth: true }, // Protected route
    },
    {
      path: '/messaging',
      name: 'Messaging',
      component: () => import('../views/Messaging.vue'), // Messaging route
      meta: { requiresAuth: true }, // Protected route
    },
    {
      path: '/jobs',
      name: 'Jobs',
      component: () => import('../views/Jobs.vue'), // Lazy-load the Jobs page
      meta: { requiresAuth: true }, // Protected route
    },
    {
      path: '/groups',
      name: 'Groups',
      component: () => import('../views/Groups.vue'), // Groups route
      meta: { requiresAuth: true }, // Protected route
    },
    {
      path: '/reset-password',
      name: 'ResetPassword',
      component: () => import('../views/ResetPassword.vue'), // Reset Password route
    },
    {
      path: '/set-new-password',
      name: 'SetNewPassword',
      component: () => import('../views/SetNewPassword.vue'), // Set New Password route
      meta: { requiresAuth: false }, // Public route (no authentication required)
    },
  ],
});

// Global Navigation Guard
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !isAuthenticated()) {
    next('/login'); // Redirect to login if not authenticated
  } else {
    next(); // Proceed to the route
  }
});

export default router;
