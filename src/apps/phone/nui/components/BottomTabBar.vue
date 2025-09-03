<script setup lang="ts">
import { computed, markRaw } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Star, Clock, User, Grid, Voicemail } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();

const tabs = computed(() => [
  { name: 'Favorites', icon: markRaw(Star), path: '/app/phone/favorites', active: route.name === 'phone-favorites' },
  { name: 'Recents', icon: markRaw(Clock), path: '/app/phone/recents', active: route.name === 'phone-recents' },
  { name: 'Contacts', icon: markRaw(User), path: '/app/phone/contacts', active: route.name === 'phone-contacts' },
  { name: 'Keypad', icon: markRaw(Grid), path: '/app/phone/keypad', active: route.name === 'phone-keypad' },
  { name: 'Voicemail', icon: markRaw(Voicemail), path: '/app/phone/voicemail', active: route.name === 'phone-voicemail' },
]);

const navigateTo = (path: string) => {
  router.push(path);
};
</script>

<template>
  <div class="w-full bg-gray-100/80 dark:bg-ios-dark-bg/80 backdrop-blur-lg border-t border-gray-200/80 dark:border-gray-700/60">
    <div class="flex justify-around items-center pt-2 pb-8">
      <button
        v-for="tab in tabs"
        :key="tab.name"
        @click="navigateTo(tab.path)"
        class="flex flex-col items-center justify-center space-y-1 w-20 h-12 transition-colors"
        :class="tab.active ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400 hover:text-blue-400 dark:hover:text-blue-400'"
      >
        <component :is="tab.icon" class="w-6 h-6" :fill="tab.active ? 'currentColor' : 'none'" />
        <span class="text-xs font-medium">{{ tab.name }}</span>
      </button>
    </div>
  </div>
</template>
