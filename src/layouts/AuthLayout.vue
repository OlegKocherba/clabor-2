<script setup lang="ts"></script>

<template>
  <div
    class="auth-layout min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"
  >
    <div class="auth-container bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
      <slot />
    </div>
  </div>
</template>
