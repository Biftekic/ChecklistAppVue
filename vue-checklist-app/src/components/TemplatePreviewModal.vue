<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click.self="$emit('close')">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <span class="text-2xl mr-3">{{ getTemplateIcon(template) }}</span>
            <div>
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                {{ template.metadata.name }}
              </h2>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ template.metadata.category }} Template
              </p>
            </div>
          </div>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Modal Content -->
      <div class="overflow-y-auto max-h-[calc(90vh-140px)] p-6">
        <!-- Template Description -->
        <div class="mb-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Description</h3>
          <p class="text-gray-600 dark:text-gray-300">
            {{ template.metadata.description }}
          </p>
        </div>

        <!-- Template Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <div class="text-sm text-gray-500 dark:text-gray-400">Estimated Time</div>
            <div class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ getEstimatedTime(template) }}
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <div class="text-sm text-gray-500 dark:text-gray-400">Team Size</div>
            <div class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ template.configuration.teamSize.recommended }} person(s)
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <div class="text-sm text-gray-500 dark:text-gray-400">Total Areas</div>
            <div class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ template.rooms.length }}
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <div class="text-sm text-gray-500 dark:text-gray-400">Total Tasks</div>
            <div class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ getTotalTasks(template) }}
            </div>
          </div>
        </div>

        <!-- Template Rooms/Areas -->
        <div class="mb-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">Areas & Tasks</h3>
          <div class="space-y-4">
            <div
              v-for="room in template.rooms"
              :key="room.id"
              class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
            >
              <button
                @click="toggleRoom(room.id)"
                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div class="flex items-center">
                  <svg
                    class="w-5 h-5 mr-2 transition-transform"
                    :class="{ 'rotate-90': expandedRooms.includes(room.id) }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                  <span class="font-medium text-gray-900 dark:text-white">
                    {{ room.name }}
                  </span>
                  <span
                    v-if="room.optional"
                    class="ml-2 px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300 rounded"
                  >
                    Optional
                  </span>
                </div>
                <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                  {{ room.tasks.length }} tasks
                  <svg class="w-4 h-4 ml-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {{ room.estimatedTime }} min
                </div>
              </button>
              
              <!-- Room Tasks (Expandable) -->
              <div v-if="expandedRooms.includes(room.id)" class="px-4 py-3 bg-white dark:bg-gray-800">
                <div class="space-y-2">
                  <div
                    v-for="task in room.tasks"
                    :key="task.id"
                    class="flex items-start p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <div class="flex-1">
                      <div class="flex items-center">
                        <span
                          :class="getPriorityClass(task.priority)"
                          class="w-2 h-2 rounded-full mr-2"
                        ></span>
                        <span class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ task.name }}
                        </span>
                        <span class="ml-2 text-xs text-gray-500 dark:text-gray-400">
                          ({{ task.estimatedTime }} min)
                        </span>
                      </div>
                      <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {{ task.description }}
                      </p>
                      <div v-if="task.supplies.length > 0" class="flex flex-wrap gap-1 mt-2">
                        <span
                          v-for="supply in task.supplies"
                          :key="supply"
                          class="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded"
                        >
                          {{ supply }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Required Supplies -->
        <div v-if="template.supplies.length > 0" class="mb-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">Required Supplies</h3>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
            <div
              v-for="supply in template.supplies"
              :key="supply.id"
              class="flex items-center p-2 bg-gray-50 dark:bg-gray-700 rounded"
            >
              <svg class="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="text-sm text-gray-700 dark:text-gray-300">
                {{ supply.quantity }} {{ supply.unit }} {{ supply.name }}
              </span>
            </div>
          </div>
        </div>

        <!-- Template Tags -->
        <div class="mb-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">Tags</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in template.metadata.tags"
              :key="tag"
              class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
        <button
          @click="$emit('close')"
          class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Close
        </button>
        <button
          @click="$emit('use')"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Use This Template
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { CleaningTemplate } from '@/types/template.types'

const props = defineProps<{
  template: CleaningTemplate
}>()

const emit = defineEmits<{
  close: []
  use: []
}>()

const expandedRooms = ref<string[]>([])

function toggleRoom(roomId: string) {
  const index = expandedRooms.value.indexOf(roomId)
  if (index > -1) {
    expandedRooms.value.splice(index, 1)
  } else {
    expandedRooms.value.push(roomId)
  }
}

function getTemplateIcon(template: CleaningTemplate): string {
  const icons: Record<string, string> = {
    office: '🏢',
    residential: '🏠',
    medical: '🏥',
    hospitality: '🏨',
    retail: '🛍️',
    educational: '🎓',
    industrial: '🏭'
  }
  return icons[template.metadata.category] || '📋'
}

function getEstimatedTime(template: CleaningTemplate): string {
  const { min, max, unit } = template.configuration.estimatedTime
  if (unit === 'hours') {
    return `${min}-${max} hours`
  }
  return `${min}-${max} minutes`
}

function getTotalTasks(template: CleaningTemplate): number {
  return template.rooms.reduce((total, room) => total + room.tasks.length, 0)
}

function getPriorityClass(priority: string): string {
  const classes: Record<string, string> = {
    critical: 'bg-red-500',
    high: 'bg-orange-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500',
    optional: 'bg-gray-400'
  }
  return classes[priority] || 'bg-gray-400'
}
</script>