<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePhotosStore } from '../store/app-store';
import { useSwipe } from '@vueuse/core';
import VideoPlayer from '../components/VideoPlayer.vue';
import { ChevronLeft, Share2, Heart, Play, MoreHorizontal } from 'lucide-vue-next';

const props = defineProps<{
  context: 'album' | 'mediaType';
  contextId: string;
  mediaId: string;
}>();

const router = useRouter();
const store = usePhotosStore();

const swipeRef = ref<HTMLElement | null>(null);
const thumbnailContainerRef = ref<HTMLElement | null>(null);
const thumbnailRefs = ref<Record<number, HTMLElement>>({});
const transitionName = ref('slide-next');
const areControlsVisible = ref(true);

const isImage = computed(() => store.currentViewerItem?.type === 'image');

const toggleControls = () => {
  if (isImage.value) {
    areControlsVisible.value = !areControlsVisible.value;
  }
};

onMounted(() => {
  store.setupViewer(props.context, props.contextId, Number(props.mediaId));
});

onUnmounted(() => {
  store.clearViewer();
});

useSwipe(swipeRef, {
  onSwipeEnd: (e, dir) => {
    if (dir === 'left') {
      transitionName.value = 'slide-next';
      store.goToNextMedia();
    } else if (dir === 'right') {
      transitionName.value = 'slide-prev';
      store.goToPreviousMedia();
    }
  },
});

watch(() => store.viewerCurrentIndex, (newIndex, oldIndex) => {
  areControlsVisible.value = true; // Show controls when swiping to a new item
  if (newIndex > oldIndex) transitionName.value = 'slide-next';
  if (newIndex < oldIndex) transitionName.value = 'slide-prev';
  
  const thumbnailEl = thumbnailRefs.value[newIndex];
  if (thumbnailEl) {
    thumbnailEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }
});

const goBack = () => router.back();

const handleAction = (action: string) => {
  alert(`Action: ${action}`);
};

const handleMoreOptions = () => {
  alert('More options clicked');
};

const handleToggleFavorite = () => {
    if (store.currentViewerItem) {
        store.toggleFavorite(store.currentViewerItem.id);
    }
};

const formattedTimestamp = computed(() => {
  if (!store.currentViewerItem?.timestamp) return { date: '', time: '' };
  const parts = store.currentViewerItem.timestamp.split(',');
  return {
    date: parts[0]?.trim() || '',
    time: parts[1]?.trim() || ''
  };
});
</script>

<template>
  <div 
    class="h-full w-full text-black dark:text-white flex flex-col font-sans overflow-hidden transition-colors duration-300"
    :class="[areControlsVisible ? 'bg-white dark:bg-black' : 'bg-black']"
  >
    <!-- Header -->
    <transition name="fade">
      <header v-if="areControlsVisible" class="absolute top-0 left-0 right-0 z-20 pt-10 px-2 pb-2 bg-white/80 dark:bg-black/80 backdrop-blur-md">
        <div class="flex justify-between items-center h-11">
          <button @click="goBack" class="flex items-center text-blue-500 text-lg">
            <ChevronLeft class="w-8 h-8" />
          </button>
          <div class="text-center">
              <p class="font-semibold text-base">{{ formattedTimestamp.date }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ formattedTimestamp.time }}</p>
          </div>
          <button @click="handleMoreOptions" class="p-2 text-blue-500">
              <MoreHorizontal class="w-6 h-6" />
          </button>
        </div>
      </header>
    </transition>

    <!-- Main Media View -->
    <main 
      ref="swipeRef" 
      class="flex-1 flex items-center justify-center overflow-hidden relative transition-all duration-300"
      :class="areControlsVisible ? 'pt-24 pb-40' : 'p-0'"
      @click="toggleControls"
    >
      <transition :name="transitionName" mode="out-in">
        <div :key="store.currentViewerItem?.id" class="w-full h-full">
          <img v-if="isImage" :src="store.currentViewerItem.url" class="w-full h-full object-contain" />
          <VideoPlayer v-else-if="store.currentViewerItem?.type === 'video'" :src="store.currentViewerItem.url" />
        </div>
      </transition>
    </main>

    <!-- Footer -->
    <transition name="fade">
      <footer v-if="areControlsVisible && isImage" class="absolute bottom-0 left-0 right-0 z-20 bg-white/80 dark:bg-black/80 backdrop-blur-md pb-8">
        <!-- Thumbnail Strip -->
        <div ref="thumbnailContainerRef" class="flex space-x-1 overflow-x-auto no-scrollbar px-2 py-4">
          <div
            v-for="(item, index) in store.viewerItems"
            :key="item.id"
            :ref="el => { if (el) thumbnailRefs[index] = el as HTMLElement }"
            @click.stop="store.goToMediaAtIndex(index)"
            class="relative h-14 w-14 flex-shrink-0 cursor-pointer"
          >
            <img
              :src="item.type === 'image' ? item.url : ''"
              v-if="item.type === 'image'"
              class="h-full w-full object-cover rounded-md border-2 transition-all"
              :class="index === store.viewerCurrentIndex ? 'border-blue-500' : 'border-transparent opacity-60'"
            />
             <video 
              v-if="item.type === 'video'"
              :src="item.url"
              class="h-full w-full object-cover rounded-md border-2 transition-all"
              :class="index === store.viewerCurrentIndex ? 'border-blue-500' : 'border-transparent opacity-60'"
            ></video>
            <!-- Video overlay -->
            <div v-if="item.type === 'video'" class="absolute inset-0 bg-black/30 rounded-md flex items-center justify-center">
                <Play class="w-5 h-5 text-white" fill="currentColor" />
            </div>
          </div>
        </div>
        <!-- Action Buttons -->
        <div class="flex justify-between items-center px-6">
          <button @click.stop="handleAction('share')" class="p-2 text-blue-500"><Share2 class="w-6 h-6" /></button>
          <button @click.stop="handleToggleFavorite" class="p-2 text-blue-500">
            <Heart class="w-6 h-6" :fill="store.currentViewerItem?.isFavorite ? 'currentColor' : 'none'" />
          </button>
        </div>
      </footer>
    </transition>
  </div>
</template>

<style scoped>
.slide-next-enter-active,
.slide-next-leave-active,
.slide-prev-enter-active,
.slide-prev-leave-active {
  transition: transform 0.3s ease-in-out;
}
.slide-next-enter-from { transform: translateX(100%); }
.slide-next-leave-to { transform: translateX(-100%); }
.slide-prev-enter-from { transform: translateX(-100%); }
.slide-prev-leave-to { transform: translateX(100%); }

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
