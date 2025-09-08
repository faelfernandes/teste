import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getAllApps } from '@core/nui/services/appManager'
import type { AppConfig } from '@core/nui/utils/appLoader'

export interface AppStoreItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  provider: string;
  compatibility: string;
  inAppPurchases: string;
  screenshots: string[];
  size: number; // in bytes
  route: string;
}

export const useAppsStore = defineStore('apps', () => {
  const allApps = ref<AppStoreItem[]>([])
  const searchQuery = ref('')
  const isLoading = ref(false)

  const fetchStoreApps = () => {
    if (allApps.value.length > 0) return; // Already loaded
    isLoading.value = true;
    
    const availableApps = getAllApps();
    
    const storeApps = availableApps
      .filter(app => app.category === 'store' && app.id !== 'apps')
      .map((app: AppConfig): AppStoreItem => {
        return {
          id: app.id,
          name: app.name,
          route: app.route,
          icon: `/src/apps/${app.id}/nui/assets/images/AppLogo.jpg`,
          size: app.size || 0,
          description: app.description || 'A useful application for your phone.',
          provider: app.provider || 'LB Phone',
          compatibility: app.compatibility || 'Works with this phone',
          inAppPurchases: app.inAppPurchases || 'No',
          screenshots: app.screenshots || [
            'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/270x585/f0f0f0/333?text=Light+Mode',
            'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/270x585/1c1c1e/eee?text=Dark+Mode'
          ],
        };
      });
      
    allApps.value = storeApps;
    isLoading.value = false;
  }

  const filteredApps = computed(() => {
    if (!searchQuery.value) {
      return allApps.value;
    }
    const query = searchQuery.value.toLowerCase();
    return allApps.value.filter(app =>
      app.name.toLowerCase().includes(query) ||
      app.description.toLowerCase().includes(query)
    );
  });

  const getAppById = computed(() => {
    return (id: string) => {
      if (allApps.value.length === 0) {
        fetchStoreApps();
      }
      return allApps.value.find(app => app.id === id);
    }
  });

  return {
    allApps,
    searchQuery,
    isLoading,
    filteredApps,
    fetchStoreApps,
    getAppById,
  }
})
