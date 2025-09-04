<script setup lang="ts">
import type { Channel } from '../store/app-store';
import { ChevronRight } from 'lucide-vue-next';

defineProps<{
  channel: Channel;
  isLast: boolean;
}>();
</script>

<template>
  <div class="flex items-center space-x-4 py-3 cursor-pointer hover:bg-gray-800/50 transition-colors px-4">
    <div class="flex flex-col items-center w-10 flex-shrink-0">
      <component :is="channel.icon" class="w-6 h-6 text-gray-400" />
      <span class="text-xs text-gray-400 mt-0.5">{{ channel.userCount }}</span>
    </div>
    <div class="flex-1 min-w-0" :class="{ 'border-b border-gray-700/60 pb-3': !isLast }">
      <div class="flex justify-between items-center">
        <p class="font-semibold text-base text-white truncate">{{ channel.name }}</p>
        <div class="flex items-center space-x-1 text-sm text-gray-400 flex-shrink-0 ml-2">
          <span>{{ channel.timestamp }}</span>
          <ChevronRight class="w-4 h-4" />
        </div>
      </div>
      <p class="text-sm text-gray-400 truncate">
        <span class="font-medium">{{ channel.lastMessageUser }}:</span> {{ channel.lastMessageText }}
      </p>
    </div>
  </div>
</template>
