<script setup lang="ts">
import type { Album } from '../store/app-store';
import { Heart, Minus } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const props = defineProps<{
  album: Album;
  isEditing: boolean;
}>();

const emit = defineEmits(['delete']);
const router = useRouter();

const handleDelete = () => {
  emit('delete', props.album.id);
};

const openAlbum = () => {
  if (!props.isEditing) {
    router.push(`/app/photos/albums/${props.album.id}`);
  }
};
</script>

<template>
  <div @click="openAlbum" class="space-y-1 group relative">
    <!-- Delete Button -->
    <transition name="fade-scale">
      <button
        v-if="isEditing && album.isDeletable"
        @click.stop="handleDelete"
        class="absolute -top-1.5 -left-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center z-10 shadow-md border-2 border-white dark:border-ios-dark-bg"
      >
        <Minus class="w-4 h-4" />
      </button>
    </transition>

    <div
      class="cursor-pointer"
      :class="{ 'animate-wiggle': isEditing && album.isDeletable }"
    >
      <div class="relative aspect-square rounded-lg overflow-hidden shadow-sm">
        <img :src="album.thumbnailUrl" :alt="album.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div v-if="album.isFavorite" class="absolute bottom-1.5 left-1.5">
          <Heart class="w-4 h-4 text-white" fill="currentColor" />
        </div>
      </div>
      <div>
        <p class="text-sm font-medium text-black dark:text-white truncate">{{ album.name }}</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ album.count }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes wiggle {
  0% { transform: rotate(-1deg); }
  25% { transform: rotate(1deg); }
  50% { transform: rotate(-1deg); }
  75% { transform: rotate(1deg); }
  100% { transform: rotate(-1deg); }
}

.animate-wiggle {
  animation: wiggle 0.5s infinite ease-in-out;
}

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
