<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  data: number[];
  color: 'green' | 'red';
}>();

const viewBox = '0 0 100 40';

const path = computed(() => {
  const data = props.data;
  if (!data || data.length < 2) return '';

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min === 0 ? 1 : max - min;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 38 - ((d - min) / range) * 36; // 36 height, 2 padding top/bottom
    return `${x},${y}`;
  });

  return `M ${points.join(' L ')}`;
});

const strokeColor = computed(() => {
  return props.color === 'green' ? '#10B981' : '#EF4444';
});
</script>

<template>
  <svg :viewBox="viewBox" class="w-full h-full" preserveAspectRatio="none">
    <path
      :d="path"
      fill="none"
      :stroke="strokeColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>
