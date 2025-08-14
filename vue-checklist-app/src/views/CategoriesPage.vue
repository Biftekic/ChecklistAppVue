<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Categories</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Organize your tasks with categories
        </p>
      </div>
      <button
        @click="showAddModal = true"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New Category
      </button>
    </div>

    <!-- Categories Grid -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="category in categories"
        :key="category.id"
        class="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow"
      >
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <div
              :class="['w-12 h-12 rounded-lg flex items-center justify-center', getCategoryColor(category.color)]"
            >
              <span class="text-2xl">{{ category.icon || '📁' }}</span>
            </div>
            <div class="flex space-x-2">
              <button
                @click="editCategory(category)"
                class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                @click="deleteCategory(category.id)"
                class="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {{ category.name }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
            {{ category.description || 'No description' }}
          </p>
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-400">
              {{ getCategoryTaskCount(category.id) }} tasks
            </span>
            <span :class="['px-2 py-1 rounded-full text-xs font-medium', getPriorityBadge(category.priority || 'Normal')]">
              {{ category.priority || 'Normal' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Add Category Card -->
      <button
        @click="showAddModal = true"
        class="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-all border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 group"
      >
        <div class="p-6 flex flex-col items-center justify-center h-full min-h-[200px]">
          <svg class="h-12 w-12 text-gray-400 group-hover:text-blue-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span class="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
            Add New Category
          </span>
        </div>
      </button>
    </div>

    <!-- Add/Edit Category Modal -->
    <Teleport to="body">
      <div v-if="showAddModal || editingCategory" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-4">
          <div class="fixed inset-0 bg-black opacity-50" @click="closeModal"></div>
          <div class="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {{ editingCategory ? 'Edit Category' : 'New Category' }}
            </h3>
            <form @submit.prevent="saveCategory" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input
                  v-model="categoryForm.name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  v-model="categoryForm.description"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Icon (Emoji)
                </label>
                <input
                  v-model="categoryForm.icon"
                  type="text"
                  placeholder="📁"
                  maxlength="2"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Color
                </label>
                <select
                  v-model="categoryForm.color"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="yellow">Yellow</option>
                  <option value="purple">Purple</option>
                  <option value="red">Red</option>
                  <option value="gray">Gray</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <select
                  v-model="categoryForm.priority"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="Low">Low</option>
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div class="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  @click="closeModal"
                  class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  {{ editingCategory ? 'Update' : 'Create' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useChecklistStore } from '@/stores/checklist.store'
import type { Category } from '@/types/checklist.types'

const checklistStore = useChecklistStore()

const showAddModal = ref(false)
const editingCategory = ref<Category | null>(null)
const categoryForm = ref({
  name: '',
  description: '',
  icon: '📁',
  color: 'blue',
  priority: 'Normal'
})

const categories = computed(() => checklistStore.categories)

const getCategoryTaskCount = (categoryId: string) => {
  return checklistStore.items.filter(item => item.categoryId === categoryId).length
}

const getCategoryColor = (color: string) => {
  const colors: Record<string, string> = {
    blue: 'bg-blue-100 dark:bg-blue-900',
    green: 'bg-green-100 dark:bg-green-900',
    yellow: 'bg-yellow-100 dark:bg-yellow-900',
    purple: 'bg-purple-100 dark:bg-purple-900',
    red: 'bg-red-100 dark:bg-red-900',
    gray: 'bg-gray-100 dark:bg-gray-700'
  }
  return colors[color] || colors.gray
}

const getPriorityBadge = (priority: string) => {
  const badges: Record<string, string> = {
    Low: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    Normal: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    High: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
  }
  return badges[priority] || badges.Normal
}

const editCategory = (category: Category) => {
  editingCategory.value = category
  categoryForm.value = {
    name: category.name,
    description: category.description || '',
    icon: category.icon || '📁',
    color: category.color || 'blue',
    priority: category.priority || 'Normal'
  }
}

const deleteCategory = (id: string) => {
  if (confirm('Are you sure you want to delete this category? Tasks in this category will not be deleted.')) {
    checklistStore.removeCategory(id)
  }
}

const closeModal = () => {
  showAddModal.value = false
  editingCategory.value = null
  categoryForm.value = {
    name: '',
    description: '',
    icon: '📁',
    color: 'blue',
    priority: 'Normal'
  }
}

const saveCategory = () => {
  if (editingCategory.value) {
    // Update existing category
    checklistStore.updateCategory(editingCategory.value.id, categoryForm.value)
  } else {
    // Add new category
    checklistStore.addCategory({
      ...categoryForm.value,
      order: checklistStore.categories.length
    })
  }
  closeModal()
}
</script>