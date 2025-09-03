<script setup lang="ts">
// Este componente agora serve como um layout para as rotas aninhadas de Settings.
// O conteúdo principal foi movido para /pages/Home.vue
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
