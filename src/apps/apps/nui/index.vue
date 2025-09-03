<script setup lang="ts">
// This component now serves as a layout for the nested routes of the Apps app.
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
