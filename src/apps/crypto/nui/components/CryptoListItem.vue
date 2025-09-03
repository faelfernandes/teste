<script setup lang="ts">
import { computed, ref, markRaw } from 'vue';
import type { CryptoCurrency } from '../store/app-store';
import { useCryptoStore } from '../store/app-store';
import { useModalStore } from '@core/nui/store/modal';
import { useBottomSheetStore } from '@core/nui/store/bottomSheet';
import SelectContact from '@apps/contacts/nui/components/SelectContact.vue';
import Sparkline from './Sparkline.vue';

const props = defineProps<{
  currency: CryptoCurrency;
}>();

const store = useCryptoStore();
const modalStore = useModalStore();
const bottomSheetStore = useBottomSheetStore();
const isHovering = ref(false);

const isSelected = computed(() => store.selectedCurrencyId === props.currency.id);

const formatBalance = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: value < 1 ? 4 : 2,
    maximumFractionDigits: value < 1 ? 4 : 2,
  }).format(value);
};

const handleBuy = async () => {
  const result = await modalStore.showModal({
    title: `Buy ${props.currency.ticker}`,
    message: `Enter the amount of ${props.currency.ticker} (in $) you want to buy`,
    inputs: [
      {
        id: 'amount',
        value: '',
        placeholder: '$1000',
        type: 'number',
        required: true,
      },
    ],
    buttons: [
      { id: 'cancel', text: 'Cancel', style: 'cancel' },
      { id: 'proceed', text: 'Proceed', style: 'default' },
    ],
  });

  if (result.buttonId === 'proceed' && result.inputValues?.amount) {
    const amount = parseFloat(result.inputValues.amount);
    if (!isNaN(amount) && amount > 0) {
      store.buyCurrency(props.currency.id, amount);
    } else {
      await modalStore.showModal({
        title: 'Invalid Amount',
        message: 'Please enter a valid number greater than zero.',
        buttons: [{ id: 'ok', text: 'OK', style: 'default' }]
      });
    }
  }
};

const handleSell = async () => {
  const result = await modalStore.showModal({
    title: `Sell ${props.currency.ticker}`,
    message: `Enter the amount of ${props.currency.ticker} (in $) you want to sell`,
    inputs: [
      {
        id: 'amount',
        value: '',
        placeholder: '$1000',
        type: 'number',
        required: true,
      },
    ],
    buttons: [
      { id: 'cancel', text: 'Cancel', style: 'cancel' },
      { id: 'proceed', text: 'Proceed', style: 'default' },
    ],
  });

  if (result.buttonId === 'proceed' && result.inputValues?.amount) {
    const amount = parseFloat(result.inputValues.amount);
    if (!isNaN(amount) && amount > 0) {
      const success = store.sellCurrency(props.currency.id, amount);
      if (!success) {
        await modalStore.showModal({
          title: 'Insufficient Balance',
          message: `You do not have enough ${props.currency.ticker} to sell.`,
          buttons: [{ id: 'ok', text: 'OK', style: 'default' }]
        });
      }
    } else {
      await modalStore.showModal({
        title: 'Invalid Amount',
        message: 'Please enter a valid number greater than zero.',
        buttons: [{ id: 'ok', text: 'OK', style: 'default' }]
      });
    }
  }
};

const handleTransfer = async () => {
  // Step 1: Get amount from modal
  const amountResult = await modalStore.showModal({
    title: `Transfer ${props.currency.ticker}`,
    message: `Enter the amount of ${props.currency.ticker} (in $) you want to transfer (select contact in next step)`,
    inputs: [
      {
        id: 'amount',
        value: '',
        placeholder: '$1000',
        type: 'number',
        required: true,
      },
    ],
    buttons: [
      { id: 'cancel', text: 'Cancel', style: 'cancel' },
      { id: 'next', text: 'Next', style: 'default' },
    ],
  });

  if (amountResult.buttonId !== 'next' || !amountResult.inputValues?.amount) {
    return; // User cancelled or entered no amount
  }

  const amount = parseFloat(amountResult.inputValues.amount);
  if (isNaN(amount) || amount <= 0) {
    await modalStore.showModal({
      title: 'Invalid Amount',
      message: 'Please enter a valid number greater than zero.',
      buttons: [{ id: 'ok', text: 'OK', style: 'default' }]
    });
    return;
  }
  
  if (props.currency.balanceUSD < amount) {
    await modalStore.showModal({
      title: 'Insufficient Balance',
      message: `You do not have enough ${props.currency.ticker} to transfer.`,
      buttons: [{ id: 'ok', text: 'OK', style: 'default' }]
    });
    return;
  }

  // Step 2: Get recipient from bottom sheet
  const selectedContact = await bottomSheetStore.open(markRaw(SelectContact));

  if (!selectedContact) {
    return; // User cancelled contact selection
  }

  // Step 3: Execute transfer
  store.transferCurrency(props.currency.id, amount, selectedContact.id);
  
  // Step 4: Show confirmation
  await modalStore.showModal({
    title: 'Transfer Complete',
    message: `You have successfully transferred ${formatBalance(amount)} of ${props.currency.ticker} to ${selectedContact.name}.`,
    buttons: [{ id: 'ok', text: 'OK', style: 'default' }]
  });
};

const handleSellAll = async () => {
  const result = await modalStore.showModal({
    title: `Sell all ${props.currency.ticker}`,
    message: `Are you sure you want to sell all your ${props.currency.ticker} for ${formatBalance(props.currency.balanceUSD)}?`,
    buttons: [
      { id: 'cancel', text: 'Cancel', style: 'cancel' },
      { id: 'proceed', text: 'Proceed', style: 'destructive' },
    ],
  });

  if (result.buttonId === 'proceed') {
    store.sellAllCurrency(props.currency.id);
  }
};
</script>

<template>
  <div 
    @click="() => store.selectCurrency(currency.id)"
    class="flex flex-col py-4 px-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
  >
    <div class="flex items-center">
      <!-- Icon & Name -->
      <div class="flex items-center space-x-4 w-1/3">
        <component :is="currency.icon" class="w-9 h-9 flex-shrink-0" />
        <div>
          <p class="font-bold text-base text-black dark:text-white">{{ currency.ticker }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ currency.name }}</p>
        </div>
      </div>
      
      <!-- Graph -->
      <div 
        class="w-1/3 h-10 px-4 relative"
        @mouseenter="isHovering = true"
        @mouseleave="isHovering = false"
      >
        <Sparkline :data="currency.graphData" :color="currency.graphColor" />
        <!-- Tooltip -->
        <transition name="fade">
          <div 
            v-if="isHovering" 
            class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-auto whitespace-nowrap bg-black text-white rounded-md px-3 py-1.5 text-center shadow-lg z-10"
          >
            <p class="font-bold text-sm">{{ formatPrice(currency.price) }}</p>
            <p 
              class="text-xs" 
              :class="currency.change >= 0 ? 'text-green-400' : 'text-red-400'"
            >
              {{ currency.change >= 0 ? '+' : '' }}{{ currency.change.toFixed(2) }}%
            </p>
            <!-- Tooltip arrow -->
            <div class="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-black"></div>
          </div>
        </transition>
      </div>

      <!-- Balance -->
      <div class="w-1/3 text-right">
        <p class="font-bold text-base text-black dark:text-white">{{ currency.balance.toFixed(4) }}</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatBalance(currency.balanceUSD) }}</p>
      </div>
    </div>

    <!-- Action Buttons (Expanded state) -->
    <div v-if="isSelected" class="mt-4 grid grid-cols-4 gap-2">
      <button @click.stop="handleBuy" class="bg-[#10B981] text-white rounded-lg py-1.5 text-sm font-semibold hover:bg-green-600 transition-colors">
        Buy
      </button>
      <button @click.stop="handleSell" class="bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-lg py-1.5 text-sm font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
        Sell
      </button>
      <button @click.stop="handleTransfer" class="border border-blue-500 text-blue-500 rounded-lg py-1.5 text-sm font-semibold hover:bg-blue-500/10 transition-colors">
        Transfer
      </button>
      <button @click.stop="handleSellAll" class="border border-red-500 text-red-500 rounded-lg py-1.5 text-sm font-semibold hover:bg-red-500/10 transition-colors">
        Sell All
      </button>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(5px);
}
</style>
