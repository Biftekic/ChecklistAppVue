export type Priority = 'low' | 'medium' | 'high' | 'urgent'
export type ChecklistItemStatus = 'pending' | 'completed' | 'archived'

export interface ChecklistItem {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: Priority
  dueDate?: Date | null
  categoryId: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  order: number
  status: ChecklistItemStatus
  notes?: string
}

export interface Category {
  id: string
  name: string
  color: string
  icon?: string
  order: number
  createdAt: Date
  updatedAt: Date
  description?: string
  priority?: string
}

export interface ChecklistFilter {
  categoryId?: string | null
  priority?: Priority | null
  status?: ChecklistItemStatus | null
  searchTerm?: string
  searchQuery?: string  // Deprecated, use searchTerm
  tags?: string[]
  dueDateFrom?: Date
  dueDateTo?: Date
  dateRange?: {
    start: Date | null
    end: Date | null
  }
  completed?: boolean
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface ChecklistStats {
  total: number
  completed: number
  pending: number
  overdue: number
  byPriority: Record<Priority, number>
  byCategory: Record<string, number>
}

export interface ExportData {
  version: string
  exportDate: Date
  categories: Category[]
  items: ChecklistItem[]
  metadata?: {
    totalItems: number
    totalCategories: number
    completedItems: number
  }
}

export interface ImportResult {
  success: boolean
  imported: {
    categories: number
    items: number
  }
  errors: string[]
  data?: Partial<ExportData>
}

export interface BackupInfo {
  date: Date
  itemCount: number
  categoryCount: number
}

export interface StorageStats {
  used: number
  quota: number
  percentage: number
  itemsSize: number
  categoriesSize: number
  backupsSize: number
}