import type { AppConfig } from '@core/nui/utils/appLoader'

const manifest: AppConfig = {
  id: 'calculator',
  name: 'Calculator',
  icon: '🧮',
  preinstalled: true,
  removable: true,
  category: 'store',
  route: '/app/calculator',
  size: 512000, // 512 KB
  statusBar: {
    mode: 'overlay',
    // Style is now omitted to be reactive to the theme
  },
  navigationBar: {
    mode: 'overlay'
  },
  // Store Info
  description: 'Perform calculations with ease.',
  provider: 'LB Phone',
  compatibility: 'Works with this phone',
  inAppPurchases: 'No',
  screenshots: [
    'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/270x585/1c1c1e/eee?text=Calculator',
    'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/270x585/f0f0f0/333?text=Calculator'
  ]
}

export default manifest
