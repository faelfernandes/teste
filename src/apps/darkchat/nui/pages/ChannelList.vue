<script setup lang="ts">
import { useDarkchatStore } from '../store/app-store';
import { useActionSheetStore } from '@core/nui/store/actionSheet';
import { useModalStore } from '@core/nui/store/modal';
import { Search, Plus, User } from 'lucide-vue-next';
import ChannelListItem from '../components/ChannelListItem.vue';

const store = useDarkchatStore();
const actionSheetStore = useActionSheetStore();
const modalStore = useModalStore();

const handleChangePassword = async () => {
  // Step 1: Ask for current password
  const currentPasswordResult = await modalStore.showModal({
    title: 'Change Password',
    message: 'Please enter your current password to continue.',
    inputs: [{ id: 'currentPassword', value: '', placeholder: 'Current password', type: 'password', required: true }],
    buttons: [
      { id: 'cancel', text: 'Cancel', style: 'cancel' },
      { id: 'next', text: 'Next', style: 'default' },
    ]
  });

  if (currentPasswordResult.buttonId !== 'next') return;

  // Step 2: "Verify" current password (in this mock, any non-empty password is fine)
  if (!currentPasswordResult.inputValues?.currentPassword) {
    await modalStore.showModal({
      title: 'Error',
      message: 'Current password cannot be empty.',
      buttons: [{ id: 'ok', text: 'OK', style: 'default' }]
    });
    return;
  }

  // Step 3: Ask for new password
  const newPasswordResult = await modalStore.showModal({
    title: 'Change Password',
    message: 'Please enter your new password.',
    inputs: [
      { id: 'newPassword', value: '', placeholder: 'New password', type: 'password', required: true },
      { id: 'confirmPassword', value: '', placeholder: 'Confirm new password', type: 'password', required: true },
    ],
    buttons: [
      { id: 'cancel', text: 'Cancel', style: 'cancel' },
      { id: 'save', text: 'Save', style: 'default' },
    ]
  });

  if (newPasswordResult.buttonId !== 'save') return;

  const newPassword = newPasswordResult.inputValues?.newPassword;
  const confirmPassword = newPasswordResult.inputValues?.confirmPassword;

  // Step 4: Validate and save new password
  if (newPassword !== confirmPassword) {
    await modalStore.showModal({
      title: 'Error',
      message: 'Passwords do not match.',
      buttons: [{ id: 'ok', text: 'OK', style: 'default' }]
    });
    return;
  }

  if (newPassword) {
    store.changePassword(newPassword);
    await modalStore.showModal({
      title: 'Success',
      message: 'Your password has been changed.',
      buttons: [{ id: 'ok', text: 'OK', style: 'default' }]
    });
  }
};

const showProfileOptions = async () => {
  const result = await actionSheetStore.show([
    [
      { id: 'change-account', text: 'Change Account', style: 'default' },
      { id: 'change-password', text: 'Change Password', style: 'default' },
      { id: 'delete-account', text: 'Delete Account', style: 'destructive' },
    ]
  ]);

  if (result === 'change-account') {
    store.logout();
  } else if (result === 'change-password') {
    handleChangePassword();
  } else if (result === 'delete-account') {
    alert('Delete Account functionality not implemented.');
  }
};
</script>

<template>
  <div class="h-full w-full bg-black text-white flex flex-col font-sans">
    <!-- Header -->
    <header class="pt-12 pb-4 px-4 sticky top-0 z-10 bg-black">
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold">Dark Chat</h1>
        <div class="flex items-center space-x-4">
          <button class="text-blue-500"><Plus class="w-7 h-7" /></button>
          <button @click="showProfileOptions" class="text-blue-500"><User class="w-7 h-7" /></button>
        </div>
      </div>
      <div class="relative mt-4">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search class="w-5 h-5 text-gray-400" />
        </div>
        <input
          v-model="store.searchQuery"
          type="text"
          placeholder="Search channels"
          class="w-full bg-[#1C1C1E] rounded-lg py-2 pl-10 pr-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </header>

    <!-- Channel List -->
    <main class="flex-1 overflow-y-auto pt-2 px-4">
      <div class="bg-[#1C1C1E] rounded-xl">
        <ChannelListItem
          v-for="(channel, index) in store.filteredChannels"
          :key="channel.id"
          :channel="channel"
          :is-last="index === store.filteredChannels.length - 1"
        />
      </div>
    </main>
  </div>
</template>
