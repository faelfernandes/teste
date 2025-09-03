import { defineStore } from 'pinia';
import { ref, computed, markRaw, onUnmounted } from 'vue';
import { useIntervalFn } from '@vueuse/core';
import { useModalStore } from '@core/nui/store/modal';
import { useBottomSheetStore } from '@core/nui/store/bottomSheet';
import SelectContact from '@apps/contacts/nui/components/SelectContact.vue';
import BtcIcon from '../assets/icons/BtcIcon.vue';
import EthIcon from '../assets/icons/EthIcon.vue';
import BnbIcon from '../assets/icons/BnbIcon.vue';
import XrpIcon from '../assets/icons/XrpIcon.vue';
import UsdtIcon from '../assets/icons/UsdtIcon.vue';

export interface CryptoCurrency {
  id: string;
  name: string;
  ticker: string;
  icon: any;
  balance: number;
  balanceUSD: number;
  price: number;
  change: number;
  graphData: number[];
  graphColor: 'green' | 'red';
}

type SortKey = 'name' | 'price' | 'balance';

const generateRandomGraphData = (): number[] => {
  const data = [];
  let lastValue = Math.random() * 50 + 25;
  for (let i = 0; i < 20; i++) {
    const change = (Math.random() - 0.5) * 10;
    lastValue = Math.max(10, Math.min(90, lastValue + change));
    data.push(lastValue);
  }
  return data;
};

export const useCryptoStore = defineStore('crypto-app', () => {
  const modalStore = useModalStore();
  const bottomSheetStore = useBottomSheetStore();
  const balance = ref(25489.54);
  const isBalanceVisible = ref(true);
  const searchQuery = ref('');
  const selectedCurrencyId = ref<string | null>(null);

  const sortCriteria = ref<{ key: SortKey; direction: 'asc' | 'desc' }[]>([
    { key: 'balance', direction: 'desc' }
  ]);

  const currencies = ref<CryptoCurrency[]>([
    { id: 'btc', name: 'Bitcoin', ticker: 'BTC', icon: markRaw(BtcIcon), balance: 0.1234, balanceUSD: 8543.21, price: 69231.50, change: 1.25, graphData: generateRandomGraphData(), graphColor: 'green' },
    { id: 'eth', name: 'Ethereum', ticker: 'ETH', icon: markRaw(EthIcon), balance: 2.5432, balanceUSD: 9876.54, price: 3883.54, change: -0.52, graphData: generateRandomGraphData(), graphColor: 'red' },
    { id: 'bnb', name: 'BNB', ticker: 'BNB', icon: markRaw(BnbIcon), balance: 10.123, balanceUSD: 6012.34, price: 594.00, change: 2.11, graphData: generateRandomGraphData(), graphColor: 'green' },
    { id: 'xrp', name: 'XRP', ticker: 'XRP', icon: markRaw(XrpIcon), balance: 10000, balanceUSD: 5200.00, price: 0.52, change: -1.15, graphData: generateRandomGraphData(), graphColor: 'red' },
    { id: 'usdt', name: 'Tether', ticker: 'USDT', icon: markRaw(UsdtIcon), balance: 1000.45, balanceUSD: 1000.45, price: 1.00, change: 0.01, graphData: generateRandomGraphData(), graphColor: 'green' },
  ]);

  const { pause } = useIntervalFn(() => {
    currencies.value.forEach(currency => {
      if (currency.id === 'usdt') return;
      const priceChangePercent = (Math.random() - 0.5) * 0.02;
      const oldPrice = currency.price;
      currency.price *= (1 + priceChangePercent);
      const changeSinceYesterday = ((currency.price / oldPrice) - 1) * 100;
      currency.change = parseFloat((currency.change + changeSinceYesterday).toFixed(2));
      currency.balanceUSD = currency.balance * currency.price;
      const newGraphPoint = currency.graphData[currency.graphData.length - 1] * (1 + (Math.random() - 0.5) * 0.05);
      currency.graphData.shift();
      currency.graphData.push(Math.max(10, Math.min(90, newGraphPoint)));
      currency.graphColor = currency.change >= 0 ? 'green' : 'red';
    });
  }, 2000);

  onUnmounted(pause);

  const formattedBalance = computed(() => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(balance.value));

  const filteredCurrencies = computed(() => {
    if (!searchQuery.value) return currencies.value;
    const query = searchQuery.value.toLowerCase();
    return currencies.value.filter(c => c.name.toLowerCase().includes(query) || c.ticker.toLowerCase().includes(query));
  });

  const sortedCurrencies = computed(() => {
    const criteria = sortCriteria.value;
    if (!criteria.length) return filteredCurrencies.value;
    return [...filteredCurrencies.value].sort((a, b) => {
      for (const { key, direction } of criteria) {
        let comparison = 0;
        let valA, valB;
        switch (key) {
          case 'name':
            valA = a.name; valB = b.name;
            comparison = valA.localeCompare(valB);
            break;
          case 'price':
            valA = a.price; valB = b.price;
            comparison = valA - valB;
            break;
          case 'balance':
            valA = a.balanceUSD; valB = b.balanceUSD;
            comparison = valA - valB;
            break;
        }
        if (comparison !== 0) return direction === 'asc' ? comparison : -comparison;
      }
      return 0;
    });
  });

  const toggleSort = (key: SortKey) => {
    // If the clicked key is already the active sort key, flip its direction.
    if (sortCriteria.value.length > 0 && sortCriteria.value[0].key === key) {
      sortCriteria.value[0].direction = sortCriteria.value[0].direction === 'asc' ? 'desc' : 'asc';
    } else {
      // Otherwise, set the clicked key as the new, single sort criterion.
      const defaultDirection = key === 'name' ? 'asc' : 'desc';
      sortCriteria.value = [{ key, direction: defaultDirection }];
    }
  };

  const getSortFor = (key: SortKey): { direction: 'asc' | 'desc' } | null => {
    if (sortCriteria.value.length > 0 && sortCriteria.value[0].key === key) {
      return { direction: sortCriteria.value[0].direction };
    }
    return null;
  };

  const toggleBalanceVisibility = () => { isBalanceVisible.value = !isBalanceVisible.value; };
  const selectCurrency = (id: string) => { selectedCurrencyId.value = selectedCurrencyId.value === id ? null : id; };

  const buyCurrency = async (currencyId: string, usdAmount: number) => {
    if (balance.value < usdAmount) {
      await modalStore.showModal({ title: 'Error', message: 'Insufficient balance', buttons: [{ id: 'ok', text: 'OK', style: 'default' }]});
      return;
    }
    const currency = currencies.value.find(c => c.id === currencyId);
    if (currency) {
      balance.value -= usdAmount;
      const amountToReceive = usdAmount / currency.price;
      currency.balance += amountToReceive;
      currency.balanceUSD += usdAmount;
    }
  };

  const sellCurrency = async (currencyId: string, usdAmount: number): Promise<boolean> => {
    const currency = currencies.value.find(c => c.id === currencyId);
    if (!currency || currency.balanceUSD < usdAmount) {
      await modalStore.showModal({ title: 'Error', message: 'Insufficient crypto balance', buttons: [{ id: 'ok', text: 'OK', style: 'default' }]});
      return false;
    }
    balance.value += usdAmount;
    const amountToSell = usdAmount / currency.price;
    currency.balance -= amountToSell;
    currency.balanceUSD -= usdAmount;
    return true;
  };

  const transferCurrency = async (currencyId: string, usdAmount: number, recipient: any): Promise<boolean> => {
    const currency = currencies.value.find(c => c.id === currencyId);
    if (!currency || currency.balanceUSD < usdAmount) {
      await modalStore.showModal({ title: 'Error', message: 'Insufficient crypto balance', buttons: [{ id: 'ok', text: 'OK', style: 'default' }]});
      return false;
    }
    const amountToTransfer = usdAmount / currency.price;
    currency.balance -= amountToTransfer;
    currency.balanceUSD -= usdAmount;
    await modalStore.showModal({ title: 'Success', message: `Transferred ${amountToTransfer.toFixed(4)} ${currency.ticker} to ${recipient.name}`, buttons: [{ id: 'ok', text: 'OK', style: 'default' }]});
    return true;
  };

  const sellAllCurrency = async (currencyId: string) => {
    const currency = currencies.value.find(c => c.id === currencyId);
    if (currency && currency.balanceUSD > 0) {
      const soldAmount = currency.balanceUSD;
      balance.value += soldAmount;
      currency.balance = 0;
      currency.balanceUSD = 0;
    }
  };

  return { balance, isBalanceVisible, searchQuery, currencies, selectedCurrencyId, sortCriteria, formattedBalance, filteredCurrencies, sortedCurrencies, toggleSort, getSortFor, toggleBalanceVisibility, selectCurrency, buyCurrency, sellCurrency, transferCurrency, sellAllCurrency };
});
