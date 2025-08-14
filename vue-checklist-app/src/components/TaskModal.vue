<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 overflow-y-auto">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black bg-opacity-50" @click="$emit('close')"></div>

      <!-- Modal -->
      <div class="flex min-h-screen items-center justify-center p-4">
        <div class="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full">
          <!-- Header -->
          <div class="border-b dark:border-gray-700 px-6 py-4">
            <h2 class="text-xl font-semibold">
              {{ item ? 'Edit Task' : 'Add New Task' }}
            </h2>
          </div>

          <!-- Body -->
          <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
            <!-- Title -->
            <div>
              <label class="block text-sm font-medium mb-2">Title *</label>
              <input
                v-model="formData.title"
                type="text"
                required
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                placeholder="Enter task title"
              />
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium mb-2">Description</label>
              <textarea
                v-model="formData.description"
                rows="3"
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                placeholder="Enter task description"
              ></textarea>
            </div>

            <!-- Category -->
            <div>
              <label class="block text-sm font-medium mb-2">Category</label>
              <select
                v-model="formData.categoryId"
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
              >
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.icon }} {{ category.name }}
                </option>
              </select>
            </div>

            <!-- Priority -->
            <div>
              <label class="block text-sm font-medium mb-2">Priority</label>
              <div class="grid grid-cols-4 gap-2">
                <button
                  v-for="priority in priorities"
                  :key="priority.value"
                  type="button"
                  @click="formData.priority = priority.value"
                  :class="[
                    'px-3 py-2 rounded-lg border transition-colors',
                    formData.priority === priority.value
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  ]"
                >
                  {{ priority.emoji }} {{ priority.label }}
                </button>
              </div>
            </div>

            <!-- Due Date -->
            <div>
              <label class="block text-sm font-medium mb-2">Due Date</label>
              <input
                v-model="formData.dueDate"
                type="date"
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
              />
            </div>

            <!-- Tags -->
            <div>
              <label class="block text-sm font-medium mb-2">Tags</label>
              <div class="flex gap-2 mb-2">
                <input
                  v-model="tagInput"
                  type="text"
                  @keydown.enter.prevent="addTag"
                  class="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                  placeholder="Add tags (press Enter)"
                />
                <button
                  type="button"
                  @click="addTag"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="(tag, index) in formData.tags"
                  :key="index"
                  class="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-200"
                >
                  #{{ tag }}
                  <button
                    type="button"
                    @click="removeTag(index)"
                    class="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                  >
                    ×
                  </button>
                </span>
              </div>
            </div>
          </form>

          <!-- Footer -->
          <div class="border-t dark:border-gray-700 px-6 py-4 flex justify-end gap-3">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              @click="handleSubmit"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {{ item ? 'Update' : 'Create' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { ChecklistItem, Category, Priority } from '@/types/checklist.types'

interface Props {
  item?: ChecklistItem | null
  categories: Category[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  save: [item: Partial<ChecklistItem>]
  close: []
}>()

const priorities = [
  { value: 'low' as Priority, label: 'Low', emoji: '🟢' },
  { value: 'medium' as Priority, label: 'Medium', emoji: '🟡' },
  { value: 'high' as Priority, label: 'High', emoji: '🟠' },
  { value: 'urgent' as Priority, label: 'Urgent', emoji: '🔴' }
]

const formData = reactive<Partial<ChecklistItem>>({
  title: '',
  description: '',
  categoryId: props.categories[0]?.id || 'default',
  priority: 'medium',
  dueDate: null,
  tags: []
})

const tagInput = ref('')

// Initialize form data when editing
watch(() => props.item, (newItem) => {
  if (newItem) {
    Object.assign(formData, {
      title: newItem.title,
      description: newItem.description,
      categoryId: newItem.categoryId,
      priority: newItem.priority,
      dueDate: newItem.dueDate ? new Date(newItem.dueDate).toISOString().split('T')[0] : null,
      tags: [...newItem.tags]
    })
  }
}, { immediate: true })

function addTag() {
  const tag = tagInput.value.trim()
  if (tag && !formData.tags?.includes(tag)) {
    if (!formData.tags) formData.tags = []
    formData.tags.push(tag)
    tagInput.value = ''
  }
}

function removeTag(index: number) {
  formData.tags?.splice(index, 1)
}

function handleSubmit() {
  if (!formData.title?.trim()) {
    alert('Please enter a title')
    return
  }

  emit('save', {
    ...formData,
    dueDate: formData.dueDate ? new Date(formData.dueDate) : null
  })
}
</script>