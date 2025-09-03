<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useMessagesUiStore } from './store/uiStore';
import BottomNavBar from './components/BottomNavBar.vue';
import ChatSelectionFooter from './components/ChatSelectionFooter.vue';

const route = useRoute();
const uiStore = useMessagesUiStore();

const showBottomNav = computed(() => {
  if (uiStore.isSelectionMode) return false;
  return route.meta.showBottomNav !== false;
});

const showSelectionFooter = computed(() => {
    return uiStore.isSelectionMode && route.name === 'messages-list';
});


const handleArchive = () => {
  alert(`Arquivando ${uiStore.selectedCount} conversas.`);
  uiStore.toggleSelectionMode();
};

const handleRead = () => {
  alert(`Marcando ${uiStore.selectedCount} conversas como lidas.`);
  uiStore.toggleSelectionMode();
};

const handleDelete = () => {
  alert(`Apagando ${uiStore.selectedCount} conversas.`);
  uiStore.toggleSelectionMode();
};
</script>

<template>
  <div class="h-full w-full flex flex-col bg-white">
    <main class="flex-1 overflow-hidden">
      <router-view v-slot="{ Component, route }">
        <transition :name="route.meta.transition || 'fade'" mode="out-in">
          <div :key="route.path" class="h-full w-full">
            <component :is="Component" v-if="Component" />
          </div>
        </transition>
      </router-view>
    </main>
    
    <footer class="sticky bottom-0 z-30">
      <ChatSelectionFooter
        v-if="showSelectionFooter"
        :disabled="!uiStore.isAnythingSelected"
        @archive="handleArchive"
        @read="handleRead"
        @delete="handleDelete"
      />
      <BottomNavBar v-if="showBottomNav" />
    </footer>
  </div>
</template>
