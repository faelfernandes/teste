<script setup lang="ts">
import { useCameraStore } from './store/app-store';
import { ZapOff, LayoutGrid, RefreshCw } from 'lucide-vue-next';

const cameraStore = useCameraStore();
</script>

<template>
  <div class="h-full w-full bg-black text-white flex flex-col font-sans">
    <!-- Header Controls -->
    <header class="absolute top-0 left-0 right-0 z-20 pt-12 px-6 flex items-center h-24">
      <div class="w-1/3 flex justify-start">
        <button class="w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <ZapOff class="w-5 h-5" />
        </button>
      </div>
      <div class="w-1/3 flex justify-center">
        <div v-if="cameraStore.activeMode === 'VIDEO'" class="text-white font-mono text-sm [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">
          {{ cameraStore.formattedRecordingTime }}
        </div>
      </div>
      <div class="w-1/3 flex justify-end">
        <button class="w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <LayoutGrid class="w-5 h-5" />
        </button>
      </div>
    </header>

    <!-- Viewfinder -->
    <main class="flex-1 flex flex-col justify-end items-center relative">
      <div class="absolute inset-0 bg-red-600">
        <!-- This div represents the camera's live view. -->
        <!-- In a real app, this would be a <video> element. -->
      </div>
      
      <!-- Zoom Controls -->
      <div class="relative z-10 mb-6">
        <div class="flex items-center space-x-2 bg-black/50 backdrop-blur-md p-1 rounded-full">
          <button
            v-for="zoom in cameraStore.zoomLevels"
            :key="zoom"
            @click="cameraStore.setZoom(zoom)"
            class="w-10 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200"
            :class="cameraStore.activeZoom === zoom ? 'bg-yellow-400 text-black' : 'text-white'"
          >
            <span v-if="zoom % 1 === 0">{{ zoom }}</span>
            <span v-else>{{ zoom.toFixed(1) }}</span>
          </button>
        </div>
      </div>
    </main>

    <!-- Footer Controls -->
    <footer class="relative z-10 pb-12 pt-4 bg-black">
      <!-- Mode Selector -->
      <div class="flex justify-center items-center space-x-6 mb-6">
        <button
          v-for="mode in cameraStore.modes"
          :key="mode"
          @click="cameraStore.setMode(mode)"
          class="text-sm font-semibold transition-colors"
          :class="cameraStore.activeMode === mode ? 'text-yellow-400' : 'text-gray-400'"
        >
          {{ mode }}
        </button>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-around items-center px-6">
        <div class="w-16 h-16 flex items-center justify-center">
          <div class="w-12 h-12 rounded-lg overflow-hidden border-2 border-white/30">
            <img :src="cameraStore.lastPhotoThumbnail" alt="Last photo" class="w-full h-full object-cover">
          </div>
        </div>

        <!-- Main Action Button -->
        <button 
          @click="() => cameraStore.handleMainAction()" 
          class="w-20 h-20 rounded-full p-1.5 flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          :class="{ 'bg-white': cameraStore.activeMode !== 'VIDEO' || cameraStore.isRecording }"
        >
          <!-- Photo shutter -->
          <div v-if="cameraStore.activeMode !== 'VIDEO'" class="w-full h-full rounded-full border-2 border-black"></div>
          
          <!-- Video record button -->
          <template v-else>
            <div v-if="!cameraStore.isRecording" class="w-full h-full bg-red-500 rounded-full"></div>
            <div v-else class="w-8 h-8 bg-red-500 rounded-lg transition-all duration-200"></div>
          </template>
        </button>

        <button @click="cameraStore.switchCamera()" class="w-16 h-16 flex items-center justify-center">
          <div class="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
            <RefreshCw class="w-7 h-7" />
          </div>
        </button>
      </div>
    </footer>
  </div>
</template>
