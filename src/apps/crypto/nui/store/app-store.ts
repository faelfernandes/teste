import { defineStore } from 'pinia';
import { ref, computed, markRaw } from 'vue';
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
  const balance = ref(25489.54);
  const isBalanceVisible = ref(true);
  const searchQuery = ref('');
  const selectedCurrencyId = ref<string | null>(null);

  const currencies = ref<CryptoCurrency[]>([
    { id: 'btc', name: 'Bitcoin', ticker: 'BTC', icon: markRaw(BtcIcon), balance: 0.1234, balanceUSD: 8543.21, price: 69231.50, change: 1.25, graphData: generateRandomGraphData(), graphColor: 'green' },
    { id: 'eth', name: 'Ethereum', ticker: 'ETH', icon: markRaw(EthIcon), balance: 2.5432, balanceUSD: 9876.54, price: 3883.54, change: -0.52, graphData: generateRandomGraphData(), graphColor: 'red' },
    { id: 'bnb', name: 'BNB', ticker: 'BNB', icon: markRaw(BnbIcon), balance: 10.123, balanceUSD: 6012.34, price: 594.00, change: 2.11, graphData: generateRandomGraphData(), graphColor: 'green' },
    { id: 'xrp', name: 'XRP', ticker: 'XRP', icon: markRaw(XrpIcon), balance: 10000, balanceUSD: 5200.00, price: 0.52, change: -1.15, graphData: generateRandomGraphData(), graphColor: 'red' },
    { id: 'usdt', name: 'Tether', ticker: 'USDT', icon: markRaw(UsdtIcon), balance: 1000.45, balanceUSD: 1000.45, price: 1.00, change: 0.01, graphData: generateRandomGraphData(), graphColor: 'green' },
  ]);

  const formattedBalance = computed(() => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(balance.value);
  });

  const filteredCurrencies = computed(() => {
    if (!searchQuery.value) {
      return currencies.value;
    }
    const query = searchQuery.value.toLowerCase();
    return currencies.value.filter(
      c => c.name.toLowerCase().includes(query) || c.ticker.toLowerCase().includes(query)
    );
  });

  const toggleBalanceVisibility = () => {
    isBalanceVisible.value = !isBalanceVisible.value;
  };

  const selectCurrency = (id: string) => {
    if (selectedCurrencyId.value === id) {
      selectedCurrencyId.value = null;
    } else {
      selectedCurrencyId.value = id;
    }
  };

  const buyCurrency = (currencyId: string, usdAmount: number) => {
    if (balance.value < usdAmount) {
      console.error("Insufficient balance");
      return;
    }

    const currency = currencies.value.find(c => c.id === currencyId);
    if (currency) {
      balance.value -= usdAmount;
      const amountToReceive = usdAmount / currency.price;
      currency.balance += amountToReceive;
      currency.balanceUSD += usdAmount;
      console.log(`Bought ${amountToReceive.toFixed(4)} ${currency.ticker} for ${usdAmount} USD`);
    }
  };

  const sellCurrency = (currencyId: string, usdAmount: number): boolean => {
    const currency = currencies.value.find(c => c.id === currencyId);
    if (!currency) {
      console.error("Currency not found");
      return false;
    }

    if (currency.balanceUSD < usdAmount) {
      console.error("Insufficient crypto balance");
      return false; // Indicate failure
    }

    balance.value += usdAmount;
    const amountToSell = usdAmount / currency.price;
    currency.balance -= amountToSell;
    currency.balanceUSD -= usdAmount;
    console.log(`Sold ${amountToSell.toFixed(4)} ${currency.ticker} for ${usdAmount} USD`);
    return true; // Indicate success
  };

  const transferCurrency = (currencyId: string, usdAmount: number, recipientId: number): boolean => {
    const currency = currencies.value.find(c => c.id === currencyId);
    if (!currency) {
      console.error("Currency not found");
      return false;
    }

    if (currency.balanceUSD < usdAmount) {
      console.error("Insufficient crypto balance");
      return false;
    }

    const amountToTransfer = usdAmount / currency.price;
    currency.balance -= amountToTransfer;
    currency.balanceUSD -= usdAmount;
    
    console.log(`Transferred ${amountToTransfer.toFixed(4)} ${currency.ticker} (worth ${usdAmount} USD) to contact ID ${recipientId}`);
    return true;
  };

  const sellAllCurrency = (currencyId: string) => {
    const currency = currencies.value.find(c => c.id === currencyId);
    if (currency && currency.balanceUSD > 0) {
      const soldAmount = currency.balanceUSD;
      balance.value += soldAmount;
      currency.balance = 0;
      currency.balanceUSD = 0;
      console.log(`Sold all ${currency.ticker} for ${soldAmount} USD`);
    }
  };

  return {
    balance,
    isBalanceVisible,
    searchQuery,
    currencies,
    selectedCurrencyId,
    formattedBalance,
    filteredCurrencies,
    toggleBalanceVisibility,
    selectCurrency,
    buyCurrency,
    sellCurrency,
    transferCurrency,
    sellAllCurrency,
  };
});
