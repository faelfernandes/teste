<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSystemStore } from '@core/nui/store/system'
import { useLayoutStore } from '@core/nui/store/layout'
import { useSettingsStore } from '@apps/settings/nui/store/app-store'
import { useClockStore } from '@apps/clock/nui/store/app-store'
import { useMailUiStore } from '@apps/mail/nui/store/uiStore'
import { getAppById } from '@core/nui/services/appManager'
import StatusBar from '@core/nui/components/StatusBar.vue'
import LockScreen from '@core/nui/components/LockScreen.vue'
import HomeScreen from '@core/nui/components/HomeScreen.vue'
import PhoneFrame from '@core/nui/components/PhoneFrame.vue'
import NavigationBar from '@core/nui/components/NavigationBar.vue'
import Modal from '@core/nui/components/Modal.vue'
import ActionSheet from '@core/nui/components/ActionSheet.vue'
import BottomSheet from '@core/nui/components/BottomSheet.vue'
import TimerFinishedAlert from '@apps/clock/nui/components/TimerFinishedAlert.vue'
import AlarmFinishedAlert from '@apps/clock/nui/components/AlarmFinishedAlert.vue'
import NewMessageModal from '@apps/mail/nui/components/NewMessageModal.vue'
import { Music } from 'lucide-vue-next'

const route = useRoute()
const systemStore = useSystemStore()
const layoutStore = useLayoutStore()
const settingsStore = useSettingsStore()
const clockStore = useClockStore()
const mailUiStore = useMailUiStore()

const isScreenOn = ref(true)
const showDynamicIsland = ref(false)
const isIslandExpanded = ref(false)

const wallpaperUrl = computed(() => systemStore.currentWallpaper.url)

const currentTime = computed(() => {
  const now = new Date()
  return now.toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  })
})

const phoneContainerRef = ref<HTMLElement | null>(null)

watch(() => settingsStore.theme, (newTheme) => {
  if (phoneContainerRef.value) {
    if (newTheme === 'dark') {
      phoneContainerRef.value.classList.add('dark')
    } else {
      phoneContainerRef.value.classList.remove('dark')
    }
  }
}, { immediate: true })

watch(() => settingsStore.phoneScale, (newScale) => {
  if (phoneContainerRef.value) {
    phoneContainerRef.value.style.setProperty('--phone-scale', (newScale / 100).toString());
  }
}, { immediate: true });

const screenStyle = computed(() => ({
  filter: `brightness(${systemStore.screenBrightness})`
}));

const mainContainerClasses = computed(() => {
  const classes = ['h-full', 'w-full'];
  if (systemStore.isLocked || route.name === 'home' || !route.name) {
    classes.push('bg-transparent');
    return classes;
  }

  if (layoutStore.statusBarMode === 'default') {
    classes.push('bg-gray-100 dark:bg-ios-dark-bg');
  } else {
    classes.push('bg-transparent');
  }
  return classes;
});

const mainContentClasses = computed(() => {
  const classes = ['h-full', 'w-full', 'overflow-hidden'];
  if (systemStore.isLocked) return classes;
  return classes;
});

const handlePowerButton = () => {
  isScreenOn.value = !isScreenOn.value
  if (!isScreenOn.value) {
    systemStore.lockDevice()
  }
}

const handleUnlock = () => {
  if (systemStore.isLocked) {
    systemStore.unlockDevice()
  }
}

const toggleIsland = () => {
  isIslandExpanded.value = !isIslandExpanded.value
}

watch(route, (newRoute) => {
  const routeMetaAppId = newRoute.meta.appId as string | undefined;
  const appConfig = getAppById(routeMetaAppId || newRoute.name as string);
  layoutStore.setLayoutConfig(appConfig || null);
}, { immediate: true });


onMounted(() => {
  setTimeout(() => {
    showDynamicIsland.value = true
  }, 1000)
  
  if (phoneContainerRef.value) {
    if (settingsStore.theme === 'dark') {
      phoneContainerRef.value.classList.add('dark')
    } else {
      phoneContainerRef.value.classList.remove('dark')
    }
    phoneContainerRef.value.style.setProperty('--phone-scale', (settingsStore.phoneScale / 100).toString());
  }
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-zinc-800">
    <div ref="phoneContainerRef" class="phone-container relative w-[375px] h-[812px]">
      <PhoneFrame
        @power="handlePowerButton"
        @volume-up="systemStore.adjustVolume(10)"
        @volume-down="systemStore.adjustVolume(-10)"
        @silent-switch="systemStore.toggleSilentMode()"
      >
        <div 
          class="w-full h-full bg-cover bg-center flex flex-col transition-all duration-300 relative"
          :style="[{ backgroundImage: `url(${wallpaperUrl})` }, screenStyle]"
          :class="{ 'opacity-0': !isScreenOn }"
        >
          <div class="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-indigo-800/70 to-black/50"></div>
          
          <!-- App Content & Wallpaper -->
          <main 
            v-if="isScreenOn" 
            class="absolute inset-0 h-full w-full overflow-hidden z-10"
          >
            <LockScreen 
              v-if="systemStore.isLocked" 
              @unlock="handleUnlock"
              :time="currentTime"
            />
            <div v-else :class="mainContainerClasses">
              <router-view v-slot="{ Component, route }">
                <transition
                  :name="route.meta.transition || 'fade'"
                  mode="out-in"
                >
                  <div :key="route.name" :class="mainContentClasses">
                    <component 
                      :is="Component" 
                      v-if="Component" 
                    />
                    <HomeScreen v-else class="h-full w-full"/>
                  </div>
                </transition>
              </router-view>
            </div>
          </main>

          <!-- Dynamic Island -->
          <div 
            v-if="isScreenOn && showDynamicIsland"
            @click="toggleIsland"
            class="absolute top-3 left-1/2 -translate-x-1/2 z-20 transition-all duration-500 ease-[cubic-bezier(0.3,1.2,0.5,1.2)]"
            :class="isIslandExpanded ? 'w-[90%]' : 'w-[120px]'"
          >
            <div 
              class="bg-black rounded-full flex items-center cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.3,1.2,0.5,1.2)] shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),0_2px_8px_rgba(0,0,0,0.6)] hover:bg-zinc-900"
              :class="isIslandExpanded ? 'h-[80px] p-4' : 'h-[30px]'"
            >
              <!-- Collapsed View -->
              <div v-if="!isIslandExpanded" class="flex items-center justify-end w-full px-2 transition-opacity duration-200">
                <div class="w-3 h-3 rounded-full bg-blue-900/50 relative overflow-hidden">
                  <div class="absolute inset-0 bg-gradient-radial from-blue-400/50 to-transparent to-70%"></div>
                  <div class="absolute top-1/3 left-1/3 w-px h-px bg-blue-200/80 rounded-full"></div>
                </div>
              </div>
              <!-- Expanded View -->
              <div v-else class="text-white w-full flex items-center justify-between animate-fade-in opacity-0" style="animation-delay: 200ms; animation-fill-mode: forwards;">
                <div class="flex items-center space-x-3 overflow-hidden">
                  <div class="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Music class="w-6 h-6" />
                  </div>
                  <div class="truncate">
                    <p class="text-sm font-semibold truncate">Song Title Placeholder</p>
                    <p class="text-xs text-gray-400 truncate">Artist Name</p>
                  </div>
                </div>
                <div class="flex items-center space-x-2 flex-shrink-0">
                  <div class="w-10 h-6 flex items-center justify-between">
                    <span class="w-1 h-2 bg-gray-400 rounded-full animate-pulse" style="animation-delay: 0s"></span>
                    <span class="w-1 h-4 bg-gray-400 rounded-full animate-pulse" style="animation-delay: 0.2s"></span>
                    <span class="w-1 h-5 bg-gray-400 rounded-full animate-pulse" style="animation-delay: 0.4s"></span>
                    <span class="w-1 h-3 bg-gray-400 rounded-full animate-pulse" style="animation-delay: 0.6s"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Global Overlays -->
          <div class="absolute inset-0 z-30 pointer-events-none">
            <TimerFinishedAlert 
              v-if="clockStore.isTimerFinished"
              @stop="clockStore.handleStopFinishedTimer"
              @restart="clockStore.handleRestartFinishedTimer"
              class="pointer-events-auto"
            />
            <AlarmFinishedAlert 
              v-if="clockStore.ringingAlarm"
              :alarm="clockStore.ringingAlarm"
              @stop="clockStore.stopRingingAlarm"
              @snooze="clockStore.snoozeAlarm"
              class="pointer-events-auto"
            />
            <NewMessageModal v-if="mailUiStore.isNewMessageModalVisible" class="pointer-events-auto" />
            <Modal class="pointer-events-auto" />
            <ActionSheet class="pointer-events-auto" />
            <BottomSheet class="pointer-events-auto" />
          </div>
          
          <!-- Top UI Elements -->
          <StatusBar 
            v-if="isScreenOn && layoutStore.statusBarMode !== 'fullscreen'" 
            :time="currentTime"
            class="absolute top-0 left-0 right-0 z-50"
          />
          <NavigationBar v-if="isScreenOn && !systemStore.isLocked" class="z-40"/>
        </div>
      </PhoneFrame>
    </div>
  </div>
</template>

<style>
.phone-container {
  transform: scale(var(--phone-scale, 1));
  transition: transform 0.3s ease;
}

.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.slide-right-enter-from {
  transform: translateX(-100%);
}
.slide-right-leave-to {
  transform: translateX(100%);
}

.slide-left-enter-from {
  transform: translateX(100%);
}
.slide-left-leave-to {
  transform: translateX(-100%);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
