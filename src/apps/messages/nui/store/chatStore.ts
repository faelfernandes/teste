import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface Message {
  id: number;
  senderId: string;
  senderName?: string;
  senderAvatarUrl?: string;
  senderColor?: string;
  type: 'text' | 'voice' | 'location' | 'date' | 'media';
  content: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
  reaction?: {
    emoji: string;
    count: number;
  };
  quote?: {
    sender: string;
    text: string;
    color: string;
  };
  mediaUrl?: string;
}

export interface GroupInfo {
  id: string;
  name: string;
  participants: string;
  avatarUrl: string;
}

export interface Contact {
  id: string;
  name: string;
  avatarUrl: string;
  status: string;
  phone: string;
}

// Helper para criar mensagens
const createMessage = (data: Partial<Message> & { id: number; senderId: string }): Message => ({
  type: 'text',
  content: '',
  timestamp: '',
  ...data,
});

const groupMembers: Record<string, Omit<Message, 'id' | 'type' | 'content' | 'timestamp'>> = {
  me: { senderId: 'me' },
  doc: { senderId: 'doc', senderName: 'Emmett "Doc" Brown', senderAvatarUrl: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/ee2d/a5d3/5ef70762e5fa2af8ed7761ecda05a65d?Expires=1757289600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=heIpR1mTtWBSevca2pZz2RHryXL2nCq3cqdRHZ5AS-dLPzdo4JBWmfFRQG4aaiPNay0JGE32mG6dLjCfF8biYup0s0sC1NFJwZ84QkSn5nWKpqPVPgv~WDie0sz-JvHqEjB0nXE0ucJtsPc7KqftuBIwR-0d1-ef1Gvz01WvWTKVZpqCK9~fSONENKKCHpOxcrpBSl9TKGaduSgqHUzX34GYkuLcbM6bhY8vQWlZ3cw5ZWK5T74MjV-pO-7m4SihVT0loMvsrjYtnNWt1rLgY4QBqXkwxPny~xq69K97EUcwtAZJ9pYUdcYFjkmj0N6ja~mSeH-HeVVRQpNGWIV4YA__', senderColor: '#A46918' },
  who: { senderId: 'who', senderName: 'Dr. Who', senderAvatarUrl: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/3640/cd28/4a324cd7ad226c16ca3db819bdc67f30?Expires=1757289600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=LTyROdHJdIlRaQOS4KqyvdOtSOpOEbh~sUivR6CFogeS1rnOLMoHe2YJGlAVqfptRrGhgSuIu2AyAzwcyn3ixzT~WDZddMmhH2V-O6B5Wqe9vanMxZI7DTvTz7Wck5Gr0DoFFnnkT-Q5lRiPzMLNfXhNrgcu2c0h~sUK5dVHMbDkqmTM46YV0urLySfBRA7jTQOAsYiWxPxOu5ssZ6I00Q8tNaqo0CMhaU6~kjUN0i-1370OYmIFuVdzPbsfF-d8Kam5-Peoi45h7TMHym74HznZofpsgBcgDgAejZBIgGc-v16fylmKzOD2xrKEZXOnHbaD6o70sovShCFwa~t-AQ__', senderColor: '#02A698' },
  titor: { senderId: 'titor', senderName: 'Titor', senderAvatarUrl: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/bcf3/a161/d82838770f5d749a814a323fa3d573b9?Expires=1757289600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=r64BIjZFQkGp189B4GtKp2FVoXPe9aqTmUqkw5ir1U2uRIteQIQHl6upMdsv94WQU4GRslHHPxDPdxFVRNQ6JA0BWlTg5MNIR2xrVgEQOVfvfD-OX3apjbTucSN30Bd0Zlz6Wn-3CMkPhWSzNUcDEDruXzID2yUlWEADDHs0ZImbN1YkEkakiyPsGbuuvC5g5Xn1pEa9twvjkCp8~oZbUjYkwyZ6Tw8tEZfWh1msXpZ6VHnis380tuTlS2-rGjjJaSh7731Bi3S8XSAu-IzEKh1PS9nm8I2ZIYd36oSH43N9QDlWHJV~8qN66WvFIJSoDIDF07nph-Bx6QckECxPBw__', senderColor: '#7F66FF' },
  cole: { senderId: 'cole', senderName: 'James Cole', senderAvatarUrl: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/e8bc/e57e/e874d5b5779d8ceefab79f68a31b9063?Expires=1757289600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=AmUrfcCgR5grWdnDy8PhtFdi0pFVwYHwWuz1RCo2HrWSEOCoG~XpSaQ35fPjmHpVo1FKwW38L8DxmokRjvCynIJxVhFjXEXn6t2sY4rsEPXPGr8fLrAsu72lJvmhmzelCGuXl4~yUfBw~fOqXIJt6r1WJhaw0Lk5pucffyKIXFYRU5m9qIPzZLl2O67REO3eGWHKt42uFkM0B2W6nUQS7oCwHwRyAAoZbi-gdHZKTPGOcWsA9nbev7OU58ktlRaeJx9M~7YpZruM~E6LU7hQMnRYlquZW~wMyTDbW1F~fqAHdKmyk3HFP2zjCytHEaeAi3MffnlnGBO-IyoxbVVZsw__', senderColor: '#FA6533' },
  coop: { senderId: 'coop', senderName: 'Joseph "Coop" Cooper', senderAvatarUrl: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/b357/bf94/5bd00aa48e48d5d5a7d566c6fb54b3ab?Expires=1757289600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=FRcvsJd1DsZzVinpLIITF5o0qsiEYEbw6rwFZNAuVL7ieIullPo0YPeWP7RWn8V12NcDYg4g9DI~j1wgZYZmcLA7YQ8S8cQpq1VuSeYL7NP9pywV2YOHn0uvv9s~l62hj6gLb44NnMLB~RC4rgf~-tX43GEc89nLAQqneMWZDSvPUxmVhnnJMwj4gVTi4o8x-1sTl2-jfMFBlvlmSX1KXH~ZNBqYvGg7tW5eEmmuEP7OVLFBjPD-UKy7SzEXh2Rgn3UnPC-WVg~y2B6cob18-Qt2XdUVbxCuhWYyVDsuD6E4pk-pPZH2lQYf~EGc0hvBoKLIzB4pDI9S3IW2ujrdQA__', senderColor: '#A46918' },
};

const groupChatData = {
  info: {
    id: '10',
    name: 'The time travelers ⏰',
    participants: 'Titor, Amy, Marty, Donny, James, William, Joseph, You',
    avatarUrl: ''
  },
  messages: [
    createMessage({ id: 1, type: 'date', senderId: 'system', content: 'Yesterday' }),
    createMessage({ id: 2, ...groupMembers.me, type: 'media', content: 'Who parked the TARDIS in my garage? 😤', mediaUrl: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/2880/5471/c1bff15f193aa1e8b4e42685838fe787?Expires=1757289600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=KBSJrb~3-okwrch9aHGzcn2wyqE0cdyVwvG9TSDYqNLqs4tZLMRvLjWjN4mCuJd0USKKm7UtHi61j42zE81VI~JqUHhg7JPuzzSsREohfQF01pChf78bn2ZLqToaV3rOpSxqapxC-aFMdcZRUgAJ5f~Xq4dZgVdHk~zfh808ZE2KjMZvb9Dp08AbBwbAIY1pLvcvITTaNE6q~TinKNUxWhpIpCw7z2VnCNCCguPgIzACd095tFhAmZWNhWczC9kIm6nAdFd4xUefm24hMOGEiLgUM7sNfvOHmKLGNFLnRZBThXNhnoxV9edQONim4~PG5JmzOlWeyKIsgs7eiq~JYw__', timestamp: '08:30', status: 'read', reaction: { emoji: '🫥', count: 1 } }),
    createMessage({ id: 3, ...groupMembers.who, content: 'Sorry, just popped in for a milkshake from \'85...', timestamp: '08:34' }),
    createMessage({ id: 4, ...groupMembers.doc, content: 'Great Scott! Einstein bit a Morlock in the distant future!', timestamp: '08:35' }),
    createMessage({ id: 5, ...groupMembers.titor, content: 'This has already happened. Including this message. And your reply.', timestamp: '08:35' }),
    createMessage({ id: 6, ...groupMembers.cole, content: 'I just wanted coffee... now I\'m stuck in 1912. Again...', timestamp: '08:55' }),
    createMessage({ id: 7, ...groupMembers.coop, content: 'Guys stop!', timestamp: '09:21' }),
    createMessage({ id: 8, ...groupMembers.coop, content: 'Time is relative... but this chat is pulling me into a notification black hole.', timestamp: '09:21', reaction: { emoji: '❤️', count: 3 } }),
    createMessage({ id: 9, ...groupMembers.me, content: 'Anyway... Group trip? Any era\'s fine, just not 2020. 😬', timestamp: '09:34', status: 'read' }),
    createMessage({ id: 10, ...groupMembers.titor, content: 'You\'ll all laugh...', timestamp: '10:01', quote: { sender: 'You', text: 'Anyway... Group trip? Any era\'s fine, just not 2020. 😬', color: '#D42A66' } }),
    createMessage({ id: 11, ...groupMembers.titor, content: '...until the clock hits 2:17 AM, March 14th, 2036.', timestamp: '10:01' }),
  ]
};

const oneOnOneChatData = {
  contact: {
    id: '7',
    name: 'Emmett "Doc" Brown',
    avatarUrl: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/ee2d/a5d3/5ef70762e5fa2af8ed7761ecda05a65d?Expires=1757289600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=heIpR1mTtWBSevca2pZz2RHryXL2nCq3cqdRHZ5AS-dLPzdo4JBWmfFRQG4aaiPNay0JGE32mG6dLjCfF8biYup0s0sC1NFJwZ84QkSn5nWKpqPVPgv~WDie0sz-JvHqEjB0nXE0ucJtsPc7KqftuBIwR-0d1-ef1Gvz01WvWTKVZpqCK9~fSONENKKCHpOxcrpBSl9TKGaduSgqHUzX34GYkuLcbM6bhY8vQWlZ3cw5ZWK5T74MjV-pO-7m4SihVT0loMvsrjYtnNWt1rLgY4QBqXkwxPny~xq69K97EUcwtAZJ9pYUdcYFjkmj0N6ja~mSeH-HeVVRQpNGWIV4YA__',
    status: 'tap here for contact info',
    phone: '+1 323 555 7777'
  },
  messages: [
    createMessage({ id: 1, type: 'date', senderId: 'system', content: 'Today' }),
    createMessage({ id: 2, senderId: 'friend', content: 'Marty?', timestamp: '10:30' }),
    createMessage({ id: 3, senderId: 'me', content: 'Yeah?', timestamp: '10:31', status: 'read', reaction: { emoji: '❤️', count: 1 } }),
    createMessage({ id: 4, senderId: 'friend', content: 'Marty, you\'ve gotta come back with me!', timestamp: '10:31' }),
    createMessage({ id: 5, senderId: 'me', content: 'Where?', timestamp: '10:32', status: 'read' }),
    createMessage({ id: 6, senderId: 'friend', content: 'Back to the future.', timestamp: '10:32' }),
    createMessage({ 
      id: 7, 
      senderId: 'friend', 
      type: 'voice', 
      content: '0:07', 
      timestamp: '10:33',
      senderAvatarUrl: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/ee2d/a5d3/5ef70762e5fa2af8ed7761ecda05a65d?Expires=1757289600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=heIpR1mTtWBSevca2pZz2RHryXL2nCq3cqdRHZ5AS-dLPzdo4JBWmfFRQG4aaiPNay0JGE32mG6dLjCfF8biYup0s0sC1NFJwZ84QkSn5nWKpqPVPgv~WDie0sz-JvHqEjB0nXE0ucJtsPc7KqftuBIwR-0d1-ef1Gvz01WvWTKVZpqCK9~fSONENKKCHpOxcrpBSl9TKGaduSgqHUzX34GYkuLcbM6bhY8vQWlZ3cw5ZWK5T74MjV-pO-7m4SihVT0loMvsrjYtnNWt1rLgY4QBqXkwxPny~xq69K97EUcwtAZJ9pYUdcYFjkmj0N6ja~mSeH-HeVVRQpNGWIV4YA__'
    }),
    createMessage({ 
      id: 8, 
      senderId: 'friend', 
      type: 'location', 
      content: 'Hill Valley', 
      timestamp: '10:34',
      mediaUrl: 'https://img-wrapper.vercel.app/image?url=https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=400&h=300&fit=crop'
    }),
    createMessage({ 
      id: 9, 
      senderId: 'friend', 
      type: 'voice', 
      content: '0:07', 
      timestamp: '10:33',
      senderAvatarUrl: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/ee2d/a5d3/5ef70762e5fa2af8ed7761ecda05a65d?Expires=1757289600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=heIpR1mTtWBSevca2pZz2RHryXL2nCq3cqdRHZ5AS-dLPzdo4JBWmfFRQG4aaiPNay0JGE32mG6dLjCfF8biYup0s0sC1NFJwZ84QkSn5nWKpqPVPgv~WDie0sz-JvHqEjB0nXE0ucJtsPc7KqftuBIwR-0d1-ef1Gvz01WvWTKVZpqCK9~fSONENKKCHpOxcrpBSl9TKGaduSgqHUzX34GYkuLcbM6bhY8vQWlZ3cw5ZWK5T74MjV-pO-7m4SihVT0loMvsrjYtnNWt1rLgY4QBqXkwxPny~xq69K97EUcwtAZJ9pYUdcYFjkmj0N6ja~mSeH-HeVVRQpNGWIV4YA__'
    })
  ]
};

export const useChatStore = defineStore('chat', () => {
  const currentChat = ref<'group' | 'oneOnOne'>('oneOnOne');
  const messages = ref<Message[]>([]);
  const contact = ref<Contact | null>(null);
  const groupInfo = ref<GroupInfo | null>(null);

  const loadChat = (chatId: string) => {
    // In a real app, you'd fetch data based on chatId
    // For this mock, we'll use the chatId to decide which mock data to load
    if (chatId === '10') { // Group chat ID from messagesStore
      currentChat.value = 'group';
      messages.value = groupChatData.messages;
      groupInfo.value = groupChatData.info;
      contact.value = null;
    } else { // Assume all others are one-on-one
      currentChat.value = 'oneOnOne';
      messages.value = oneOnOneChatData.messages;
      contact.value = oneOnOneChatData.contact;
      groupInfo.value = null;
    }
  };

  const addMessage = (message: Omit<Message, 'id'>) => {
    const newMessage: Message = {
      ...message,
      id: Math.max(...messages.value.map(m => m.id), 0) + 1,
    };
    messages.value.push(newMessage);
  };

  return {
    currentChat,
    messages,
    contact,
    groupInfo,
    loadChat,
    addMessage,
  };
});
