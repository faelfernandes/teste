<script setup lang="ts">
// Emitters for physical buttons, allowing interaction from the parent component.
defineEmits<{
  power: []
  'volume-up': []
  'volume-down': []
  'silent-switch': []
}>()
</script>

<template>
  <div class="phone-frame-wrapper">
    <!-- The screen content will be passed into this slot. It's clipped by the rounded corners. -->
    <div class="phone-screen">
      <slot></slot>
    </div>
    
    <!-- The static overlay for the notch and bezel. It's visually on top but doesn't block clicks. -->
    <div class="phone-overlay">
      <div class="notch"></div>
    </div>

    <!-- Simplified physical buttons for interaction -->
    <div class="physical-buttons">
      <div class="left">
        <button @click="$emit('silent-switch')" class="side-button silent-switch" title="Silent Switch"></button>
        <button @click="$emit('volume-up')" class="side-button volume-up" title="Volume Up"></button>
        <button @click="$emit('volume-down')" class="side-button volume-down" title="Volume Down"></button>
      </div>
      <div class="right">
        <button @click="$emit('power')" class="side-button power-btn" title="Power"></button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.phone-frame-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  /* This is the black outer shell of the phone */
  background: #000;
  border-radius: 54px; /* Realistic corner radius for an iPhone frame */
  padding: 12px; /* Simulates the metal frame thickness */
  box-shadow: 0 0 1px 2px rgba(150, 150, 150, 0.1), 0 0 0 7px #1c1c1c;
}

.phone-screen {
  width: 100%;
  height: 100%;
  border-radius: 42px; /* Slightly smaller radius for the screen inside the frame */
  overflow: hidden; /* This is crucial for clipping the content */
  position: relative; /* Establishes a stacking context for the content inside */
  background: #000; /* Fallback background for the screen area */
}

.phone-overlay {
  position: absolute;
  /* Inset to match the padding, covering only the screen area */
  inset: 12px; 
  border-radius: 42px; /* Match the screen's corner radius */
  pointer-events: none; /* Allows clicks to pass through to the UI below */
  z-index: 9999; /* Ensures it's on top of all other content */
  /* Simulates the inner shadow of the bezel */
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.7);
}

.notch {
  position: absolute;
  top: 0px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px; /* Width of the Dynamic Island area */
  height: 30px; /* Height of the Dynamic Island area */
  background: #000;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
}

/* Simplified physical buttons, positioned outside the wrapper */
.physical-buttons {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.physical-buttons .side-button {
  position: absolute;
  background: #1c1c1c;
  pointer-events: auto;
  cursor: pointer;
  transition: background-color 0.2s;
}
.physical-buttons .side-button:hover {
  background: #333;
}
.physical-buttons .left {
  top: 130px;
  left: -5px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.physical-buttons .left .silent-switch {
  width: 3px;
  height: 25px;
  border-radius: 2px 0 0 2px;
  margin-bottom: 10px;
}
.physical-buttons .left .volume-up,
.physical-buttons .left .volume-down {
  width: 3px;
  height: 55px;
  border-radius: 2px 0 0 2px;
}
.physical-buttons .right {
  top: 180px;
  right: -5px;
}
.physical-buttons .right .power-btn {
  width: 3px;
  height: 80px;
  border-radius: 0 2px 2px 0;
}
</style>
