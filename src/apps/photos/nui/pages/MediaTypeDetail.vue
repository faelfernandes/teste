<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { usePhotosStore } from '../store/app-store';
import { useModalStore } from '@core/nui/store/modal';
import { useActionSheetStore } from '@core/nui/store/actionSheet';
import { ChevronLeft, MoreHorizontal, Check, Upload, Trash2 } from 'lucide-vue-next';

const props = defineProps<{
  mediaTypeId: string;
}>();

const router = useRouter();
const store = usePhotosStore();
const modalStore = useModalStore();
const actionSheetStore = useActionSheetStore();

const mediaType = computed(() => store.mediaTypes.find(mt => mt.id === props.mediaTypeId));
const mediaItems = computed(() => store.getPhotosByMediaType(props.mediaTypeId));

const photoCount = computed(() => mediaItems.value.filter(item => item.type === 'image').length);
const videoCount = computed(() => mediaItems.value.filter(item => item.type === 'video').length);

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
  // This is a placeholder for more options action sheet
  alert('More options clicked');
};

const handlePhotoClick = (photoId: number) => {
  if (store.isSelectionMode) {
    store.togglePhotoSelection(photoId);
  } else {
    router.push({
      name: 'photos-media-viewer',
      params: {
        context: 'mediaType',
        contextId: props.mediaTypeId,
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
  <div v-if="mediaType" class="h-full w-full bg-gray-100 dark:bg-ios-dark-bg flex flex-col font-sans">
    <!-- Custom Header -->
    <header class="sticky top-0 z-20 pt-10 bg-gray-100/80 dark:bg-ios-dark-bg/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700/60">
      <div class="w-full flex items-center justify-between px-2 pb-2 relative h-11">
        <button @click="goBack" class="flex items-center text-blue-500 text-lg">
          <ChevronLeft class="w-8 h-8 -ml-2" />
        </button>
        <div class="absolute left-1/2 -translate-x-1/2 text-center">
          <h1 class="font-semibold text-black dark:text-white">{{ store.isSelectionMode ? `${store.selectedCount} Selected` : mediaType.name }}</h1>
          <p v-if="!store.isSelectionMode" class="text-xs text-gray-500 dark:text-gray-400">{{ photoCount }} Photos, {{ videoCount }} Videos</p>
        </div>
        <div class="flex items-center space-x-4">
          <button @click="handleHeaderRightClick" class="text-blue-500 text-lg">{{ store.isSelectionMode ? 'Done' : 'Select' }}</button>
          <button v-if="!store.isSelectionMode" @click="handleMoreOptions" class="text-blue-500">
            <MoreHorizontal class="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>

    <!-- Media Grid -->
    <main class="flex-1 overflow-y-auto no-scrollbar p-0.5" :class="{'pb-20': store.isSelectionMode}">
      <div v-if="mediaItems.length > 0" class="grid grid-cols-3">
        <div
          v-for="item in mediaItems"
          :key="item.id"
          class="aspect-square p-0.5 relative cursor-pointer"
          @click="handlePhotoClick(item.id)"
        >
          <img :src="item.url" :alt="`Media ${item.id}`" class="w-full h-full object-cover transition-transform duration-200" :class="{'scale-90 rounded-lg': store.isPhotoSelected(item.id)}" />
          
          <!-- Video Duration Overlay -->
          <div v-if="item.type === 'video'" class="absolute bottom-1.5 right-1.5 text-white text-xs font-semibold [text-shadow:0_1px_2px_rgba(0,0,0,0.7)]">
            <span>{{ item.duration }}</span>
          </div>

          <!-- Selection Checkmark -->
          <div v-if="store.isSelectionMode" class="absolute bottom-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all" :class="store.isPhotoSelected(item.id) ? 'bg-blue-500 border-2 border-white' : 'bg-black/20 border-2 border-white'">
            <Check v-if="store.isPhotoSelected(item.id)" class="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
      <div v-else class="text-center text-gray-500 pt-10">
        No {{ mediaType.name.toLowerCase() }} found.
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
    Media type not found.
  </div>
</template>
