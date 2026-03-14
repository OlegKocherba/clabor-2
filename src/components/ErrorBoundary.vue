<script setup lang="ts">
import { ref, onErrorCaptured, provide } from 'vue';
import { useMessages } from '@/composables/useMessages';
import { ErrorType } from '@/types/errors';
import type { ErrorBoundaryState, AppError } from '@/types/errors';

const { fallbackComponent, showToast = true } = defineProps<{
  fallbackComponent?: unknown;
  showToast?: boolean;
}>();

const emit = defineEmits<{
  error: [error: AppError];
  recover: [];
}>();

const { showError } = useMessages();

const errorState = ref<ErrorBoundaryState>({
  hasError: false,
  error: null,
});

const createAppError = (error: Error, context?: Record<string, unknown>): AppError => ({
  id: `error_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
  type: ErrorType.SYSTEM,
  message: error.message || 'An unexpected error occurred',
  stack: error.stack,
  timestamp: new Date(),
  context,
});

const handleError = (error: AppError) => {
  console.error('ErrorBoundary caught error:', error);

  if (showToast) {
    showError({
      title: 'Application Error',
      message: error.message,
      life: 5000,
    });
  }

  emit('error', error);
};

const recover = () => {
  errorState.value.hasError = false;
  errorState.value.error = null;

  emit('recover');
};

onErrorCaptured((error: Error, instance, info) => {
  const appError = createAppError(error, {
    componentInfo: info,
    componentInstance: instance?.$.type?.name,
  });

  errorState.value.hasError = true;
  errorState.value.error = appError;

  handleError(appError);

  // Return false to prevent error from propagating
  return false;
});

// Provide error boundary context for child components
provide('errorBoundary', {
  reportError: (error: Error, context?: Record<string, unknown>) => {
    const appError = createAppError(error, context);
    errorState.value.hasError = true;
    errorState.value.error = appError;
    handleError(appError);
  },
  recover,
});
</script>

<template>
  <div>
    <template v-if="!errorState.hasError">
      <slot />
    </template>

    <template v-else>
      <component
        :is="fallbackComponent"
        v-if="fallbackComponent"
        :error="errorState.error"
        :recover="recover"
      />

      <div
        v-else
        class="error-boundary-fallback bg-red-50 border border-red-200 rounded-lg p-6 m-4"
      >
        <div class="flex items-center mb-4">
          <div class="ml-3">
            <h3 class="text-lg font-medium text-red-800">Something went wrong</h3>
            <div class="mt-2 text-sm text-red-700">
              <p>{{ errorState.error?.message || 'An unexpected error occurred' }}</p>
            </div>
          </div>
        </div>

        <div class="mt-4">
          <div class="flex space-x-3">
            <button
              class="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              @click="recover"
            >
              Dismiss
            </button>

            <slot
              name="actions"
              :error="errorState.error"
              :recover="recover"
            />
          </div>
        </div>

        <details
          v-if="errorState.error?.stack"
          class="mt-4"
        >
          <summary class="text-sm text-red-600 cursor-pointer hover:text-red-800">
            Show technical details
          </summary>
          <pre class="mt-2 text-xs text-red-700 bg-red-100 p-2 rounded overflow-x-auto">{{
            errorState.error.stack
          }}</pre>
        </details>
      </div>
    </template>
  </div>
</template>

<style scoped>
.error-boundary-fallback {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
