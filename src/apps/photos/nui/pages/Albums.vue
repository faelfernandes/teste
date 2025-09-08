<script setup lang="ts">
import { usePhotosStore } from '../store/app-store';
import AlbumItem from '../components/AlbumItem.vue';
import { Plus, ChevronRight } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const store = usePhotosStore();
const router = useRouter();

const handleDelete = (albumId: number) => {
  store.deleteAlbum(albumId);
};

const handleAddAlbum = () => {
  alert('Add new album functionality not implemented.');
};

const handleMediaTypeClick = (typeId: string) => {
  router.push(`/app/photos/media-types/${typeId}`);
};
</script>

<template>
  <div class="h-full w-full bg-gray-100 dark:bg-ios-dark-bg flex flex-col font-sans">
    <!-- Custom Header -->
    <header class="sticky top-0 z-20 pt-10 bg-gray-100/80 dark:bg-ios-dark-bg/80 backdrop-blur-md">
      <div class="w-full flex items-center justify-between px-4 pb-2 relative h-11">
        <button @click="store.toggleEditing" class="text-blue-500 text-lg w-16 text-left">
          {{ store.isEditing ? 'Done' : 'Edit' }}
        </button>
        <h1 class="text-lg font-semibold text-black dark:text-white absolute left-1/2 -translate-x-1/2">Albums</h1>
        <div class="w-16 flex justify-end">
          <button @click="handleAddAlbum" class="text-blue-500"><Plus class="w-7 h-7" /></button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto no-scrollbar">
      <div class="px-4 pt-4 pb-8 space-y-6">
        <!-- My Albums Section -->
        <div>
          <h2 class="text-xl font-bold text-black dark:text-white mb-2">My Albums</h2>
          <div class="grid grid-cols-2 gap-x-4 gap-y-6">
            <AlbumItem
              v-for="album in store.myAlbums"
              :key="album.id"
              :album="album"
              :is-editing="store.isEditing"
              @delete="handleDelete"
            />
          </div>
        </div>

        <!-- Shared Albums Section -->
        <div>
          <h2 class="text-xl font-bold text-black dark:text-white mb-2">Shared Albums</h2>
          <div class="grid grid-cols-2 gap-x-4 gap-y-6">
            <AlbumItem
              v-for="album in store.sharedAlbums"
              :key="album.id"
              :album="album"
              :is-editing="store.isEditing"
              @delete="handleDelete"
            />
          </div>
        </div>
        
        <!-- Media Types Section -->
        <div>
          <h2 class="text-xl font-bold text-black dark:text-white mb-2">Media Types</h2>
          <div class="bg-white dark:bg-ios-dark-card rounded-xl">
            <div
              v-for="(type, index) in store.mediaTypes"
              :key="type.id"
              @click="handleMediaTypeClick(type.id)"
              class="flex items-center p-3 space-x-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              :class="{ 'border-b border-gray-200 dark:border-gray-700/60': index < store.mediaTypes.length - 1 }"
            >
              <component :is="type.icon" class="w-6 h-6 text-blue-500" />
              <p class="flex-1 text-base text-blue-500">{{ type.name }}</p>
              <span class="text-gray-500 dark:text-gray-400">{{ type.count }}</span>
              <ChevronRight class="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
