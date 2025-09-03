<script setup lang="ts">
import type { Contact } from '../store/app-store';
import { usePhoneStore } from '../store/app-store';
import { Info } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const props = defineProps<{
  contact: Contact;
  isLast: boolean;
  isEditing: boolean;
}>();

const emit = defineEmits(['delete']);

const phoneStore = usePhoneStore();
const router = useRouter();

const handleInfoClick = () => {
  if (props.isEditing) return;
  router.push(`/app/phone/contacts/${props.contact.id}`);
};

const handleDelete = () => {
  emit('delete');
};

const onItemClick = () => {
  if (!props.isEditing) {
    // In a real app, this might initiate a call. Here, it does nothing.
  }
};
</script>

<template>
  <div @click="onItemClick" class="flex items-center p-2.5 space-x-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50">
    <!-- Delete Button -->
    <transition name="fade-scale">
      <button 
        v-if="isEditing"
        @click.stop="handleDelete"
        class="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-lg font-bold leading-none flex-shrink-0"
      >
        -
      </button>
    </transition>
    
    <!-- Avatar -->
    <div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
      <span class="text-base font-semibold text-gray-600 dark:text-gray-300">
        {{ phoneStore.getInitials(contact.name) }}
      </span>
    </div>
    
    <!-- Name/Phone and Info Button -->
    <div class="flex-1 min-w-0" :class="{ 'border-b border-gray-200 dark:border-gray-700/60 pb-2.5': !isLast }">
      <div class="flex justify-between items-center">
        <div class="min-w-0">
          <p class="text-base font-medium text-black dark:text-white truncate">{{ contact.name }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ contact.phone }}</p>
        </div>
        <button @click.stop="handleInfoClick" class="text-blue-500 p-2 -mr-2">
          <Info class="w-6 h-6" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.5);
}
</style>
