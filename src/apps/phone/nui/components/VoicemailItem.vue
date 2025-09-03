<script setup lang="ts">
import type { Voicemail } from '../store/app-store';
import { usePhoneStore } from '../store/app-store';
import CustomSlider from '@core/nui/components/CustomSlider.vue';
import { Play, Pause, Phone, Trash2 } from 'lucide-vue-next';

const props = defineProps<{
  voicemail: Voicemail;
  isSelected: boolean;
}>();

const emit = defineEmits(['select', 'delete']);
const phoneStore = usePhoneStore();
</script>

<template>
  <div 
    @click="!isSelected && $emit('select')"
    class="bg-white dark:bg-ios-dark-card rounded-xl p-4 transition-all duration-300 ease-in-out"
    :class="{'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50': !isSelected}"
  >
    <div class="flex justify-between items-center">
      <div>
        <p class="font-semibold text-base text-black dark:text-white">{{ voicemail.sender }}</p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{{ voicemail.date }}</p>
      </div>
      <div v-if="!isSelected" class="text-sm text-gray-500 dark:text-gray-400">
        {{ voicemail.duration }}
      </div>
    </div>

    <div v-if="isSelected" class="mt-4 space-y-3 animate-fade-in">
      <!-- Playback Slider -->
      <div class="flex items-center space-x-2">
        <span class="text-xs text-gray-500 dark:text-gray-400">0:00</span>
        <CustomSlider v-model="phoneStore.playbackProgress" :min="0" :max="100" />
        <span class="text-xs text-gray-500 dark:text-gray-400">{{ voicemail.duration }}</span>
      </div>
      <!-- Controls -->
      <div class="flex justify-between items-center">
        <button @click.stop="phoneStore.toggleVoicemailPlayback()" class="text-blue-500 p-2">
          <Pause v-if="phoneStore.isPlayingVoicemail" class="w-8 h-8" fill="currentColor" />
          <Play v-else class="w-8 h-8" fill="currentColor" />
        </button>
        <div class="flex items-center space-x-4">
          <button class="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center">
            <Phone class="w-5 h-5"/>
          </button>
          <button class="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center">
            <div class="w-5 h-5 rounded-full bg-white"></div>
          </button>
          <button @click.stop="$emit('delete')" class="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center">
            <Trash2 class="w-5 h-5"/>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fade-in 0.3s ease-out forwards;
}
@keyframes fade-in {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
