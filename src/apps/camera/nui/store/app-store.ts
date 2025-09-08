import { defineStore } from 'pinia'
import { ref, computed, onUnmounted } from 'vue'
import { useIntervalFn } from '@vueuse/core';

export type CameraMode = 'VIDEO' | 'PHOTO' | 'LANDSCAPE';

export const useCameraStore = defineStore('camera', () => {
  const modes = ref<CameraMode[]>(['VIDEO', 'PHOTO', 'LANDSCAPE']);
  const activeMode = ref<CameraMode>('PHOTO');
  
  const zoomLevels = ref([0.5, 1, 2, 5]);
  const activeZoom = ref(1);

  const lastPhotoThumbnail = ref('https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/ed9d/8b5c/233f84a2c692a13329430598f79a2a01?Expires=1757289600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=NSyZnNk-sFWfGOfw3j8ghwhT7bIQEF4KQvYCPdwQHYcySefQ-CU~7DUyqIIsLxFcDr8Limrvc6CVBJIKOTsEI21OkudmA8SyoW72sNBWPUyyV-qHzn8ingwgVT-xc7lHrGqCwIwfSjUDRDjEN3jzeH1MvOjZoGSSv4JmgtvZM4Wqic33A0HLNsXr4i2HEI16fLWHUv7OlasYbSTyS1pNVRsSk98l9q-okJPl9thNM9FnZa2E2Z5eKatMfq5J43u3VF-0artPd01G1kwYatqOLfntjrvX2fBiZ7luuamPUbyas4JsYaaOyRapMEWlxEKdzah14Y2G5SM8r0w~nBBn6Q__');

  // Video recording state
  const isRecording = ref(false);
  const recordingTime = ref(0); // in seconds
  let recordingInterval: ReturnType<typeof useIntervalFn> | null = null;

  const formattedRecordingTime = computed(() => {
    const hours = Math.floor(recordingTime.value / 3600);
    const minutes = Math.floor((recordingTime.value % 3600) / 60);
    const seconds = recordingTime.value % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  });

  const setMode = (mode: CameraMode) => {
    if (isRecording.value) stopRecording();
    activeMode.value = mode;
  };

  const setZoom = (zoom: number) => {
    activeZoom.value = zoom;
  };

  const takePhoto = () => {
    console.log('Photo taken!');
    // In a real app, you would update the lastPhotoThumbnail here
  };

  const startRecording = () => {
    isRecording.value = true;
    recordingTime.value = 0;
    recordingInterval = useIntervalFn(() => {
      recordingTime.value++;
    }, 1000);
  };

  const stopRecording = () => {
    isRecording.value = false;
    recordingInterval?.pause();
    // In a real app, you might save the video here
  };

  const toggleRecording = () => {
    if (isRecording.value) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleMainAction = () => {
    if (activeMode.value === 'VIDEO') {
      toggleRecording();
    } else {
      takePhoto();
    }
  };

  const switchCamera = () => {
    console.log('Switching camera');
  };

  onUnmounted(() => {
    recordingInterval?.pause();
  });

  return {
    modes,
    activeMode,
    zoomLevels,
    activeZoom,
    lastPhotoThumbnail,
    isRecording,
    formattedRecordingTime,
    setMode,
    setZoom,
    handleMainAction,
    switchCamera,
  }
})
