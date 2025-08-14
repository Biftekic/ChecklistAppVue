<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Templates</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Create and manage reusable task templates
        </p>
      </div>
      <button
        @click="showTemplateModal = true"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New Template
      </button>
    </div>

    <!-- Templates Grid -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div
        v-for="template in templates"
        :key="template.id"
        class="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow"
      >
        <div class="p-6">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ template.metadata.name }}
              </h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {{ template.metadata.description }}
              </p>
            </div>
            <div class="flex space-x-2">
              <button
                @click="applyTemplate(template)"
                class="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg"
                title="Apply Template"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button
                @click="editTemplate(template)"
                class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                title="Edit Template"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                @click="deleteTemplate(template.id)"
                class="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                title="Delete Template"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Template Items Preview -->
          <div class="space-y-2">
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Rooms ({{ template.rooms.length }})</h4>
            <div class="space-y-1 max-h-32 overflow-y-auto">
              <div
                v-for="room in template.rooms.slice(0, 3)"
                :key="room.id"
                class="flex items-center text-sm text-gray-600 dark:text-gray-400"
              >
                <svg class="h-4 w-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ room.name }} ({{ room.tasks.length }} tasks)
              </div>
              <div v-if="template.rooms.length > 3" class="text-sm text-gray-500 dark:text-gray-400 italic">
                +{{ template.rooms.length - 3 }} more rooms
              </div>
            </div>
          </div>

          <!-- Template Metadata -->
          <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-sm">
            <span class="text-gray-500 dark:text-gray-400">
              Created {{ formatDate(template.metadata.createdAt) }}
            </span>
            <span class="text-gray-500 dark:text-gray-400">
              Used {{ template.metadata.usageCount || 0 }} times
            </span>
          </div>
        </div>
      </div>

      <!-- Add Template Card -->
      <button
        @click="showTemplateModal = true"
        class="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-all border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 group"
      >
        <div class="p-6 flex flex-col items-center justify-center h-full min-h-[200px]">
          <svg class="h-12 w-12 text-gray-400 group-hover:text-blue-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span class="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
            Create New Template
          </span>
        </div>
      </button>
    </div>

    <!-- Template Customizer Modal -->
    <TemplateCustomizer
      v-if="showTemplateModal"
      :template="editingTemplate"
      @save="handleSaveTemplate"
      @close="closeTemplateModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTemplateStore } from '@/stores/template.store'
import { useChecklistStore } from '@/stores/checklist.store'
import TemplateCustomizer from '@/components/templates/TemplateCustomizer.vue'
import { format } from 'date-fns'
import type { CleaningTemplate } from '@/types/template.types'

const templateStore = useTemplateStore()
const checklistStore = useChecklistStore()

const showTemplateModal = ref(false)
const editingTemplate = ref<CleaningTemplate | null>(null)

const templates = computed(() => templateStore.templates)

const formatDate = (date: Date | string) => {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, 'MMM d, yyyy')
}

const applyTemplate = (template: CleaningTemplate) => {
  const totalTasks = template.rooms.reduce((sum, room) => sum + room.tasks.length, 0)
  if (confirm(`Apply template "${template.metadata.name}"? This will add ${totalTasks} tasks to your list.`)) {
    checklistStore.applyTemplate(template.id)
    // templateStore.incrementUsageCount(template.id) // Not implemented yet
    alert('Template applied successfully!')
  }
}

const editTemplate = (template: CleaningTemplate) => {
  editingTemplate.value = template
  showTemplateModal.value = true
}

const deleteTemplate = (id: string) => {
  if (confirm('Are you sure you want to delete this template?')) {
    // templateStore.removeTemplate(id) // Not implemented yet
  }
}

const handleSaveTemplate = (template: Partial<CleaningTemplate>) => {
  if (editingTemplate.value) {
    // templateStore.updateTemplate(editingTemplate.value.id, template) // Not implemented yet
  } else {
    // templateStore.addTemplate(template as Omit<CleaningTemplate, 'id'>) // Not implemented yet
  }
  closeTemplateModal()
}

const closeTemplateModal = () => {
  showTemplateModal.value = false
  editingTemplate.value = null
}
</script>