<template>
  <div class="category-manager">
    <div class="mb-4">
      <h2 class="text-xl font-semibold mb-4">Categories</h2>
      
      <!-- Add Category Form -->
      <div class="flex gap-2 mb-4">
        <input
          v-model="newCategory.icon"
          type="text"
          placeholder="📁"
          class="w-16 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 text-center"
          maxlength="2"
        />
        <input
          v-model="newCategory.name"
          type="text"
          placeholder="Category name"
          class="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
          @keydown.enter="addCategory"
        />
        <input
          v-model="newCategory.color"
          type="color"
          class="w-16 h-10 rounded-lg border dark:border-gray-700 cursor-pointer"
        />
        <button
          @click="addCategory"
          :disabled="!newCategory.name"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add
        </button>
      </div>

      <!-- Categories List -->
      <div class="space-y-2">
        <div
          v-for="category in categories"
          :key="category.id"
          class="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700"
        >
          <!-- Icon -->
          <span class="text-2xl">{{ category.icon || '📁' }}</span>
          
          <!-- Name -->
          <div class="flex-1">
            <input
              v-if="editingId === category.id"
              v-model="editingName"
              @keydown.enter="saveEdit(category.id)"
              @keydown.esc="cancelEdit"
              @blur="saveEdit(category.id)"
              class="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              ref="editInput"
            />
            <span v-else class="font-medium">{{ category.name }}</span>
          </div>

          <!-- Color -->
          <div
            class="w-6 h-6 rounded-full border dark:border-gray-600"
            :style="{ backgroundColor: category.color }"
          ></div>

          <!-- Item Count -->
          <span class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">
            {{ getCategoryItemCount(category.id) }} items
          </span>

          <!-- Actions -->
          <div class="flex gap-2">
            <button
              @click="startEdit(category)"
              class="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              title="Edit"
            >
              ✏️
            </button>
            <button
              @click="deleteCategory(category.id)"
              :disabled="categories.length === 1"
              class="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Delete"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useChecklistStore } from '@/stores/checklist.store'
import type { Category } from '@/types/checklist.types'

const store = useChecklistStore()

const categories = computed(() => store.categories)
const newCategory = ref({
  name: '',
  icon: '📁',
  color: '#3B82F6'
})

const editingId = ref<string | null>(null)
const editingName = ref('')
const editInput = ref<HTMLInputElement | null>(null)

function getCategoryItemCount(categoryId: string): number {
  return store.items.filter(item => item.categoryId === categoryId).length
}

function addCategory() {
  if (!newCategory.value.name.trim()) return

  store.addCategory({
    name: newCategory.value.name,
    icon: newCategory.value.icon || '📁',
    color: newCategory.value.color,
    order: categories.value.length
  })

  // Reset form
  newCategory.value = {
    name: '',
    icon: '📁',
    color: '#3B82F6'
  }
}

function deleteCategory(id: string) {
  if (categories.value.length === 1) {
    alert('You must have at least one category')
    return
  }

  const itemCount = getCategoryItemCount(id)
  if (itemCount > 0) {
    if (!confirm(`This category contains ${itemCount} items. They will be moved to the default category. Continue?`)) {
      return
    }
  }

  store.deleteCategory(id)
}

function startEdit(category: Category) {
  editingId.value = category.id
  editingName.value = category.name
  nextTick(() => {
    editInput.value?.focus()
    editInput.value?.select()
  })
}

function saveEdit(id: string) {
  if (editingName.value.trim()) {
    store.updateCategory(id, { name: editingName.value })
  }
  cancelEdit()
}

function cancelEdit() {
  editingId.value = null
  editingName.value = ''
}
</script>