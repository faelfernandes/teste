<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useChatStore, type Message } from '../store/chatStore';
import ChatHeader from '../components/ChatHeader.vue';
import MessageBubble from '../components/MessageBubble.vue';
import DateSeparator from '../components/DateSeparator.vue';
import ChatInput from '../components/ChatInput.vue';

const route = useRoute();
const chatStore = useChatStore();
const chatId = route.params.chatId as string;

const chatContainer = ref<HTMLElement | null>(null);

const handleSendMessage = (message: string) => {
  console.log('Sending message:', message);
  // Futuramente, aqui você adicionará a mensagem ao chatStore
  // Ex: chatStore.addMessage({ ... });
};

const isFirstInSequence = (currentMsg: Message, index: number): boolean => {
  if (index === 0) return true;
  const prevMsg = chatStore.messages[index - 1];
  return prevMsg.type === 'date' || prevMsg.senderId !== currentMsg.senderId;
};

const showTail = (currentMsg: Message, index: number): boolean => {
  if (index === chatStore.messages.length - 1) return true;
  const nextMsg = chatStore.messages[index + 1];
  return nextMsg.type === 'date' || nextMsg.senderId !== currentMsg.senderId;
};

const isGroupChat = computed(() => !!chatStore.groupInfo);

onMounted(() => {
  chatStore.loadChat(chatId);
  // Rola para o final das mensagens após a renderização
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  });
});
</script>

<template>
  <div class="h-full w-full flex flex-col font-sans bg-[#F5F2EB]">
    <!-- Background Image -->
    <div 
      class="absolute inset-0 bg-repeat opacity-60"
      style="background-image: url('https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/2faa/1450/690cbe84625fe49cda500a1374b3915e?Expires=1757289600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=iaSsg5U3~Q8nnQZ1fGyJzQPWIyrOr2eM60rAYSAIP2141clvWFvzKUFVVUUujKhJ3B-YmWcRho1Pw5rbUF1q-zpamHER8Osl45mOS22-RLwUhvwroEb46PSNLYjaoapyv9QQdwEAViPplAnhRhdgR9N7gFv741kFBWz8HwlcDao5SLd1chVEcJkx-7oS5wbYiMphMZwHaN2tkdVvwWT~zvMTG1ARTgt0Xt70qa28qzPQOMmEMQhLttPH59VqLD9un0~4XOLdkGylh2xWGKgH6XhicTtPqxV3fl1eS9Qwec~IOtPkU8bULxBkIgLCVFv1eai0vFP1Q6uY7DriJFdyIw__');"
    ></div>

    <ChatHeader :contact="chatStore.contact" :group-info="chatStore.groupInfo" />

    <main ref="chatContainer" class="flex-1 overflow-y-auto px-4 pt-2 pb-2 relative">
      <div class="flex flex-col">
        <template v-for="(item, index) in chatStore.messages" :key="item.id">
          <DateSeparator v-if="item.type === 'date'" :date="item.content" class="my-2" />
          <MessageBubble 
            v-else 
            :message="item" 
            :is-group-chat="isGroupChat"
            :show-avatar="isFirstInSequence(item, index)"
            :show-name="isFirstInSequence(item, index)"
            :show-tail="showTail(item, index)"
            :class="isFirstInSequence(item, index) ? 'mt-2' : 'mt-0.5'"
          />
        </template>
      </div>
    </main>

    <ChatInput @sendMessage="handleSendMessage" />
  </div>
</template>
