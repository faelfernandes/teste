<script setup lang="ts">
import { ref, computed, watch, markRaw } from 'vue';
import { usePhoneStore } from '../store/app-store';
import { useActionSheetStore } from '@core/nui/store/actionSheet';
import PageLayout from '@core/nui/components/PageLayout.vue';
import { MessageCircle, Phone, Video, Upload } from 'lucide-vue-next';

const phoneStore = usePhoneStore();
const actionSheetStore = useActionSheetStore();

const isEditing = ref(false);

const myCard = computed(() => phoneStore.myCard);

// Create local refs for editing
const editableName = ref('');
const editablePhone = ref('');
const editableEmail = ref('');
const editableAddress = ref('');

// Define action buttons
const actionButtons = computed(() => [
  { id: 'message', icon: markRaw(MessageCircle), label: 'message', disabled: true },
  { id: 'call', icon: markRaw(Phone), label: 'call', disabled: true },
  { id: 'video', icon: markRaw(Video), label: 'video', disabled: true },
  { id: 'share', icon: markRaw(Upload), label: 'share', disabled: false }
]);

// Sync local refs with store data when component loads or myCard changes
watch(myCard, (newCard) => {
  if (newCard) {
    editableName.value = newCard.name;
    editablePhone.value = newCard.phone;
    editableEmail.value = newCard.email || '';
    editableAddress.value = newCard.address || '';
  }
}, { immediate: true });

const handleAction = (action: string) => {
  if (isEditing.value) return;
  alert(`${action} action for ${myCard.value?.name}`);
};

const handleAvatarEdit = async () => {
  const result = await actionSheetStore.show([
    [
      { id: 'change', text: 'Change Avatar', style: 'default' },
      { id: 'remove', text: 'Remove Avatar', style: 'destructive' },
    ]
  ]);

  if (result === 'change') {
    alert('Change Avatar functionality not implemented.');
  } else if (result === 'remove') {
    alert('Remove Avatar functionality not implemented.');
  }
};

const toggleEditMode = () => {
  if (isEditing.value && myCard.value) {
    // Save changes when clicking "Done"
    phoneStore.updateMyCard({
      ...myCard.value,
      name: editableName.value,
      phone: editablePhone.value,
      email: editableEmail.value,
      address: editableAddress.value,
    });
  }
  isEditing.value = !isEditing.value;
};
</script>

<template>
  <PageLayout v-if="myCard" page-title="" previous-title="Contacts">
    <template #header-actions>
      <button @click="toggleEditMode" class="text-blue-500 text-lg px-2 font-semibold">
        {{ isEditing ? 'Done' : 'Edit' }}
      </button>
    </template>
    
    <div class="flex flex-col items-center p-4 space-y-6">
      <!-- Avatar and Name -->
      <div class="flex flex-col items-center space-y-3 mt-8">
        <div class="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <span class="text-6xl font-light text-gray-500 dark:text-gray-400">
            {{ phoneStore.getInitials(myCard.name) }}
          </span>
        </div>
        <button v-if="isEditing" @click="handleAvatarEdit" class="text-blue-500 text-lg">Edit</button>
        <h2 v-else class="text-3xl text-black dark:text-white">{{ myCard.name }}</h2>
      </div>

      <!-- Quick Actions (View Mode) -->
      <div v-if="!isEditing" class="grid grid-cols-4 gap-4 w-full max-w-sm">
        <button
          v-for="button in actionButtons"
          :key="button.id"
          @click="handleAction(button.id)"
          :disabled="button.disabled"
          class="flex flex-col items-center space-y-1 transition-colors"
          :class="button.disabled ? 'text-gray-400 dark:text-gray-500' : 'text-gray-500 dark:text-gray-400'"
        >
          <div class="w-16 h-16 bg-white dark:bg-ios-dark-card rounded-xl flex items-center justify-center shadow-sm">
            <component
              :is="button.icon"
              class="w-8 h-8"
              :class="button.disabled ? 'text-gray-400 dark:text-gray-500' : 'text-blue-500'"
              :fill="button.id !== 'share' && !button.disabled ? 'currentColor' : 'none'"
            />
          </div>
          <span class="text-xs">{{ button.label }}</span>
        </button>
      </div>

      <!-- Contact Info (View Mode) -->
      <div v-if="!isEditing" class="w-full space-y-4">
        <div class="bg-white dark:bg-ios-dark-card rounded-xl p-3">
          <p class="text-sm text-gray-500 dark:text-gray-400">phone</p>
          <p class="text-blue-500 text-base">{{ myCard.phone }}</p>
        </div>
      </div>

      <!-- Edit Form (Edit Mode) -->
      <div v-if="isEditing" class="w-full space-y-4">
        <div class="bg-white dark:bg-ios-dark-card rounded-xl">
          <div class="border-b border-gray-200 dark:border-gray-700/60">
            <input 
              v-model="editableName"
              type="text" 
              placeholder="Name"
              class="w-full bg-transparent p-3 text-lg outline-none text-black dark:text-white"
            />
          </div>
          <div>
            <input 
              v-model="editablePhone"
              type="tel" 
              placeholder="Phone"
              class="w-full bg-transparent p-3 text-lg outline-none text-blue-500"
            />
          </div>
        </div>
        <div class="bg-white dark:bg-ios-dark-card rounded-xl">
          <div class="border-b border-gray-200 dark:border-gray-700/60">
            <input 
              v-model="editableEmail"
              type="email" 
              placeholder="Email"
              class="w-full bg-transparent p-3 text-lg outline-none text-black dark:text-white"
            />
          </div>
          <div>
            <input 
              v-model="editableAddress"
              type="text" 
              placeholder="Address"
              class="w-full bg-transparent p-3 text-lg outline-none text-black dark:text-white"
            />
          </div>
        </div>
      </div>
    </div>
  </PageLayout>
  <div v-else class="h-full flex items-center justify-center text-gray-500">
    My Card not found.
  </div>
</template>
