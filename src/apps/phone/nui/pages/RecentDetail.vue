<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePhoneStore } from '../store/app-store';
import PageLayout from '@core/nui/components/PageLayout.vue';
import { User, MessageSquare, Phone, Video, Upload } from 'lucide-vue-next';

const props = defineProps<{
  callId: string;
}>();

const router = useRouter();
const phoneStore = usePhoneStore();

const callDetail = computed(() => {
  return phoneStore.getRecentCallById(Number(props.callId));
});

const callHistory = computed(() => {
    if (!callDetail.value) return [];
    // In a real scenario, you'd filter by phone number. Here we filter by name as it holds the number for unknown contacts.
    return phoneStore.getCallHistoryByNumber(callDetail.value.name);
});

const handleAction = (action: string) => {
  if (action === 'add to contacts') {
    if (callDetail.value) {
      // The phone number is stored in the `name` property for unknown contacts.
      // We clean it and store it in the `dialedNumber` state to pre-fill the new contact form.
      const numberToSave = callDetail.value.name;
      phoneStore.dialedNumber = numberToSave.replace(/\D/g, '');
      router.push({ name: 'phone-new-contact' });
    }
  } else {
    alert(`${action} action triggered for ${callDetail.value?.name}`);
  }
};
</script>

<template>
  <PageLayout v-if="callDetail" page-title="" previous-title="Recents">
    <div class="flex flex-col items-center p-4 space-y-6">
      <!-- Avatar and Number -->
      <div class="flex flex-col items-center space-y-3 mt-8">
        <div class="w-28 h-28 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <User class="w-16 h-16 text-gray-400 dark:text-gray-500" />
        </div>
        <h2 class="text-2xl text-black dark:text-white">{{ callDetail.name }}</h2>
      </div>

      <!-- Action Buttons -->
      <div class="grid grid-cols-4 gap-4 w-full max-w-sm">
        <button @click="handleAction('message')" class="flex flex-col items-center space-y-1 text-blue-500">
          <div class="w-full h-10 bg-white dark:bg-ios-dark-card rounded-lg flex items-center justify-center shadow-sm">
            <MessageSquare class="w-6 h-6" />
          </div>
          <span class="text-xs">message</span>
        </button>
        <button @click="handleAction('call')" class="flex flex-col items-center space-y-1 text-blue-500">
          <div class="w-full h-10 bg-white dark:bg-ios-dark-card rounded-lg flex items-center justify-center shadow-sm">
            <Phone class="w-6 h-6" />
          </div>
          <span class="text-xs">call</span>
        </button>
        <button @click="handleAction('video')" class="flex flex-col items-center space-y-1 text-blue-500">
          <div class="w-full h-10 bg-white dark:bg-ios-dark-card rounded-lg flex items-center justify-center shadow-sm">
            <Video class="w-6 h-6" />
          </div>
          <span class="text-xs">video</span>
        </button>
        <button @click="handleAction('share')" class="flex flex-col items-center space-y-1 text-blue-500">
          <div class="w-full h-10 bg-white dark:bg-ios-dark-card rounded-lg flex items-center justify-center shadow-sm">
            <Upload class="w-6 h-6" />
          </div>
          <span class="text-xs">share</span>
        </button>
      </div>

      <!-- Call History -->
      <div class="w-full bg-white dark:bg-ios-dark-card rounded-xl p-4 text-sm">
        <p class="text-gray-600 dark:text-gray-300 font-semibold mb-2">30 de ago. de 2025</p>
        <div 
            v-for="(call, index) in callHistory" 
            :key="call.id" 
            class="flex justify-between py-1"
            :class="{'border-t border-gray-200 dark:border-gray-700/60': index > 0}"
        >
          <span class="text-gray-500 dark:text-gray-400 capitalize">{{ call.type }} Call</span>
          <span class="text-gray-600 dark:text-gray-300">{{ call.time }}</span>
        </div>
      </div>

      <!-- Phone Number -->
      <div class="w-full bg-white dark:bg-ios-dark-card rounded-xl p-4">
        <p class="text-gray-500 dark:text-gray-400 text-sm">phone</p>
        <p class="text-blue-500 text-base">{{ callDetail.name }}</p>
      </div>

      <!-- Add to Contacts -->
      <div class="w-full bg-white dark:bg-ios-dark-card rounded-xl p-4">
        <button @click="handleAction('add to contacts')" class="text-blue-500 w-full text-left">Add to Contacts</button>
      </div>
    </div>
  </PageLayout>
  <div v-else class="h-full flex items-center justify-center text-gray-500">
    Call details not found.
  </div>
</template>
