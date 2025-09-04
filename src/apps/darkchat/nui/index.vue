<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useDarkchatStore } from './store/app-store';

const store = useDarkchatStore();
const router = useRouter();

// Redirect user based on auth state when the app is entered
onMounted(() => {
  if (store.isAuthenticated) {
    router.replace({ name: 'darkchat-channels' });
  } else {
    router.replace({ name: 'darkchat-login' });
  }
});
</script>

<template>
  <div class="h-full w-full">
    <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transition || 'fade'" mode="out-in">
        <div :key="route.path" class="h-full w-full">
          <component :is="Component" v-if="Component" />
        </div>
      </transition>
    </router-view>
  </div>
</template>
