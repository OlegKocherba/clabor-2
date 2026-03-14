<script setup lang="ts"></script>

<template>
  <div class="app-layout min-h-screen bg-gray-50 flex flex-col">
    <header class="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <h1 class="text-xl font-semibold text-gray-800">App Header</h1>
    </header>
    <nav class="bg-indigo-600 text-white px-6 py-3">
      <div class="text-sm font-medium">App Navigation</div>
    </nav>
    <main class="flex-1 px-6 py-8">
      <slot />
    </main>
    <footer class="bg-gray-800 text-white px-6 py-4 text-center text-sm">App Footer</footer>
  </div>
</template>
