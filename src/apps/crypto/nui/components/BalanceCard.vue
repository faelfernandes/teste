<script setup lang="ts">
import { Eye } from 'lucide-vue-next';

defineProps<{
  balance: string;
  isVisible: boolean;
}>();

defineEmits(['toggle-visibility']);
</script>

<template>
  <div class="w-full rounded-2xl p-5 flex flex-col justify-between text-white bg-gradient-to-br from-[#26D07C] to-[#14A55B] shadow-lg">
    <div class="flex justify-between items-center">
      <span class="text-sm font-medium opacity-90">Estimated Balance</span>
      <button @click="$emit('toggle-visibility')" class="opacity-90 hover:opacity-100">
        <Eye class="w-5 h-5" />
      </button>
    </div>
    <div class="mt-2">
      <p v-if="isVisible" class="text-5xl font-bold">{{ balance }}</p>
      <p v-else class="text-5xl font-bold">$*****</p>
    </div>
  </div>
</template>
