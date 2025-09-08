<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { usePhotosStore } from '../store/app-store';
import { ChevronLeft, MoreHorizontal } from 'lucide-vue-next';

const props = defineProps<{
  albumId: string;
}>();

const router = useRouter();
const store = usePhotosStore();

const album = computed(() => store.getAlbumById(Number(props.albumId)));
const photos = computed(() => store.getPhotosByAlbumId(Number(props.albumId)));

const goBack = () => {
  router.back();
};

const handleSelect = () => {
  alert('Select functionality not implemented.');
};

const handleMore = () => {
  alert('More options not implemented.');
};
</script>

<template>
  <div v-if="album" class="h-full w-full bg-gray-100 dark:bg-ios-dark-bg flex flex-col font-sans">
    <!-- Custom Header -->
    <header class="sticky top-0 z-20 pt-10 bg-gray-100/80 dark:bg-ios-dark-bg/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700/60">
      <div class="w-full flex items-center justify-between px-2 pb-2 relative h-11">
        <button @click="goBack" class="flex items-center text-blue-500 text-lg">
          <ChevronLeft class="w-8 h-8 -ml-2" />
          <span class="-ml-2">Albums</span>
        </button>
        <div class="absolute left-1/2 -translate-x-1/2 text-center">
          <h1 class="font-semibold text-black dark:text-white">{{ album.name }}</h1>
          <p class="text-xs text-gray-500 dark:text-gray-400">{{ album.count }} Photos, 2 Videos</p> <!-- Mocked videos count -->
        </div>
        <div class="flex items-center space-x-4">
          <button @click="handleSelect" class="text-blue-500 text-lg">Select</button>
          <button @click="handleMore" class="text-blue-500"><MoreHorizontal class="w-6 h-6" /></button>
        </div>
      </div>
    </header>

    <!-- Photo Grid -->
    <main class="flex-1 overflow-y-auto no-scrollbar p-0.5">
      <div class="grid grid-cols-3">
        <div
          v-for="photo in photos"
          :key="photo.id"
          class="aspect-square p-0.5"
        >
          <img :src="photo.url" :alt="`Photo ${photo.id}`" class="w-full h-full object-cover" />
        </div>
      </div>
    </main>
  </div>
  <div v-else class="h-full flex items-center justify-center text-gray-500">
    Album not found.
  </div>
</template>
