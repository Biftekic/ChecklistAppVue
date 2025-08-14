import { ref, computed } from 'vue'

export interface Action {
  id: string
  type: 'create' | 'update' | 'delete' | 'move' | 'bulk' | 'toggle'
  timestamp: Date
  data: any
  undo: () => Promise<void> | void
  redo: () => Promise<void> | void
  description: string
}

export class UndoRedoManager {
  private history = ref<Action[]>([])
  private currentIndex = ref(-1)
  private maxHistorySize = 50
  private isExecuting = ref(false)

  // Computed properties
  canUndo = computed(() => this.currentIndex.value >= 0)
  canRedo = computed(() => this.currentIndex.value < this.history.value.length - 1)
  
  getHistory = computed(() => this.history.value.slice(0, this.currentIndex.value + 1))
  
  getUndoDescription = computed(() => {
    if (this.canUndo.value) {
      return this.history.value[this.currentIndex.value]?.description || ''
    }
    return ''
  })
  
  getRedoDescription = computed(() => {
    if (this.canRedo.value) {
      return this.history.value[this.currentIndex.value + 1]?.description || ''
    }
    return ''
  })

  async execute(action: Action): Promise<void> {
    if (this.isExecuting.value) return
    
    this.isExecuting.value = true
    
    try {
      // Remove any actions after current index (clear redo history)
      this.history.value = this.history.value.slice(0, this.currentIndex.value + 1)
      
      // Add new action
      this.history.value.push(action)
      
      // Limit history size
      if (this.history.value.length > this.maxHistorySize) {
        this.history.value.shift()
      } else {
        this.currentIndex.value++
      }
      
      // Execute the action
      await action.redo()
      
      // Emit event for UI updates
      this.emitHistoryChange()
    } finally {
      this.isExecuting.value = false
    }
  }

  async undo(): Promise<Action | null> {
    if (!this.canUndo.value || this.isExecuting.value) return null
    
    this.isExecuting.value = true
    
    try {
      const action = this.history.value[this.currentIndex.value]
      await action.undo()
      this.currentIndex.value--
      
      // Emit event for UI updates
      this.emitHistoryChange()
      
      return action
    } finally {
      this.isExecuting.value = false
    }
  }

  async redo(): Promise<Action | null> {
    if (!this.canRedo.value || this.isExecuting.value) return null
    
    this.isExecuting.value = true
    
    try {
      this.currentIndex.value++
      const action = this.history.value[this.currentIndex.value]
      await action.redo()
      
      // Emit event for UI updates
      this.emitHistoryChange()
      
      return action
    } finally {
      this.isExecuting.value = false
    }
  }

  async undoMultiple(count: number): Promise<Action[]> {
    const undoneActions: Action[] = []
    
    for (let i = 0; i < count && this.canUndo.value; i++) {
      const action = await this.undo()
      if (action) {
        undoneActions.push(action)
      }
    }
    
    return undoneActions
  }

  async redoMultiple(count: number): Promise<Action[]> {
    const redoneActions: Action[] = []
    
    for (let i = 0; i < count && this.canRedo.value; i++) {
      const action = await this.redo()
      if (action) {
        redoneActions.push(action)
      }
    }
    
    return redoneActions
  }

  clear(): void {
    this.history.value = []
    this.currentIndex.value = -1
    this.emitHistoryChange()
  }

  getHistorySize(): number {
    return this.history.value.length
  }

  setMaxHistorySize(size: number): void {
    this.maxHistorySize = Math.max(1, size)
    
    // Trim history if needed
    if (this.history.value.length > this.maxHistorySize) {
      const removeCount = this.history.value.length - this.maxHistorySize
      this.history.value = this.history.value.slice(removeCount)
      this.currentIndex.value = Math.max(-1, this.currentIndex.value - removeCount)
    }
  }

  private emitHistoryChange(): void {
    window.dispatchEvent(new CustomEvent('undoredo:change', {
      detail: {
        canUndo: this.canUndo.value,
        canRedo: this.canRedo.value,
        historySize: this.history.value.length,
        currentIndex: this.currentIndex.value
      }
    }))
  }
}

// Singleton instance
let undoRedoManager: UndoRedoManager | null = null

export function useUndoRedo() {
  if (!undoRedoManager) {
    undoRedoManager = new UndoRedoManager()
  }
  
  return undoRedoManager
}

// Helper function to create actions
export function createAction(
  type: Action['type'],
  description: string,
  data: any,
  undoFn: () => Promise<void> | void,
  redoFn: () => Promise<void> | void
): Action {
  return {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    timestamp: new Date(),
    data,
    undo: undoFn,
    redo: redoFn,
    description
  }
}