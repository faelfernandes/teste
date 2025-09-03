<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePhoneStore } from '../store/app-store';
import PageLayout from '@core/nui/components/PageLayout.vue';
import { MessageSquare, Phone, Video, Upload } from 'lucide-vue-next';

const props = defineProps<{
  contactId: string;
}>();

const router = useRouter();
const phoneStore = usePhoneStore();

const contact = computed(() => {
  return phoneStore.getContactById(Number(props.contactId));
});

const isCurrentContactFavorite = computed(() => {
  if (!contact.value) return false;
  return phoneStore.isFavorite(contact.value.id);
});

const handleAction = (action: string) => {
  alert(`${action} action for ${contact.value?.name}`);
};

const toggleFavorite = () => {
  if (!contact.value) return;
  if (isCurrentContactFavorite.value) {
    phoneStore.removeFavorite(contact.value.id);
  } else {
    phoneStore.addFavorite(contact.value.id);
  }
};

const goToEdit = () => {
  router.push(`/app/phone/contacts/${props.contactId}/edit`);
};
</script>

<template>
  <PageLayout v-if="contact" page-title="" previous-title="Contacts">
    <template #header-actions>
      <button @click="goToEdit" class="text-blue-500 text-lg px-2">
        Edit
      </button>
    </template>
    
    <div class="flex flex-col items-center p-4 space-y-6">
      <!-- Avatar and Name -->
      <div class="flex flex-col items-center space-y-3 mt-8">
        <div class="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <span class="text-6xl font-light text-gray-500 dark:text-gray-400">
            {{ phoneStore.getInitials(contact.name) }}
          </span>
        </div>
        <h2 class="text-3xl text-black dark:text-white">{{ contact.name }}</h2>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-4 gap-4 w-full max-w-sm">
        <button @click="handleAction('message')" class="flex flex-col items-center space-y-1 text-blue-500">
          <div class="w-16 h-16 bg-white dark:bg-ios-dark-card rounded-xl flex items-center justify-center shadow-sm">
            <MessageSquare class="w-8 h-8" />
          </div>
          <span class="text-xs">message</span>
        </button>
        <button @click="handleAction('call')" class="flex flex-col items-center space-y-1 text-blue-500">
          <div class="w-16 h-16 bg-white dark:bg-ios-dark-card rounded-xl flex items-center justify-center shadow-sm">
            <Phone class="w-8 h-8" />
          </div>
          <span class="text-xs">call</span>
        </button>
        <button @click="handleAction('video')" class="flex flex-col items-center space-y-1 text-blue-500">
          <div class="w-16 h-16 bg-white dark:bg-ios-dark-card rounded-xl flex items-center justify-center shadow-sm">
            <Video class="w-8 h-8" />
          </div>
          <span class="text-xs">video</span>
        </button>
        <button @click="handleAction('share')" class="flex flex-col items-center space-y-1 text-blue-500">
          <div class="w-16 h-16 bg-white dark:bg-ios-dark-card rounded-xl flex items-center justify-center shadow-sm">
            <Upload class="w-8 h-8" />
          </div>
          <span class="text-xs">share</span>
        </button>
      </div>

      <!-- Contact Info -->
      <div class="w-full space-y-4">
        <div class="bg-white dark:bg-ios-dark-card rounded-xl p-3">
          <p class="text-sm text-gray-500 dark:text-gray-400">phone</p>
          <p class="text-blue-500 text-base">{{ contact.phone }}</p>
        </div>
        <div v-if="contact.email || contact.address" class="bg-white dark:bg-ios-dark-card rounded-xl p-3">
          <div v-if="contact.email">
            <p class="text-sm text-gray-500 dark:text-gray-400">email</p>
            <p class="text-blue-500 text-base">{{ contact.email }}</p>
          </div>
          <div v-if="contact.email && contact.address" class="border-t border-gray-200 dark:border-gray-700/60 my-2"></div>
          <div v-if="contact.address">
            <p class="text-sm text-gray-500 dark:text-gray-400">address</p>
            <p class="text-blue-500 text-base">{{ contact.address }}</p>
          </div>
        </div>
        <div class="bg-white dark:bg-ios-dark-card rounded-xl">
          <button @click="handleAction('share location')" class="w-full text-left p-3 text-blue-500 border-b border-gray-200 dark:border-gray-700/60">Share my Location</button>
          <button @click="toggleFavorite" class="w-full text-left p-3 border-b border-gray-200 dark:border-gray-700/60" :class="isCurrentContactFavorite ? 'text-red-500' : 'text-blue-500'">
            {{ isCurrentContactFavorite ? 'Remove from Favorites' : 'Add to Favorites' }}
          </button>
          <button @click="handleAction('block')" class="w-full text-left p-3 text-red-500">Block this Caller</button>
        </div>
      </div>
    </div>
  </PageLayout>
  <div v-else class="h-full flex items-center justify-center text-gray-500">
    Contact not found.
  </div>
</template>
