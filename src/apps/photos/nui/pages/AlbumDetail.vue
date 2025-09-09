<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { usePhotosStore } from '../store/app-store';
import { useModalStore } from '@core/nui/store/modal';
import { useActionSheetStore } from '@core/nui/store/actionSheet';
import { ChevronLeft, MoreHorizontal, Check, Upload, Trash2 } from 'lucide-vue-next';

const props = defineProps<{
  albumId: string;
}>();

const router = useRouter();
const store = usePhotosStore();
const modalStore = useModalStore();
const actionSheetStore = useActionSheetStore();

const album = computed(() => store.getAlbumById(Number(props.albumId)));
const photos = computed(() => store.getPhotosByAlbumId(Number(props.albumId)));

const goBack = () => {
  if (store.isSelectionMode) {
    store.cancelSelectionMode();
  } else {
    router.back();
  }
};

const handleHeaderRightClick = () => {
  if (store.isSelectionMode) {
    store.cancelSelectionMode();
  } else {
    store.toggleSelectionMode();
  }
};

const handleMoreOptions = async () => {
  if (store.selectedCount === 0) return;

  const result = await actionSheetStore.show([
    [
      { id: 'add-to-album', text: 'Add to Album', style: 'default' },
      { id: 'add-to-favourites', text: 'Add to Favourites', style: 'default' },
    ]
  ]);

  if (result === 'add-to-album') {
    alert('Add to Album functionality not implemented.');
  } else if (result === 'add-to-favourites') {
    store.addSelectedToFavorites();
  }
};

const handlePhotoClick = (photoId: number) => {
  if (store.isSelectionMode) {
    store.togglePhotoSelection(photoId);
  } else {
    router.push({
      name: 'photos-media-viewer',
      params: {
        context: 'album',
        contextId: props.albumId,
        mediaId: photoId,
      },
    });
  }
};

const handleDeleteSelected = async () => {
  if (store.selectedCount === 0) return;
  const result = await modalStore.showModal({
    title: `Delete ${store.selectedCount} Items`,
    message: 'This action cannot be undone.',
    buttons: [
      { id: 'cancel', text: 'Cancel', style: 'cancel' },
      { id: 'delete', text: 'Delete', style: 'destructive' },
    ]
  });
  if (result.buttonId === 'delete') {
    store.deleteSelectedPhotos();
  }
};

const handleShare = () => {
  alert('Share functionality not implemented.');
};
</script>

<template>
  <div v-if="album" class="h-full w-full bg-gray-100 dark:bg-ios-dark-bg flex flex-col font-sans">
    <!-- Custom Header -->
    <header class="sticky top-0 z-20 pt-10 bg-gray-100/80 dark:bg-ios-dark-bg/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700/60">
      <div class="w-full flex items-center justify-between px-2 pb-2 relative h-11">
        <button @click="goBack" class="flex items-center text-blue-500 text-lg">
          <ChevronLeft class="w-8 h-8 -ml-2" />
          <span v-if="!store.isSelectionMode" class="-ml-2">Albums</span>
        </button>
        <div class="absolute left-1/2 -translate-x-1/2 text-center">
          <h1 class="font-semibold text-black dark:text-white">{{ store.isSelectionMode ? `${store.selectedCount} Selected` : album.name }}</h1>
          <p v-if="!store.isSelectionMode" class="text-xs text-gray-500 dark:text-gray-400">{{ album.count }} Photos, 2 Videos</p>
        </div>
        <div class="flex items-center space-x-4">
          <button @click="handleHeaderRightClick" class="text-blue-500 text-lg">{{ store.isSelectionMode ? 'Done' : 'Select' }}</button>
          <button v-if="store.isSelectionMode" @click="handleMoreOptions" class="text-blue-500 disabled:text-gray-400" :disabled="store.selectedCount === 0">
            <MoreHorizontal class="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>

    <!-- Photo Grid -->
    <main class="flex-1 overflow-y-auto no-scrollbar p-0.5" :class="{'pb-20': store.isSelectionMode}">
      <div class="grid grid-cols-3">
        <div
          v-for="photo in photos"
          :key="photo.id"
          class="aspect-square p-0.5 relative cursor-pointer"
          @click="handlePhotoClick(photo.id)"
        >
          <img :src="photo.url" :alt="`Photo ${photo.id}`" class="w-full h-full object-cover transition-transform duration-200" :class="{'scale-90 rounded-lg': store.isPhotoSelected(photo.id)}" />
          <div v-if="store.isSelectionMode" class="absolute bottom-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all" :class="store.isPhotoSelected(photo.id) ? 'bg-blue-500 border-2 border-white' : 'bg-black/20 border-2 border-white'">
            <Check v-if="store.isPhotoSelected(photo.id)" class="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </main>

    <!-- Selection Footer -->
    <footer v-if="store.isSelectionMode" class="absolute bottom-0 left-0 right-0 z-30 bg-gray-100/80 dark:bg-ios-dark-bg/80 backdrop-blur-lg border-t border-gray-200/80 dark:border-gray-700/60 transition-transform duration-300">
      <div class="flex justify-between items-center px-4 h-14">
        <button @click="handleShare" class="p-2 text-blue-500 disabled:text-gray-400" :disabled="store.selectedCount === 0">
          <Upload class="w-6 h-6" />
        </button>
        <button @click="handleDeleteSelected" class="p-2 text-blue-500 disabled:text-gray-400" :disabled="store.selectedCount === 0">
          <Trash2 class="w-6 h-6" />
        </button>
      </div>
      <div class="h-8"></div> <!-- Safe area for home indicator -->
    </footer>
  </div>
  <div v-else class="h-full flex items-center justify-center text-gray-500">
    Album not found.
  </div>
</template>
