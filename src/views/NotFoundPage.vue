<script setup lang="ts">
import { useRouter } from 'vue-router';
import Button from 'primevue/button';

const router = useRouter();
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[60vh] gap-4">
    <h1 class="text-6xl font-bold text-surface-500">404</h1>
    <p class="text-xl text-surface-400">Page not found</p>
    <Button
      label="Go Home"
      @click="router.push('/')"
    />
  </div>
</template>
