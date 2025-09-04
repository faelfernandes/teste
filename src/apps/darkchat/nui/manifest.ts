import type { AppConfig } from '@core/nui/utils/appLoader'

const manifest: AppConfig = {
  id: 'darkchat',
  name: 'Dark Chat',
  icon: '💬',
  preinstalled: false,
  removable: true,
  category: 'store',
  route: '/app/darkchat',
  statusBar: {
    mode: 'fullscreen',
    style: 'dark'
  },
  navigationBar: {
    mode: 'hidden'
  }
}

export default manifest
