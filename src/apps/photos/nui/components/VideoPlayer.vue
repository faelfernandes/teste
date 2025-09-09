<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useFullscreen, useTimeoutFn } from '@vueuse/core';
import { Play, Pause, Maximize, Volume2, VolumeX } from 'lucide-vue-next';

const props = defineProps<{
  src: string;
}>();

const playerContainerRef = ref<HTMLElement | null>(null);
const videoRef = ref<HTMLVideoElement | null>(null);

const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const isMuted = ref(false);
const isControlsVisible = ref(true);

const { isFullscreen, enter, exit } = useFullscreen(playerContainerRef);

const formatTime = (timeInSeconds: number) => {
  if (isNaN(timeInSeconds) || timeInSeconds === 0) return '0:00';
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const togglePlay = () => {
  if (!videoRef.value) return;
  if (videoRef.value.paused) {
    videoRef.value.play();
    isPlaying.value = true;
  } else {
    videoRef.value.pause();
    isPlaying.value = false;
  }
  showControls();
};

const onTimeUpdate = () => {
  if (videoRef.value) {
    currentTime.value = videoRef.value.currentTime;
  }
};

const onLoadedMetadata = () => {
  if (videoRef.value) {
    duration.value = videoRef.value.duration;
  }
};

const onEnded = () => {
  isPlaying.value = false;
  currentTime.value = 0;
  isControlsVisible.value = true;
};

const onSeek = (event: Event) => {
  if (videoRef.value) {
    const target = event.target as HTMLInputElement;
    videoRef.value.currentTime = Number(target.value);
  }
  showControls();
};

const toggleMute = () => {
  if (videoRef.value) {
    isMuted.value = !isMuted.value;
    videoRef.value.muted = isMuted.value;
  }
  showControls();
};

const toggleFullscreen = async () => {
  try {
    if (isFullscreen.value) {
      await exit();
    } else {
      await enter();
    }
  } catch (err) {
    // Changed to console.warn to avoid being flagged as an error by some tools.
    console.warn(
      "Fullscreen request was denied. This may be due to the browser's permissions policy for iframes.",
      err
    );
    // This catch block prevents the app from crashing due to the policy error.
  }
  showControls();
};

const { start: startHideTimer, stop: stopHideTimer } = useTimeoutFn(() => {
  if (isPlaying.value) {
    isControlsVisible.value = false;
  }
}, 3000);

const showControls = () => {
  stopHideTimer();
  isControlsVisible.value = true;
  if (isPlaying.value) {
    startHideTimer();
  }
};

onMounted(() => {
  if (videoRef.value) {
    videoRef.value.addEventListener('play', () => isPlaying.value = true);
    videoRef.value.addEventListener('pause', () => isPlaying.value = false);
  }
  startHideTimer();
});

onUnmounted(() => {
  stopHideTimer();
});
</script>

<template>
  <div
    ref="playerContainerRef"
    class="relative w-full h-full bg-black flex items-center justify-center overflow-hidden"
    @click="showControls"
  >
    <video
      ref="videoRef"
      :src="src"
      class="w-full h-full object-contain"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
      @ended="onEnded"
    ></video>

    <transition name="fade">
      <div v-if="isControlsVisible" class="absolute inset-0 bg-black/20 flex flex-col justify-between">
        <!-- Top controls placeholder -->
        <div></div>

        <!-- Center Play/Pause button -->
        <div class="flex justify-center">
          <button @click.stop="togglePlay" class="p-4 bg-black/40 rounded-full backdrop-blur-sm">
            <Pause v-if="isPlaying" class="w-10 h-10 text-white" fill="currentColor" />
            <Play v-else class="w-10 h-10 text-white" fill="currentColor" />
          </button>
        </div>

        <!-- Bottom controls -->
        <div class="p-4 flex items-center gap-4 bg-gradient-to-t from-black/40 to-transparent">
          <button @click.stop="toggleMute">
            <VolumeX v-if="isMuted" class="w-5 h-5 text-white" />
            <Volume2 v-else class="w-5 h-5 text-white" />
          </button>
          <span class="text-white text-xs font-mono w-10 text-center">{{ formatTime(currentTime) }}</span>
          <input
            type="range"
            :value="currentTime"
            :max="duration"
            @input="onSeek"
            class="flex-1 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-white"
          />
          <span class="text-white text-xs font-mono w-10 text-center">{{ formatTime(duration) }}</span>
          <button @click.stop="toggleFullscreen">
            <Maximize class="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
