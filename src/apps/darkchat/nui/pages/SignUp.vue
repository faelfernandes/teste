<script setup lang="ts">
import { useDarkchatStore } from '../store/app-store';
import { useRouter } from 'vue-router';

const store = useDarkchatStore();
const router = useRouter();

const handleLoginRedirect = () => {
  router.push({ name: 'darkchat-login' });
};
</script>

<template>
  <div class="h-full w-full bg-black text-white flex flex-col font-sans">
    <!-- Header -->
    <header class="pt-20 pb-10 px-6">
      <h1 class="text-3xl font-bold">Sign Up</h1>
    </header>

    <!-- Form -->
    <main class="flex-1 px-6 space-y-6">
      <div>
        <label for="username" class="block text-sm font-medium mb-2">Username</label>
        <input
          v-model="store.username"
          id="username"
          type="text"
          class="w-full bg-[#1C1C1E] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label for="password" class="block text-sm font-medium mb-2">Password</label>
        <input
          v-model="store.password"
          id="password"
          type="password"
          class="w-full bg-[#1C1C1E] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        @click="store.signUp"
        class="w-full bg-blue-600 text-white font-semibold py-3.5 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Sign Up
      </button>
    </main>

    <!-- Footer -->
    <footer class="pb-12 px-6 text-center">
      <p class="text-sm">
        Already have an account?
        <a @click.prevent="handleLoginRedirect" href="#" class="font-semibold text-blue-500 hover:underline">Log In</a>
      </p>
    </footer>
  </div>
</template>
