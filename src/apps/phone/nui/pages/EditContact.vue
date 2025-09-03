<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { usePhoneStore, type Contact } from '../store/app-store';
import { useModalStore } from '@core/nui/store/modal';

const props = defineProps<{
  contactId: string;
}>();

const router = useRouter();
const phoneStore = usePhoneStore();
const modalStore = useModalStore();

const contact = computed(() => phoneStore.getContactById(Number(props.contactId)));

// Local state for editing
const editableFirstName = ref('');
const editableLastName = ref('');
const editablePhone = ref('');
const editableEmail = ref('');
const editableAddress = ref('');

// Sync local state when the contact data is loaded
watch(contact, (newContact) => {
  if (newContact) {
    const nameParts = newContact.name.split(' ');
    editableFirstName.value = nameParts[0] || '';
    editableLastName.value = nameParts.slice(1).join(' ') || '';
    editablePhone.value = newContact.phone;
    editableEmail.value = newContact.email || '';
    editableAddress.value = newContact.address || '';
  }
}, { immediate: true });

const handleCancel = () => {
  router.back();
};

const handleDone = () => {
  if (contact.value) {
    const updatedContact: Contact = {
      ...contact.value,
      name: `${editableFirstName.value} ${editableLastName.value}`.trim(),
      phone: editablePhone.value,
      email: editableEmail.value,
      address: editableAddress.value,
    };
    phoneStore.updateContact(updatedContact);
  }
  router.back();
};

const handleDelete = async () => {
  if (contact.value) {
    const result = await modalStore.showModal({
      title: 'Delete Contact',
      message: 'Are you sure you want to delete this contact?',
      buttons: [
        { id: 'cancel', text: 'Cancel', style: 'cancel' },
        { id: 'delete', text: 'Delete', style: 'destructive' },
      ]
    });

    if (result.buttonId === 'delete') {
      phoneStore.deleteContact(contact.value.id);
      router.push({ name: 'phone-contacts' }); // Go back to the main list
    }
  }
};
</script>

<template>
  <div v-if="contact" class="h-full w-full bg-gray-100 dark:bg-ios-dark-bg flex flex-col font-sans text-black dark:text-white">
    <!-- Header -->
    <header class="sticky top-0 z-20 pt-10 bg-gray-100/80 dark:bg-ios-dark-bg/80 backdrop-blur-md">
      <div class="w-full flex items-center justify-between px-4 pb-2 relative h-11">
        <button @click="handleCancel" class="text-lg text-blue-500">Cancel</button>
        <button @click="handleDone" class="text-lg text-blue-500 font-semibold">Done</button>
      </div>
    </header>

    <!-- Form Content -->
    <main class="flex-1 overflow-y-auto">
      <div class="flex flex-col items-center p-4 space-y-6">
        <!-- Avatar -->
        <div class="flex flex-col items-center space-y-3 mt-8">
          <div class="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span class="text-6xl font-light text-gray-500 dark:text-gray-400">
              {{ phoneStore.getInitials(contact.name) }}
            </span>
          </div>
          <button class="text-blue-500 text-lg">Edit</button>
        </div>

        <!-- Edit Form -->
        <div class="w-full space-y-4">
          <div class="bg-white dark:bg-ios-dark-card rounded-xl">
            <div class="border-b border-gray-200 dark:border-gray-700/60">
              <input 
                v-model="editableFirstName"
                type="text" 
                placeholder="First Name"
                class="w-full bg-transparent p-3 text-lg outline-none"
              />
            </div>
            <div>
              <input 
                v-model="editableLastName"
                type="text" 
                placeholder="Last Name"
                class="w-full bg-transparent p-3 text-lg outline-none"
              />
            </div>
          </div>
          
          <div class="bg-white dark:bg-ios-dark-card rounded-xl">
            <input 
              v-model="editablePhone"
              type="tel" 
              placeholder="Phone"
              class="w-full bg-transparent p-3 text-lg outline-none text-blue-500"
            />
          </div>

          <div class="bg-white dark:bg-ios-dark-card rounded-xl">
            <div class="border-b border-gray-200 dark:border-gray-700/60">
              <input 
                v-model="editableEmail"
                type="email" 
                placeholder="Email"
                class="w-full bg-transparent p-3 text-lg outline-none"
              />
            </div>
            <div>
              <input 
                v-model="editableAddress"
                type="text" 
                placeholder="Address"
                class="w-full bg-transparent p-3 text-lg outline-none"
              />
            </div>
          </div>

          <div class="bg-white dark:bg-ios-dark-card rounded-xl">
            <button @click="handleDelete" class="w-full text-left p-3 text-red-500">
              Delete Contact
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
  <div v-else class="h-full flex items-center justify-center text-gray-500">
    Contact not found.
  </div>
</template>
