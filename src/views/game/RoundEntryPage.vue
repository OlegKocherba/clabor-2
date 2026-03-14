<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useGameStore } from '@/stores/gameStore';
import { useGameNavigation } from '@/composables/useGameNavigation';
import { useRoundForm } from '@/composables/useRoundForm';
import type { TeamIndex } from '@/types/game';

const gameStore = useGameStore();
const { goToScoreboard, requireActiveGame } = useGameNavigation();

onMounted(() => requireActiveGame());

const {
  playedBy,
  declarations,
  rawPoints,
  noTricks,
  pool,
  noTricksEnabled,
  isValid,
  setPointsForTeam,
  reset,
  toFormState,
} = useRoundForm();

const totalRaw = computed(() => (rawPoints.value[0] ?? 0) + (rawPoints.value[1] ?? 0));
const showSumError = computed(
  () => rawPoints.value[0] !== null && rawPoints.value[1] !== null && totalRaw.value !== pool.value,
);

function handlePointInput(teamIndex: TeamIndex, event: Event) {
  const val = (event.target as HTMLInputElement).valueAsNumber;
  setPointsForTeam(teamIndex, isNaN(val) ? null : val);
}

function submit() {
  if (!isValid.value) return;
  gameStore.addRound(toFormState());
  reset();
  goToScoreboard();
}
</script>

<template>
  <div class="min-h-screen bg-bg-light flex flex-col">
    <!-- Header -->
    <header class="flex items-center bg-surface p-4 border-b border-slate-200 sticky top-0 z-10">
      <button
        class="icon-btn flex size-10 shrink-0 items-center justify-center"
        @click="goToScoreboard"
      >
        <svg
          class="w-5 h-5 text-slate-600"
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
      <h2 class="text-lg font-bold leading-tight flex-1 text-center pr-10">New Round</h2>
    </header>

    <main class="flex-1 overflow-y-auto pb-28">
      <!-- Team selector -->
      <section class="p-4">
        <h3 class="text-xs section-label mb-3">Who took trump</h3>
        <div class="flex gap-3">
          <button
            v-for="(name, i) in gameStore.teamNames"
            :key="i"
            class="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all border-2"
            :class="
              playedBy === i
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-surface text-slate-600 border-slate-200 hover:border-primary/50'
            "
            @click="playedBy = i as TeamIndex"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
              />
            </svg>
            <span>{{ name }}</span>
          </button>
        </div>
      </section>

      <!-- Points scored -->
      <section class="px-4 py-4 bg-surface my-2">
        <h3 class="text-xs section-label mb-4">Points</h3>
        <div class="grid grid-cols-2 gap-6">
          <div
            v-for="(name, i) in gameStore.teamNames"
            :key="i"
            class="flex flex-col gap-2"
          >
            <label class="text-xs font-medium text-slate-400">{{ name }}</label>
            <input
              type="number"
              class="w-full text-3xl font-bold bg-slate-50 border-none rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-primary text-slate-900"
              placeholder="0"
              :value="rawPoints[i as TeamIndex] ?? ''"
              min="0"
              :max="pool"
              @input="handlePointInput(i as TeamIndex, $event)"
            />
            <button
              :disabled="!noTricksEnabled[i as TeamIndex]"
              class="w-full py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors"
              :class="
                noTricks[i as TeamIndex]
                  ? 'bg-red-500 text-white'
                  : noTricksEnabled[i as TeamIndex]
                    ? 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    : 'bg-slate-50 text-slate-300 cursor-not-allowed'
              "
              @click="noTricks[i as TeamIndex] = !noTricks[i as TeamIndex]"
            >
              No tricks −100
            </button>
          </div>
        </div>

        <div
          v-if="showSumError"
          class="mt-4 flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-xl"
        >
          <svg
            class="w-4 h-4 shrink-0"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
            />
            <path d="M12 8v4m0 4h.01" />
          </svg>
          <span class="text-xs font-medium">Total must be {{ pool }} (currently: {{ totalRaw }})</span>
        </div>
      </section>

      <!-- Declarations -->
      <section class="p-4">
        <h3 class="text-xs section-label mb-4">Declarations</h3>
        <div class="space-y-3">
          <!-- Tierce -->
          <div class="card flex items-center justify-between p-4">
            <div>
              <p class="font-semibold">Tierce</p>
              <p class="text-xs text-slate-500">20 pts</p>
            </div>
            <div class="flex items-center gap-4">
              <button
                class="counter-btn-minus"
                :disabled="declarations.tierces <= 0"
                @click="declarations.tierces--"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    d="M5 12h14"
                  />
                </svg>
              </button>
              <span class="text-lg font-bold w-6 text-center tabular-nums">{{ declarations.tierces }}</span>
              <button
                class="counter-btn-plus"
                :disabled="declarations.tierces >= 4"
                @click="declarations.tierces++"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Poltina -->
          <div class="card flex items-center justify-between p-4">
            <div>
              <p class="font-semibold">Poltina</p>
              <p class="text-xs text-slate-500">50 pts</p>
            </div>
            <div class="flex items-center gap-4">
              <button
                class="counter-btn-minus"
                :disabled="declarations.poltinas <= 0"
                @click="declarations.poltinas--"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    d="M5 12h14"
                  />
                </svg>
              </button>
              <span class="text-lg font-bold w-6 text-center tabular-nums">{{ declarations.poltinas }}</span>
              <button
                class="counter-btn-plus"
                :disabled="declarations.poltinas >= 2"
                @click="declarations.poltinas++"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Bela -->
          <div class="card flex items-center justify-between p-4">
            <div>
              <p class="font-semibold">Bela</p>
              <p class="text-xs text-slate-500">20 pts</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                v-model="declarations.hasBela"
                type="checkbox"
                class="sr-only peer"
              />
              <div
                class="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"
              />
            </label>
          </div>
        </div>
      </section>

      <!-- Pool summary -->
      <section class="mx-4 mt-2 p-5 rounded-2xl bg-primary/5 border border-primary/20">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-sm text-slate-500 font-medium">Round Pool</p>
            <p class="text-3xl font-black text-primary tabular-nums">{{ pool }}</p>
          </div>
          <div
            v-if="gameStore.carryOver > 0"
            class="text-right"
          >
            <p class="text-xs text-slate-400">Carry-over</p>
            <p class="font-bold text-primary">+{{ gameStore.carryOver }}</p>
          </div>
        </div>
      </section>
    </main>

    <!-- Fixed bottom -->
    <div
      class="fixed bottom-0 left-0 right-0 p-4 bg-surface/80 backdrop-blur-md border-t border-slate-200"
      style="max-width: var(--app-max-width); margin-inline: auto"
    >
      <button
        class="btn-primary w-full py-4 text-base shadow-primary/20 flex items-center justify-center gap-2"
        :disabled="!isValid"
        @click="submit"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M17 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7l-4-4zM12 17v-6M9 17v-2"
          />
        </svg>
        Save Round
      </button>
    </div>
  </div>
</template>
