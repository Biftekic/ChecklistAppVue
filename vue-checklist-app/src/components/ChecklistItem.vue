<template>
  <div
    :class="[
      'checklist-item group relative flex items-center gap-3 p-4 rounded-lg border transition-all',
      item.completed ? 'bg-gray-50 dark:bg-gray-800 opacity-75' : 'bg-white dark:bg-gray-900',
      'hover:shadow-md dark:hover:shadow-gray-700/50',
      dragging && 'opacity-50 cursor-move'
    ]"
    :draggable="!readonly"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    @dragover.prevent
    @drop="handleDrop"
  >
    <!-- Checkbox -->
    <div class="flex-shrink-0">
      <input
        type="checkbox"
        :checked="item.completed"
        @change="$emit('toggle', item.id)"
        :disabled="readonly"
        class="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
      />
    </div>

    <!-- Priority Indicator -->
    <div
      :class="[
        'w-1 h-8 rounded-full flex-shrink-0',
        priorityColors[item.priority]
      ]"
      :title="`Priority: ${item.priority}`"
    />

    <!-- Content -->
    <div class="flex-1 min-w-0">
      <h3
        :class="[
          'text-lg font-medium',
          item.completed && 'line-through text-gray-500'
        ]"
      >
        {{ item.title }}
      </h3>
      
      <p v-if="item.description" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
        {{ item.description }}
      </p>

      <!-- Meta Information -->
      <div class="flex flex-wrap items-center gap-2 mt-2">
        <!-- Category -->
        <span
          v-if="category"
          class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full"
          :style="{ backgroundColor: category.color + '20', color: category.color }"
        >
          <span v-if="category.icon" class="mr-1">{{ category.icon }}</span>
          {{ category.name }}
        </span>

        <!-- Due Date -->
        <span
          v-if="item.dueDate"
          :class="[
            'inline-flex items-center px-2 py-1 text-xs font-medium rounded-full',
            isOverdue ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
          ]"
        >
          📅 {{ formatDate(item.dueDate) }}
        </span>

        <!-- Tags -->
        <span
          v-for="tag in item.tags"
          :key="tag"
          class="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-200"
        >
          #{{ tag }}
        </span>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        @click="$emit('edit', item)"
        :disabled="readonly"
        class="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
        title="Edit"
      >
        ✏️
      </button>
      <button
        @click="$emit('delete', item.id)"
        :disabled="readonly"
        class="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
        title="Delete"
      >
        🗑️
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ChecklistItem, Category, Priority } from '@/types/checklist.types'

interface Props {
  item: ChecklistItem
  category?: Category
  readonly?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  toggle: [id: string]
  edit: [item: ChecklistItem]
  delete: [id: string]
  reorder: [draggedId: string, targetId: string]
}>()

const dragging = ref(false)

const priorityColors: Record<Priority, string> = {
  low: 'bg-gray-400',
  medium: 'bg-yellow-400',
  high: 'bg-orange-400',
  urgent: 'bg-red-400'
}

const isOverdue = computed(() => {
  if (!props.item.dueDate || props.item.completed) return false
  return new Date(props.item.dueDate) < new Date()
})

function formatDate(date: Date | string | null): string {
  if (!date) return ''
  const d = new Date(date)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (d.toDateString() === today.toDateString()) {
    return 'Today'
  } else if (d.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow'
  } else {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
}

function handleDragStart(event: DragEvent) {
  dragging.value = true
  event.dataTransfer!.effectAllowed = 'move'
  event.dataTransfer!.setData('itemId', props.item.id)
}

function handleDragEnd() {
  dragging.value = false
}

function handleDrop(event: DragEvent) {
  event.preventDefault()
  const draggedId = event.dataTransfer!.getData('itemId')
  if (draggedId !== props.item.id) {
    emit('reorder', draggedId, props.item.id)
  }
}
</script>