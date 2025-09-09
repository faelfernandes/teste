import { defineStore } from 'pinia'
import { ref, computed, markRaw } from 'vue'
import { Video, User, RectangleEllipsis, Download, Copy } from 'lucide-vue-next';

export interface Photo {
  id: number;
  url: string;
  type: 'image' | 'video';
  duration?: string;
  timestamp: string;
  isFavorite: boolean;
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
    { id: 1, url: 'https://i.imgur.com/v2QzVzT.jpeg', type: 'image', timestamp: '28 de agosto, 10:30', isFavorite: false },
    { id: 2, url: 'https://i.imgur.com/sC5B7h1.jpeg', type: 'image', timestamp: '28 de agosto, 10:31', isFavorite: false },
    { id: 3, url: 'https://i.imgur.com/N8py2nO.jpeg', type: 'image', timestamp: '28 de agosto, 10:32', isFavorite: false },
    { id: 4, url: 'https://i.imgur.com/bW5E32P.jpeg', type: 'image', timestamp: '28 de agosto, 10:33', isFavorite: false },
    { id: 5, url: 'https://i.imgur.com/8pZ4sZz.png', type: 'image', timestamp: '28 de agosto, 10:34', isFavorite: false },
    { id: 6, url: 'https://i.imgur.com/uE4bcT7.png', type: 'image', timestamp: '28 de agosto, 10:30', isFavorite: true },
    { id: 7, url: 'https://i.imgur.com/pDRaD3E.png', type: 'image', timestamp: '28 de agosto, 10:36', isFavorite: false },
    { id: 8, url: 'https://i.imgur.com/jT8YwLg.png', type: 'image', timestamp: '28 de agosto, 10:37', isFavorite: false },
    { id: 9, url: 'https://i.imgur.com/v2QzVzT.jpeg', type: 'image', timestamp: '28 de agosto, 10:38', isFavorite: false },
    { id: 10, url: 'https://i.imgur.com/sC5B7h1.jpeg', type: 'image', timestamp: '28 de agosto, 10:39', isFavorite: false },
    { id: 11, url: 'https://i.imgur.com/N8py2nO.jpeg', type: 'image', timestamp: '28 de agosto, 10:40', isFavorite: false },
    { id: 12, url: 'https://i.imgur.com/bW5E32P.jpeg', type: 'image', timestamp: '28 de agosto, 10:41', isFavorite: false },
    { id: 13, url: 'https://i.imgur.com/8pZ4sZz.png', type: 'image', timestamp: '28 de agosto, 10:42', isFavorite: false },
    { id: 14, url: 'https://i.imgur.com/uE4bcT7.png', type: 'image', timestamp: '28 de agosto, 10:43', isFavorite: false },
    { id: 15, url: 'https://i.imgur.com/pDRaD3E.png', type: 'image', timestamp: '28 de agosto, 10:44', isFavorite: false },
    { id: 16, url: 'https://r2.fivemanage.com/video/bSL8FQosNn9L.mp4', type: 'video', duration: '0:10', timestamp: '27 de agosto, 15:00', isFavorite: false },
    { id: 17, url: 'https://r2.fivemanage.com/video/QceJBfjV4Kpq.mp4', type: 'video', duration: '0:10', timestamp: '27 de agosto, 15:01', isFavorite: false },
  ]);

  const myAlbums = ref<Album[]>([
    { id: 1, name: 'Recents', count: 21, thumbnailUrl: 'https://i.imgur.com/8pZ4sZz.png', isDeletable: false, photoIds: photos.value.map(p => p.id) },
    { id: 2, name: 'Favourites', count: 1, thumbnailUrl: 'https://i.imgur.com/uE4bcT7.png', isFavorite: true, isDeletable: false, photoIds: [6] },
    { id: 3, name: 'Vacation', count: 4, thumbnailUrl: 'https://i.imgur.com/pDRaD3E.png', isDeletable: true, photoIds: [9,10,11,12] },
  ]);

  const sharedAlbums = ref<Album[]>([
    { id: 4, name: 'Cars', count: 8, thumbnailUrl: 'https://i.imgur.com/jT8YwLg.png', isDeletable: true, photoIds: [1,2,3,4,9,10,11,12] },
  ]);

  const mediaTypes = ref<MediaType[]>([
    { id: 'videos', name: 'Videos', count: 2, icon: markRaw(Video) },
    { id: 'selfies', name: 'Selfies', count: 0, icon: markRaw(User) },
    { id: 'screenshots', name: 'Screenshots', count: 0, icon: markRaw(RectangleEllipsis) },
    { id: 'imports', name: 'Imports', count: 0, icon: markRaw(Download) },
    { id: 'duplicates', name: 'Duplicates', count: 0, icon: markRaw(Copy) },
  ]);

  const viewerItems = ref<Photo[]>([]);
  const viewerCurrentIndex = ref(-1);

  const selectedCount = computed(() => selectedPhotoIds.value.length);
  const isPhotoSelected = computed(() => (photoId: number) => selectedPhotoIds.value.includes(photoId));
  const currentViewerItem = computed(() => {
    if (viewerCurrentIndex.value >= 0 && viewerCurrentIndex.value < viewerItems.value.length) {
      return viewerItems.value[viewerCurrentIndex.value];
    }
    return null;
  });

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

  const setupViewer = (context: 'album' | 'mediaType', contextId: string, initialMediaId: number) => {
    let items: Photo[] = [];
    if (context === 'album') {
      items = getPhotosByAlbumId.value(Number(contextId));
    } else if (context === 'mediaType') {
      items = getPhotosByMediaType.value(contextId);
    }
    viewerItems.value = items;
    const initialIndex = items.findIndex(item => item.id === initialMediaId);
    viewerCurrentIndex.value = initialIndex > -1 ? initialIndex : 0;
  };

  const clearViewer = () => {
    viewerItems.value = [];
    viewerCurrentIndex.value = -1;
  };

  const goToNextMedia = () => {
    if (viewerCurrentIndex.value < viewerItems.value.length - 1) {
      viewerCurrentIndex.value++;
    }
  };

  const goToPreviousMedia = () => {
    if (viewerCurrentIndex.value > 0) {
      viewerCurrentIndex.value--;
    }
  };

  const goToMediaAtIndex = (index: number) => {
    if (index >= 0 && index < viewerItems.value.length) {
      viewerCurrentIndex.value = index;
    }
  };

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
    photos.value = photos.value.filter(p => !selectedPhotoIds.value.includes(p.id));
    const allAlbums = [...myAlbums.value, ...sharedAlbums.value];
    allAlbums.forEach(album => {
      if (album.photoIds) {
        const initialCount = album.photoIds.length;
        album.photoIds = album.photoIds.filter(id => !selectedPhotoIds.value.includes(id));
        album.count -= (initialCount - album.photoIds.length);
      }
    });
    cancelSelectionMode();
  };

  const addSelectedToFavorites = () => {
    if (selectedPhotoIds.value.length === 0) return;
    const favoritesAlbum = myAlbums.value.find(a => a.id === 2);
    if (favoritesAlbum) {
      selectedPhotoIds.value.forEach(photoId => {
        if (!favoritesAlbum.photoIds?.includes(photoId)) {
          favoritesAlbum.photoIds?.push(photoId);
        }
      });
      favoritesAlbum.count = favoritesAlbum.photoIds?.length || 0;
    }
    cancelSelectionMode();
  };

  const toggleFavorite = (photoId: number) => {
    const photo = photos.value.find(p => p.id === photoId);
    if (photo) {
      photo.isFavorite = !photo.isFavorite;
      
      const favoritesAlbum = myAlbums.value.find(a => a.id === 2);
      if (favoritesAlbum) {
        if (photo.isFavorite) {
          if (!favoritesAlbum.photoIds?.includes(photoId)) {
            favoritesAlbum.photoIds?.push(photoId);
          }
        } else {
          if (favoritesAlbum.photoIds) {
            const index = favoritesAlbum.photoIds.indexOf(photoId);
            if (index > -1) {
              favoritesAlbum.photoIds.splice(index, 1);
            }
          }
        }
        favoritesAlbum.count = favoritesAlbum.photoIds?.length || 0;
      }
    }
  };

  return {
    myAlbums, sharedAlbums, mediaTypes, isEditing, isSelectionMode, selectedPhotoIds,
    selectedCount, isPhotoSelected, getAlbumById, getPhotosByAlbumId, getPhotosByMediaType,
    toggleEditing, deleteAlbum, toggleSelectionMode, cancelSelectionMode, togglePhotoSelection,
    deleteSelectedPhotos, addSelectedToFavorites,
    viewerItems, viewerCurrentIndex, currentViewerItem, setupViewer, clearViewer,
    goToNextMedia, goToPreviousMedia, goToMediaAtIndex, toggleFavorite,
  };
});
