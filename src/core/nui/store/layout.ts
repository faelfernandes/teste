import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AppConfig, BarConfig } from '@core/nui/utils/appLoader'
import { useSettingsStore } from '@apps/settings/nui/store/app-store'

// 🔹 Interface do layout (grid + dock)
export interface Layout {
  dock: string[]
  pages: string[][]
}

// 🔹 Mock local inicial (máximo 2 páginas)
const mockLayout: Layout = {
  dock: ["phone", "messages", "camera", "photos"],
  pages: [
    [
      "settings", 
      "apps", 
      "clock", 
      "mail", 
      "weather", 
      "wallet", 
      "garage", 
      "home", 
      "maps", 
      "notes", 
      "calculator", 
      "voicememo", 
      "services", 
      "music", 
      "pages", 
    ],
    ["crypto", "darkchat"]
  ]
}

export const useLayoutStore = defineStore('layout', () => {
  // State
  const layout = ref<Layout>({ dock: [], pages: [[]] })
  const isEditing = ref(false)
  const loading = ref(false)
  const isLayoutLoaded = ref(false)
  const currentPage = ref(0)
  const draggedApp = ref<string | null>(null)
  const draggedFrom = ref<{ type: 'page' | 'dock', pageIndex?: number, itemIndex: number } | null>(null)
  const currentAppConfig = ref<AppConfig | null>(null);

  // Constants
  const MAX_PAGES = 2
  const MAX_APPS_PER_PAGE = 24 // Aumentado para suportar mais apps por página
  const MAX_DOCK_APPS = 4

  // Getters & Computed Properties for reactive UI
  const totalPages = computed(() => Math.min(layout.value.pages.length, MAX_PAGES))

  const statusBarMode = computed<BarConfig['mode']>(() => {
    if (!currentAppConfig.value) return 'overlay'; // Home screen default
    return currentAppConfig.value.statusBar?.mode || 'default';
  });

  const statusBarStyle = computed<BarConfig['style']>(() => {
    const settingsStore = useSettingsStore();
    const globalThemeStyle = settingsStore.theme === 'dark' ? 'dark' : 'light';

    if (statusBarMode.value === 'default') {
      return globalThemeStyle;
    }
    return currentAppConfig.value?.statusBar?.style || globalThemeStyle;
  });

  const navigationBarMode = computed<BarConfig['mode']>(() => {
    if (!currentAppConfig.value) return 'overlay'; // Home screen default
    return currentAppConfig.value?.navigationBar?.mode || 'default';
  });

  const navigationBarStyle = computed<BarConfig['style']>(() => {
    const settingsStore = useSettingsStore();
    const globalThemeStyle = settingsStore.theme === 'dark' ? 'dark' : 'light';

    if (navigationBarMode.value === 'default') {
      return globalThemeStyle;
    }
    return currentAppConfig.value?.navigationBar?.style || statusBarStyle.value;
  });

  const isNavigationBarVisible = computed(() => navigationBarMode.value !== 'fullscreen');

  const isAppInstalled = computed(() => {
    return (appId: string): boolean => {
      if (!layout.value || !layout.value.pages) return false;
      const inPages = layout.value.pages.some(page => page.includes(appId));
      const inDock = layout.value.dock.includes(appId);
      return inPages || inDock;
    }
  });
  
  // Actions
  const setLayoutConfig = (appConfig: AppConfig | null) => {
    currentAppConfig.value = appConfig;
  };

  const toggleEditMode = () => {
    isEditing.value = !isEditing.value
  }

  const exitEditMode = () => {
    isEditing.value = false
  }

  const nextPage = () => {
    if (currentPage.value < totalPages.value - 1) {
      currentPage.value++
    }
  }

  const prevPage = () => {
    if (currentPage.value > 0) {
      currentPage.value--
    }
  }

  const goToPage = (pageIndex: number) => {
    if (pageIndex >= 0 && pageIndex < totalPages.value) {
      currentPage.value = pageIndex
    }
  }

  // 🔹 Drag & Drop Functions
  const startDrag = (appId: string, fromType: 'page' | 'dock', pageIndex?: number, itemIndex: number = 0) => {
    draggedApp.value = appId
    draggedFrom.value = { type: fromType, pageIndex, itemIndex }
  }

  const endDrag = () => {
    draggedApp.value = null
    draggedFrom.value = null
  }

  const dropOnPage = (targetPageIndex: number, targetIndex: number) => {
    if (!draggedApp.value || !draggedFrom.value) return

    const appId = draggedApp.value
    const fromInfo = draggedFrom.value

    // Ensure target page exists
    ensurePageExists(targetPageIndex)

    // Ensure we don't exceed page limit
    if (targetPageIndex >= MAX_PAGES) return

    // Check if target page has space (unless moving within same page)
    const isSamePage = fromInfo.type === 'page' && fromInfo.pageIndex === targetPageIndex
    if (!isSamePage && layout.value.pages[targetPageIndex].length >= MAX_APPS_PER_PAGE) return

    // Remove from source
    if (fromInfo.type === 'page' && fromInfo.pageIndex !== undefined) {
      const fromPage = layout.value.pages[fromInfo.pageIndex]
      const fromIndex = fromPage.indexOf(appId)
      if (fromIndex !== -1) {
        fromPage.splice(fromIndex, 1)
        // Adjust target index if moving within same page and removing from before target
        if (isSamePage && fromIndex < targetIndex) {
          targetIndex--
        }
      }
    } else if (fromInfo.type === 'dock') {
      const dockIndex = layout.value.dock.indexOf(appId)
      if (dockIndex !== -1) {
        layout.value.dock.splice(dockIndex, 1)
      }
    }

    // Add to target page
    const targetPage = layout.value.pages[targetPageIndex]
    const insertIndex = Math.min(targetIndex, targetPage.length)
    targetPage.splice(insertIndex, 0, appId)

    endDrag()
    saveLayout()
  }

  const dropOnDock = (targetIndex: number) => {
    if (!draggedApp.value || !draggedFrom.value) return

    const appId = draggedApp.value
    const fromInfo = draggedFrom.value

    // Check if dock has space
    if (layout.value.dock.length >= MAX_DOCK_APPS && fromInfo.type !== 'dock') return

    // Remove from source
    if (fromInfo.type === 'page' && fromInfo.pageIndex !== undefined) {
      const fromPage = layout.value.pages[fromInfo.pageIndex]
      const fromIndex = fromPage.indexOf(appId)
      if (fromIndex !== -1) {
        fromPage.splice(fromIndex, 1)
      }
    } else if (fromInfo.type === 'dock') {
      const dockIndex = layout.value.dock.indexOf(appId)
      if (dockIndex !== -1) {
        layout.value.dock.splice(dockIndex, 1)
      }
    }

    // Add to dock
    const insertIndex = Math.min(targetIndex, layout.value.dock.length)
    layout.value.dock.splice(insertIndex, 0, appId)

    endDrag()
    saveLayout()
  }

  const canDropOnPage = (pageIndex: number) => {
    return pageIndex < MAX_PAGES && layout.value.pages[pageIndex]?.length < MAX_APPS_PER_PAGE
  }

  const canDropOnDock = () => {
    return layout.value.dock.length < MAX_DOCK_APPS || (draggedFrom.value?.type === 'dock')
  }
  
  const removeFromGrid = (appId: string) => {
    for (let i = 0; i < layout.value.pages.length; i++) {
      const idx = layout.value.pages[i].indexOf(appId)
      if (idx !== -1) {
        layout.value.pages[i].splice(idx, 1)
        saveLayout()
        return
      }
    }
  }

  const removeFromDock = (appId: string) => {
    const idx = layout.value.dock.indexOf(appId)
    if (idx !== -1) {
      layout.value.dock.splice(idx, 1)
      saveLayout()
    }
  }

  const ensurePageExists = (pageIndex: number) => {
    while (layout.value.pages.length <= pageIndex) {
      layout.value.pages.push([])
    }
  }

  const installApp = (appId: string) => {
    if (isAppInstalled.value(appId)) {
      console.warn(`App ${appId} is already installed.`);
      return;
    }

    for (let i = 0; i < layout.value.pages.length; i++) {
      if (layout.value.pages[i].length < MAX_APPS_PER_PAGE) {
        layout.value.pages[i].push(appId);
        saveLayout();
        return;
      }
    }

    if (layout.value.pages.length < MAX_PAGES) {
      layout.value.pages.push([appId]);
      saveLayout();
      return;
    }

    alert('Home Screen is full. Cannot install new app.');
  };

  const saveLayout = async () => {
    console.log('💾 Salvando layout (mock):', JSON.stringify(layout.value))
  }

  const loadLayout = async (identifier?: string) => {
    loading.value = true
    try {
      // Aqui você poderia carregar o layout de uma API ou localStorage
      // Por enquanto, usamos o mock.
      layout.value = mockLayout
      console.log('📱 Layout carregado (mock):', identifier)
    } catch (error) {
      console.error('Erro ao carregar layout:', error)
      layout.value = mockLayout
    } finally {
      loading.value = false
      isLayoutLoaded.value = true
    }
  }

  return {
    // State
    layout,
    isEditing,
    loading,
    isLayoutLoaded,
    currentPage,
    currentAppConfig,
    draggedApp,
    draggedFrom,
    
    // Constants
    MAX_DOCK_APPS,

    // Getters / Computed
    totalPages,
    isNavigationBarVisible,
    statusBarMode,
    statusBarStyle,
    navigationBarMode,
    navigationBarStyle,
    isAppInstalled,
    
    // Actions
    setLayoutConfig,
    toggleEditMode,
    exitEditMode,
    nextPage,
    prevPage,
    goToPage,
    startDrag,
    endDrag,
    dropOnPage,
    dropOnDock,
    canDropOnPage,
    canDropOnDock,
    removeFromGrid,
    removeFromDock,
    installApp,
    loadLayout,
  }
})
