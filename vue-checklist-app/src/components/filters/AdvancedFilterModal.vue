<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click="close">
        <div class="modal-container" @click.stop>
          <div class="modal-header">
            <h2>Advanced Filters</h2>
            <button @click="close" class="close-btn">×</button>
          </div>

          <div class="modal-body">
            <!-- Search -->
            <div class="filter-section">
              <label class="filter-label">Search</label>
              <input
                v-model="localFilters.searchTerm"
                type="text"
                placeholder="Search tasks..."
                class="filter-input"
              />
            </div>

            <!-- Categories -->
            <div class="filter-section">
              <label class="filter-label">Categories</label>
              <div class="checkbox-group">
                <label
                  v-for="category in categories"
                  :key="category.id"
                  class="checkbox-label"
                >
                  <input
                    type="checkbox"
                    :value="category.id"
                    :checked="localFilters.categories?.includes(category.id)"
                    @change="toggleCategory(category.id)"
                  />
                  <span class="category-indicator" :style="{ background: category.color }"></span>
                  {{ category.name }}
                </label>
              </div>
            </div>

            <!-- Priority -->
            <div class="filter-section">
              <label class="filter-label">Priority</label>
              <div class="checkbox-group">
                <label
                  v-for="priority in priorities"
                  :key="priority.value"
                  class="checkbox-label"
                >
                  <input
                    type="checkbox"
                    :value="priority.value"
                    :checked="localFilters.priorities?.includes(priority.value)"
                    @change="togglePriority(priority.value)"
                  />
                  <span :class="['priority-badge', `priority-${priority.value}`]">
                    {{ priority.label }}
                  </span>
                </label>
              </div>
            </div>

            <!-- Status -->
            <div class="filter-section">
              <label class="filter-label">Status</label>
              <div class="radio-group">
                <label class="radio-label">
                  <input
                    type="radio"
                    value=""
                    :checked="!localFilters.completed && localFilters.status !== 'overdue'"
                    @change="setStatus(null)"
                  />
                  All Tasks
                </label>
                <label class="radio-label">
                  <input
                    type="radio"
                    value="pending"
                    :checked="localFilters.completed === false"
                    @change="setStatus('pending')"
                  />
                  Pending
                </label>
                <label class="radio-label">
                  <input
                    type="radio"
                    value="completed"
                    :checked="localFilters.completed === true"
                    @change="setStatus('completed')"
                  />
                  Completed
                </label>
                <label class="radio-label">
                  <input
                    type="radio"
                    value="overdue"
                    :checked="localFilters.status === 'overdue'"
                    @change="setStatus('overdue')"
                  />
                  Overdue
                </label>
              </div>
            </div>

            <!-- Date Range -->
            <div class="filter-section">
              <label class="filter-label">Due Date Range</label>
              <div class="date-range">
                <input
                  v-model="dateRangeStart"
                  type="date"
                  class="filter-input date-input"
                  @change="updateDateRange"
                />
                <span class="date-separator">to</span>
                <input
                  v-model="dateRangeEnd"
                  type="date"
                  class="filter-input date-input"
                  @change="updateDateRange"
                />
              </div>
              <div class="quick-dates">
                <button @click="setToday" class="quick-date-btn">Today</button>
                <button @click="setThisWeek" class="quick-date-btn">This Week</button>
                <button @click="setThisMonth" class="quick-date-btn">This Month</button>
                <button @click="clearDateRange" class="quick-date-btn">Clear</button>
              </div>
            </div>

            <!-- Tags -->
            <div class="filter-section">
              <label class="filter-label">Tags</label>
              <div class="tag-input-container">
                <input
                  v-model="tagInput"
                  type="text"
                  placeholder="Enter tag and press Enter"
                  class="filter-input"
                  @keyup.enter="addTag"
                />
                <div v-if="suggestedTags.length" class="tag-suggestions">
                  <button
                    v-for="tag in suggestedTags"
                    :key="tag"
                    @click="selectTag(tag)"
                    class="tag-suggestion"
                  >
                    {{ tag }}
                  </button>
                </div>
              </div>
              <div v-if="localFilters.tags?.length" class="selected-tags">
                <span
                  v-for="tag in localFilters.tags"
                  :key="tag"
                  class="tag-chip"
                >
                  {{ tag }}
                  <button @click="removeTag(tag)" class="remove-tag">×</button>
                </span>
              </div>
            </div>

            <!-- Sorting -->
            <div class="filter-section">
              <label class="filter-label">Sort By</label>
              <div class="sort-controls">
                <select v-model="sortBy" class="filter-select">
                  <option value="order">Manual Order</option>
                  <option value="title">Title</option>
                  <option value="priority">Priority</option>
                  <option value="dueDate">Due Date</option>
                  <option value="createdAt">Created Date</option>
                  <option value="updatedAt">Updated Date</option>
                </select>
                <div class="sort-order">
                  <button
                    :class="['sort-btn', { active: sortOrder === 'asc' }]"
                    @click="sortOrder = 'asc'"
                    title="Ascending"
                  >
                    ↑
                  </button>
                  <button
                    :class="['sort-btn', { active: sortOrder === 'desc' }]"
                    @click="sortOrder = 'desc'"
                    title="Descending"
                  >
                    ↓
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button @click="resetFilters" class="btn btn-secondary">
              Reset All
            </button>
            <div class="footer-actions">
              <button @click="close" class="btn btn-cancel">Cancel</button>
              <button @click="applyFilters" class="btn btn-primary">
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useFilterPresetsStore } from '@/stores/filterPresets.store'
import { useChecklistStore } from '@/stores/checklist.store'
import type { FilterCriteria, DateRange } from '@/types/filter.types'
import type { Priority } from '@/types/checklist.types'
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'

// Props & Emits
const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

// Stores
const filterStore = useFilterPresetsStore()
const checklistStore = useChecklistStore()

// Local state
const localFilters = ref<FilterCriteria>({})
const dateRangeStart = ref('')
const dateRangeEnd = ref('')
const tagInput = ref('')
const sortBy = ref('order')
const sortOrder = ref<'asc' | 'desc'>('asc')

// Static data
const priorities: { value: Priority; label: string }[] = [
  { value: 'urgent', label: 'Urgent' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' }
]

// Computed
const categories = computed(() => checklistStore.categories)
const allTags = computed(() => checklistStore.allTags)

const suggestedTags = computed(() => {
  if (!tagInput.value) return []
  const input = tagInput.value.toLowerCase()
  return allTags.value
    .filter(tag => 
      tag.toLowerCase().includes(input) &&
      !localFilters.value.tags?.includes(tag)
    )
    .slice(0, 5)
})

// Watch for prop changes
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    // Initialize with current filters
    localFilters.value = { ...filterStore.activeFilters }
    sortBy.value = filterStore.sortBy
    sortOrder.value = filterStore.sortOrder
    
    // Set date inputs
    if (localFilters.value.dateRange) {
      dateRangeStart.value = localFilters.value.dateRange.start
        ? localFilters.value.dateRange.start.toISOString().split('T')[0]
        : ''
      dateRangeEnd.value = localFilters.value.dateRange.end
        ? localFilters.value.dateRange.end.toISOString().split('T')[0]
        : ''
    }
  }
})

// Methods
function close() {
  emit('close')
}

function toggleCategory(categoryId: string) {
  if (!localFilters.value.categories) {
    localFilters.value.categories = []
  }
  const index = localFilters.value.categories.indexOf(categoryId)
  if (index > -1) {
    localFilters.value.categories.splice(index, 1)
  } else {
    localFilters.value.categories.push(categoryId)
  }
}

function togglePriority(priority: Priority) {
  if (!localFilters.value.priorities) {
    localFilters.value.priorities = []
  }
  const index = localFilters.value.priorities.indexOf(priority)
  if (index > -1) {
    localFilters.value.priorities.splice(index, 1)
  } else {
    localFilters.value.priorities.push(priority)
  }
}

function setStatus(status: string | null) {
  if (status === 'pending') {
    localFilters.value.completed = false
    delete localFilters.value.status
  } else if (status === 'completed') {
    localFilters.value.completed = true
    delete localFilters.value.status
  } else if (status === 'overdue') {
    localFilters.value.status = 'overdue'
    delete localFilters.value.completed
  } else {
    delete localFilters.value.completed
    delete localFilters.value.status
  }
}

function updateDateRange() {
  const start = dateRangeStart.value ? new Date(dateRangeStart.value) : null
  const end = dateRangeEnd.value ? new Date(dateRangeEnd.value) : null
  
  if (start || end) {
    localFilters.value.dateRange = { start, end }
  } else {
    delete localFilters.value.dateRange
  }
}

function setToday() {
  const today = new Date()
  localFilters.value.dateRange = {
    start: startOfDay(today),
    end: endOfDay(today)
  }
  dateRangeStart.value = today.toISOString().split('T')[0]
  dateRangeEnd.value = today.toISOString().split('T')[0]
}

function setThisWeek() {
  const today = new Date()
  localFilters.value.dateRange = {
    start: startOfWeek(today),
    end: endOfWeek(today)
  }
  dateRangeStart.value = startOfWeek(today).toISOString().split('T')[0]
  dateRangeEnd.value = endOfWeek(today).toISOString().split('T')[0]
}

function setThisMonth() {
  const today = new Date()
  localFilters.value.dateRange = {
    start: startOfMonth(today),
    end: endOfMonth(today)
  }
  dateRangeStart.value = startOfMonth(today).toISOString().split('T')[0]
  dateRangeEnd.value = endOfMonth(today).toISOString().split('T')[0]
}

function clearDateRange() {
  delete localFilters.value.dateRange
  dateRangeStart.value = ''
  dateRangeEnd.value = ''
}

function addTag() {
  if (!tagInput.value.trim()) return
  
  if (!localFilters.value.tags) {
    localFilters.value.tags = []
  }
  
  const tag = tagInput.value.trim()
  if (!localFilters.value.tags.includes(tag)) {
    localFilters.value.tags.push(tag)
  }
  
  tagInput.value = ''
}

function selectTag(tag: string) {
  if (!localFilters.value.tags) {
    localFilters.value.tags = []
  }
  
  if (!localFilters.value.tags.includes(tag)) {
    localFilters.value.tags.push(tag)
  }
  
  tagInput.value = ''
}

function removeTag(tag: string) {
  if (!localFilters.value.tags) return
  
  const index = localFilters.value.tags.indexOf(tag)
  if (index > -1) {
    localFilters.value.tags.splice(index, 1)
  }
}

function resetFilters() {
  localFilters.value = {}
  dateRangeStart.value = ''
  dateRangeEnd.value = ''
  tagInput.value = ''
  sortBy.value = 'order'
  sortOrder.value = 'asc'
}

function applyFilters() {
  filterStore.applyFilters(localFilters.value)
  filterStore.setSorting(sortBy.value as any, sortOrder.value)
  close()
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-container {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 2rem;
  line-height: 1;
  color: var(--text-secondary, #6b7280);
  cursor: pointer;
  padding: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: var(--text-primary, #111827);
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.filter-section {
  margin-bottom: 1.5rem;
}

.filter-label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary, #111827);
}

.filter-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 6px;
  font-size: 1rem;
}

.filter-input:focus {
  outline: none;
  border-color: var(--primary-color, #3b82f6);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.checkbox-group,
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.checkbox-label,
.radio-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
}

.checkbox-label input,
.radio-label input {
  cursor: pointer;
}

.category-indicator {
  width: 1rem;
  height: 1rem;
  border-radius: 4px;
}

.priority-badge {
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
}

.priority-urgent {
  background: #fee2e2;
  color: #dc2626;
}

.priority-high {
  background: #fed7aa;
  color: #ea580c;
}

.priority-medium {
  background: #fef3c7;
  color: #d97706;
}

.priority-low {
  background: #dbeafe;
  color: #2563eb;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.date-input {
  flex: 1;
}

.date-separator {
  color: var(--text-secondary, #6b7280);
  font-size: 0.875rem;
}

.quick-dates {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.quick-date-btn {
  padding: 0.25rem 0.5rem;
  background: var(--bg-secondary, #f3f4f6);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-date-btn:hover {
  background: var(--primary-light, #dbeafe);
  border-color: var(--primary-color, #3b82f6);
  color: var(--primary-dark, #1e40af);
}

.tag-input-container {
  position: relative;
}

.tag-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid var(--border-color, #e5e7eb);
  border-top: none;
  border-radius: 0 0 6px 6px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.tag-suggestion {
  display: block;
  width: 100%;
  padding: 0.5rem 0.75rem;
  background: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  font-size: 0.875rem;
}

.tag-suggestion:hover {
  background: var(--bg-hover, #f9fafb);
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.tag-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: var(--primary-light, #dbeafe);
  color: var(--primary-dark, #1e40af);
  border-radius: 4px;
  font-size: 0.875rem;
}

.remove-tag {
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  padding: 0;
  opacity: 0.7;
}

.remove-tag:hover {
  opacity: 1;
}

.filter-select {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 6px;
  font-size: 1rem;
  background: white;
}

.sort-controls {
  display: flex;
  gap: 0.75rem;
}

.sort-order {
  display: flex;
  gap: 0.25rem;
}

.sort-btn {
  padding: 0.5rem 0.75rem;
  background: white;
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;
}

.sort-btn:hover {
  background: var(--bg-hover, #f9fafb);
}

.sort-btn.active {
  background: var(--primary-color, #3b82f6);
  border-color: var(--primary-color, #3b82f6);
  color: white;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-top: 1px solid var(--border-color, #e5e7eb);
  background: var(--bg-secondary, #f9fafb);
  border-radius: 0 0 12px 12px;
}

.footer-actions {
  display: flex;
  gap: 0.75rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.btn-secondary {
  background: white;
  border-color: var(--border-color, #e5e7eb);
  color: var(--text-secondary, #6b7280);
}

.btn-secondary:hover {
  background: var(--bg-hover, #f9fafb);
}

.btn-cancel {
  background: white;
  border-color: var(--border-color, #e5e7eb);
  color: var(--text-secondary, #6b7280);
}

.btn-cancel:hover {
  background: var(--bg-hover, #f9fafb);
}

.btn-primary {
  background: var(--primary-color, #3b82f6);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-dark, #2563eb);
}

/* Modal transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.95);
}
</style>