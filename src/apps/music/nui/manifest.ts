import type { AppConfig } from '@core/nui/utils/appLoader'

const manifest: AppConfig = {
  id: 'music',
  name: 'Music',
  icon: '🎵',
  preinstalled: false,
  removable: true,
  category: 'store',
  route: '/app/music',
  statusBar: {
    mode: 'fullscreen',
    style: 'dark'
  }
}

export default manifest
