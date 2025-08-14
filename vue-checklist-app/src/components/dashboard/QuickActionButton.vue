<template>
  <router-link
    :to="to"
    :class="`flex flex-col items-center justify-center p-4 rounded-lg border-2 border-dashed transition-all hover:scale-105 ${borderClass} ${bgClass}`"
  >
    <svg :class="`h-8 w-8 mb-2 ${iconClass}`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="iconPath" />
    </svg>
    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ label }}</span>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label: string
  icon: string
  to: string
  color: string
}>()

const borderClass = computed(() => {
  const colors: Record<string, string> = {
    blue: 'border-blue-300 hover:border-blue-400 dark:border-blue-700 dark:hover:border-blue-600',
    green: 'border-green-300 hover:border-green-400 dark:border-green-700 dark:hover:border-green-600',
    purple: 'border-purple-300 hover:border-purple-400 dark:border-purple-700 dark:hover:border-purple-600',
    gray: 'border-gray-300 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600'
  }
  return colors[props.color] || colors.gray
})

const bgClass = computed(() => {
  const colors: Record<string, string> = {
    blue: 'hover:bg-blue-50 dark:hover:bg-blue-900/20',
    green: 'hover:bg-green-50 dark:hover:bg-green-900/20',
    purple: 'hover:bg-purple-50 dark:hover:bg-purple-900/20',
    gray: 'hover:bg-gray-50 dark:hover:bg-gray-900/20'
  }
  return colors[props.color] || colors.gray
})

const iconClass = computed(() => {
  const colors: Record<string, string> = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    purple: 'text-purple-600 dark:text-purple-400',
    gray: 'text-gray-600 dark:text-gray-400'
  }
  return colors[props.color] || colors.gray
})

const iconPath = computed(() => {
  const icons: Record<string, string> = {
    plus: 'M12 4v16m8-8H4',
    'folder-plus': 'M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z',
    template: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z',
    cog: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
  }
  return icons[props.icon] || icons.plus
})
</script>