<script setup lang="ts">
import { computed } from 'vue'
import { useBatteryStore } from '@core/nui/store/battery'
import { useSystemStore } from '@core/nui/store/system'
import { useLayoutStore } from '@core/nui/store/layout'

defineProps<{
  time: string
}>()

const batteryStore = useBatteryStore()
const systemStore = useSystemStore()
const layoutStore = useLayoutStore()

const signalBars = computed(() => 4) // Simular sinal completo

const textColorClass = computed(() => {
  return layoutStore.statusBarStyle === 'dark' ? 'text-white' : 'text-black'
})

const iconColorClass = computed(() => {
  return layoutStore.statusBarStyle === 'dark' ? 'bg-white' : 'bg-black'
})

const batteryBorderColorClass = computed(() => {
  return layoutStore.statusBarStyle === 'dark' ? 'border-white' : 'border-black'
})

const batteryLevelColor = computed(() => {
  if (batteryStore.isCharging) return 'bg-green-400'
  if (batteryStore.level <= 20) return 'bg-red-500'
  return layoutStore.statusBarStyle === 'dark' ? 'bg-white' : 'bg-black'
})
</script>

<template>
  <div class="flex justify-between items-center px-6 py-2 text-sm font-medium" :class="textColorClass">
    <!-- Left: Time -->
    <div class="font-semibold">
      {{ time }}
    </div>

    <!-- Right: Icons -->
    <div class="flex items-center space-x-1">
      <!-- Signal Bars -->
      <div class="flex items-end space-x-1">
        <div 
          v-for="bar in 4" 
          :key="bar"
          class="w-1 rounded-sm transition-all"
          :class="[
            bar <= signalBars ? iconColorClass : 'bg-gray-600',
            bar === 1 ? 'h-1' : bar === 2 ? 'h-2' : bar === 3 ? 'h-3' : 'h-4'
          ]"
        ></div>
      </div>

      <!-- WiFi Icon -->
      <div class="text-xs" :class="textColorClass">📶</div>

      <!-- Battery -->
      <div class="flex items-center space-x-1">
        <span class="text-xs">
          {{ batteryStore.level }}%
        </span>
        <div class="w-6 h-3 border rounded-sm relative" :class="batteryBorderColorClass">
          <div 
            class="h-full rounded-sm transition-all"
            :class="batteryLevelColor"
            :style="{ width: `${batteryStore.level}%` }"
          ></div>
          <div class="absolute -right-1 top-1 w-1 h-1 rounded-sm" :class="iconColorClass"></div>
        </div>
      </div>
    </div>
  </div>
</template>
