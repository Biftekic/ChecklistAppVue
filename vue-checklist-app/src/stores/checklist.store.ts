import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { 
  ChecklistItem, 
  Category, 
  ChecklistFilter, 
  ChecklistStats,
  Priority,
  ExportData,
  ImportResult,
  BackupInfo,
  StorageStats
} from '@/types/checklist.types'
import { useLocalStorage } from '@vueuse/core'
import { PersistenceService } from '@/services/persistence.service'

export const useChecklistStore = defineStore('checklist', () => {
  // State
  const items = ref<ChecklistItem[]>([])
  const categories = ref<Category[]>([])
  const filter = ref<ChecklistFilter>({})
  const selectedCategoryId = ref<string | null>(null)

  // Local Storage Persistence
  const storedItems = useLocalStorage('checklist-items', items.value)
  const storedCategories = useLocalStorage('checklist-categories', categories.value)

  // Enhanced sync with validation
  watch(items, (newItems) => {
    const success = PersistenceService.saveToLocalStorage('checklist-items-v2', newItems)
    if (success) {
      storedItems.value = newItems
    }
  }, { deep: true })

  watch(categories, (newCategories) => {
    const success = PersistenceService.saveToLocalStorage('checklist-categories-v2', newCategories)
    if (success) {
      storedCategories.value = newCategories
    }
  }, { deep: true })

  // Initialize from local storage
  if (storedItems.value.length > 0) {
    items.value = storedItems.value
  }
  if (storedCategories.value.length > 0) {
    categories.value = storedCategories.value
  }

  // Computed
  const filteredItems = computed(() => {
    let result = [...items.value]

    // Category filter
    if (filter.value.categoryId) {
      result = result.filter(item => item.categoryId === filter.value.categoryId)
    }

    // Priority filter
    if (filter.value.priority) {
      result = result.filter(item => item.priority === filter.value.priority)
    }

    // Status filter
    if (filter.value.status) {
      result = result.filter(item => item.status === filter.value.status)
    }

    // Completed filter
    if (filter.value.completed !== undefined) {
      result = result.filter(item => item.completed === filter.value.completed)
    }

    // Search filter (support both searchTerm and searchQuery for backwards compatibility)
    const searchTerm = filter.value.searchTerm || filter.value.searchQuery
    if (searchTerm) {
      const query = searchTerm.toLowerCase()
      result = result.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Tags filter
    if (filter.value.tags && filter.value.tags.length > 0) {
      result = result.filter(item =>
        filter.value.tags!.some(tag => item.tags.includes(tag))
      )
    }

    // Date range filter (new format)
    if (filter.value.dateRange) {
      const { start, end } = filter.value.dateRange
      if (start) {
        result = result.filter(item =>
          item.dueDate && new Date(item.dueDate) >= start
        )
      }
      if (end) {
        result = result.filter(item =>
          item.dueDate && new Date(item.dueDate) <= end
        )
      }
    } else {
      // Legacy date filters
      if (filter.value.dueDateFrom) {
        result = result.filter(item =>
          item.dueDate && new Date(item.dueDate) >= filter.value.dueDateFrom!
        )
      }
      if (filter.value.dueDateTo) {
        result = result.filter(item =>
          item.dueDate && new Date(item.dueDate) <= filter.value.dueDateTo!
        )
      }
    }

    // Sorting
    const sortBy = filter.value.sortBy || 'order'
    const sortOrder = filter.value.sortOrder || 'asc'
    
    result.sort((a, b) => {
      let compareResult = 0
      
      switch (sortBy) {
        case 'title':
          compareResult = a.title.localeCompare(b.title)
          break
        case 'priority':
          const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 }
          compareResult = priorityOrder[a.priority] - priorityOrder[b.priority]
          break
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) compareResult = 0
          else if (!a.dueDate) compareResult = 1
          else if (!b.dueDate) compareResult = -1
          else compareResult = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          break
        case 'createdAt':
          compareResult = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case 'updatedAt':
          compareResult = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          break
        case 'order':
        default:
          compareResult = a.order - b.order
          break
      }
      
      return sortOrder === 'desc' ? -compareResult : compareResult
    })

    return result
  })

  const stats = computed<ChecklistStats>(() => {
    const now = new Date()
    const stats: ChecklistStats = {
      total: items.value.length,
      completed: 0,
      pending: 0,
      overdue: 0,
      byPriority: { low: 0, medium: 0, high: 0, urgent: 0 },
      byCategory: {}
    }

    items.value.forEach(item => {
      if (item.completed) {
        stats.completed++
      } else {
        stats.pending++
        if (item.dueDate && new Date(item.dueDate) < now) {
          stats.overdue++
        }
      }

      stats.byPriority[item.priority]++
      stats.byCategory[item.categoryId] = (stats.byCategory[item.categoryId] || 0) + 1
    })

    return stats
  })

  const allTags = computed(() => {
    const tags = new Set<string>()
    items.value.forEach(item => {
      item.tags.forEach(tag => tags.add(tag))
    })
    return Array.from(tags)
  })

  // Actions
  function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  function addCategory(category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Category {
    const newCategory: Category = {
      ...category,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    categories.value.push(newCategory)
    return newCategory
  }

  function updateCategory(id: string, updates: Partial<Category>) {
    const index = categories.value.findIndex(c => c.id === id)
    if (index !== -1) {
      categories.value[index] = {
        ...categories.value[index],
        ...updates,
        updatedAt: new Date()
      }
    }
  }

  function deleteCategory(id: string) {
    categories.value = categories.value.filter(c => c.id !== id)
    // Move items from deleted category to default
    items.value.forEach(item => {
      if (item.categoryId === id) {
        item.categoryId = 'default'
      }
    })
  }

  function addItem(item: Omit<ChecklistItem, 'id' | 'createdAt' | 'updatedAt'>): ChecklistItem {
    const newItem: ChecklistItem = {
      ...item,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    items.value.push(newItem)
    return newItem
  }

  function updateItem(id: string, updates: Partial<ChecklistItem>) {
    const index = items.value.findIndex(i => i.id === id)
    if (index !== -1) {
      items.value[index] = {
        ...items.value[index],
        ...updates,
        updatedAt: new Date()
      }
    }
  }

  function deleteItem(id: string) {
    items.value = items.value.filter(i => i.id !== id)
  }

  function toggleItemComplete(id: string) {
    const item = items.value.find(i => i.id === id)
    if (item) {
      item.completed = !item.completed
      item.status = item.completed ? 'completed' : 'pending'
      item.updatedAt = new Date()
    }
  }

  function reorderItems(draggedId: string, targetId: string) {
    const draggedIndex = items.value.findIndex(i => i.id === draggedId)
    const targetIndex = items.value.findIndex(i => i.id === targetId)

    if (draggedIndex !== -1 && targetIndex !== -1) {
      const [draggedItem] = items.value.splice(draggedIndex, 1)
      items.value.splice(targetIndex, 0, draggedItem)

      // Update order values
      items.value.forEach((item, index) => {
        item.order = index
      })
    }
  }

  function setFilter(newFilter: ChecklistFilter) {
    filter.value = newFilter
  }

  function setFilters(newFilter: ChecklistFilter) {
    // Alias for setFilter for consistency with filterPresets store
    filter.value = newFilter
  }

  function clearFilter() {
    filter.value = {}
  }

  // Enhanced Export Functions
  function exportData(): ExportData {
    const data: ExportData = {
      version: '2.0.0',
      exportDate: new Date(),
      categories: categories.value,
      items: items.value,
      metadata: {
        totalItems: items.value.length,
        totalCategories: categories.value.length,
        completedItems: items.value.filter(i => i.completed).length
      }
    }
    
    // Create automatic backup
    PersistenceService.createBackup(items.value, categories.value)
    
    return data
  }

  function exportToJSON(): void {
    const data = exportData()
    PersistenceService.exportToJSON(data)
  }

  function exportToCSV(): void {
    PersistenceService.exportToCSV(items.value, categories.value)
  }

  // Enhanced Import Functions
  function importData(data: ExportData): ImportResult {
    const result: ImportResult = {
      success: false,
      imported: { categories: 0, items: 0 },
      errors: []
    }

    try {
      // Validate data structure
      const validation = PersistenceService.validateData(data)
      if (!validation.valid) {
        result.errors = validation.errors
        return result
      }

      // Create backup before import
      PersistenceService.createBackup(items.value, categories.value)

      // Import categories
      data.categories.forEach(category => {
        if (!categories.value.find(c => c.id === category.id)) {
          categories.value.push(category)
          result.imported.categories++
        }
      })

      // Import items
      data.items.forEach(item => {
        if (!items.value.find(i => i.id === item.id)) {
          items.value.push(item)
          result.imported.items++
        }
      })

      result.success = true
    } catch (error) {
      result.errors.push(`Import failed: ${error}`)
    }

    return result
  }

  async function importFromFile(file: File): Promise<ImportResult> {
    let result: ImportResult
    
    if (file.name.endsWith('.json')) {
      result = await PersistenceService.importFromJSON(file)
      if (result.success && result.data) {
        return importData(result.data as ExportData)
      }
    } else if (file.name.endsWith('.csv')) {
      result = await PersistenceService.importFromCSV(file, categories.value)
      if (result.success && result.data?.items) {
        // Create backup before import
        PersistenceService.createBackup(items.value, categories.value)
        
        // Import CSV items
        result.data.items.forEach(item => {
          if (!items.value.find(i => i.id === item.id)) {
            items.value.push(item)
          }
        })
      }
    } else {
      result = {
        success: false,
        imported: { categories: 0, items: 0 },
        errors: ['Unsupported file format. Please use JSON or CSV files.']
      }
    }
    
    return result
  }

  // Backup and Restore Functions
  function createBackup(): string {
    return PersistenceService.createBackup(items.value, categories.value)
  }

  function getBackupList(): BackupInfo[] {
    return PersistenceService.getBackupList()
  }

  function restoreFromBackup(backupIndex: number = 0): boolean {
    const backup = PersistenceService.restoreBackup(backupIndex)
    
    if (backup) {
      // Clear current data
      items.value = []
      categories.value = []
      
      // Restore from backup
      const result = importData(backup)
      return result.success
    }
    
    return false
  }

  // Storage Management
  async function getStorageStats(): Promise<StorageStats> {
    return PersistenceService.getStorageStats()
  }

  function clearAllData(): void {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      PersistenceService.clearAllData()
      items.value = []
      categories.value = []
      filter.value = {}
    }
  }

  function clearAll() {
    items.value = []
    categories.value = []
    filter.value = {}
  }

  // Alias for deleteCategory
  function removeCategory(id: string) {
    deleteCategory(id)
  }

  // Apply a template by adding its items to the checklist
  function applyTemplate(templateId: string) {
    // This will be implemented when integrating with template store
    // For now, just return
    return
  }

  // Initialize default category if none exist
  if (categories.value.length === 0) {
    addCategory({
      name: 'General',
      color: '#3B82F6',
      icon: '📋',
      order: 0
    })
  }

  return {
    // State
    items,
    categories,
    filter,
    selectedCategoryId,

    // Computed
    filteredItems,
    stats,
    allTags,

    // Actions
    addCategory,
    updateCategory,
    deleteCategory,
    addItem,
    updateItem,
    deleteItem,
    toggleItemComplete,
    reorderItems,
    setFilter,
    setFilters,
    clearFilter,
    
    // Export/Import
    exportData,
    exportToJSON,
    exportToCSV,
    importData,
    importFromFile,
    
    // Backup/Restore
    createBackup,
    getBackupList,
    restoreFromBackup,
    
    // Storage Management
    getStorageStats,
    clearAllData,
    clearAll,
    
    // Aliases
    removeCategory,
    applyTemplate
  }
})