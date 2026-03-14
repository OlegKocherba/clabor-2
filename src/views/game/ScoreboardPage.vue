<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useGameStore } from '@/stores/gameStore';
import { useGameNavigation } from '@/composables/useGameNavigation';
import TeamScoreDisplay from '@/components/game/TeamScoreDisplay.vue';
import RoundHistoryItem from '@/components/game/RoundHistoryItem.vue';
import VictoryModal from '@/components/game/VictoryModal.vue';

const gameStore = useGameStore();
const { goToLanding, goToSetup, goToRoundEntry, requireActiveGame } = useGameNavigation();

onMounted(() => requireActiveGame());

const confirmReset = ref(false);
const reversedRounds = computed(() => [...gameStore.rounds].reverse());
const isLeading = computed<[boolean, boolean]>(() => {
  const [a, b] = gameStore.totalsWithPenalties;
  if (a === b) return [false, false];
  return [a > b, b > a];
});

function doReset() {
  gameStore.resetGame();
  confirmReset.value = false;
  goToLanding();
}
</script>

<template>
  <div class="min-h-screen bg-bg-light flex flex-col">
    <!-- Sticky header -->
    <header
      class="sticky top-0 z-10 bg-bg-light/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between"
    >
      <button
        class="icon-btn"
        @click="goToLanding"
      >
        <svg
          class="w-5 h-5 text-slate-700"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <h1 class="text-lg font-bold tracking-tight">Clabor</h1>
      <button
        class="icon-btn text-slate-500"
        @click="confirmReset = true"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          viewBox="0 0 24 24"
        >
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
      </button>
    </header>

    <main class="flex-1 px-4 py-6 space-y-6 pb-28">
      <!-- Live Score -->
      <section>
        <h2 class="text-sm section-label mb-4 px-1">Live Score</h2>
        <div class="grid grid-cols-2 gap-4">
          <TeamScoreDisplay
            v-for="i in [0, 1] as const"
            :key="i"
            :name="gameStore.teamNames[i]"
            :score="gameStore.totalsWithPenalties[i]"
            :bait-count="gameStore.baitCounts[i]"
            :is-leading="isLeading[i]"
          />
        </div>
      </section>

      <!-- Carry over -->
      <div
        v-if="gameStore.carryOver > 0"
        class="flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl"
      >
        <svg
          class="w-4 h-4 text-amber-500 shrink-0"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
        <span class="text-xs font-bold text-amber-700">Carry-over: {{ gameStore.carryOver }} pts</span>
      </div>

      <!-- Round History -->
      <section>
        <div class="flex items-center justify-between mb-4 px-1">
          <h2 class="text-sm section-label">Round History</h2>
          <button
            v-if="gameStore.rounds.length > 0"
            class="text-xs font-bold text-red-500 flex items-center gap-1 active:opacity-70"
            @click="gameStore.undoLastRound()"
          >
            <svg
              class="w-3 h-3"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
              />
            </svg>
            Undo
          </button>
        </div>

        <div
          v-if="gameStore.rounds.length === 0"
          class="text-center py-12 text-slate-400 text-sm"
        >
          No rounds yet
        </div>

        <div
          v-else
          class="space-y-3"
        >
          <RoundHistoryItem
            v-for="(round, idx) in reversedRounds"
            :key="round.id"
            :round="round"
            :round-number="gameStore.rounds.length - idx"
            :team-names="gameStore.teamNames"
          />
        </div>
      </section>
    </main>
  </div>

  <!-- FAB: New Round -->
  <button
    v-if="gameStore.winner === null"
    class="fixed bottom-6 right-app size-14 bg-primary text-white rounded-full shadow-lg shadow-primary/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform z-20"
    @click="goToRoundEntry"
  >
    <svg
      class="w-7 h-7"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M12 4v16m8-8H4"
      />
    </svg>
  </button>

  <!-- Victory modal -->
  <VictoryModal />

  <!-- Confirm reset modal -->
  <Transition name="fade">
    <div
      v-if="confirmReset"
      class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end justify-center p-4 sm:items-center"
      @click.self="confirmReset = false"
    >
      <div class="bg-surface rounded-2xl p-6 w-full max-w-xs shadow-2xl">
        <h3 class="text-lg font-bold mb-1">Reset game?</h3>
        <p class="text-slate-500 text-sm mb-5">All scores and history will be deleted.</p>
        <div class="flex flex-col gap-3">
          <button
            class="w-full py-3 rounded-xl bg-red-500 text-white font-bold active:scale-[0.98] transition-transform"
            @click="doReset"
          >
            Yes, reset
          </button>
          <button
            class="w-full py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-bold active:scale-[0.98] transition-transform"
            @click="confirmReset = false"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
