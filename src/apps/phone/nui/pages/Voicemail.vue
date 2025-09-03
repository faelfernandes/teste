<script setup lang="ts">
import { usePhoneStore } from '../store/app-store';
import PageLayout from '@core/nui/components/PageLayout.vue';
import VoicemailItem from '../components/VoicemailItem.vue';

const phoneStore = usePhoneStore();
</script>

<template>
  <PageLayout page-title="Voicemail">
    <div class="p-4 space-y-3">
      <VoicemailItem
        v-for="voicemail in phoneStore.voicemails"
        :key="voicemail.id"
        :voicemail="voicemail"
        :is-selected="phoneStore.selectedVoicemailId === voicemail.id"
        @select="() => phoneStore.selectVoicemail(voicemail.id)"
        @delete="() => phoneStore.deleteVoicemail(voicemail.id)"
      />
    </div>
  </PageLayout>
</template>
