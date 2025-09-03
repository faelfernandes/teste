<script setup lang="ts">
defineProps<{
  main: string;
  sub?: string;
}>();

defineEmits(['click']);
</script>

<template>
  <button
    @click="$emit('click')"
    class="w-20 h-20 rounded-full flex flex-col items-center justify-center transition-colors duration-150 bg-gray-200/80 dark:bg-gray-700/60 active:bg-gray-300 dark:active:bg-gray-600"
  >
    <span class="text-4xl font-light text-black dark:text-white">{{ main }}</span>
    <span v-if="sub" class="text-[10px] font-bold tracking-[0.2em] text-black dark:text-white">{{ sub }}</span>
  </button>
</template>
