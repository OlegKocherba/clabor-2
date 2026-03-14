<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';

const authStore = useAuthStore();
const router = useRouter();

const handleLogin = () => {
  authStore.login();
  router.push('/');
};
</script>

<template>
  <div class="text-center">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Login Page</h1>
    <p class="text-gray-600 mb-6">Please sign in to your account</p>
    <Button
      label="Login"
      severity="primary"
      size="large"
      @click="handleLogin"
    />
  </div>
</template>
