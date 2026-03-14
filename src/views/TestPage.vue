<script setup lang="ts">
import { ref } from 'vue';
import { useTestService } from '@/composables/services/useTestService';
import { createApiClient } from '@/services/baseApiService';
import { useMessages } from '@/composables/useMessages';
import { useError } from '@/composables/useError';
import Button from 'primevue/button';

const { getPostReq, loading } = useTestService();
const { showSuccess, showError, showWarning, showInfo } = useMessages();
const { reportError } = useError();
const apiResponse = ref<string>('');

const makeTestRequest = async () => {
  apiResponse.value = '';
  const response = await getPostReq(1);
  if (response) {
    apiResponse.value = `Success: ${response.title} - ${response.body.substring(0, 50)}...`;
  }
};

const triggerError = () => {
  throw new Error('Test error for error boundary demonstration');
};

const triggerAsyncError = async () => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  throw new Error('Test async error - this will not be caught by error boundary');
};

const triggerReportError = () => {
  try {
    // Simulate some problematic code
    throw new Error('Simulated error for testing error reporting');
  } catch (error) {
    reportError(error as Error, { context: 'testing error reporting' });
  }
};

const testNetworkError = async () => {
  apiResponse.value = '';
  const invalidApiClient = createApiClient({
    baseUrl: 'https://invalid-domain-that-does-not-exist.com',
  });
  // Direct call without withLoading — catch needed to prevent unhandledrejection
  try {
    await invalidApiClient.get('test');
  } catch {
    // toast shown automatically by baseApiService
  }
};

const test404Error = async () => {
  apiResponse.value = '';
  await getPostReq(99999);
};
</script>

<template>
  <div class="p-8">
    <div class="text-center max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold text-gray-800 mb-4">Test Page</h1>
      <p class="text-lg text-gray-600 mb-8">Comprehensive testing suite for all application features</p>

      <div class="space-y-8">
        <!-- API Testing Section -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">API Testing</h2>
          <div class="space-x-4 mb-4">
            <Button
              :disabled="loading['GET:posts/1']"
              :label="loading['GET:posts/1'] ? 'Loading...' : 'Test API Request'"
              severity="info"
              :loading="loading['GET:posts/1']"
              @click="makeTestRequest"
            />

            <Button
              label="Test Network Error (BaseService Toast)"
              severity="warn"
              @click="testNetworkError"
            />

            <Button
              label="Test 404 Error (BaseService Toast)"
              severity="warn"
              outlined
              @click="test404Error"
            />
          </div>

          <div
            v-if="apiResponse"
            class="max-w-md mx-auto p-4 bg-gray-100 rounded-lg"
          >
            <p class="text-sm text-gray-700">{{ apiResponse }}</p>
          </div>
        </div>

        <!-- Toast Messages Testing Section -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Toast Messages Demo</h2>
          <div class="space-x-2">
            <Button
              label="Success Toast"
              severity="success"
              @click="() => showSuccess({ title: 'Success!', message: 'Operation completed successfully' })"
            />

            <Button
              label="Error Toast"
              severity="danger"
              @click="() => showError({ title: 'Error!', message: 'Something went wrong' })"
            />

            <Button
              label="Warning Toast"
              severity="warn"
              @click="() => showWarning({ title: 'Warning!', message: 'Please be careful' })"
            />

            <Button
              label="Info Toast"
              severity="info"
              @click="() => showInfo({ title: 'Info', message: 'Here is some information' })"
            />
          </div>
        </div>

        <!-- Error Boundary Testing Section -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Error Boundary Testing</h2>
          <div class="space-x-2">
            <Button
              label="Trigger Error (Caught)"
              severity="danger"
              @click="triggerError"
            />

            <Button
              label="Trigger Async Error (Not Caught)"
              severity="danger"
              outlined
              @click="triggerAsyncError"
            />

            <Button
              label="Report Error"
              severity="warn"
              @click="triggerReportError"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
