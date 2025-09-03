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
                <div v-for="bar in 4" :key="bar" class="w-1 rounded-sm transition-all" :class="[
                    bar <= signalBars ? iconColorClass : 'bg-gray-600',
                    bar === 1 ? 'h-1' : bar === 2 ? 'h-2' : bar === 3 ? 'h-3' : 'h-4'
                ]"></div>
            </div>

            <!-- Battery -->
            <div class="flex items-center space-x-1">
                <div class="w-6 h-3 relative">
                    <div class="h-full overflow-hidden border transition-all battery-level"
                        style="width: 100%;" :class="batteryBorderColorClass"><svg :width="`${batteryStore.level}%`" height="11">
                            <defs>
                                <clipPath id="dot">
                                    <rect x="94%" y="0" width="6%" height="100%"></rect>
                                </clipPath>
                                <clipPath id="w">
                                    <rect x="0" y="0" width="100%" height="100%" rx="3.75"
                                        fill="rgba(255, 255, 255, 0.5)"></rect>
                                </clipPath>
                            </defs>
                            <defs>
                                <mask id="mask" x="0" y="0" width="100%" height="100%">
                                    <rect x="0" y="0" width="90%" height="100%" fill="white" clip-path="url(#w)"></rect>
                                    <rect x="0" y="0" width="90%" height="100%" rx="3.75"
                                        fill="rgba(255, 255, 255, 0.5)"></rect><text x="45%" y="65%" fill="black"
                                        font-size="12" font-weight="700" font-family="arial" text-anchor="middle"
                                        alignment-baseline="middle">{{batteryStore.level}}</text>
                                </mask>
                            </defs>
                            <rect x="0" y="0" width="90%" height="100%" fill="white"
                                style="mask: url(&quot;#mask&quot;);"></rect>
                            <ellipse cx="92%" cy="50%" rx="8%" ry="20%" fill="rgba(255, 255, 255, 0.5)"
                                clip-path="url(#dot)"></ellipse>
                        </svg>
                    </div>
                    <div class="absolute -right-0.5 top-1 w-1 h-1 rounded-sm" :class="iconColorClass"></div>
                </div>
            </div>
        </div>
    </div>
</template>
