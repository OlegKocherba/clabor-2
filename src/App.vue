<script setup lang="ts">
import { useLayouts } from '@/composables/useLayouts';
import { useMessages } from '@/composables/useMessages';
import { registerErrorHandler } from '@/services/baseApiService';
import ErrorBoundary from '@/components/ErrorBoundary.vue';

const { currentLayout } = useLayouts();
const { showApiError } = useMessages();

registerErrorHandler((errorInfo) => showApiError(errorInfo));
</script>

<template>
  <div class="min-h-screen">
    <ErrorBoundary>
      <component :is="currentLayout">
        <router-view />
      </component>
    </ErrorBoundary>
    <ToastComponent />
  </div>
</template>
