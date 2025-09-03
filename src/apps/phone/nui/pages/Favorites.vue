<script setup lang="ts">
import { usePhoneStore } from '../store/app-store';
import { useModalStore } from '@core/nui/store/modal';
import PageLayout from '@core/nui/components/PageLayout.vue';
import FavoriteListItem from '../components/FavoriteListItem.vue';

const phoneStore = usePhoneStore();
const modalStore = useModalStore();

const handleDelete = async (contactId: number) => {
  const contact = phoneStore.getContactById(contactId);
  if (!contact) return;

  const result = await modalStore.showModal({
    title: `Remove ${contact.name}?`,
    message: 'This contact will be removed from your favorites.',
    buttons: [
      { id: 'cancel', text: 'Cancel', style: 'cancel' },
      { id: 'remove', text: 'Remove', style: 'destructive' },
    ]
  });

  if (result.buttonId === 'remove') {
    phoneStore.removeFavorite(contactId);
  }
};
</script>

<template>
  <PageLayout page-title="Favorites">
    <template #header-actions>
      <button @click="phoneStore.toggleEditingFavorites" class="text-blue-500 text-lg px-2">
        {{ phoneStore.isEditingFavorites ? 'Done' : 'Edit' }}
      </button>
    </template>

    <div class="px-4 -mt-2 space-y-4">
      <div v-if="phoneStore.favoriteContacts.length > 0" class="bg-white dark:bg-ios-dark-card rounded-xl">
        <FavoriteListItem
          v-for="(contact, index) in phoneStore.favoriteContacts"
          :key="contact.id"
          :contact="contact"
          :is-last="index === phoneStore.favoriteContacts.length - 1"
          :is-editing="phoneStore.isEditingFavorites"
          @delete="handleDelete(contact.id)"
        />
      </div>
      <div v-else class="text-center text-gray-500 pt-10">
        No favorites yet.
      </div>
    </div>
  </PageLayout>
</template>
