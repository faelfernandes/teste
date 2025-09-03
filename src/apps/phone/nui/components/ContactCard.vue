<script setup lang="ts">
import type { Contact } from '../store/app-store';
import { usePhoneStore } from '../store/app-store';
import { ChevronRight } from 'lucide-vue-next';

defineProps<{
  contact: Contact;
  isLast: boolean;
}>();

defineEmits(['click']);

const phoneStore = usePhoneStore();
</script>

<template>
  <div @click="$emit('click')" class="flex items-center p-2.5 space-x-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50">
    <div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
      <span class="text-base font-semibold text-gray-600 dark:text-gray-300">
        {{ phoneStore.getInitials(contact.name) }}
      </span>
    </div>
    <div class="flex-1 min-w-0" :class="{ 'border-b border-gray-200 dark:border-gray-700/60 pb-2.5': !isLast }">
      <p class="text-base font-medium text-black dark:text-white truncate">{{ contact.name }}</p>
      <p v-if="contact.phone" class="text-sm text-gray-500 dark:text-gray-400">{{ contact.phone }}</p>
    </div>
    <ChevronRight v-if="contact.isMyCard" class="w-5 h-5 text-gray-400" />
  </div>
</template>
