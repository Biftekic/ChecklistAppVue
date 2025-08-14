<template>
  <div class="checklist-container">
    <!-- Header with Stats -->
    <div class="mb-6 p-4 bg-white dark:bg-gray-900 rounded-lg shadow">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="text-center">
          <p class="text-2xl font-bold text-blue-600">{{ stats.total }}</p>
          <p class="text-sm text-gray-600 dark:text-gray-400">Total Tasks</p>
        </div>
        <div class="text-center">
          <p class="text-2xl font-bold text-green-600">{{ stats.completed }}</p>
          <p class="text-sm text-gray-600 dark:text-gray-400">Completed</p>
        </div>
        <div class="text-center">
          <p class="text-2xl font-bold text-yellow-600">{{ stats.pending }}</p>
          <p class="text-sm text-gray-600 dark:text-gray-400">Pending</p>
        </div>
        <div class="text-center">
          <p class="text-2xl font-bold text-red-600">{{ stats.overdue }}</p>
          <p class="text-sm text-gray-600 dark:text-gray-400">Overdue</p>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="mb-6 p-4 bg-white dark:bg-gray-900 rounded-lg shadow">
      <div class="flex flex-col md:flex-row gap-4">
        <!-- Search -->
        <div class="flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search tasks..."
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
            @input="updateFilter"
          />
        </div>

        <!-- Category Filter -->
        <select
          v-model="selectedCategory"
          @change="updateFilter"
          class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
        >
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.icon }} {{ category.name }}
          </option>
        </select>

        <!-- Priority Filter -->
        <select
          v-model="selectedPriority"
          @change="updateFilter"
          class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
        >
          <option value="">All Priorities</option>
          <option value="urgent">🔴 Urgent</option>
          <option value="high">🟠 High</option>
          <option value="medium">🟡 Medium</option>
          <option value="low">🟢 Low</option>
        </select>

        <!-- Status Filter -->
        <select
          v-model="selectedStatus"
          @change="updateFilter"
          class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="archived">Archived</option>
        </select>

        <!-- Clear Filters -->
        <button
          @click="clearFilters"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          Clear
        </button>
      </div>
    </div>

    <!-- Add New Task Button -->
    <div class="mb-6">
      <button
        @click="showAddModal = true"
        class="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
      >
        <span class="text-xl">+</span>
        Add New Task
      </button>
    </div>

    <!-- Tasks List -->
    <div class="space-y-4">
      <TransitionGroup name="list" tag="div">
        <ChecklistItem
          v-for="item in filteredItems"
          :key="item.id"
          :item="item"
          :category="getCategoryById(item.categoryId)"
          @toggle="store.toggleItemComplete"
          @edit="editItem"
          @delete="deleteItem"
          @reorder="store.reorderItems"
        />
      </TransitionGroup>

      <!-- Empty State -->
      <div v-if="filteredItems.length === 0" class="text-center py-12">
        <p class="text-gray-500 dark:text-gray-400 text-lg">
          {{ searchQuery || selectedCategory || selectedPriority || selectedStatus 
            ? 'No tasks found matching your filters.' 
            : 'No tasks yet. Create your first task!' }}
        </p>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <TaskModal
      v-if="showAddModal || editingItem"
      :item="editingItem"
      :categories="categories"
      @save="saveItem"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useChecklistStore } from '@/stores/checklist.store'
import ChecklistItem from './ChecklistItem.vue'
import TaskModal from './TaskModal.vue'
import type { ChecklistItem as ChecklistItemType, Priority, ChecklistItemStatus } from '@/types/checklist.types'

const store = useChecklistStore()

const showAddModal = ref(false)
const editingItem = ref<ChecklistItemType | null>(null)
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedPriority = ref<Priority | ''>('')
const selectedStatus = ref<ChecklistItemStatus | ''>('')

const categories = computed(() => store.categories)
const filteredItems = computed(() => store.filteredItems)
const stats = computed(() => store.stats)

function getCategoryById(id: string) {
  return categories.value.find(c => c.id === id)
}

function updateFilter() {
  store.setFilter({
    searchQuery: searchQuery.value,
    categoryId: selectedCategory.value || undefined,
    priority: selectedPriority.value || undefined,
    status: selectedStatus.value || undefined
  })
}

function clearFilters() {
  searchQuery.value = ''
  selectedCategory.value = ''
  selectedPriority.value = ''
  selectedStatus.value = ''
  store.clearFilter()
}

function editItem(item: ChecklistItemType) {
  editingItem.value = { ...item }
}

function deleteItem(id: string) {
  if (confirm('Are you sure you want to delete this task?')) {
    store.deleteItem(id)
  }
}

function saveItem(item: Partial<ChecklistItemType>) {
  if (editingItem.value) {
    store.updateItem(editingItem.value.id, item)
  } else {
    store.addItem({
      title: item.title!,
      description: item.description,
      completed: false,
      priority: item.priority || 'medium',
      dueDate: item.dueDate,
      categoryId: item.categoryId || categories.value[0]?.id || 'default',
      tags: item.tags || [],
      order: store.items.length,
      status: 'pending'
    })
  }
  closeModal()
}

function closeModal() {
  showAddModal.value = false
  editingItem.value = null
}
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-move {
  transition: transform 0.3s ease;
}
</style>