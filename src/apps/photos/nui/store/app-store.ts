import { defineStore } from 'pinia'
import { ref, computed, markRaw } from 'vue'
import { Video, User, RectangleEllipsis, Download, Copy } from 'lucide-vue-next';

export interface Photo {
  id: number;
  url: string;
  type: 'image' | 'video';
  duration?: string;
}

export interface Album {
  id: number;
  name: string;
  count: number;
  thumbnailUrl: string;
  isFavorite?: boolean;
  isDeletable?: boolean;
  photoIds?: number[];
}

export interface MediaType {
  id: string;
  name: string;
  count: number;
  icon: any; // Component
}

export const usePhotosStore = defineStore('photos', () => {
  const isEditing = ref(false);
  const isSelectionMode = ref(false);
  const selectedPhotoIds = ref<number[]>([]);

  const photos = ref<Photo[]>([
    { id: 1, url: 'https://i.imgur.com/v2QzVzT.jpeg', type: 'video', duration: '0:05' },
    { id: 2, url: 'https://i.imgur.com/sC5B7h1.jpeg', type: 'video', duration: '0:05' },
    { id: 3, url: 'https://i.imgur.com/N8py2nO.jpeg', type: 'image' },
    { id: 4, url: 'https://i.imgur.com/bW5E32P.jpeg', type: 'image' },
    { id: 5, url: 'https://i.imgur.com/8pZ4sZz.png', type: 'image' },
    { id: 6, url: 'https://i.imgur.com/uE4bcT7.png', type: 'image' },
    { id: 7, url: 'https://i.imgur.com/pDRaD3E.png', type: 'image' },
    { id: 8, url: 'https://i.imgur.com/jT8YwLg.png', type: 'image' },
    { id: 9, url: 'https://i.imgur.com/v2QzVzT.jpeg', type: 'image' },
    { id: 10, url: 'https://i.imgur.com/sC5B7h1.jpeg', type: 'image' },
    { id: 11, url: 'https://i.imgur.com/N8py2nO.jpeg', type: 'image' },
    { id: 12, url: 'https://i.imgur.com/bW5E32P.jpeg', type: 'image' },
    { id: 13, url: 'https://i.imgur.com/8pZ4sZz.png', type: 'image' },
    { id: 14, url: 'https://i.imgur.com/uE4bcT7.png', type: 'image' },
    { id: 15, url: 'https://i.imgur.com/pDRaD3E.png', type: 'image' },
  ]);

  const myAlbums = ref<Album[]>([
    { id: 1, name: 'Recents', count: 21, thumbnailUrl: 'https://i.imgur.com/8pZ4sZz.png', isDeletable: false, photoIds: photos.value.map(p => p.id) },
    { id: 2, name: 'Favourites', count: 7, thumbnailUrl: 'https://i.imgur.com/uE4bcT7.png', isFavorite: true, isDeletable: false, photoIds: [5,6,7,8,12,13,14] },
    { id: 3, name: 'Vacation', count: 4, thumbnailUrl: 'https://i.imgur.com/pDRaD3E.png', isDeletable: true, photoIds: [9,10,11,12] },
  ])

  const sharedAlbums = ref<Album[]>([
    { id: 4, name: 'Cars', count: 8, thumbnailUrl: 'https://i.imgur.com/jT8YwLg.png', isDeletable: true, photoIds: [1,2,3,4,9,10,11,12] },
  ])

  const mediaTypes = ref<MediaType[]>([
    { id: 'videos', name: 'Videos', count: 2, icon: markRaw(Video) },
    { id: 'selfies', name: 'Selfies', count: 0, icon: markRaw(User) },
    { id: 'screenshots', name: 'Screenshots', count: 0, icon: markRaw(RectangleEllipsis) },
    { id: 'imports', name: 'Imports', count: 0, icon: markRaw(Download) },
    { id: 'duplicates', name: 'Duplicates', count: 0, icon: markRaw(Copy) },
  ]);

  const selectedCount = computed(() => selectedPhotoIds.value.length);
  const isPhotoSelected = computed(() => (photoId: number) => selectedPhotoIds.value.includes(photoId));

  const getAlbumById = computed(() => {
    return (albumId: number) => {
      return myAlbums.value.find(a => a.id === albumId) || sharedAlbums.value.find(a => a.id === albumId);
    }
  });

  const getPhotosByAlbumId = computed(() => {
    return (albumId: number) => {
      const album = getAlbumById.value(albumId);
      if (!album || !album.photoIds) return [];
      return photos.value.filter(photo => album.photoIds!.includes(photo.id));
    }
  });

  const getPhotosByMediaType = computed(() => {
    return (mediaTypeId: string) => {
      if (mediaTypeId === 'videos') {
        return photos.value.filter(p => p.type === 'video');
      }
      return [];
    }
  });

  const toggleEditing = () => {
    isEditing.value = !isEditing.value;
  };

  const deleteAlbum = (albumId: number) => {
    let index = myAlbums.value.findIndex(a => a.id === albumId);
    if (index !== -1) {
      myAlbums.value.splice(index, 1);
      return;
    }
    index = sharedAlbums.value.findIndex(a => a.id === albumId);
    if (index !== -1) {
      sharedAlbums.value.splice(index, 1);
    }
  };
  
  const clearSelection = () => {
    selectedPhotoIds.value = [];
  };

  const toggleSelectionMode = () => {
    isSelectionMode.value = !isSelectionMode.value;
    if (!isSelectionMode.value) {
      clearSelection();
    }
  };

  const cancelSelectionMode = () => {
    isSelectionMode.value = false;
    clearSelection();
  };

  const togglePhotoSelection = (photoId: number) => {
    if (!isSelectionMode.value) return;
    const index = selectedPhotoIds.value.indexOf(photoId);
    if (index > -1) {
      selectedPhotoIds.value.splice(index, 1);
    } else {
      selectedPhotoIds.value.push(photoId);
    }
  };

  const deleteSelectedPhotos = () => {
    // Remove photos from the main list
    photos.value = photos.value.filter(p => !selectedPhotoIds.value.includes(p.id));

    // Remove photo IDs from all albums and update counts
    const allAlbums = [...myAlbums.value, ...sharedAlbums.value];
    allAlbums.forEach(album => {
      if (album.photoIds) {
        const initialCount = album.photoIds.length;
        album.photoIds = album.photoIds.filter(id => !selectedPhotoIds.value.includes(id));
        album.count -= (initialCount - album.photoIds.length);
      }
    });

    // Exit selection mode
    cancelSelectionMode();
  };

  const addSelectedToFavorites = () => {
    if (selectedPhotoIds.value.length === 0) return;

    const favoritesAlbum = myAlbums.value.find(a => a.id === 2); // Assuming ID 2 is Favourites
    if (favoritesAlbum) {
      selectedPhotoIds.value.forEach(photoId => {
        if (!favoritesAlbum.photoIds?.includes(photoId)) {
          favoritesAlbum.photoIds?.push(photoId);
        }
      });
      favoritesAlbum.count = favoritesAlbum.photoIds?.length || 0;
    }
    
    // After action, exit selection mode
    cancelSelectionMode();
  };

  return {
    myAlbums,
    sharedAlbums,
    mediaTypes,
    isEditing,
    isSelectionMode,
    selectedPhotoIds,
    selectedCount,
    isPhotoSelected,
    getAlbumById,
    getPhotosByAlbumId,
    getPhotosByMediaType,
    toggleEditing,
    deleteAlbum,
    toggleSelectionMode,
    cancelSelectionMode,
    togglePhotoSelection,
    deleteSelectedPhotos,
    addSelectedToFavorites,
  }
})
