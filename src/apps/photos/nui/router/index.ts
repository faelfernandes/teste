import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/app/photos',
    component: () => import('../index.vue'),
    redirect: '/app/photos/albums',
    children: [
      {
        path: 'gallery',
        name: 'photos-gallery',
        component: () => import('../pages/Gallery.vue'),
      },
      {
        path: 'albums',
        name: 'photos-albums',
        component: () => import('../pages/Albums.vue'),
      },
      {
        path: 'albums/:albumId',
        name: 'photos-album-detail',
        component: () => import('../pages/AlbumDetail.vue'),
        props: true,
        meta: { transition: 'slide-left' }
      },
      {
        path: 'media-types/:mediaTypeId',
        name: 'photos-media-type-detail',
        component: () => import('../pages/MediaTypeDetail.vue'),
        props: true,
        meta: { transition: 'slide-left' }
      },
    ],
  },
];

export default routes;
