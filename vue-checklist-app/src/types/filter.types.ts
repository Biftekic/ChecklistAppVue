import type { Priority, ChecklistItemStatus } from './checklist.types'

export interface FilterPreset {
  id: string
  name: string
  icon?: string
  filters: FilterCriteria
  isDefault?: boolean
  sortOrder?: number
  createdAt: Date
  updatedAt: Date
}

export interface FilterCriteria {
  categories?: string[]
  priorities?: Priority[]
  tags?: string[]
  dateRange?: DateRange
  status?: ChecklistItemStatus | 'overdue'
  searchTerm?: string
  completed?: boolean
}

export interface DateRange {
  start: Date | null
  end: Date | null
}

export type FilterOperator = 'AND' | 'OR'

export interface AdvancedFilter extends FilterCriteria {
  operator?: FilterOperator
}

export interface FilterState {
  presets: FilterPreset[]
  activePresetId: string | null
  activeFilters: FilterCriteria
  quickFilters: QuickFilter[]
  recentSearches: string[]
}

export interface QuickFilter {
  id: string
  label: string
  icon?: string
  filter: Partial<FilterCriteria>
  color?: string
}

export type FilterSortBy = 'createdAt' | 'updatedAt' | 'dueDate' | 'priority' | 'title' | 'order'
export type FilterSortOrder = 'asc' | 'desc'

export interface FilterSort {
  by: FilterSortBy
  order: FilterSortOrder
}