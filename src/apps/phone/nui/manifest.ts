import type { AppConfig } from '@core/nui/utils/appLoader'

const manifest: AppConfig = {
  id: 'phone',
  name: 'Phone',
  icon: '📞',
  preinstalled: true,
  removable: false,
  category: 'system',
  route: '/app/phone',
  statusBar: {
    mode: 'default',
    style: 'light'
  },
  navigationBar: {
    mode: 'hidden'
  }
}

export default manifest
