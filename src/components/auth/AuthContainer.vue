<script>
import { ref, watch, defineComponent } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import LoginForm from './LoginForm.vue';
import SignupForm from './SignupForm.vue';

// Step 1: A simple "ForgotPasswordForm" inline, or you can create a separate file
const ForgotPasswordForm = defineComponent({
  name: 'ForgotPasswordForm',
  emits: ['backToLogin'], // We'll emit when the user wants to go back
  setup(_, { emit }) {
    const identifier = ref('');

    const handleSendLink = () => {
      // In a real app, you'd call an API to create a reset link in a DB table, etc.
      alert("A reset link will be sent to: ${identifier.value}");
    };

    const handleBack = () => {
      emit('backToLogin');
    };

    return { identifier, handleSendLink, handleBack };
  },
  template: `
    <div class="p-6 bg-white rounded shadow w-96">
      <h2 class="text-xl font-bold mb-4">Reset Password</h2>
      <p class="text-sm text-gray-600 mb-4">
        Enter your email or username to receive a reset link.
      </p>
      <input
        v-model="identifier"
        placeholder="Username or Email"
        class="border rounded w-full px-3 py-2 mb-4"
      />
      <div class="flex justify-end space-x-3">
        <button
          @click="handleSendLink"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Send Reset Link
        </button>
        <button
          @click="handleBack"
          class="text-blue-600 underline"
        >
          Back
        </button>
      </div>
    </div>
  `
});

export default {
  name: 'AuthContainer',
  components: {
    LoginForm,
    SignupForm,
    ForgotPasswordForm
  },
  setup() {
    const router = useRouter();
    const route = useRoute();

    const isLogin = ref(route.path === '/login');
    const isForgotPassword = ref(false); // <-- new state for "forgot password"

    // Watch for route changes to handle login/signup
    watch(route, () => {
      isLogin.value = (route.path === '/login');
      // If we switch routes, exit the forgot password form
      isForgotPassword.value = false;
    });

    // Toggle between login and signup
    const toggleAuth = () => {
      if (!isForgotPassword.value) {
        // normal toggle
        isLogin.value = !isLogin.value;
        router.push(isLogin.value ? '/login' : '/signup');
      } else {
        // if we are in forgot mode, go back to login or signup
        isForgotPassword.value = false;
        isLogin.value = true;
        router.push('/login');
      }
    };

    // Triggered by the "Forgot Password?" link in login
    const showForgotPassword = () => {
      isForgotPassword.value = true;
    };

    // The user clicked "Back" in the forgot form
    const backToLogin = () => {
      isForgotPassword.value = false;
      isLogin.value = true;
      router.push('/login');
    };

    return {
      isLogin,
      isForgotPassword,
      toggleAuth,
      showForgotPassword,
      backToLogin
    };
  }
};
</script>

<template>
  <div class="w-[400px] relative overflow-hidden">
    <div class="relative">

      <!-- Step 2: Use <Transition> to animate switching among login, signup, forgot -->
      <Transition
        mode="out-in"
        enter-active-class="animate-slide-in"
        leave-active-class="animate-slide-out"
      >
        <!-- If we're in forgot mode, show ForgotPasswordForm -->
        <ForgotPasswordForm
          v-if="isForgotPassword"
          key="forgot"
          @backToLogin="backToLogin"
        />

        <!-- Otherwise, if isLogin, show LoginForm -->
        <LoginForm
          v-else-if="isLogin"
          @toggle="toggleAuth"
          @forgot="showForgotPassword"
          key="login"
        />

        <!-- Otherwise, show SignupForm -->
        <SignupForm
          v-else
          @toggle="toggleAuth"
          key="signup"
        />
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.animate-slide-in {
  animation: slideIn 0.3s ease-out forwards;
}
.animate-slide-out {
  animation: slideOut 0.3s ease-out forwards;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(100%); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes slideOut {
  from { opacity: 1; transform: translateX(0); }
  to   { opacity: 0; transform: translateX(-100%); }
}
</style>