<script setup lang="ts">
import { ref, markRaw } from 'vue';
import { useRouter } from 'vue-router';
import PageLayout from '@core/nui/components/PageLayout.vue';
import SearchInput from '@core/nui/components/SearchInput.vue';
import SettingsGroup from '../components/SettingsGroup.vue';

// Importando os ícones
import AvatarIcon from '../components/icons/AvatarIcon.vue';
import ListIcon from '../components/icons/ListIcon.vue';
import BroadcastIcon from '../components/icons/BroadcastIcon.vue';
import StarIcon from '../components/icons/StarIcon.vue';
import LaptopIcon from '../components/icons/LaptopIcon.vue';
import KeyIcon from '../components/icons/KeyIcon.vue';
import LockIcon from '../components/icons/LockIcon.vue';
import ChatIcon from '../components/icons/ChatIcon.vue';
import BellIcon from '../components/icons/BellIcon.vue';
import DataIcon from '../components/icons/DataIcon.vue';
import HelpIcon from '../components/icons/HelpIcon.vue';
import HeartIcon from '../components/icons/HeartIcon.vue';
import InstagramIcon from '../components/icons/InstagramIcon.vue';
import FacebookIcon from '../components/icons/FacebookIcon.vue';
import ThreadsIcon from '../components/icons/ThreadsIcon.vue';
import QrCodeIcon from '../components/icons/QrCodeIcon.vue';
import type { Component } from 'vue';

const router = useRouter();
const searchQuery = ref('');

interface Setting {
  id: string;
  title: string;
  icon: Component;
  action?: () => void;
}

const settingGroups = ref<Setting[][]>([
  [
    { id: 'avatar', title: 'Avatar', icon: markRaw(AvatarIcon) },
  ],
  [
    { id: 'list', title: 'List', icon: markRaw(ListIcon) },
    { id: 'broadcast', title: 'Broadcast messages', icon: markRaw(BroadcastIcon) },
    { id: 'starred', title: 'Starred messages', icon: markRaw(StarIcon) },
    { id: 'devices', title: 'Linked devices', icon: markRaw(LaptopIcon) },
  ],
  [
    { id: 'account', title: 'Account', icon: markRaw(KeyIcon) },
    { id: 'privacy', title: 'Privacy', icon: markRaw(LockIcon) },
    { id: 'chats', title: 'Chats', icon: markRaw(ChatIcon) },
    { id: 'notifications', title: 'Notifications', icon: markRaw(BellIcon) },
    { id: 'storage', title: 'Storage and data', icon: markRaw(DataIcon) },
  ],
  [
    { id: 'help', title: 'Help', icon: markRaw(HelpIcon) },
    { id: 'invite', title: 'Invite a friend', icon: markRaw(HeartIcon) },
  ],
]);

const metaGroup = ref<Setting[]>([
  { id: 'instagram', title: 'Open Instagram', icon: markRaw(InstagramIcon) },
  { id: 'facebook', title: 'Open Facebook', icon: markRaw(FacebookIcon) },
  { id: 'threads', title: 'Open Threads', icon: markRaw(ThreadsIcon) },
]);

const handleItemClick = (item: Setting) => {
  // Placeholder for navigation
  alert(`Navigating to ${item.title}`);
};
</script>

<template>
  <div class="h-full w-full bg-[#F4F4F4] flex flex-col font-sans">
    <main class="flex-1 overflow-y-auto">
      <PageLayout page-title="Settings">
        <div class="px-4 -mt-2 space-y-6 pb-4">
          <SearchInput v-model="searchQuery" placeholder="Search" />

          <!-- Profile Section -->
          <div class="bg-white rounded-xl mx-0">
            <div class="flex items-center p-2 space-x-3 cursor-pointer" @click="handleItemClick({id: 'profile', title: 'Profile', icon: 'div'})">
              <img
                src="https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/ed9d/8b5c/233f84a2c692a13329430598f79a2a01?Expires=1757289600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=NSyZnNk-sFWfGOfw3j8ghwhT7bIQEF4KQvYCPdwQHYcySefQ-CU~7DUyqIIsLxFcDr8Limrvc6CVBJIKOTsEI21OkudmA8SyoW72sNBWPUyyV-qHzn8ingwgVT-xc7lHrGqCwIwfSjUDRDjEN3jzeH1MvOjZoGSSv4JmgtvZM4Wqic33A0HLNsXr4i2HEI16fLWHUv7OlasYbSTyS1pNVRsSk98l9q-okJPl9thNM9FnZa2E2Z5eKatMfq5J43u3VF-0artPd01G1kwYatqOLfntjrvX2fBiZ7luuamPUbyas4JsYaaOyRapMEWlxEKdzah14Y2G5SM8r0w~nBBn6Q__"
                alt="Marty McFly"
                class="w-14 h-14 rounded-full object-cover"
              />
              <div class="flex-1">
                <p class="text-xl font-medium text-[#0A0A0A]">Marty McFly</p>
                <p class="text-sm text-[#767779]">Nobody calls me chicken! 🐔</p>
              </div>
              <button class="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">
                <QrCodeIcon class="w-6 h-6 text-[#0A0A0A]" />
              </button>
            </div>
            <div class="border-b border-gray-200 ml-20"></div>
            <SettingsGroup :group="settingGroups[0]" :is-first-group="true" @item-click="handleItemClick" />
          </div>

          <!-- Settings Groups -->
          <SettingsGroup
            v-for="(group, index) in settingGroups.slice(1)"
            :key="`group-${index+1}`"
            :group="group"
            @item-click="handleItemClick"
          />

          <!-- Meta Group -->
          <div>
            <h3 class="text-sm text-[#767779] px-4 mb-2">Also from Meta</h3>
            <SettingsGroup :group="metaGroup" @item-click="handleItemClick" />
          </div>
        </div>
      </PageLayout>
    </main>
  </div>
</template>
