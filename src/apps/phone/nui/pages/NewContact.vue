<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePhoneStore } from '../store/app-store';
import { User } from 'lucide-vue-next';

const router = useRouter();
const phoneStore = usePhoneStore();

const firstName = ref('');
const lastName = ref('');
const phoneNumber = ref('');

// Pre-fill phone number on component mount
onMounted(() => {
  if (phoneStore.dialedNumber) {
    phoneNumber.value = phoneStore.dialedNumber;
    // Clear the store's dialed number so it's not reused
    phoneStore.clearDialedNumber();
  }
});

const isDoneEnabled = computed(() => {
  return (firstName.value.trim() !== '' || lastName.value.trim() !== '') && phoneNumber.value.trim().length > 0;
});

const goBack = () => {
  router.back();
};

const saveContact = () => {
  if (!isDoneEnabled.value) return;

  phoneStore.addContact({
    firstName: firstName.value,
    lastName: lastName.value,
    phone: phoneNumber.value,
  });
  router.push({ name: 'phone-contacts' });
};
</script>

<template>
  <div class="h-full w-full bg-gray-100 dark:bg-ios-dark-bg flex flex-col font-sans text-black dark:text-white">
    <!-- Header -->
    <header class="sticky top-0 z-20 pt-10 bg-gray-100/80 dark:bg-ios-dark-bg/80 backdrop-blur-md">
      <div class="w-full flex items-center justify-between px-4 pb-2 relative h-11">
        <button @click="goBack" class="text-lg text-blue-500">Cancel</button>
        <button 
          @click="saveContact" 
          class="text-lg"
          :class="isDoneEnabled ? 'text-blue-500 font-semibold' : 'text-gray-400 dark:text-gray-600'"
          :disabled="!isDoneEnabled"
        >
          Done
        </button>
      </div>
    </header>

    <!-- Form Content -->
    <main class="flex-1 overflow-y-auto pt-8">
      <div class="flex flex-col items-center space-y-4">
        <!-- Avatar -->
        <div class="flex flex-col items-center space-y-2">
          <div class="w-36 h-36 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
            <User class="w-20 h-20 text-gray-500 dark:text-gray-500" />
          </div>
          <button class="text-blue-500 text-lg">Add Photo</button>
        </div>

        <!-- Name and Phone Inputs -->
        <div class="w-full px-4">
          <div class="bg-white dark:bg-ios-dark-card rounded-xl">
            <div class="border-b border-gray-200 dark:border-gray-700/60">
              <input 
                v-model="firstName"
                type="text" 
                placeholder="First Name"
                class="w-full bg-transparent p-3 text-lg outline-none"
              />
            </div>
            <div>
              <input 
                v-model="lastName"
                type="text" 
                placeholder="Last Name"
                class="w-full bg-transparent p-3 text-lg outline-none"
              />
            </div>
          </div>

          <div class="bg-white dark:bg-ios-dark-card rounded-xl mt-4">
            <input 
              v-model="phoneNumber"
              type="tel" 
              placeholder="Phone Number"
              class="w-full bg-transparent p-3 text-lg outline-none"
            />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
