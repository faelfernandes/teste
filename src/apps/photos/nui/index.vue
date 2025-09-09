<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import BottomTabBar from './components/BottomTabBar.vue';

const route = useRoute();

const showBottomBar = computed(() => {
  const visibleRoutes = ['photos-gallery', 'photos-albums'];
  return visibleRoutes.includes(route.name as string);
});
</script>

<template>
  <div class="h-full w-full bg-gray-100 dark:bg-ios-dark-bg flex flex-col font-sans">
    <main class="flex-1 overflow-y-auto no-scrollbar">
      <router-view v-slot="{ Component, route }">
        <transition :name="route.meta.transition || 'fade'" mode="out-in">
          <div :key="route.path" class="h-full w-full">
            <component :is="Component" v-if="Component" />
          </div>
        </transition>
      </router-view>
    </main>
    <footer v-if="showBottomBar" class="sticky bottom-0 z-10">
      <BottomTabBar />
    </footer>
  </div>
</template>
