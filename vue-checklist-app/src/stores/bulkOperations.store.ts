import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useChecklistStore } from './checklist.store'
import { useUndoRedo, createAction } from '@/composables/useUndoRedo'
import type { ChecklistItem, Priority, ChecklistItemStatus } from '@/types/checklist.types'

interface BulkOperationState {
  selectedTaskIds: Set<string>
  isSelectionMode: boolean
  lastSelectedIndex: number
  lastSelectedId: string | null
}

export const useBulkOperationsStore = defineStore('bulkOperations', () => {
  // State
  const selectedTaskIds = ref(new Set<string>())
  const isSelectionMode = ref(false)
  const lastSelectedIndex = ref(-1)
  const lastSelectedId = ref<string | null>(null)
  
  // Get checklist store and undo/redo manager
  const checklistStore = useChecklistStore()
  const undoRedoManager = useUndoRedo()
  
  // Computed
  const selectedCount = computed(() => selectedTaskIds.value.size)
  
  const selectedTasks = computed(() => {
    return Array.from(selectedTaskIds.value)
      .map(id => checklistStore.items.find(item => item.id === id))
      .filter(Boolean) as ChecklistItem[]
  })
  
  const hasSelection = computed(() => selectedTaskIds.value.size > 0)
  
  const allTasksSelected = computed(() => {
    return checklistStore.filteredItems.length > 0 &&
           checklistStore.filteredItems.every(item => selectedTaskIds.value.has(item.id))
  })
  
  const someTasksSelected = computed(() => {
    return selectedTaskIds.value.size > 0 && !allTasksSelected.value
  })
  
  // Actions
  function enterSelectionMode() {
    isSelectionMode.value = true
  }
  
  function exitSelectionMode() {
    isSelectionMode.value = false
    clearSelection()
  }
  
  function toggleSelection(taskId: string) {
    const task = checklistStore.items.find(item => item.id === taskId)
    if (!task) return
    
    if (selectedTaskIds.value.has(taskId)) {
      selectedTaskIds.value.delete(taskId)
      
      // Exit selection mode if no items selected
      if (selectedTaskIds.value.size === 0) {
        isSelectionMode.value = false
      }
    } else {
      selectedTaskIds.value.add(taskId)
      
      // Enter selection mode when first item is selected
      if (!isSelectionMode.value) {
        isSelectionMode.value = true
      }
    }
    
    // Update last selected
    const index = checklistStore.filteredItems.findIndex(item => item.id === taskId)
    if (index !== -1) {
      lastSelectedIndex.value = index
      lastSelectedId.value = taskId
    }
  }
  
  function selectRange(fromId: string, toId: string) {
    const items = checklistStore.filteredItems
    const fromIndex = items.findIndex(item => item.id === fromId)
    const toIndex = items.findIndex(item => item.id === toId)
    
    if (fromIndex === -1 || toIndex === -1) return
    
    const start = Math.min(fromIndex, toIndex)
    const end = Math.max(fromIndex, toIndex)
    
    for (let i = start; i <= end; i++) {
      selectedTaskIds.value.add(items[i].id)
    }
    
    if (!isSelectionMode.value) {
      isSelectionMode.value = true
    }
  }
  
  function selectRangeFromLast(toId: string) {
    if (lastSelectedId.value) {
      selectRange(lastSelectedId.value, toId)
    } else {
      toggleSelection(toId)
    }
  }
  
  function selectAll() {
    checklistStore.filteredItems.forEach(item => {
      selectedTaskIds.value.add(item.id)
    })
    
    if (selectedTaskIds.value.size > 0) {
      isSelectionMode.value = true
    }
  }
  
  function clearSelection() {
    selectedTaskIds.value.clear()
    lastSelectedIndex.value = -1
    lastSelectedId.value = null
  }
  
  function invertSelection() {
    const newSelection = new Set<string>()
    
    checklistStore.filteredItems.forEach(item => {
      if (!selectedTaskIds.value.has(item.id)) {
        newSelection.add(item.id)
      }
    })
    
    selectedTaskIds.value = newSelection
    
    if (selectedTaskIds.value.size === 0) {
      isSelectionMode.value = false
    }
  }
  
  // Bulk operations with undo/redo
  async function bulkDelete() {
    if (selectedTaskIds.value.size === 0) return
    
    const taskIds = Array.from(selectedTaskIds.value)
    const deletedTasks = taskIds
      .map(id => checklistStore.items.find(item => item.id === id))
      .filter(Boolean) as ChecklistItem[]
    
    // Create undo/redo action
    const action = createAction(
      'bulk',
      `Delete ${taskIds.length} task${taskIds.length > 1 ? 's' : ''}`,
      { taskIds, tasks: deletedTasks },
      // Undo: restore deleted tasks
      () => {
        deletedTasks.forEach(task => {
          checklistStore.items.push(task)
        })
      },
      // Redo: delete tasks again
      () => {
        taskIds.forEach(id => {
          checklistStore.deleteItem(id)
        })
      }
    )
    
    await undoRedoManager.execute(action)
    clearSelection()
    exitSelectionMode()
  }
  
  async function bulkComplete(completed: boolean = true) {
    if (selectedTaskIds.value.size === 0) return
    
    const taskIds = Array.from(selectedTaskIds.value)
    const previousStates = new Map<string, { completed: boolean; status: ChecklistItemStatus }>()
    
    // Store previous states
    taskIds.forEach(id => {
      const task = checklistStore.items.find(item => item.id === id)
      if (task) {
        previousStates.set(id, {
          completed: task.completed,
          status: task.status
        })
      }
    })
    
    // Create undo/redo action
    const action = createAction(
      'bulk',
      `Mark ${taskIds.length} task${taskIds.length > 1 ? 's' : ''} as ${completed ? 'completed' : 'pending'}`,
      { taskIds, completed, previousStates },
      // Undo: restore previous states
      () => {
        taskIds.forEach(id => {
          const task = checklistStore.items.find(item => item.id === id)
          const prevState = previousStates.get(id)
          if (task && prevState) {
            task.completed = prevState.completed
            task.status = prevState.status
            task.updatedAt = new Date()
          }
        })
      },
      // Redo: apply completion state
      () => {
        taskIds.forEach(id => {
          const task = checklistStore.items.find(item => item.id === id)
          if (task) {
            task.completed = completed
            task.status = completed ? 'completed' : 'pending'
            task.updatedAt = new Date()
          }
        })
      }
    )
    
    await undoRedoManager.execute(action)
    clearSelection()
    exitSelectionMode()
  }
  
  async function bulkMove(categoryId: string) {
    if (selectedTaskIds.value.size === 0) return
    
    const taskIds = Array.from(selectedTaskIds.value)
    const previousCategories = new Map<string, string>()
    
    // Store previous categories
    taskIds.forEach(id => {
      const task = checklistStore.items.find(item => item.id === id)
      if (task) {
        previousCategories.set(id, task.categoryId)
      }
    })
    
    // Get category name for description
    const category = checklistStore.categories.find(c => c.id === categoryId)
    const categoryName = category?.name || 'Unknown'
    
    // Create undo/redo action
    const action = createAction(
      'bulk',
      `Move ${taskIds.length} task${taskIds.length > 1 ? 's' : ''} to ${categoryName}`,
      { taskIds, categoryId, previousCategories },
      // Undo: restore previous categories
      () => {
        taskIds.forEach(id => {
          const task = checklistStore.items.find(item => item.id === id)
          const prevCategory = previousCategories.get(id)
          if (task && prevCategory) {
            task.categoryId = prevCategory
            task.updatedAt = new Date()
          }
        })
      },
      // Redo: move to new category
      () => {
        taskIds.forEach(id => {
          const task = checklistStore.items.find(item => item.id === id)
          if (task) {
            task.categoryId = categoryId
            task.updatedAt = new Date()
          }
        })
      }
    )
    
    await undoRedoManager.execute(action)
    clearSelection()
    exitSelectionMode()
  }
  
  async function bulkSetPriority(priority: Priority) {
    if (selectedTaskIds.value.size === 0) return
    
    const taskIds = Array.from(selectedTaskIds.value)
    const previousPriorities = new Map<string, Priority>()
    
    // Store previous priorities
    taskIds.forEach(id => {
      const task = checklistStore.items.find(item => item.id === id)
      if (task) {
        previousPriorities.set(id, task.priority)
      }
    })
    
    // Create undo/redo action
    const action = createAction(
      'bulk',
      `Set priority to ${priority} for ${taskIds.length} task${taskIds.length > 1 ? 's' : ''}`,
      { taskIds, priority, previousPriorities },
      // Undo: restore previous priorities
      () => {
        taskIds.forEach(id => {
          const task = checklistStore.items.find(item => item.id === id)
          const prevPriority = previousPriorities.get(id)
          if (task && prevPriority) {
            task.priority = prevPriority
            task.updatedAt = new Date()
          }
        })
      },
      // Redo: set new priority
      () => {
        taskIds.forEach(id => {
          const task = checklistStore.items.find(item => item.id === id)
          if (task) {
            task.priority = priority
            task.updatedAt = new Date()
          }
        })
      }
    )
    
    await undoRedoManager.execute(action)
    clearSelection()
    exitSelectionMode()
  }
  
  async function bulkAddTags(tags: string[]) {
    if (selectedTaskIds.value.size === 0 || tags.length === 0) return
    
    const taskIds = Array.from(selectedTaskIds.value)
    const previousTags = new Map<string, string[]>()
    
    // Store previous tags
    taskIds.forEach(id => {
      const task = checklistStore.items.find(item => item.id === id)
      if (task) {
        previousTags.set(id, [...task.tags])
      }
    })
    
    // Create undo/redo action
    const action = createAction(
      'bulk',
      `Add ${tags.length} tag${tags.length > 1 ? 's' : ''} to ${taskIds.length} task${taskIds.length > 1 ? 's' : ''}`,
      { taskIds, tags, previousTags },
      // Undo: restore previous tags
      () => {
        taskIds.forEach(id => {
          const task = checklistStore.items.find(item => item.id === id)
          const prevTags = previousTags.get(id)
          if (task && prevTags) {
            task.tags = prevTags
            task.updatedAt = new Date()
          }
        })
      },
      // Redo: add tags
      () => {
        taskIds.forEach(id => {
          const task = checklistStore.items.find(item => item.id === id)
          if (task) {
            // Add only unique tags
            const uniqueTags = new Set([...task.tags, ...tags])
            task.tags = Array.from(uniqueTags)
            task.updatedAt = new Date()
          }
        })
      }
    )
    
    await undoRedoManager.execute(action)
    clearSelection()
    exitSelectionMode()
  }
  
  async function bulkRemoveTags(tags: string[]) {
    if (selectedTaskIds.value.size === 0 || tags.length === 0) return
    
    const taskIds = Array.from(selectedTaskIds.value)
    const previousTags = new Map<string, string[]>()
    
    // Store previous tags
    taskIds.forEach(id => {
      const task = checklistStore.items.find(item => item.id === id)
      if (task) {
        previousTags.set(id, [...task.tags])
      }
    })
    
    // Create undo/redo action
    const action = createAction(
      'bulk',
      `Remove ${tags.length} tag${tags.length > 1 ? 's' : ''} from ${taskIds.length} task${taskIds.length > 1 ? 's' : ''}`,
      { taskIds, tags, previousTags },
      // Undo: restore previous tags
      () => {
        taskIds.forEach(id => {
          const task = checklistStore.items.find(item => item.id === id)
          const prevTags = previousTags.get(id)
          if (task && prevTags) {
            task.tags = prevTags
            task.updatedAt = new Date()
          }
        })
      },
      // Redo: remove tags
      () => {
        taskIds.forEach(id => {
          const task = checklistStore.items.find(item => item.id === id)
          if (task) {
            task.tags = task.tags.filter(tag => !tags.includes(tag))
            task.updatedAt = new Date()
          }
        })
      }
    )
    
    await undoRedoManager.execute(action)
    clearSelection()
    exitSelectionMode()
  }
  
  async function bulkDuplicate() {
    if (selectedTaskIds.value.size === 0) return
    
    const taskIds = Array.from(selectedTaskIds.value)
    const duplicatedTasks: ChecklistItem[] = []
    
    // Create duplicates
    taskIds.forEach(id => {
      const task = checklistStore.items.find(item => item.id === id)
      if (task) {
        const duplicate = checklistStore.addItem({
          title: `${task.title} (Copy)`,
          description: task.description,
          completed: false,
          priority: task.priority,
          dueDate: task.dueDate,
          categoryId: task.categoryId,
          tags: [...task.tags],
          order: task.order + 0.5,
          status: 'pending'
        })
        duplicatedTasks.push(duplicate)
      }
    })
    
    // Create undo/redo action
    const action = createAction(
      'bulk',
      `Duplicate ${taskIds.length} task${taskIds.length > 1 ? 's' : ''}`,
      { originalIds: taskIds, duplicatedTasks },
      // Undo: remove duplicated tasks
      () => {
        duplicatedTasks.forEach(task => {
          checklistStore.deleteItem(task.id)
        })
      },
      // Redo: add duplicated tasks back
      () => {
        duplicatedTasks.forEach(task => {
          checklistStore.items.push(task)
        })
      }
    )
    
    await undoRedoManager.execute(action)
    clearSelection()
    exitSelectionMode()
  }
  
  return {
    // State
    selectedTaskIds,
    isSelectionMode,
    lastSelectedIndex,
    lastSelectedId,
    
    // Computed
    selectedCount,
    selectedTasks,
    hasSelection,
    allTasksSelected,
    someTasksSelected,
    
    // Actions
    enterSelectionMode,
    exitSelectionMode,
    toggleSelection,
    selectRange,
    selectRangeFromLast,
    selectAll,
    clearSelection,
    invertSelection,
    
    // Bulk operations
    bulkDelete,
    bulkComplete,
    bulkMove,
    bulkSetPriority,
    bulkAddTags,
    bulkRemoveTags,
    bulkDuplicate
  }
})