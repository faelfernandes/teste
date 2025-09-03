<script setup lang="ts">
import { useCryptoStore } from './store/app-store';
import PageLayout from '@core/nui/components/PageLayout.vue';
import SearchInput from '@core/nui/components/SearchInput.vue';
import BalanceCard from './components/BalanceCard.vue';
import CryptoListItem from './components/CryptoListItem.vue';
import AppIcon from './assets/icons/AppIcon.vue';
import { ChevronUp, ChevronDown } from 'lucide-vue-next';

const store = useCryptoStore();

const getSortInfo = (key: 'name' | 'price' | 'balance') => store.getSortFor(key);
</script>

<template>
  <PageLayout page-title="">
    <!-- Custom Header -->
    <template #custom-header>
      <div class="flex items-center space-x-2 px-4 pt-12 pb-4">
        <AppIcon class="w-7 h-7" />
        <h1 class="text-2xl font-bold text-black dark:text-white">Crypto</h1>
      </div>
    </template>

    <div class="px-4 space-y-4">
      <!-- Balance Card -->
      <BalanceCard 
        :balance="store.formattedBalance"
        :is-visible="store.isBalanceVisible"
        @toggle-visibility="store.toggleBalanceVisibility"
      />

      <!-- Search Bar -->
      <SearchInput 
        v-model="store.searchQuery"
        placeholder="Search Cryptocurrency"
      />

      <!-- List Header -->
      <div class="flex items-center justify-between text-sm font-semibold text-gray-500 dark:text-gray-400 px-2">
        <button @click="store.toggleSort('name')" class="flex items-center space-x-1">
          <span>Name</span>
          <template v-if="getSortInfo('name')">
            <ChevronUp v-if="getSortInfo('name')?.direction === 'asc'" class="w-4 h-4" />
            <ChevronDown v-else class="w-4 h-4" />
          </template>
        </button>
        <button @click="store.toggleSort('price')" class="flex items-center space-x-1">
          <span>Graph</span>
           <template v-if="getSortInfo('price')">
            <ChevronUp v-if="getSortInfo('price')?.direction === 'asc'" class="w-4 h-4" />
            <ChevronDown v-else class="w-4 h-4" />
          </template>
        </button>
        <button @click="store.toggleSort('balance')" class="flex items-center space-x-1">
          <span>Balance</span>
           <template v-if="getSortInfo('balance')">
            <ChevronUp v-if="getSortInfo('balance')?.direction === 'asc'" class="w-4 h-4" />
            <ChevronDown v-else class="w-4 h-4" />
          </template>
        </button>
      </div>

      <!-- Crypto List -->
      <div class="bg-white dark:bg-ios-dark-card rounded-xl divide-y divide-gray-200 dark:divide-gray-700/60">
        <CryptoListItem
          v-for="currency in store.sortedCurrencies"
          :key="currency.id"
          :currency="currency"
        />
      </div>
      <div v-if="store.sortedCurrencies.length === 0" class="text-center py-10 text-gray-500">
        No results found.
      </div>
    </div>
  </PageLayout>
</template>
