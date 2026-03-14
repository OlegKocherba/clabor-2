<script setup lang="ts">
import type { Round } from '@/types/game';

const props = defineProps<{
  round: Round;
  roundNumber: number;
  teamNames: [string, string];
}>();

const playedBy = props.round.playedBy;
const opponentIdx = (1 - playedBy) as 0 | 1;

const myScore = props.round.finalScores[playedBy];
const oppScore = props.round.finalScores[opponentIdx];
const isCapot = !props.round.isBait && !props.round.isDraw && oppScore === 0;
</script>

<template>
  <div
    class="card p-4 flex items-center justify-between"
    :class="round.isBait ? 'border-l-4 border-l-primary' : ''"
  >
    <!-- Left: round + playing team's score -->
    <div class="flex flex-col min-w-0">
      <span class="label-xs">Round {{ roundNumber }}</span>
      <span class="text-[9px] text-slate-300 font-medium">{{ teamNames[playedBy] }} took trump</span>
      <div class="flex items-center gap-2 mt-1">
        <span class="text-lg font-bold tabular-nums">{{ myScore }}</span>
        <span
          v-if="isCapot"
          class="badge-danger"
          >CAPOT</span
        >
        <span
          v-if="round.isDraw"
          class="badge-warning"
          >DRAW</span
        >
      </div>
    </div>

    <!-- Divider -->
    <div class="h-8 w-px bg-slate-100 shrink-0 mx-3" />

    <!-- Right: opponents score -->
    <div class="flex flex-col text-right min-w-0">
      <span class="label-xs">{{ teamNames[opponentIdx] }}</span>
      <div class="flex items-center justify-end gap-2 mt-1">
        <span
          v-if="round.isBait"
          class="badge-primary"
          >BAIT</span
        >
        <span
          class="text-lg font-bold tabular-nums"
          :class="round.isBait ? 'text-slate-400' : ''"
        >
          {{ oppScore }}
        </span>
      </div>
    </div>
  </div>
</template>
