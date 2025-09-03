<script setup lang="ts">
import { ref } from 'vue';
import { usePhoneStore } from '../store/app-store';
import PageLayout from '@core/nui/components/PageLayout.vue';
import SearchInput from '@core/nui/components/SearchInput.vue';
import ContactCard from '../components/ContactCard.vue';
import { Plus } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const phoneStore = usePhoneStore();
const router = useRouter();
const letterRefs = ref<Record<string, HTMLElement | null>>({});

const handleNewContact = () => {
  router.push('/app/phone/new');
};

const goToMyCard = () => {
  router.push('/app/phone/my-card');
};

const goToContactDetail = (contactId: number) => {
  router.push(`/app/phone/contacts/${contactId}`);
};

const scrollToLetter = (letter: string) => {
  const element = letterRefs.value[letter];
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>

<template>
  <div class="h-full flex flex-col bg-gray-100 dark:bg-ios-dark-bg font-sans">
    <div class="flex-1 overflow-hidden">
      <PageLayout page-title="Contacts">
        <template #header-actions>
          <button @click="handleNewContact" class="text-blue-500">
            <Plus class="w-7 h-7" />
          </button>
        </template>

        <div class="px-4 -mt-2">
          <SearchInput v-model="phoneStore.searchQuery" placeholder="Search" />
        </div>

        <div class="pt-4 relative">
          <div class="pr-8 pb-12">
            <!-- My Card Section -->
            <div v-if="phoneStore.myCard && !phoneStore.searchQuery" class="px-2 mb-4">
              <div class="bg-white dark:bg-ios-dark-card rounded-xl">
                <ContactCard :contact="phoneStore.myCard" :is-last="true" @click="goToMyCard" />
              </div>
            </div>

            <!-- Regular Contacts -->
            <div v-for="group in phoneStore.groupedContacts" :key="group.letter" class="mb-4">
              <h2 :ref="(el) => { if (el) letterRefs[group.letter] = el as HTMLElement }" class="px-4 pb-1 text-sm font-semibold text-gray-600 dark:text-gray-400">
                {{ group.letter }}
              </h2>
              <div class="bg-white dark:bg-ios-dark-card rounded-xl mx-2">
                <ContactCard 
                  v-for="(contact, index) in group.contacts" 
                  :key="contact.id"
                  :contact="contact"
                  :is-last="index === group.contacts.length - 1"
                  @click="goToContactDetail(contact.id)"
                />
              </div>
            </div>
            <div v-if="phoneStore.groupedContacts.length === 0" class="text-center text-gray-500 pt-10">
              No contacts found.
            </div>
          </div>
          
          <div class="absolute top-4 right-0 h-full flex flex-col justify-center items-center text-blue-500 text-xs font-bold space-y-0.5 pr-1">
            <a v-for="letter in phoneStore.alphabet" :key="letter" href="#" @click.prevent="scrollToLetter(letter)" class="hover:underline">
              {{ letter }}
            </a>
          </div>
        </div>
      </PageLayout>
    </div>
    
    <footer class="flex-shrink-0 text-center py-2 border-t border-gray-200 dark:border-gray-700/60 bg-gray-100/95 dark:bg-ios-dark-bg/95 backdrop-blur-sm">
      <span class="text-sm text-gray-600 dark:text-gray-400 font-medium">
        {{ phoneStore.totalContacts }} Contacts
      </span>
    </footer>
  </div>
</template>
