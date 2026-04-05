<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  name: string;
  score: number;
  baitCount: number;
  isLeading?: boolean;
}>();

const baitPct = computed(() => Math.min((props.baitCount / 10) * 100, 100));
</script>

<template>
  <div class="card p-5 flex flex-col items-center">
    <span
      class="text-xs font-medium uppercase mb-1 truncate max-w-full"
      :class="isLeading ? 'text-primary' : 'text-slate-500'"
    >
      {{ name }}
    </span>
    <span class="text-4xl font-bold text-slate-900 tabular-nums">{{ score }}</span>
    <div class="w-full mt-4 space-y-2">
      <div class="flex justify-between items-center">
        <span class="label-xs">BAIT TRACKER</span>
        <span class="label-xs">{{ baitCount }}/10</span>
      </div>
      <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          class="h-full rounded-full transition-all"
          :class="baitCount >= 6 ? 'bg-red-500' : baitCount >= 3 ? 'bg-amber-400' : 'bg-primary'"
          :style="{ width: baitPct + '%' }"
        />
      </div>
    </div>
  </div>
</template>
