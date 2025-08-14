<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ title }}</p>
        <p class="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{{ value }}</p>
        <p class="mt-2 text-sm" :class="changeClass">
          {{ change }} from last week
        </p>
      </div>
      <div :class="`p-3 rounded-lg ${iconBgClass}`">
        <svg class="h-6 w-6" :class="iconClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="iconPath" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  value: number | string
  change: string
  icon: string
  color: string
}>()

const changeClass = computed(() => {
  if (props.change.startsWith('+')) {
    return 'text-green-600 dark:text-green-400'
  } else if (props.change.startsWith('-')) {
    return 'text-red-600 dark:text-red-400'
  }
  return 'text-gray-600 dark:text-gray-400'
})

const iconBgClass = computed(() => {
  const colors: Record<string, string> = {
    blue: 'bg-blue-100 dark:bg-blue-900',
    green: 'bg-green-100 dark:bg-green-900',
    yellow: 'bg-yellow-100 dark:bg-yellow-900',
    purple: 'bg-purple-100 dark:bg-purple-900'
  }
  return colors[props.color] || 'bg-gray-100 dark:bg-gray-900'
})

const iconClass = computed(() => {
  const colors: Record<string, string> = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    yellow: 'text-yellow-600 dark:text-yellow-400',
    purple: 'text-purple-600 dark:text-purple-400'
  }
  return colors[props.color] || 'text-gray-600 dark:text-gray-400'
})

const iconPath = computed(() => {
  const icons: Record<string, string> = {
    tasks: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    check: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    clock: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    folder: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z'
  }
  return icons[props.icon] || icons.tasks
})
</script>