import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { FilterPreset, FilterCriteria, QuickFilter, FilterSort, FilterSortBy, FilterSortOrder } from '@/types/filter.types'
import { useChecklistStore } from './checklist.store'
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isAfter, isBefore, isWithinInterval } from 'date-fns'

export const useFilterPresetsStore = defineStore('filterPresets', () => {
  // State
  const presets = ref<FilterPreset[]>([])
  const activePresetId = ref<string | null>(null)
  const activeFilters = ref<FilterCriteria>({})
  const quickFilters = ref<QuickFilter[]>([])
  const recentSearches = ref<string[]>([])
  const maxRecentSearches = 10
  
  // Sorting
  const sortBy = ref<FilterSortBy>('order')
  const sortOrder = ref<FilterSortOrder>('asc')
  
  // Get checklist store
  const checklistStore = useChecklistStore()
  
  // Default presets
  const defaultPresets: FilterPreset[] = [
    {
      id: 'today',
      name: "Today's Tasks",
      icon: 'calendar-today',
      filters: {
        dateRange: {
          start: startOfDay(new Date()),
          end: endOfDay(new Date())
        }
      },
      isDefault: true,
      sortOrder: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'this-week',
      name: 'This Week',
      icon: 'calendar-week',
      filters: {
        dateRange: {
          start: startOfWeek(new Date()),
          end: endOfWeek(new Date())
        }
      },
      isDefault: true,
      sortOrder: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'high-priority',
      name: 'High Priority',
      icon: 'priority-high',
      filters: {
        priorities: ['high', 'urgent']
      },
      isDefault: true,
      sortOrder: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'overdue',
      name: 'Overdue',
      icon: 'alert',
      filters: {
        status: 'overdue'
      },
      isDefault: true,
      sortOrder: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'completed',
      name: 'Completed',
      icon: 'check-circle',
      filters: {
        completed: true
      },
      isDefault: true,
      sortOrder: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'pending',
      name: 'Pending',
      icon: 'clock',
      filters: {
        completed: false
      },
      isDefault: true,
      sortOrder: 6,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]
  
  // Default quick filters
  const defaultQuickFilters: QuickFilter[] = [
    {
      id: 'no-category',
      label: 'Uncategorized',
      icon: 'folder-off',
      filter: { categories: ['uncategorized'] },
      color: 'gray'
    },
    {
      id: 'has-tags',
      label: 'Tagged',
      icon: 'tag',
      filter: {},
      color: 'blue'
    },
    {
      id: 'no-due-date',
      label: 'No Due Date',
      icon: 'calendar-off',
      filter: {},
      color: 'orange'
    }
  ]
  
  // Computed
  const activePreset = computed(() => {
    if (!activePresetId.value) return null
    return presets.value.find(p => p.id === activePresetId.value) || null
  })
  
  const hasActiveFilters = computed(() => {
    return Object.keys(activeFilters.value).length > 0
  })
  
  const customPresets = computed(() => {
    return presets.value.filter(p => !p.isDefault)
  })
  
  const sortedPresets = computed(() => {
    return [...presets.value].sort((a, b) => {
      if (a.sortOrder !== undefined && b.sortOrder !== undefined) {
        return a.sortOrder - b.sortOrder
      }
      return a.name.localeCompare(b.name)
    })
  })
  
  // Actions
  function initialize() {
    // Load saved presets from localStorage
    const savedPresets = localStorage.getItem('filterPresets')
    if (savedPresets) {
      try {
        const parsed = JSON.parse(savedPresets)
        // Convert date strings back to Date objects
        presets.value = parsed.map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt),
          filters: {
            ...p.filters,
            dateRange: p.filters.dateRange ? {
              start: p.filters.dateRange.start ? new Date(p.filters.dateRange.start) : null,
              end: p.filters.dateRange.end ? new Date(p.filters.dateRange.end) : null
            } : undefined
          }
        }))
      } catch (error) {
        console.error('Failed to load filter presets:', error)
        presets.value = [...defaultPresets]
      }
    } else {
      presets.value = [...defaultPresets]
    }
    
    // Load quick filters
    const savedQuickFilters = localStorage.getItem('quickFilters')
    if (savedQuickFilters) {
      try {
        quickFilters.value = JSON.parse(savedQuickFilters)
      } catch (error) {
        console.error('Failed to load quick filters:', error)
        quickFilters.value = [...defaultQuickFilters]
      }
    } else {
      quickFilters.value = [...defaultQuickFilters]
    }
    
    // Load recent searches
    const savedSearches = localStorage.getItem('recentSearches')
    if (savedSearches) {
      try {
        recentSearches.value = JSON.parse(savedSearches)
      } catch (error) {
        console.error('Failed to load recent searches:', error)
        recentSearches.value = []
      }
    }
  }
  
  function savePreset(name: string, filters: FilterCriteria, icon?: string): FilterPreset {
    const existingIndex = presets.value.findIndex(p => p.name === name && !p.isDefault)
    
    if (existingIndex > -1) {
      // Update existing preset
      const preset = presets.value[existingIndex]
      preset.filters = filters
      preset.icon = icon
      preset.updatedAt = new Date()
      persistPresets()
      return preset
    } else {
      // Create new preset
      const newPreset: FilterPreset = {
        id: `custom-${Date.now()}`,
        name,
        icon,
        filters,
        isDefault: false,
        sortOrder: presets.value.length + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      presets.value.push(newPreset)
      persistPresets()
      return newPreset
    }
  }
  
  function deletePreset(presetId: string) {
    const index = presets.value.findIndex(p => p.id === presetId && !p.isDefault)
    if (index > -1) {
      presets.value.splice(index, 1)
      
      // Clear active preset if it was deleted
      if (activePresetId.value === presetId) {
        clearFilters()
      }
      
      persistPresets()
    }
  }
  
  function applyPreset(presetId: string) {
    const preset = presets.value.find(p => p.id === presetId)
    if (preset) {
      activePresetId.value = presetId
      activeFilters.value = { ...preset.filters }
      applyFiltersToStore()
    }
  }
  
  function applyFilters(filters: FilterCriteria) {
    activeFilters.value = { ...filters }
    activePresetId.value = null // Clear preset when custom filters are applied
    applyFiltersToStore()
  }
  
  function applyQuickFilter(quickFilterId: string) {
    const quickFilter = quickFilters.value.find(qf => qf.id === quickFilterId)
    if (quickFilter) {
      // Merge with existing filters
      activeFilters.value = {
        ...activeFilters.value,
        ...quickFilter.filter
      }
      activePresetId.value = null
      applyFiltersToStore()
    }
  }
  
  function clearFilters() {
    activeFilters.value = {}
    activePresetId.value = null
    applyFiltersToStore()
  }
  
  function clearFilter(filterKey: keyof FilterCriteria) {
    delete activeFilters.value[filterKey]
    activePresetId.value = null
    applyFiltersToStore()
  }
  
  function setSearchTerm(searchTerm: string) {
    activeFilters.value.searchTerm = searchTerm
    
    // Add to recent searches
    if (searchTerm && searchTerm.trim().length > 0) {
      addRecentSearch(searchTerm.trim())
    }
    
    activePresetId.value = null
    applyFiltersToStore()
  }
  
  function addRecentSearch(search: string) {
    // Remove if already exists
    const index = recentSearches.value.indexOf(search)
    if (index > -1) {
      recentSearches.value.splice(index, 1)
    }
    
    // Add to beginning
    recentSearches.value.unshift(search)
    
    // Limit size
    if (recentSearches.value.length > maxRecentSearches) {
      recentSearches.value = recentSearches.value.slice(0, maxRecentSearches)
    }
    
    // Persist
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value))
  }
  
  function clearRecentSearches() {
    recentSearches.value = []
    localStorage.removeItem('recentSearches')
  }
  
  function setSorting(by: FilterSortBy, order?: FilterSortOrder) {
    sortBy.value = by
    sortOrder.value = order || (sortBy.value === by && sortOrder.value === 'asc' ? 'desc' : 'asc')
    applyFiltersToStore()
  }
  
  function applyFiltersToStore() {
    // Handle special case for overdue filter
    let dateRange = activeFilters.value.dateRange
    
    if (activeFilters.value.status === 'overdue') {
      // For overdue items, we filter for items with due dates in the past
      const now = new Date()
      dateRange = {
        start: null,
        end: now
      }
    }
    
    // Apply filters to checklist store
    checklistStore.setFilters({
      searchTerm: activeFilters.value.searchTerm || '',
      categoryId: activeFilters.value.categories?.[0] || null,
      priority: activeFilters.value.priorities?.[0] || null,
      status: activeFilters.value.status === 'overdue' ? null : activeFilters.value.status || null,
      tags: activeFilters.value.tags || [],
      completed: activeFilters.value.status === 'overdue' ? false : activeFilters.value.completed,
      dateRange: dateRange,
      sortBy: sortBy.value,
      sortOrder: sortOrder.value,
      // Add a custom flag for overdue filtering
      isOverdueFilter: activeFilters.value.status === 'overdue'
    } as any)
  }
  
  function persistPresets() {
    localStorage.setItem('filterPresets', JSON.stringify(presets.value))
  }
  
  function persistQuickFilters() {
    localStorage.setItem('quickFilters', JSON.stringify(quickFilters.value))
  }
  
  function exportPresets(): string {
    return JSON.stringify({
      presets: customPresets.value,
      quickFilters: quickFilters.value,
      version: '1.0'
    }, null, 2)
  }
  
  function importPresets(jsonString: string) {
    try {
      const data = JSON.parse(jsonString)
      
      if (data.presets) {
        data.presets.forEach((preset: any) => {
          // Ensure dates are Date objects
          preset.createdAt = new Date(preset.createdAt)
          preset.updatedAt = new Date(preset.updatedAt)
          if (preset.filters.dateRange) {
            preset.filters.dateRange.start = preset.filters.dateRange.start ? new Date(preset.filters.dateRange.start) : null
            preset.filters.dateRange.end = preset.filters.dateRange.end ? new Date(preset.filters.dateRange.end) : null
          }
          
          // Add if not exists
          const exists = presets.value.some(p => p.id === preset.id)
          if (!exists) {
            presets.value.push(preset)
          }
        })
      }
      
      if (data.quickFilters) {
        quickFilters.value = [...quickFilters.value, ...data.quickFilters]
      }
      
      persistPresets()
      persistQuickFilters()
      
      return true
    } catch (error) {
      console.error('Failed to import presets:', error)
      return false
    }
  }
  
  // Watch for changes and persist
  watch(presets, persistPresets, { deep: true })
  watch(quickFilters, persistQuickFilters, { deep: true })
  
  // Initialize on store creation
  initialize()
  
  return {
    // State
    presets,
    activePresetId,
    activeFilters,
    quickFilters,
    recentSearches,
    sortBy,
    sortOrder,
    
    // Computed
    activePreset,
    hasActiveFilters,
    customPresets,
    sortedPresets,
    
    // Actions
    initialize,
    savePreset,
    deletePreset,
    applyPreset,
    applyFilters,
    applyQuickFilter,
    clearFilters,
    clearFilter,
    setSearchTerm,
    addRecentSearch,
    clearRecentSearches,
    setSorting,
    exportPresets,
    importPresets
  }
})