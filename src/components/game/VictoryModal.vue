<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '@/stores/gameStore';
import { useGameNavigation } from '@/composables/useGameNavigation';

const gameStore = useGameStore();
const { goToSetup } = useGameNavigation();

const visible = computed(() => gameStore.winner !== null);
const winnerName = computed(() => (gameStore.winner !== null ? gameStore.teamNames[gameStore.winner] : ''));
const winnerScore = computed(() => (gameStore.winner !== null ? gameStore.totalsWithPenalties[gameStore.winner] : 0));

const startNewGame = () => {
  gameStore.resetGame();
  goToSetup();
};
</script>

<template>
  <Dialog
    :visible="visible"
    :modal="true"
    :closable="false"
    :draggable="false"
    :pt="{ root: 'rounded-2xl', header: 'hidden', content: 'p-0' }"
  >
    <div class="flex flex-col items-center gap-4 p-8 text-center">
      <div class="text-5xl">🏆</div>
      <h2 class="text-2xl font-black text-slate-800">Victory!</h2>
      <p class="text-slate-500">
        Team <span class="font-bold text-primary">{{ winnerName }}</span> wins
      </p>
      <p class="text-4xl font-black text-primary tabular-nums">{{ winnerScore }}</p>
      <Button
        label="New Game"
        class="w-full mt-2"
        size="large"
        @click="startNewGame"
      />
    </div>
  </Dialog>
</template>
