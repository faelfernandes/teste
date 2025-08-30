import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import { loadSystemConfig } from '@core/nui/utils/appLoader'
import HomeScreen from '@core/nui/components/HomeScreen.vue'

/**
 * Creates and configures the Vue Router instance.
 * This function is called from main.ts AFTER the appManager is initialized.
 */
export async function createAppRouter(): Promise<any> {
  const systemConfig = await loadSystemConfig()
  const enabledApps = systemConfig.apps || []
  const appRoutes: RouteRecordRaw[] = []

  // Dynamically import routes from each enabled application
  for (const appId of enabledApps) {
    try {
      const appRouterModule = await import(`../../../apps/${appId}/nui/router/index.ts`)
      if (appRouterModule.default) {
        // Add meta information to each route to identify the parent app
        const routesWithMeta = appRouterModule.default.map((route: RouteRecordRaw) => ({
          ...route,
          meta: { ...route.meta, appId: appId, title: route.meta?.title || appId }
        }));
        appRoutes.push(...routesWithMeta)
      }
    } catch (e) {
      // It's okay if an app doesn't have a router file, just warn.
      // console.warn(`Could not load routes for app: ${appId}`, e)
    }
  }

  // Define the base routes for the OS
  const routes: RouteRecordRaw[] = [
    {
      path: '/',
      name: 'root',
      component: HomeScreen,
    },
    ...appRoutes
  ]

  // Create the router instance
  const router = createRouter({
    history: createWebHashHistory(),
    routes
  })

  return router
}
