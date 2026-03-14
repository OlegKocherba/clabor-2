<script setup lang="ts">
import { reactive, computed } from 'vue';
import { useGameStore } from '@/stores/gameStore';
import { useGameNavigation } from '@/composables/useGameNavigation';
import type { GameFormat } from '@/types/game';

const gameStore = useGameStore();
const { goToLanding, goToScoreboard } = useGameNavigation();

const form = reactive({
  format: 1001 as GameFormat,
  name0: gameStore.teamNames[0],
  name1: gameStore.teamNames[1],
});

const isValid = computed(() => form.name0.trim().length > 0 && form.name1.trim().length > 0);

function startGame() {
  if (!isValid.value) return;
  gameStore.setupGame([form.name0.trim(), form.name1.trim()], form.format);
  goToScoreboard();
}
</script>

<template>
  <div class="min-h-screen bg-surface flex flex-col">
    <!-- Header -->
    <header class="flex items-center bg-surface p-4 pb-2 justify-between border-b border-slate-100 sticky top-0 z-10">
      <button
        class="icon-btn flex size-12 shrink-0 items-center justify-center"
        @click="goToLanding"
      >
        <svg
          class="w-6 h-6 text-slate-600"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <h2 class="text-lg font-bold leading-tight flex-1 text-center pr-12">New Game</h2>
    </header>

    <div class="flex flex-col flex-1 px-4 py-6 gap-8">
      <!-- Title -->
      <div class="text-center">
        <h3 class="text-slate-900 text-2xl font-bold leading-tight pb-2">Game Setup</h3>
        <p class="text-slate-500 text-sm">Choose a format and team names</p>
      </div>

      <!-- Format toggle -->
      <div class="space-y-4">
        <h3 class="text-lg font-bold text-slate-900">Target Score</h3>
        <div class="flex h-12 flex-1 items-center justify-center rounded-xl bg-slate-100 p-1">
          <button
            v-for="f in [501, 1001]"
            :key="f"
            class="flex h-full grow items-center justify-center rounded-lg px-2 text-sm font-semibold leading-normal transition-all"
            :class="form.format === f ? 'bg-surface shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'"
            @click="form.format = f as GameFormat"
          >
            {{ f }} pts
          </button>
        </div>
      </div>

      <!-- Team names -->
      <div class="space-y-6">
        <h3 class="text-lg font-bold text-slate-900">Team Names</h3>
        <div class="space-y-4">
          <div
            v-for="i in [0, 1]"
            :key="i"
            class="flex flex-col gap-2"
          >
            <label class="text-sm font-medium text-slate-600">Team {{ i + 1 }}</label>
            <div class="relative">
              <input
                v-model="form[`name${i}` as 'name0' | 'name1']"
                type="text"
                :placeholder="`Team ${i + 1} name`"
                class="input-field pr-12"
              />
              <svg
                class="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Start button -->
      <div class="mt-auto pt-4">
        <button
          class="btn-primary w-full h-14 text-lg shadow-primary/30 flex items-center justify-center gap-2"
          :disabled="!isValid"
          @click="startGame"
        >
          START GAME
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
