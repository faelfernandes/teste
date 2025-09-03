<script setup lang="ts">
import { useRouter } from 'vue-router';
import { usePhoneStore } from '../store/app-store';
import DialButton from '../components/DialButton.vue';
import { Plus, Phone, Delete } from 'lucide-vue-next';

const phoneStore = usePhoneStore();
const router = useRouter();

const keypad = [
  { main: '1', sub: '' },
  { main: '2', sub: 'ABC' },
  { main: '3', sub: 'DEF' },
  { main: '4', sub: 'GHI' },
  { main: '5', sub: 'JKL' },
  { main: '6', sub: 'MNO' },
  { main: '7', sub: 'PQRS' },
  { main: '8', sub: 'TUV' },
  { main: '9', sub: 'WXYZ' },
  { main: '*', sub: '' },
  { main: '0', sub: '+' },
  { main: '#', sub: '' },
];

const goToNewContact = () => {
  router.push('/app/phone/new');
};
</script>

<template>
  <div class="h-full w-full bg-gray-100 dark:bg-ios-dark-bg flex flex-col font-sans text-black dark:text-white">
    <!-- Header -->
    <header class="pt-12 pb-2 px-6">
      <div class="flex items-center justify-between h-9">
        <h1 class="text-3xl font-bold">Keypad</h1>
        <button @click="goToNewContact" class="text-blue-500">
          <Plus class="w-7 h-7" />
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col justify-end pb-4">
      <!-- Display -->
      <div class="flex-1 flex flex-col justify-end items-center px-8">
        <div class="h-12 text-center">
          <p v-if="phoneStore.dialedNumber" class="text-4xl font-light tracking-wider truncate">
            {{ phoneStore.dialedNumber }}
          </p>
        </div>
        <!-- "Add Number" button removed as requested -->
      </div>

      <!-- Keypad Grid -->
      <div class="grid grid-cols-3 gap-x-4 gap-y-4 justify-items-center mt-4">
        <DialButton
          v-for="key in keypad"
          :key="key.main"
          :main="key.main"
          :sub="key.sub"
          @click="() => phoneStore.appendDigit(key.main)"
        />
      </div>

      <!-- Action Buttons -->
      <div class="grid grid-cols-3 gap-x-4 justify-items-center mt-4 h-20">
        <div></div> <!-- Spacer -->
        <button
          @click="() => phoneStore.makeCall()"
          :disabled="!phoneStore.dialedNumber"
          class="w-20 h-20 rounded-full flex items-center justify-center transition-colors duration-150 bg-green-500 active:bg-green-600 disabled:bg-gray-300 dark:disabled:bg-gray-700"
        >
          <Phone class="w-8 h-8 text-white" />
        </button>
        <button 
          v-if="phoneStore.dialedNumber"
          @click="() => phoneStore.deleteDigit()"
          class="w-20 h-20 rounded-full flex items-center justify-center transition-opacity"
        >
          <Delete class="w-7 h-7 text-gray-500 dark:text-gray-400" />
        </button>
      </div>
    </main>
  </div>
</template>
