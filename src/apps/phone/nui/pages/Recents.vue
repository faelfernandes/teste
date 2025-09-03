<script setup lang="ts">
import { usePhoneStore } from '../store/app-store';
import PageLayout from '@core/nui/components/PageLayout.vue';
import RecentCallItem from '../components/RecentCallItem.vue';

const phoneStore = usePhoneStore();
</script>

<template>
  <PageLayout page-title="Recents">
    <template #header-actions>
      <button @click="phoneStore.isEditingRecents = !phoneStore.isEditingRecents" class="text-blue-500 text-lg px-2">
        {{ phoneStore.isEditingRecents ? 'Done' : 'Edit' }}
      </button>
    </template>

    <div class="px-4 -mt-2 space-y-4">
      <!-- Filter Tabs -->
      <div class="flex justify-center">
        <div class="flex space-x-1 bg-gray-200 dark:bg-ios-dark-card p-1 rounded-lg">
          <button 
            @click="phoneStore.recentsFilter = 'all'"
            class="px-8 py-1 text-sm font-semibold rounded-md transition-colors"
            :class="phoneStore.recentsFilter === 'all' ? 'bg-white dark:bg-gray-500 text-black dark:text-white shadow' : 'text-gray-600 dark:text-gray-400'"
          >
            All
          </button>
          <button 
            @click="phoneStore.recentsFilter = 'missed'"
            class="px-8 py-1 text-sm font-semibold rounded-md transition-colors"
            :class="phoneStore.recentsFilter === 'missed' ? 'bg-white dark:bg-gray-500 text-black dark:text-white shadow' : 'text-gray-600 dark:text-gray-400'"
          >
            Missed
          </button>
        </div>
      </div>

      <!-- Recents List -->
      <div class="bg-white dark:bg-ios-dark-card rounded-xl">
        <RecentCallItem
          v-for="(call, index) in phoneStore.filteredRecents"
          :key="call.id"
          :call="call"
          :is-last="index === phoneStore.filteredRecents.length - 1"
        />
        <div v-if="phoneStore.filteredRecents.length === 0" class="p-4 text-center text-gray-500">
          No {{ phoneStore.recentsFilter === 'missed' ? 'missed' : '' }} calls.
        </div>
      </div>
    </div>
  </PageLayout>
</template>
