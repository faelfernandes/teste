import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useModalStore } from '@core/nui/store/modal';

export interface Listing {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  timestamp: string;
  isOwner?: boolean;
}

export interface NewListingData {
  title: string;
  description: string;
  price: number;
}

export const useMarketplaceStore = defineStore('marketplace', () => {
  const modalStore = useModalStore();
  const listings = ref<Listing[]>([
    {
      id: 1,
      title: 'X80 Proto',
      description: 'X80 Proto, white with red details. Has been driven carefully and is in mint condition',
      price: 2000000,
      imageUrl: 'https://img-wrapper.vercel.app/image?url=https://i.imgur.com/v2QzVzT.jpeg',
      timestamp: 'Yesterday, 21:24',
      isOwner: false,
    },
    {
      id: 2,
      title: 'Banshee',
      description: 'Selling my 2020 model Bravado Banshee, low mileage and in perfect condition. Price is negotiable.',
      price: 74999,
      imageUrl: 'https://img-wrapper.vercel.app/image?url=https://i.imgur.com/sC5B7h1.jpeg',
      timestamp: 'agosto 26th, 2025',
      isOwner: false,
    },
    {
      id: 3,
      title: 'Sanchez, 2018 Model',
      description: 'Selling my 2018 Sanchez. It has low mileage and is in perfect condition. Price is negotiable.',
      price: 1999,
      imageUrl: 'https://img-wrapper.vercel.app/image?url=https://i.imgur.com/N8py2nO.jpeg',
      timestamp: 'agosto 25th, 2025',
      isOwner: false,
    },
    {
      id: 4,
      title: 'Dominator',
      description: 'Selling my 2020 model Dominator, low mileage and in perfect condition.',
      price: 49999,
      imageUrl: 'https://img-wrapper.vercel.app/image?url=https://i.imgur.com/bW5E32P.jpeg',
      timestamp: 'agosto 23th, 2025',
      isOwner: true,
    },
  ]);

  const searchQuery = ref('');

  const filteredListings = computed(() => {
    if (!searchQuery.value) {
      return listings.value;
    }
    const query = searchQuery.value.toLowerCase();
    return listings.value.filter(
      listing =>
        listing.title.toLowerCase().includes(query) ||
        listing.description.toLowerCase().includes(query)
    );
  });

  const userListings = computed(() => {
    return filteredListings.value.filter(l => l.isOwner);
  });

  const formatPrice = (price: number) => {
    const formatted = new Intl.NumberFormat('de-DE').format(price);
    return `$${formatted}`;
  };

  const addListing = (data: NewListingData) => {
    const newListing: Listing = {
      id: Date.now(),
      title: data.title,
      description: data.description,
      price: data.price,
      imageUrl: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/200x150/e0e0e0/777?text=New+Post',
      timestamp: 'Just now',
      isOwner: true,
    };
    listings.value.unshift(newListing);
  };

  const deleteListing = async (listingId: number) => {
    const result = await modalStore.showModal({
      title: 'Delete Post',
      message: 'Are you sure you want to delete this post? This action cannot be undone.',
      buttons: [
        { id: 'cancel', text: 'Cancel', style: 'cancel' },
        { id: 'delete', text: 'Delete', style: 'destructive' },
      ]
    });

    if (result.buttonId === 'delete') {
      const index = listings.value.findIndex(l => l.id === listingId);
      if (index !== -1) {
        listings.value.splice(index, 1);
      }
    }
  };

  return {
    listings,
    searchQuery,
    filteredListings,
    userListings,
    formatPrice,
    addListing,
    deleteListing,
  };
});
