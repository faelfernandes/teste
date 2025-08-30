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
  border-radius: 3em; /* Realistic corner radius for an iPhone frame */
  padding: 0.3em; /* Simulates the metal frame thickness */
  box-shadow: 0 0 .1em .25em var(--phone-frame-color), 0 0 0 .4em #d3cde4;
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
  width: 0.4em;
  background: var(--phone-button-color);
  pointer-events: auto;
  cursor: pointer;
  transition: background-color 0.2s;
  box-shadow: inset -.15em 0 .1em #000, inset 0 0 .1em var(--phone-button-color), inset 0 .2em .1em var(--phone-border-color), inset 0 -.2em .1em var(--phone-border-color), inset -.1em .333em .1em #00000080, inset -.1em -.333em .1em #00000080;
}
.physical-buttons .side-button:hover {
  background: #333;
}
.physical-buttons .left {
    position: absolute;
    top: 130px;
    left: -0.6em;
    display: flex;
    flex-direction: column;
    gap: 15px;
}
.physical-buttons .left .silent-switch {
  height: 3em;
  margin-bottom: 10px;
  border-radius: 0.5em 0 0 0.5em;
}
.physical-buttons .left .volume-up,
.physical-buttons .left .volume-down {
  height: 4em;
  border-radius: 0.5em 0 0 0.5em;
}
.physical-buttons .right {
    position: absolute;
    top: 180px;
    right: -0.6em;
}
.physical-buttons .right .power-btn {
  height: 6em;
  border-radius: 0 0.5em 0.5em 0;
  box-shadow: inset .15em 0 .1em #000, inset 0 0 .1em var(--phone-button-color), inset 0 .2em .1em var(--phone-border-color), inset 0 -.2em .1em var(--phone-border-color), inset .1em .333em .1em #00000080, inset .1em -.333em .1em #00000080;
}
</style>
