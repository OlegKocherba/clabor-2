<script setup lang="ts">
import { useGameStore } from '@/stores/gameStore';
import { useGameNavigation } from '@/composables/useGameNavigation';

const gameStore = useGameStore();
const { goToSetup, goToScoreboard } = useGameNavigation();
</script>

<template>
  <div class="min-h-screen bg-bg-light flex flex-col">
    <main class="flex-1 flex flex-col items-center max-w-lg mx-auto w-full pb-12 px-6">
      <!-- Logo block -->
      <div class="mb-8 relative mt-12">
        <div class="absolute inset-0 bg-[#007fff]/20 blur-3xl rounded-full" />
        <div class="relative flex flex-col items-center">
          <div
            class="w-24 h-24 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/40 mb-6"
          >
            <span
              class="material-symbols-outlined text-white select-none"
              style="font-size: 52px; font-variation-settings: 'FILL' 1"
              >playing_cards</span
            >
          </div>
          <h1 class="text-slate-900 tracking-tight text-5xl font-bold leading-tight text-center">Clabor</h1>
          <p class="text-primary text-base font-semibold mt-2 tracking-widest uppercase">Belote Companion</p>
        </div>
      </div>

      <!-- Buttons -->
      <div class="flex flex-col gap-4 w-full mt-8">
        <button
          class="btn-primary flex items-center justify-between w-full h-16 px-6 shadow-primary/20"
          @click="goToSetup"
        >
          <div class="flex items-center gap-4">
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              viewBox="0 0 24 24"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
              />
              <path d="M12 8v8M8 12h8" />
            </svg>
            <span class="text-lg tracking-wide">Start New Game</span>
          </div>
          <svg
            class="w-5 h-5 opacity-60"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        <button
          v-if="gameStore.isActive"
          class="btn-secondary flex items-center justify-between w-full h-16 px-6"
          @click="goToScoreboard"
        >
          <div class="flex items-center gap-4">
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span class="text-lg tracking-wide">Resume Last Game</span>
          </div>
          <svg
            class="w-5 h-5 opacity-60"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </main>
  </div>
</template>
