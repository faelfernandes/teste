import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/app/phone',
    component: () => import('../index.vue'),
    redirect: '/app/phone/contacts',
    children: [
      {
        path: 'favorites',
        name: 'phone-favorites',
        component: () => import('../pages/Favorites.vue'),
      },
      {
        path: 'recents',
        name: 'phone-recents',
        component: () => import('../pages/Recents.vue'),
      },
      {
        path: 'recents/:callId',
        name: 'phone-recents-detail',
        component: () => import('../pages/RecentDetail.vue'),
        props: true,
        meta: { transition: 'slide-left' }
      },
      {
        path: 'contacts',
        name: 'phone-contacts',
        component: () => import('../pages/Contacts.vue'),
      },
      {
        path: 'my-card',
        name: 'phone-my-card',
        component: () => import('../pages/MyCard.vue'),
        meta: { transition: 'slide-left' }
      },
      {
        path: 'contacts/:contactId',
        name: 'phone-contact-detail',
        component: () => import('../pages/ContactDetail.vue'),
        props: true,
        meta: { transition: 'slide-left' }
      },
      {
        path: 'contacts/:contactId/edit',
        name: 'phone-contact-edit',
        component: () => import('../pages/EditContact.vue'),
        props: true,
        meta: { transition: 'slide-up' }
      },
      {
        path: 'new',
        name: 'phone-new-contact',
        component: () => import('../pages/NewContact.vue'),
        meta: { transition: 'slide-up' }
      },
      {
        path: 'keypad',
        name: 'phone-keypad',
        component: () => import('../pages/Keypad.vue'),
      },
      {
        path: 'voicemail',
        name: 'phone-voicemail',
        component: () => import('../pages/Voicemail.vue'),
      },
    ]
  }
]

export default routes
