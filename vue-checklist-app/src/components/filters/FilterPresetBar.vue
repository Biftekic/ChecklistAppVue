<template>
  <div class="filter-preset-bar">
    <div class="preset-tabs">
      <!-- Default presets -->
      <button
        v-for="preset in sortedPresets"
        :key="preset.id"
        :class="['preset-tab', { active: activePresetId === preset.id }]"
        @click="applyPreset(preset.id)"
        :title="preset.name"
      >
        <span v-if="preset.icon" class="preset-icon">{{ preset.icon }}</span>
        <span class="preset-name">{{ preset.name }}</span>
        <button
          v-if="!preset.isDefault"
          @click.stop="deletePreset(preset.id)"
          class="delete-preset"
          title="Delete preset"
        >
          ×
        </button>
      </button>

      <!-- Add new preset button -->
      <button
        @click="showSavePresetModal = true"
        class="preset-tab add-preset"
        title="Save current filters as preset"
      >
        <span class="preset-icon">+</span>
        <span class="preset-name">Save Preset</span>
      </button>
    </div>

    <!-- Quick filters -->
    <div class="quick-filters">
      <button
        v-for="filter in quickFilters"
        :key="filter.id"
        :class="['quick-filter', { active: isQuickFilterActive(filter) }]"
        @click="toggleQuickFilter(filter.id)"
        :style="{ '--filter-color': filter.color }"
      >
        <span v-if="filter.icon" class="filter-icon">{{ filter.icon }}</span>
        {{ filter.label }}
      </button>
    </div>

    <!-- Active filters display -->
    <div v-if="hasActiveFilters" class="active-filters">
      <span class="filters-label">Active Filters:</span>
      <div class="filter-chips">
        <span
          v-for="(value, key) in activeFilterChips"
          :key="key"
          class="filter-chip"
        >
          {{ value }}
          <button @click="clearFilter(key)" class="remove-chip">×</button>
        </span>
      </div>
      <button @click="clearAllFilters" class="clear-all">Clear All</button>
    </div>

    <!-- Save Preset Modal -->
    <Teleport to="body">
      <div v-if="showSavePresetModal" class="modal-overlay" @click="closeSaveModal">
        <div class="modal-content" @click.stop>
          <h3>Save Filter Preset</h3>
          <div class="form-group">
            <label for="preset-name">Preset Name</label>
            <input
              id="preset-name"
              v-model="newPresetName"
              type="text"
              placeholder="Enter preset name"
              @keyup.enter="savePreset"
            />
          </div>
          <div class="form-group">
            <label for="preset-icon">Icon (optional)</label>
            <input
              id="preset-icon"
              v-model="newPresetIcon"
              type="text"
              placeholder="Enter emoji or leave blank"
            />
          </div>
          <div class="modal-actions">
            <button @click="closeSaveModal" class="btn-cancel">Cancel</button>
            <button @click="savePreset" class="btn-save" :disabled="!newPresetName">
              Save Preset
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFilterPresetsStore } from '@/stores/filterPresets.store'
import type { FilterCriteria, QuickFilter } from '@/types/filter.types'

const filterStore = useFilterPresetsStore()

// State
const showSavePresetModal = ref(false)
const newPresetName = ref('')
const newPresetIcon = ref('')

// Computed
const sortedPresets = computed(() => filterStore.sortedPresets)
const activePresetId = computed(() => filterStore.activePresetId)
const hasActiveFilters = computed(() => filterStore.hasActiveFilters)
const quickFilters = computed(() => filterStore.quickFilters)

const activeFilterChips = computed(() => {
  const chips: Record<string, string> = {}
  const filters = filterStore.activeFilters

  if (filters.categories?.length) {
    chips.categories = `Categories: ${filters.categories.join(', ')}`
  }
  if (filters.priorities?.length) {
    chips.priorities = `Priority: ${filters.priorities.join(', ')}`
  }
  if (filters.tags?.length) {
    chips.tags = `Tags: ${filters.tags.join(', ')}`
  }
  if (filters.status) {
    chips.status = `Status: ${filters.status}`
  }
  if (filters.completed !== undefined) {
    chips.completed = filters.completed ? 'Completed' : 'Pending'
  }
  if (filters.searchTerm) {
    chips.searchTerm = `Search: "${filters.searchTerm}"`
  }
  if (filters.dateRange) {
    const start = filters.dateRange.start?.toLocaleDateString()
    const end = filters.dateRange.end?.toLocaleDateString()
    if (start || end) {
      chips.dateRange = `Date: ${start || '...'} - ${end || '...'}`
    }
  }

  return chips
})

// Methods
function applyPreset(presetId: string) {
  filterStore.applyPreset(presetId)
}

function deletePreset(presetId: string) {
  if (confirm('Are you sure you want to delete this preset?')) {
    filterStore.deletePreset(presetId)
  }
}

function clearFilter(key: string) {
  filterStore.clearFilter(key as keyof FilterCriteria)
}

function clearAllFilters() {
  filterStore.clearFilters()
}

function toggleQuickFilter(filterId: string) {
  filterStore.applyQuickFilter(filterId)
}

function isQuickFilterActive(filter: QuickFilter): boolean {
  // Check if the quick filter criteria matches current active filters
  const active = filterStore.activeFilters
  for (const [key, value] of Object.entries(filter.filter)) {
    if (JSON.stringify(active[key as keyof FilterCriteria]) !== JSON.stringify(value)) {
      return false
    }
  }
  return true
}

function savePreset() {
  if (!newPresetName.value.trim()) return

  filterStore.savePreset(
    newPresetName.value.trim(),
    filterStore.activeFilters,
    newPresetIcon.value.trim() || undefined
  )

  closeSaveModal()
}

function closeSaveModal() {
  showSavePresetModal.value = false
  newPresetName.value = ''
  newPresetIcon.value = ''
}
</script>

<style scoped>
.filter-preset-bar {
  background: var(--bg-secondary, #f3f4f6);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.preset-tabs {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
  margin-bottom: 0.75rem;
}

.preset-tab {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.preset-tab:hover {
  background: var(--bg-hover, #f9fafb);
  border-color: var(--primary-color, #3b82f6);
}

.preset-tab.active {
  background: var(--primary-color, #3b82f6);
  color: white;
  border-color: var(--primary-color, #3b82f6);
}

.preset-tab.add-preset {
  border-style: dashed;
  color: var(--text-secondary, #6b7280);
}

.preset-icon {
  font-size: 1rem;
}

.preset-name {
  font-weight: 500;
}

.delete-preset {
  margin-left: 0.25rem;
  padding: 0 0.25rem;
  background: transparent;
  border: none;
  color: inherit;
  font-size: 1.25rem;
  cursor: pointer;
  opacity: 0.7;
}

.delete-preset:hover {
  opacity: 1;
}

.quick-filters {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.75rem;
}

.quick-filter {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  background: white;
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 20px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-filter:hover {
  border-color: var(--filter-color, var(--primary-color, #3b82f6));
  background: var(--bg-hover, #f9fafb);
}

.quick-filter.active {
  background: var(--filter-color, var(--primary-color, #3b82f6));
  color: white;
  border-color: var(--filter-color, var(--primary-color, #3b82f6));
}

.filter-icon {
  font-size: 0.875rem;
}

.active-filters {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.filters-label {
  font-size: 0.875rem;
  color: var(--text-secondary, #6b7280);
  font-weight: 500;
}

.filter-chips {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  flex: 1;
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: var(--primary-light, #dbeafe);
  color: var(--primary-dark, #1e40af);
  border-radius: 4px;
  font-size: 0.875rem;
}

.remove-chip {
  padding: 0 0.25rem;
  background: transparent;
  border: none;
  color: inherit;
  font-size: 1rem;
  cursor: pointer;
  opacity: 0.7;
}

.remove-chip:hover {
  opacity: 1;
}

.clear-all {
  padding: 0.375rem 0.75rem;
  background: transparent;
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 4px;
  font-size: 0.875rem;
  color: var(--text-secondary, #6b7280);
  cursor: pointer;
  transition: all 0.2s;
}

.clear-all:hover {
  background: white;
  border-color: var(--danger-color, #ef4444);
  color: var(--danger-color, #ef4444);
}

/* Modal styles */
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
}

.modal-content {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-content h3 {
  margin: 0 0 1rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary, #6b7280);
}

.form-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 4px;
  font-size: 1rem;
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-color, #3b82f6);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.btn-cancel,
.btn-save {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background: white;
  border: 1px solid var(--border-color, #e5e7eb);
  color: var(--text-secondary, #6b7280);
}

.btn-cancel:hover {
  background: var(--bg-hover, #f9fafb);
}

.btn-save {
  background: var(--primary-color, #3b82f6);
  border: 1px solid var(--primary-color, #3b82f6);
  color: white;
}

.btn-save:hover:not(:disabled) {
  background: var(--primary-dark, #2563eb);
}

.btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Scrollbar styles for preset tabs */
.preset-tabs::-webkit-scrollbar {
  height: 4px;
}

.preset-tabs::-webkit-scrollbar-track {
  background: var(--bg-secondary, #f3f4f6);
}

.preset-tabs::-webkit-scrollbar-thumb {
  background: var(--border-color, #e5e7eb);
  border-radius: 2px;
}

.preset-tabs::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary, #6b7280);
}
</style>