<script setup lang="ts">
import type { RecentCall } from '../store/app-store';
import { usePhoneStore } from '../store/app-store';
import { Info, User } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const props = defineProps<{
  call: RecentCall;
  isLast: boolean;
}>();

const phoneStore = usePhoneStore();
const router = useRouter();

const handleInfoClick = () => {
  router.push(`/app/phone/recents/${props.call.id}`);
};

const handleDelete = () => {
  phoneStore.deleteRecentCall(props.call.id);
};
</script>

<template>
  <div class="flex items-center p-2.5 space-x-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50">
    <button 
        v-if="phoneStore.isEditingRecents"
        @click.stop="handleDelete"
        class="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-lg font-bold leading-none flex-shrink-0 animate-fade-in"
    >
      -
    </button>
    
    <div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
      <span v-if="call.initials" class="text-base font-semibold text-gray-600 dark:text-gray-300">
        {{ call.initials }}
      </span>
      <User v-else class="w-6 h-6 text-gray-400 dark:text-gray-500" />
    </div>

    <div class="flex-1 min-w-0" :class="{ 'border-b border-gray-200 dark:border-gray-700/60 pb-2.5': !isLast }">
      <div class="flex justify-between items-center">
        <p 
          class="text-base font-medium truncate"
          :class="call.type === 'missed' ? 'text-red-500' : 'text-black dark:text-white'"
        >
          {{ call.name }}
        </p>
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">{{ call.time }}</span>
          <button @click.stop="handleInfoClick" class="text-blue-500">
            <Info class="w-5 h-5" />
          </button>
        </div>
      </div>
      <p class="text-sm text-gray-500 dark:text-gray-400">{{ call.secondaryInfo }}</p>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fade-in 0.2s ease-out forwards;
}
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
