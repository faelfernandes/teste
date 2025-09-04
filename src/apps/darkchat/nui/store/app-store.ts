import { defineStore } from 'pinia'
import { ref, computed, markRaw } from 'vue'
import { useRouter } from 'vue-router'
import { Users } from 'lucide-vue-next';

export interface Channel {
  id: number;
  name: string;
  icon: any;
  userCount: number;
  lastMessageUser: string;
  lastMessageText: string;
  timestamp: string;
}

export const useDarkchatStore = defineStore('darkchat', () => {
  const router = useRouter();

  const isAuthenticated = ref(false);
  const username = ref('anonymous');
  const password = ref('••••••••');
  
  const channels = ref<Channel[]>([
    { id: 1, name: 'guns', icon: markRaw(Users), userCount: 7, lastMessageUser: 'kevin', lastMessageText: 'i have a draco, 2k', timestamp: '4h' },
    { id: 2, name: 'comics', icon: markRaw(Users), userCount: 134, lastMessageUser: 'anonymous943', lastMessageText: 'whats up, i found this really great comic the other day', timestamp: '8h' },
    { id: 3, name: 'cars', icon: markRaw(Users), userCount: 23, lastMessageUser: 'pirateking32', lastMessageText: 'i have a 2019 mustang for sale', timestamp: '12h' },
  ]);

  const searchQuery = ref('');

  const filteredChannels = computed(() => {
    if (!searchQuery.value) {
      return channels.value;
    }
    const query = searchQuery.value.toLowerCase();
    return channels.value.filter(c => c.name.toLowerCase().includes(query));
  });

  const signUp = () => {
    isAuthenticated.value = true;
    router.push({ name: 'darkchat-channels' });
  };

  const login = () => {
    isAuthenticated.value = true;
    router.push({ name: 'darkchat-channels' });
  }

  const logout = () => {
    isAuthenticated.value = false;
    router.push({ name: 'darkchat-login' });
  }

  const changePassword = (newPassword: string) => {
    password.value = newPassword;
  };

  return {
    isAuthenticated,
    username,
    password,
    channels,
    searchQuery,
    filteredChannels,
    signUp,
    login,
    logout,
    changePassword,
  }
})
