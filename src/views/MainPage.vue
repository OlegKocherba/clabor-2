<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

const navigateToTest = () => {
  router.push('/test');
};
</script>

<template>
  <div class="text-center max-w-2xl mx-auto p-8">
    <h1 class="text-4xl font-bold text-gray-800 mb-4">Main Page</h1>
    <p class="text-lg text-gray-600 mb-8">Welcome to the main application page</p>

    <div class="space-x-4">
      <Button
        label="Go to Test Page"
        severity="info"
        icon="pi pi-flask"
        @click="navigateToTest"
      />

      <Button
        label="Logout"
        severity="danger"
        icon="pi pi-sign-out"
        @click="handleLogout"
      />
    </div>
  </div>
</template>
