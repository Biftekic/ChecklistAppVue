import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useChecklistStore } from './checklist.store'
import type { Priority } from '@/types/checklist.types'

describe('Checklist Store', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    setActivePinia(createPinia())
  })

  describe('Categories', () => {
    it('should initialize with a default category', () => {
      const store = useChecklistStore()
      expect(store.categories).toHaveLength(1)
      expect(store.categories[0].name).toBe('General')
    })

    it('should add a new category', () => {
      const store = useChecklistStore()
      const category = store.addCategory({
        name: 'Work',
        color: '#FF0000',
        icon: '💼',
        order: 1
      })
      
      expect(store.categories).toHaveLength(2)
      expect(category.name).toBe('Work')
      expect(category.id).toBeDefined()
    })

    it('should update a category', () => {
      const store = useChecklistStore()
      const categoryId = store.categories[0].id
      
      store.updateCategory(categoryId, { name: 'Updated' })
      
      const updated = store.categories.find(c => c.id === categoryId)
      expect(updated?.name).toBe('Updated')
    })

    it('should delete a category and move items to default', () => {
      const store = useChecklistStore()
      const category = store.addCategory({
        name: 'ToDelete',
        color: '#000000',
        icon: '🗑️',
        order: 1
      })
      
      store.addItem({
        title: 'Test Item',
        completed: false,
        priority: 'medium',
        categoryId: category.id,
        tags: [],
        order: 0,
        status: 'pending'
      })
      
      store.deleteCategory(category.id)
      
      expect(store.categories).toHaveLength(1)
      expect(store.items[0].categoryId).toBe('default')
    })
  })

  describe('Items', () => {
    it('should add a new item', () => {
      const store = useChecklistStore()
      const item = store.addItem({
        title: 'Test Task',
        description: 'Test Description',
        completed: false,
        priority: 'high',
        categoryId: store.categories[0].id,
        tags: ['test'],
        order: 0,
        status: 'pending'
      })
      
      expect(store.items).toHaveLength(1)
      expect(item.title).toBe('Test Task')
      expect(item.id).toBeDefined()
    })

    it('should update an item', () => {
      const store = useChecklistStore()
      const item = store.addItem({
        title: 'Original',
        completed: false,
        priority: 'low',
        categoryId: store.categories[0].id,
        tags: [],
        order: 0,
        status: 'pending'
      })
      
      store.updateItem(item.id, { title: 'Updated', priority: 'high' })
      
      const updated = store.items.find(i => i.id === item.id)
      expect(updated?.title).toBe('Updated')
      expect(updated?.priority).toBe('high')
    })

    it('should toggle item completion', () => {
      const store = useChecklistStore()
      const item = store.addItem({
        title: 'Toggle Test',
        completed: false,
        priority: 'medium',
        categoryId: store.categories[0].id,
        tags: [],
        order: 0,
        status: 'pending'
      })
      
      store.toggleItemComplete(item.id)
      expect(store.items[0].completed).toBe(true)
      expect(store.items[0].status).toBe('completed')
      
      store.toggleItemComplete(item.id)
      expect(store.items[0].completed).toBe(false)
      expect(store.items[0].status).toBe('pending')
    })

    it('should delete an item', () => {
      const store = useChecklistStore()
      const item = store.addItem({
        title: 'To Delete',
        completed: false,
        priority: 'low',
        categoryId: store.categories[0].id,
        tags: [],
        order: 0,
        status: 'pending'
      })
      
      store.deleteItem(item.id)
      expect(store.items).toHaveLength(0)
    })
  })

  describe('Filtering', () => {
    beforeEach(() => {
      const store = useChecklistStore()
      
      // Add test items
      store.addItem({
        title: 'High Priority Task',
        completed: false,
        priority: 'high',
        categoryId: store.categories[0].id,
        tags: ['urgent'],
        order: 0,
        status: 'pending'
      })
      
      store.addItem({
        title: 'Low Priority Task',
        completed: true,
        priority: 'low',
        categoryId: store.categories[0].id,
        tags: ['done'],
        order: 1,
        status: 'completed'
      })
    })

    it('should filter by priority', () => {
      const store = useChecklistStore()
      store.setFilter({ priority: 'high' })
      
      expect(store.filteredItems).toHaveLength(1)
      expect(store.filteredItems[0].priority).toBe('high')
    })

    it('should filter by status', () => {
      const store = useChecklistStore()
      store.setFilter({ status: 'completed' })
      
      expect(store.filteredItems).toHaveLength(1)
      expect(store.filteredItems[0].status).toBe('completed')
    })

    it('should filter by search query', () => {
      const store = useChecklistStore()
      store.setFilter({ searchQuery: 'High' })
      
      expect(store.filteredItems).toHaveLength(1)
      expect(store.filteredItems[0].title).toContain('High')
    })

    it('should filter by tags', () => {
      const store = useChecklistStore()
      store.setFilter({ tags: ['urgent'] })
      
      expect(store.filteredItems).toHaveLength(1)
      expect(store.filteredItems[0].tags).toContain('urgent')
    })
  })

  describe('Statistics', () => {
    it('should calculate correct statistics', () => {
      const store = useChecklistStore()
      
      store.addItem({
        title: 'Completed Task',
        completed: true,
        priority: 'high',
        categoryId: store.categories[0].id,
        tags: [],
        order: 0,
        status: 'completed'
      })
      
      store.addItem({
        title: 'Pending Task',
        completed: false,
        priority: 'low',
        categoryId: store.categories[0].id,
        tags: [],
        order: 1,
        status: 'pending'
      })
      
      const stats = store.stats
      expect(stats.total).toBe(2)
      expect(stats.completed).toBe(1)
      expect(stats.pending).toBe(1)
      expect(stats.byPriority.high).toBe(1)
      expect(stats.byPriority.low).toBe(1)
    })
  })

  describe('Import/Export', () => {
    it('should export data correctly', () => {
      const store = useChecklistStore()
      
      store.addItem({
        title: 'Export Test',
        completed: false,
        priority: 'medium',
        categoryId: store.categories[0].id,
        tags: ['test'],
        order: 0,
        status: 'pending'
      })
      
      const exported = store.exportData()
      
      expect(exported.version).toBe('1.0.0')
      expect(exported.categories).toHaveLength(1)
      expect(exported.items).toHaveLength(1)
      expect(exported.exportDate).toBeDefined()
    })

    it('should import data correctly', () => {
      const store = useChecklistStore()
      store.clearAll()
      
      const importData = {
        version: '1.0.0',
        exportDate: new Date(),
        categories: [{
          id: 'test-cat',
          name: 'Imported',
          color: '#FF0000',
          icon: '📦',
          order: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        }],
        items: [{
          id: 'test-item',
          title: 'Imported Task',
          completed: false,
          priority: 'high' as Priority,
          categoryId: 'test-cat',
          tags: ['imported'],
          order: 0,
          status: 'pending' as const,
          createdAt: new Date(),
          updatedAt: new Date()
        }]
      }
      
      const result = store.importData(importData)
      
      expect(result.success).toBe(true)
      expect(result.imported.categories).toBe(1)
      expect(result.imported.items).toBe(1)
      expect(store.categories).toHaveLength(1)
      expect(store.items).toHaveLength(1)
    })
  })
})