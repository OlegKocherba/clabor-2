<script setup lang="ts">
defineProps<{
  modelValue: number;
  max?: number;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: number];
}>();
</script>

<template>
  <div class="flex items-center gap-3">
    <button
      class="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center font-bold text-zinc-600 active:scale-95 transition-transform disabled:opacity-30 disabled:active:scale-100"
      :disabled="modelValue <= 0"
      @click="emit('update:modelValue', modelValue - 1)"
    >
      −
    </button>
    <span class="font-bold text-lg w-4 text-center tabular-nums">{{ modelValue }}</span>
    <button
      class="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center font-bold text-zinc-600 active:scale-95 transition-transform disabled:opacity-30 disabled:active:scale-100"
      :disabled="max !== undefined && modelValue >= max"
      @click="emit('update:modelValue', modelValue + 1)"
    >
      +
    </button>
  </div>
</template>
