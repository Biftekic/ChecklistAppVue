import type { ChecklistItem, Category, ExportData, ImportResult } from '@/types/checklist.types'

export class PersistenceService {
  private static readonly STORAGE_VERSION = '2.0.0'
  private static readonly STORAGE_KEYS = {
    items: 'checklist-items-v2',
    categories: 'checklist-categories-v2',
    backups: 'checklist-backups',
    settings: 'checklist-settings',
    lastSync: 'checklist-last-sync'
  }

  /**
   * Validate data structure before saving or importing
   */
  static validateData(data: any): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    // Check basic structure
    if (!data || typeof data !== 'object') {
      errors.push('Invalid data format: must be an object')
      return { valid: false, errors }
    }

    // Validate items if present
    if (data.items) {
      if (!Array.isArray(data.items)) {
        errors.push('Items must be an array')
      } else {
        data.items.forEach((item: any, index: number) => {
          if (!item.id || !item.title) {
            errors.push(`Item at index ${index} missing required fields (id, title)`)
          }
          if (!['low', 'medium', 'high', 'urgent'].includes(item.priority)) {
            errors.push(`Item at index ${index} has invalid priority`)
          }
        })
      }
    }

    // Validate categories if present
    if (data.categories) {
      if (!Array.isArray(data.categories)) {
        errors.push('Categories must be an array')
      } else {
        data.categories.forEach((category: any, index: number) => {
          if (!category.id || !category.name) {
            errors.push(`Category at index ${index} missing required fields (id, name)`)
          }
        })
      }
    }

    return { valid: errors.length === 0, errors }
  }

  /**
   * Save data to localStorage with error handling
   */
  static saveToLocalStorage(key: string, data: any): boolean {
    try {
      const validation = this.validateData({ items: data })
      if (!validation.valid) {
        console.error('Validation errors:', validation.errors)
        return false
      }

      const serialized = JSON.stringify(data)
      
      // Check storage quota
      const sizeInBytes = new Blob([serialized]).size
      const sizeInMB = sizeInBytes / (1024 * 1024)
      
      if (sizeInMB > 5) {
        console.warn('Data size exceeds 5MB, consider cleanup')
      }

      localStorage.setItem(key, serialized)
      localStorage.setItem(this.STORAGE_KEYS.lastSync, new Date().toISOString())
      
      return true
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
      
      // Handle quota exceeded error
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        this.handleQuotaExceeded()
      }
      
      return false
    }
  }

  /**
   * Load data from localStorage with fallback
   */
  static loadFromLocalStorage<T>(key: string, defaultValue: T): T {
    try {
      const stored = localStorage.getItem(key)
      if (!stored) return defaultValue

      const parsed = JSON.parse(stored)
      
      // Convert date strings back to Date objects
      if (Array.isArray(parsed)) {
        parsed.forEach((item: any) => {
          if (item.createdAt) item.createdAt = new Date(item.createdAt)
          if (item.updatedAt) item.updatedAt = new Date(item.updatedAt)
          if (item.dueDate) item.dueDate = new Date(item.dueDate)
        })
      }

      return parsed
    } catch (error) {
      console.error('Failed to load from localStorage:', error)
      return defaultValue
    }
  }

  /**
   * Create a backup of current data
   */
  static createBackup(items: ChecklistItem[], categories: Category[]): string {
    const backup: ExportData = {
      version: this.STORAGE_VERSION,
      exportDate: new Date(),
      categories,
      items,
      metadata: {
        totalItems: items.length,
        totalCategories: categories.length,
        completedItems: items.filter(i => i.completed).length
      }
    }

    // Store up to 5 backups
    const backups = this.loadFromLocalStorage<ExportData[]>(this.STORAGE_KEYS.backups, [])
    backups.unshift(backup)
    
    if (backups.length > 5) {
      backups.pop()
    }

    this.saveToLocalStorage(this.STORAGE_KEYS.backups, backups)
    
    return backup.exportDate.toISOString()
  }

  /**
   * Restore from a specific backup
   */
  static restoreBackup(backupIndex: number = 0): ExportData | null {
    const backups = this.loadFromLocalStorage<ExportData[]>(this.STORAGE_KEYS.backups, [])
    
    if (backupIndex >= 0 && backupIndex < backups.length) {
      return backups[backupIndex]
    }
    
    return null
  }

  /**
   * Get list of available backups
   */
  static getBackupList(): { date: Date; itemCount: number; categoryCount: number }[] {
    const backups = this.loadFromLocalStorage<ExportData[]>(this.STORAGE_KEYS.backups, [])
    
    return backups.map(backup => ({
      date: new Date(backup.exportDate),
      itemCount: backup.metadata?.totalItems || backup.items.length,
      categoryCount: backup.metadata?.totalCategories || backup.categories.length
    }))
  }

  /**
   * Export data as JSON file
   */
  static exportToJSON(data: ExportData): void {
    const validation = this.validateData(data)
    if (!validation.valid) {
      throw new Error(`Export validation failed: ${validation.errors.join(', ')}`)
    }

    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
    const filename = `checklist-export-${timestamp}.json`
    
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
  }

  /**
   * Export data as CSV file
   */
  static exportToCSV(items: ChecklistItem[], categories: Category[]): void {
    // Create CSV header
    const headers = [
      'ID',
      'Title',
      'Description',
      'Category',
      'Priority',
      'Status',
      'Completed',
      'Due Date',
      'Tags',
      'Notes',
      'Created At',
      'Updated At'
    ]

    // Map categories for lookup
    const categoryMap = new Map(categories.map(c => [c.id, c.name]))

    // Convert items to CSV rows
    const rows = items.map(item => [
      item.id,
      `"${item.title.replace(/"/g, '""')}"`,
      `"${(item.description || '').replace(/"/g, '""')}"`,
      categoryMap.get(item.categoryId) || 'Unknown',
      item.priority,
      item.status,
      item.completed ? 'Yes' : 'No',
      item.dueDate ? new Date(item.dueDate).toLocaleDateString() : '',
      item.tags.join(';'),
      `"${(item.notes || '').replace(/"/g, '""')}"`,
      new Date(item.createdAt).toLocaleString(),
      new Date(item.updatedAt).toLocaleString()
    ])

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
    const filename = `checklist-export-${timestamp}.csv`
    
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
  }

  /**
   * Import data from JSON file
   */
  static async importFromJSON(file: File): Promise<ImportResult> {
    const result: ImportResult = {
      success: false,
      imported: { categories: 0, items: 0 },
      errors: []
    }

    try {
      // Validate file type
      if (!file.type.includes('json') && !file.name.endsWith('.json')) {
        result.errors.push('Invalid file type. Please select a JSON file.')
        return result
      }

      // Read file content
      const text = await file.text()
      const data = JSON.parse(text)

      // Validate data structure
      const validation = this.validateData(data)
      if (!validation.valid) {
        result.errors = validation.errors
        return result
      }

      // Return parsed data for the store to process
      return {
        success: true,
        imported: {
          categories: data.categories?.length || 0,
          items: data.items?.length || 0
        },
        errors: [],
        data
      }
    } catch (error) {
      result.errors.push(`Failed to import file: ${error}`)
      return result
    }
  }

  /**
   * Import data from CSV file
   */
  static async importFromCSV(file: File, categories: Category[]): Promise<ImportResult> {
    const result: ImportResult = {
      success: false,
      imported: { categories: 0, items: 0 },
      errors: []
    }

    try {
      // Validate file type
      if (!file.type.includes('csv') && !file.name.endsWith('.csv')) {
        result.errors.push('Invalid file type. Please select a CSV file.')
        return result
      }

      // Read file content
      const text = await file.text()
      const lines = text.split('\n').filter(line => line.trim())
      
      if (lines.length < 2) {
        result.errors.push('CSV file is empty or invalid')
        return result
      }

      // Parse CSV (simple parser - may need enhancement for complex CSVs)
      const headers = lines[0].split(',').map(h => h.trim())
      const items: ChecklistItem[] = []
      
      // Create category name to ID map
      const categoryMap = new Map(categories.map(c => [c.name, c.id]))

      for (let i = 1; i < lines.length; i++) {
        try {
          const values = this.parseCSVLine(lines[i])
          
          if (values.length !== headers.length) {
            result.errors.push(`Row ${i + 1}: Column count mismatch`)
            continue
          }

          const item: ChecklistItem = {
            id: values[0] || `imported-${Date.now()}-${i}`,
            title: values[1].replace(/^"|"$/g, '').replace(/""/g, '"'),
            description: values[2].replace(/^"|"$/g, '').replace(/""/g, '"'),
            categoryId: categoryMap.get(values[3]) || 'default',
            priority: (['low', 'medium', 'high', 'urgent'].includes(values[4]) ? values[4] : 'medium') as any,
            status: values[5] as any || 'pending',
            completed: values[6].toLowerCase() === 'yes',
            dueDate: values[7] ? new Date(values[7]) : undefined,
            tags: values[8] ? values[8].split(';').filter(t => t) : [],
            notes: values[9]?.replace(/^"|"$/g, '').replace(/""/g, '"'),
            createdAt: values[10] ? new Date(values[10]) : new Date(),
            updatedAt: values[11] ? new Date(values[11]) : new Date(),
            order: i
          }

          items.push(item)
          result.imported.items++
        } catch (error) {
          result.errors.push(`Row ${i + 1}: ${error}`)
        }
      }

      result.success = result.imported.items > 0
      result.data = { items, categories: [] }
      
    } catch (error) {
      result.errors.push(`Failed to parse CSV: ${error}`)
    }

    return result
  }

  /**
   * Parse a CSV line handling quoted values
   */
  private static parseCSVLine(line: string): string[] {
    const result: string[] = []
    let current = ''
    let inQuotes = false
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      const nextChar = line[i + 1]
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"'
          i++ // Skip next quote
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current)
        current = ''
      } else {
        current += char
      }
    }
    
    result.push(current)
    return result
  }

  /**
   * Handle quota exceeded error
   */
  private static handleQuotaExceeded(): void {
    // Try to clean up old data
    const backups = this.loadFromLocalStorage<ExportData[]>(this.STORAGE_KEYS.backups, [])
    
    if (backups.length > 2) {
      // Keep only 2 most recent backups
      this.saveToLocalStorage(this.STORAGE_KEYS.backups, backups.slice(0, 2))
    }

    // Clear browser cache if possible
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      navigator.storage.estimate().then(estimate => {
        const usage = estimate.usage || 0
        const quota = estimate.quota || 0
        const percentUsed = (usage / quota * 100).toFixed(2)
        
        console.warn(`Storage usage: ${percentUsed}% (${usage} of ${quota} bytes)`)
      })
    }
  }

  /**
   * Get storage usage statistics
   */
  static async getStorageStats(): Promise<{
    used: number
    quota: number
    percentage: number
    itemsSize: number
    categoriesSize: number
    backupsSize: number
  }> {
    const stats = {
      used: 0,
      quota: 0,
      percentage: 0,
      itemsSize: 0,
      categoriesSize: 0,
      backupsSize: 0
    }

    // Get overall storage estimate
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate()
      stats.used = estimate.usage || 0
      stats.quota = estimate.quota || 0
      stats.percentage = stats.quota > 0 ? (stats.used / stats.quota * 100) : 0
    }

    // Calculate individual sizes
    const itemsData = localStorage.getItem(this.STORAGE_KEYS.items) || ''
    const categoriesData = localStorage.getItem(this.STORAGE_KEYS.categories) || ''
    const backupsData = localStorage.getItem(this.STORAGE_KEYS.backups) || ''

    stats.itemsSize = new Blob([itemsData]).size
    stats.categoriesSize = new Blob([categoriesData]).size
    stats.backupsSize = new Blob([backupsData]).size

    return stats
  }

  /**
   * Clear all stored data
   */
  static clearAllData(): void {
    Object.values(this.STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
  }
}