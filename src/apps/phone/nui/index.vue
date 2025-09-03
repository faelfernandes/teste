<script setup lang="ts">
import BottomTabBar from './components/BottomTabBar.vue';
</script>

<template>
  <div class="h-full w-full bg-gray-100 dark:bg-ios-dark-bg flex flex-col font-sans">
    <main class="flex-1 overflow-y-auto no-scrollbar">
      <router-view />
    </main>
    <footer class="sticky bottom-0 z-10">
      <BottomTabBar />
    </footer>
  </div>
</template>
