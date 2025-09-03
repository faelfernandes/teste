import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useCallStore } from '@core/nui/store/callStore';
import { useModalStore } from '@core/nui/store/modal';

export interface Contact {
  id: number;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  isMyCard?: boolean;
}

export interface NewContactData {
  firstName: string;
  lastName: string;
  phone: string;
}

export interface Voicemail {
  id: number;
  sender: string;
  date: string;
  duration: string;
}

export interface RecentCall {
  id: number;
  name: string;
  secondaryInfo: string;
  time: string;
  type: 'incoming' | 'outgoing' | 'missed';
  initials?: string;
}

export const usePhoneStore = defineStore('phone', () => {
  const callStore = useCallStore();
  const modalStore = useModalStore();
  
  const contacts = ref<Contact[]>([
    { id: 0, name: "LB's Phone", phone: '(123) 456-7890', isMyCard: true, email: 'contact@lbphone.com', address: '1234 Main St' },
    { id: 1, name: 'Anna', phone: '(111) 111-1111' },
    { id: 2, name: 'Breze', phone: '(205) 144-0416', email: 'breze@lbphone.com', address: '1234 Elm St' },
    { id: 3, name: 'Curtis Jackson', phone: '(141) 555-1' },
    { id: 4, name: 'Loaf Scripts', phone: '(480) 294-0940' },
    { id: 5, name: 'Peter', phone: '(156) 644-4151' },
    { id: 6, name: 'Rafae Rafae', phone: '(323) 232-323' },
    { id: 7, name: 'Sally', phone: '(205) 144-0412' },
    { id: 8, name: 'Tom', phone: '(155) 613-5534' },
  ]);

  const voicemails = ref<Voicemail[]>([
    { id: 1, sender: 'Loaf Scripts', date: '30 agosto 2025 at 4:25', duration: '0:00' },
    { id: 2, sender: 'Loaf Scripts', date: '30 agosto 2025 at 2:25', duration: '0:00' },
    { id: 3, sender: '(205) 923-1126', date: '29 agosto 2025 at 18:25', duration: '0:00' },
    { id: 4, sender: '(205) 118-9847', date: '28 agosto 2025 at 9:25', duration: '0:00' },
  ]);
  
  const recents = ref<RecentCall[]>([
    { id: 1, name: '(205) 118-9847', secondaryInfo: 'Unknown', time: 'sábado', type: 'missed', initials: '??' },
    { id: 2, name: '(205) 923-1126', secondaryInfo: 'Unknown', time: 'sábado', type: 'missed', initials: '??' },
    { id: 3, name: '(205) 923-1126', secondaryInfo: 'Unknown', time: 'sábado', type: 'missed', initials: '??' },
    { id: 4, name: '(205) 923-1126', secondaryInfo: 'Unknown', time: 'sábado', type: 'missed', initials: '??' },
    { id: 5, name: 'Breze', secondaryInfo: '(205) 144-0416', time: 'sexta-feira', type: 'incoming', initials: 'B' },
    { id: 6, name: 'No Caller ID', secondaryInfo: 'Unknown', time: 'sexta-feira', type: 'incoming' },
    { id: 7, name: 'Loaf Scripts', secondaryInfo: '(480) 294-0940', time: 'quinta-feira', type: 'outgoing', initials: 'LS' },
  ]);

  const recentsFilter = ref<'all' | 'missed'>('all');
  const isEditingRecents = ref(false);

  const selectedVoicemailId = ref<number | null>(null);
  const isPlayingVoicemail = ref(false);
  const playbackProgress = ref(0);

  const searchQuery = ref('');
  const dialedNumber = ref('');

  const favoriteContactIds = ref<number[]>([2, 4, 5]);
  const isEditingFavorites = ref(false);

  const myCard = computed(() => contacts.value.find(c => c.isMyCard));

  const filteredContacts = computed(() => {
    if (!searchQuery.value) {
      return contacts.value.filter(c => !c.isMyCard);
    }
    const query = searchQuery.value.toLowerCase();
    return contacts.value.filter(
      (contact) =>
        !contact.isMyCard &&
        (contact.name.toLowerCase().includes(query) ||
        contact.phone.replace(/\D/g, '').includes(query.replace(/\D/g, '')))
    );
  });

  const totalContacts = computed(() => contacts.value.filter(c => !c.isMyCard).length);

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length > 1 && parts[1]) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getContactById = computed(() => {
    return (id: number) => contacts.value.find(c => c.id === id);
  });

  const groupedContacts = computed(() => {
    const groups: Record<string, Contact[]> = {};

    const sorted = [...filteredContacts.value].sort((a, b) => a.name.localeCompare(b.name));

    for (const contact of sorted) {
      const firstLetter = contact.name[0].toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(contact);
    }

    return Object.entries(groups).map(([letter, contacts]) => ({
      letter,
      contacts,
    }));
  });

  const alphabet = computed(() => {
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  });

  const appendDigit = (digit: string) => {
    dialedNumber.value += digit;
  };

  const deleteDigit = () => {
    dialedNumber.value = dialedNumber.value.slice(0, -1);
  };

  const clearDialedNumber = () => {
    dialedNumber.value = '';
  };

  const makeCall = () => {
    if (dialedNumber.value) {
      callStore.startCall({
        contactName: dialedNumber.value,
        contactLabel: 'Mobile',
        callType: 'voice'
      });
    }
  };

  const addContact = (data: NewContactData) => {
    const newContact: Contact = {
      id: Date.now(),
      name: `${data.firstName} ${data.lastName}`.trim(),
      phone: data.phone,
    };
    contacts.value.push(newContact);
  };

  const updateContact = (updatedData: Contact) => {
    const index = contacts.value.findIndex(c => c.id === updatedData.id);
    if (index !== -1) {
        contacts.value[index] = { ...contacts.value[index], ...updatedData };
    }
  };

  const deleteContact = (contactId: number) => {
    contacts.value = contacts.value.filter(c => c.id !== contactId);
  };

  const selectVoicemail = (id: number) => {
    if (selectedVoicemailId.value === id) {
      selectedVoicemailId.value = null;
      isPlayingVoicemail.value = false;
    } else {
      selectedVoicemailId.value = id;
      isPlayingVoicemail.value = false;
    }
    playbackProgress.value = 0;
  };

  const toggleVoicemailPlayback = () => {
    if (selectedVoicemailId.value !== null) {
      isPlayingVoicemail.value = !isPlayingVoicemail.value;
    }
  };

  const deleteVoicemail = async (id: number) => {
    const result = await modalStore.showModal({
      title: 'Delete Voicemail',
      message: 'Are you sure you want to delete this voicemail?',
      buttons: [
        { id: 'cancel', text: 'Cancel', style: 'cancel' },
        { id: 'delete', text: 'Delete', style: 'destructive' },
      ]
    });

    if (result.buttonId === 'delete') {
      voicemails.value = voicemails.value.filter(v => v.id !== id);
      if (selectedVoicemailId.value === id) {
        selectedVoicemailId.value = null;
        isPlayingVoicemail.value = false;
      }
    }
  };

  const filteredRecents = computed(() => {
    if (recentsFilter.value === 'missed') {
      return recents.value.filter(call => call.type === 'missed');
    }
    return recents.value;
  });

  const getRecentCallById = computed(() => {
    return (id: number) => recents.value.find(call => call.id === id);
  });

  const getCallHistoryByNumber = computed(() => {
    return (phoneNumber: string) => {
      return recents.value.filter(call => call.name === phoneNumber);
    }
  });

  const deleteRecentCall = (id: number) => {
    recents.value = recents.value.filter(call => call.id !== id);
  };

  const favoriteContacts = computed(() => {
    return favoriteContactIds.value.map(id => contacts.value.find(c => c.id === id)).filter(Boolean) as Contact[];
  });

  const isFavorite = computed(() => {
    return (contactId: number) => favoriteContactIds.value.includes(contactId);
  });

  const toggleEditingFavorites = () => {
    isEditingFavorites.value = !isEditingFavorites.value;
  };

  const addFavorite = (contactId: number) => {
    if (!favoriteContactIds.value.includes(contactId)) {
      favoriteContactIds.value.push(contactId);
    }
  };

  const removeFavorite = (contactId: number) => {
    const index = favoriteContactIds.value.indexOf(contactId);
    if (index > -1) {
      favoriteContactIds.value.splice(index, 1);
    }
  };

  const updateMyCard = (updatedData: Partial<Contact>) => {
    const myCardIndex = contacts.value.findIndex(c => c.isMyCard);
    if (myCardIndex !== -1) {
      contacts.value[myCardIndex] = { ...contacts.value[myCardIndex], ...updatedData };
    }
  };

  return {
    contacts,
    myCard,
    voicemails,
    recents,
    recentsFilter,
    isEditingRecents,
    selectedVoicemailId,
    isPlayingVoicemail,
    playbackProgress,
    searchQuery,
    dialedNumber,
    groupedContacts,
    totalContacts,
    alphabet,
    filteredRecents,
    favoriteContacts,
    isEditingFavorites,
    isFavorite,
    getInitials,
    getContactById,
    appendDigit,
    deleteDigit,
    clearDialedNumber,
    makeCall,
    addContact,
    updateContact,
    deleteContact,
    selectVoicemail,
    toggleVoicemailPlayback,
    deleteVoicemail,
    deleteRecentCall,
    getRecentCallById,
    getCallHistoryByNumber,
    toggleEditingFavorites,
    addFavorite,
    removeFavorite,
    updateMyCard,
  };
});
