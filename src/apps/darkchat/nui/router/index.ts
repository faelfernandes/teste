import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/app/darkchat',
    component: () => import('../index.vue'),
    children: [
      {
        path: '',
        name: 'darkchat-signup',
        component: () => import('../pages/SignUp.vue'),
        meta: { transition: 'fade' }
      },
      {
        path: 'login',
        name: 'darkchat-login',
        component: () => import('../pages/Login.vue'),
        meta: { transition: 'fade' }
      },
      {
        path: 'channels',
        name: 'darkchat-channels',
        component: () => import('../pages/ChannelList.vue'),
        meta: { transition: 'fade' }
      }
    ]
  }
]

export default routes
