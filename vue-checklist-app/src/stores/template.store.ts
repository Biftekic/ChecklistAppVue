import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  CleaningTemplate,
  TemplateCategory,
  TemplateCustomization,
  GeneratedChecklist,
  RoomTemplate,
  TaskTemplate
} from '@/types/template.types'
import type { ChecklistItem, Priority } from '@/types/checklist.types'
import { useChecklistStore } from './checklist.store'
import { useLocalStorage } from '@vueuse/core'

// Default templates data (will be loaded from JSON files in production)
const defaultTemplates: CleaningTemplate[] = [
  {
    id: 'office-small',
    version: '1.0.0',
    metadata: {
      name: 'Small Office Cleaning',
      category: 'office',
      industry: 'Commercial',
      description: 'Complete cleaning template for small offices (up to 200m²)',
      author: 'System',
      createdAt: new Date(),
      updatedAt: new Date(),
      usageCount: 0,
      rating: 4.5,
      tags: ['office', 'commercial', 'daily', 'small'],
      image: '/templates/office-small.jpg'
    },
    configuration: {
      parameters: [
        {
          id: 'size',
          name: 'Office Size (m²)',
          type: 'number',
          required: true,
          defaultValue: 150,
          description: 'Total office area in square meters'
        },
        {
          id: 'frequency',
          name: 'Cleaning Frequency',
          type: 'select',
          required: true,
          defaultValue: 'daily',
          options: ['daily', 'weekly', 'biweekly']
        }
      ],
      estimatedTime: { min: 60, max: 90, unit: 'minutes' },
      teamSize: { min: 1, max: 2, recommended: 1 },
      frequency: ['daily', 'weekly'],
      customizable: {
        allowAddTasks: true,
        allowRemoveTasks: true,
        allowEditTasks: true,
        allowReorderTasks: true,
        requiredTasks: ['empty-trash', 'clean-surfaces']
      }
    },
    rooms: [
      {
        id: 'reception',
        name: 'Reception Area',
        type: 'entrance',
        optional: false,
        order: 1,
        estimatedTime: 15,
        supplies: ['glass-cleaner', 'microfiber-cloth', 'vacuum'],
        tasks: [
          {
            id: 'clean-entrance-glass',
            name: 'Clean entrance glass doors',
            description: 'Clean both sides of glass doors and windows',
            category: 'cleaning',
            priority: 'high',
            frequency: 'daily',
            estimatedTime: 5,
            supplies: ['glass-cleaner', 'microfiber-cloth'],
            validationCriteria: ['No streaks visible', 'Handles cleaned'],
            customizable: true,
            requiresPhoto: false,
            order: 1
          },
          {
            id: 'vacuum-entrance',
            name: 'Vacuum entrance mats',
            description: 'Thoroughly vacuum entrance mats and carpet',
            category: 'cleaning',
            priority: 'high',
            frequency: 'daily',
            estimatedTime: 5,
            supplies: ['vacuum'],
            validationCriteria: ['No visible debris', 'Mats properly aligned'],
            customizable: true,
            requiresPhoto: false,
            order: 2
          },
          {
            id: 'wipe-reception-desk',
            name: 'Clean reception desk',
            description: 'Wipe down reception desk and organize items',
            category: 'cleaning',
            priority: 'medium',
            frequency: 'daily',
            estimatedTime: 5,
            supplies: ['microfiber-cloth', 'disinfectant'],
            validationCriteria: ['Surface clean', 'Items organized'],
            customizable: true,
            requiresPhoto: false,
            order: 3
          }
        ]
      },
      {
        id: 'main-office',
        name: 'Main Office Area',
        type: 'office',
        optional: false,
        order: 2,
        estimatedTime: 30,
        supplies: ['vacuum', 'microfiber-cloth', 'disinfectant', 'trash-bags'],
        tasks: [
          {
            id: 'empty-trash',
            name: 'Empty all trash bins',
            description: 'Empty and replace liners in all trash bins',
            category: 'waste',
            priority: 'high',
            frequency: 'daily',
            estimatedTime: 10,
            supplies: ['trash-bags'],
            validationCriteria: ['All bins emptied', 'New liners installed'],
            customizable: false,
            requiresPhoto: false,
            order: 1
          },
          {
            id: 'clean-surfaces',
            name: 'Clean all desk surfaces',
            description: 'Wipe down all desk surfaces and workstations',
            category: 'cleaning',
            priority: 'high',
            frequency: 'daily',
            estimatedTime: 15,
            supplies: ['microfiber-cloth', 'disinfectant'],
            validationCriteria: ['No dust visible', 'Surfaces disinfected'],
            customizable: false,
            requiresPhoto: false,
            order: 2
          },
          {
            id: 'vacuum-office',
            name: 'Vacuum office floors',
            description: 'Vacuum all carpeted areas in the main office',
            category: 'cleaning',
            priority: 'medium',
            frequency: 'daily',
            estimatedTime: 10,
            supplies: ['vacuum'],
            validationCriteria: ['No visible debris', 'Under desks cleaned'],
            customizable: true,
            requiresPhoto: false,
            order: 3
          }
        ]
      },
      {
        id: 'kitchen',
        name: 'Kitchen/Break Room',
        type: 'kitchen',
        optional: true,
        order: 3,
        estimatedTime: 20,
        supplies: ['disinfectant', 'microfiber-cloth', 'dish-soap', 'trash-bags'],
        tasks: [
          {
            id: 'clean-counters',
            name: 'Clean kitchen counters',
            description: 'Wipe and disinfect all counter surfaces',
            category: 'cleaning',
            priority: 'high',
            frequency: 'daily',
            estimatedTime: 5,
            supplies: ['disinfectant', 'microfiber-cloth'],
            validationCriteria: ['Counters clear', 'Surfaces disinfected'],
            customizable: true,
            requiresPhoto: false,
            order: 1
          },
          {
            id: 'clean-appliances',
            name: 'Clean appliances',
            description: 'Clean microwave, coffee maker, and refrigerator exterior',
            category: 'cleaning',
            priority: 'medium',
            frequency: 'weekly',
            estimatedTime: 10,
            supplies: ['disinfectant', 'microfiber-cloth'],
            validationCriteria: ['No stains', 'Handles cleaned'],
            customizable: true,
            requiresPhoto: false,
            order: 2
          },
          {
            id: 'wash-dishes',
            name: 'Wash any dishes',
            description: 'Wash, dry, and put away any dishes in sink',
            category: 'cleaning',
            priority: 'medium',
            frequency: 'daily',
            estimatedTime: 5,
            supplies: ['dish-soap'],
            validationCriteria: ['Sink empty', 'Dishes put away'],
            customizable: true,
            requiresPhoto: false,
            order: 3
          }
        ]
      },
      {
        id: 'bathroom',
        name: 'Restroom',
        type: 'bathroom',
        optional: false,
        order: 4,
        estimatedTime: 15,
        supplies: ['toilet-cleaner', 'disinfectant', 'microfiber-cloth', 'mop', 'toilet-paper', 'paper-towels'],
        tasks: [
          {
            id: 'clean-toilet',
            name: 'Clean and disinfect toilets',
            description: 'Thoroughly clean and disinfect all toilets',
            category: 'cleaning',
            priority: 'critical',
            frequency: 'daily',
            estimatedTime: 5,
            supplies: ['toilet-cleaner', 'disinfectant'],
            validationCriteria: ['Bowl clean', 'Seat disinfected', 'Handle sanitized'],
            customizable: false,
            requiresPhoto: false,
            safetyNotes: 'Wear gloves. Do not mix cleaning chemicals.',
            order: 1
          },
          {
            id: 'clean-sinks',
            name: 'Clean sinks and counters',
            description: 'Clean and disinfect sinks, faucets, and counters',
            category: 'cleaning',
            priority: 'high',
            frequency: 'daily',
            estimatedTime: 3,
            supplies: ['disinfectant', 'microfiber-cloth'],
            validationCriteria: ['No soap scum', 'Faucets shining'],
            customizable: false,
            requiresPhoto: false,
            order: 2
          },
          {
            id: 'restock-supplies',
            name: 'Restock supplies',
            description: 'Check and restock toilet paper, paper towels, and soap',
            category: 'supplies',
            priority: 'high',
            frequency: 'daily',
            estimatedTime: 2,
            supplies: ['toilet-paper', 'paper-towels', 'soap'],
            validationCriteria: ['All dispensers full', 'Backup supplies available'],
            customizable: true,
            requiresPhoto: false,
            order: 3
          },
          {
            id: 'mop-floor',
            name: 'Mop bathroom floor',
            description: 'Mop and disinfect bathroom floor',
            category: 'cleaning',
            priority: 'medium',
            frequency: 'daily',
            estimatedTime: 5,
            supplies: ['mop', 'disinfectant'],
            validationCriteria: ['Floor clean', 'No standing water'],
            customizable: true,
            requiresPhoto: false,
            order: 4
          }
        ]
      }
    ],
    supplies: [
      { id: 'glass-cleaner', name: 'Glass Cleaner', category: 'chemicals', quantity: 1, unit: 'bottle', optional: false },
      { id: 'microfiber-cloth', name: 'Microfiber Cloths', category: 'tools', quantity: 10, unit: 'pieces', optional: false },
      { id: 'vacuum', name: 'Vacuum Cleaner', category: 'equipment', quantity: 1, unit: 'unit', optional: false },
      { id: 'disinfectant', name: 'Disinfectant Spray', category: 'chemicals', quantity: 2, unit: 'bottles', optional: false },
      { id: 'trash-bags', name: 'Trash Bags', category: 'supplies', quantity: 20, unit: 'pieces', optional: false },
      { id: 'toilet-cleaner', name: 'Toilet Bowl Cleaner', category: 'chemicals', quantity: 1, unit: 'bottle', optional: false },
      { id: 'mop', name: 'Mop and Bucket', category: 'equipment', quantity: 1, unit: 'set', optional: false },
      { id: 'toilet-paper', name: 'Toilet Paper', category: 'supplies', quantity: 12, unit: 'rolls', optional: false },
      { id: 'paper-towels', name: 'Paper Towels', category: 'supplies', quantity: 6, unit: 'rolls', optional: false },
      { id: 'soap', name: 'Hand Soap', category: 'supplies', quantity: 4, unit: 'bottles', optional: false },
      { id: 'dish-soap', name: 'Dish Soap', category: 'chemicals', quantity: 1, unit: 'bottle', optional: true }
    ],
    validation: {
      minRooms: 2,
      maxRooms: 10,
      minTasks: 5,
      maxTasks: 50,
      requiredRooms: ['main-office', 'bathroom'],
      requiredTasks: ['empty-trash', 'clean-surfaces', 'clean-toilet']
    }
  }
]

export const useTemplateStore = defineStore('template', () => {
  // State
  const templates = ref<CleaningTemplate[]>(defaultTemplates)
  const customTemplates = ref<CleaningTemplate[]>([])
  const selectedTemplate = ref<CleaningTemplate | null>(null)
  const currentCustomization = ref<TemplateCustomization | null>(null)
  const recentlyUsedTemplateIds = ref<string[]>([])
  const favoriteTemplateIds = ref<string[]>([])

  // Local Storage Persistence
  const storedCustomTemplates = useLocalStorage('custom-templates', customTemplates.value)
  const storedRecentlyUsed = useLocalStorage('recently-used-templates', recentlyUsedTemplateIds.value)
  const storedFavorites = useLocalStorage('favorite-templates', favoriteTemplateIds.value)

  // Load from storage
  customTemplates.value = storedCustomTemplates.value
  recentlyUsedTemplateIds.value = storedRecentlyUsed.value
  favoriteTemplateIds.value = storedFavorites.value

  // Computed
  const allTemplates = computed(() => [...templates.value, ...customTemplates.value])
  
  const templatesByCategory = computed(() => {
    const grouped: Record<TemplateCategory, CleaningTemplate[]> = {
      office: [],
      residential: [],
      medical: [],
      hospitality: [],
      retail: [],
      industrial: [],
      educational: [],
      specialty: []
    }
    
    allTemplates.value.forEach(template => {
      grouped[template.metadata.category].push(template)
    })
    
    return grouped
  })

  const recentTemplates = computed(() => {
    return recentlyUsedTemplateIds.value
      .map(id => allTemplates.value.find(t => t.id === id))
      .filter(Boolean) as CleaningTemplate[]
  })

  const favoriteTemplates = computed(() => {
    return favoriteTemplateIds.value
      .map(id => allTemplates.value.find(t => t.id === id))
      .filter(Boolean) as CleaningTemplate[]
  })

  const estimatedTime = computed(() => {
    if (!selectedTemplate.value || !currentCustomization.value) return 0
    
    let totalTime = 0
    const customization = currentCustomization.value
    
    selectedTemplate.value.rooms.forEach(room => {
      if (customization.selectedRoomIds.includes(room.id)) {
        room.tasks.forEach(task => {
          if (!customization.removedTaskIds.includes(task.id)) {
            const modification = customization.taskModifications.get(task.id)
            totalTime += modification?.estimatedTime || task.estimatedTime
          }
        })
      }
    })
    
    // Add time for custom tasks
    customization.addedTasks.forEach(task => {
      totalTime += task.estimatedTime
    })
    
    return totalTime
  })

  // Actions
  function selectTemplate(templateId: string) {
    const template = allTemplates.value.find(t => t.id === templateId)
    if (template) {
      selectedTemplate.value = template
      initializeCustomization()
      
      // Update recently used
      const index = recentlyUsedTemplateIds.value.indexOf(templateId)
      if (index > -1) {
        recentlyUsedTemplateIds.value.splice(index, 1)
      }
      recentlyUsedTemplateIds.value.unshift(templateId)
      
      // Keep only last 10 recently used
      if (recentlyUsedTemplateIds.value.length > 10) {
        recentlyUsedTemplateIds.value = recentlyUsedTemplateIds.value.slice(0, 10)
      }
      
      storedRecentlyUsed.value = recentlyUsedTemplateIds.value
    }
  }

  function initializeCustomization() {
    if (!selectedTemplate.value) return
    
    currentCustomization.value = {
      selectedRoomIds: selectedTemplate.value.rooms
        .filter(room => !room.optional)
        .map(room => room.id),
      taskModifications: new Map(),
      addedTasks: [],
      removedTaskIds: [],
      parameterValues: {}
    }
    
    // Set default parameter values
    selectedTemplate.value.configuration.parameters.forEach(param => {
      if (currentCustomization.value) {
        currentCustomization.value.parameterValues[param.id] = param.defaultValue
      }
    })
  }

  function toggleRoom(roomId: string) {
    if (!currentCustomization.value) return
    
    const index = currentCustomization.value.selectedRoomIds.indexOf(roomId)
    if (index > -1) {
      currentCustomization.value.selectedRoomIds.splice(index, 1)
    } else {
      currentCustomization.value.selectedRoomIds.push(roomId)
    }
  }

  function modifyTask(taskId: string, modifications: Partial<TaskTemplate>) {
    if (!currentCustomization.value) return
    
    currentCustomization.value.taskModifications.set(taskId, modifications)
  }

  function addCustomTask(roomId: string, task: Omit<TaskTemplate, 'id'>) {
    if (!currentCustomization.value) return
    
    const customTask: TaskTemplate = {
      ...task,
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }
    
    currentCustomization.value.addedTasks.push(customTask)
  }

  function removeTask(taskId: string) {
    if (!currentCustomization.value) return
    
    // Check if it's a custom task
    const customIndex = currentCustomization.value.addedTasks.findIndex(t => t.id === taskId)
    if (customIndex > -1) {
      currentCustomization.value.addedTasks.splice(customIndex, 1)
    } else {
      currentCustomization.value.removedTaskIds.push(taskId)
    }
  }

  function setParameter(parameterId: string, value: any) {
    if (!currentCustomization.value) return
    
    currentCustomization.value.parameterValues[parameterId] = value
  }

  function generateChecklist(): GeneratedChecklist | null {
    if (!selectedTemplate.value || !currentCustomization.value) return null
    
    const checklistStore = useChecklistStore()
    const tasks: GeneratedChecklist['tasks'] = []
    let orderCounter = 0
    
    // Process selected rooms and their tasks
    selectedTemplate.value.rooms.forEach(room => {
      if (!currentCustomization.value!.selectedRoomIds.includes(room.id)) return
      
      // Process original tasks
      room.tasks.forEach(task => {
        if (currentCustomization.value!.removedTaskIds.includes(task.id)) return
        
        const modifications = currentCustomization.value!.taskModifications.get(task.id)
        
        tasks.push({
          id: `${room.id}-${task.id}`,
          title: modifications?.name || task.name,
          description: modifications?.description || task.description,
          roomName: room.name,
          priority: (modifications?.priority || task.priority) as string,
          estimatedTime: modifications?.estimatedTime || task.estimatedTime,
          order: orderCounter++
        })
      })
      
      // Add custom tasks for this room
      currentCustomization.value!.addedTasks
        .filter(task => task.category === room.id)
        .forEach(task => {
          tasks.push({
            id: task.id,
            title: task.name,
            description: task.description,
            roomName: room.name,
            priority: task.priority as string,
            estimatedTime: task.estimatedTime,
            order: orderCounter++
          })
        })
    })
    
    const generatedChecklist: GeneratedChecklist = {
      templateId: selectedTemplate.value.id,
      templateName: selectedTemplate.value.metadata.name,
      customizations: currentCustomization.value,
      generatedAt: new Date(),
      estimatedTime: estimatedTime.value,
      tasks
    }
    
    // Create checklist items in the main store
    const categoryId = checklistStore.categories.find(c => c.name === 'Templates')?.id || 
                      checklistStore.addCategory({ name: 'Templates', color: '#8B5CF6', icon: '📋', order: 0 }).id
    
    tasks.forEach(task => {
      const priorityMap: Record<string, Priority> = {
        critical: 'urgent',
        high: 'high',
        medium: 'medium',
        low: 'low',
        optional: 'low'
      }
      
      checklistStore.addItem({
        title: `${task.roomName}: ${task.title}`,
        description: task.description,
        completed: false,
        priority: priorityMap[task.priority] || 'medium',
        dueDate: null,
        categoryId,
        tags: [task.roomName, selectedTemplate.value!.metadata.category],
        order: task.order,
        status: 'pending'
      })
    })
    
    // Update template usage count
    const template = allTemplates.value.find(t => t.id === selectedTemplate.value!.id)
    if (template) {
      template.metadata.usageCount++
    }
    
    return generatedChecklist
  }

  function saveAsCustomTemplate(name: string, description: string) {
    if (!selectedTemplate.value || !currentCustomization.value) return null
    
    const customTemplate: CleaningTemplate = {
      ...JSON.parse(JSON.stringify(selectedTemplate.value)), // Deep clone
      id: `custom-${Date.now()}`,
      isCustom: true,
      baseTemplateId: selectedTemplate.value.id,
      metadata: {
        ...selectedTemplate.value.metadata,
        name,
        description,
        author: 'User',
        createdAt: new Date(),
        updatedAt: new Date(),
        usageCount: 0,
        rating: 0
      }
    }
    
    // Apply customizations to the template
    // Filter rooms
    customTemplate.rooms = customTemplate.rooms.filter(room => 
      currentCustomization.value!.selectedRoomIds.includes(room.id)
    )
    
    // Apply task modifications and removals
    customTemplate.rooms.forEach(room => {
      // Remove deleted tasks
      room.tasks = room.tasks.filter(task => 
        !currentCustomization.value!.removedTaskIds.includes(task.id)
      )
      
      // Apply modifications
      room.tasks.forEach(task => {
        const modifications = currentCustomization.value!.taskModifications.get(task.id)
        if (modifications) {
          Object.assign(task, modifications)
        }
      })
      
      // Add custom tasks
      const customTasksForRoom = currentCustomization.value!.addedTasks
        .filter(task => task.category === room.id)
      room.tasks.push(...customTasksForRoom)
    })
    
    customTemplates.value.push(customTemplate)
    storedCustomTemplates.value = customTemplates.value
    
    return customTemplate
  }

  function deleteCustomTemplate(templateId: string) {
    customTemplates.value = customTemplates.value.filter(t => t.id !== templateId)
    storedCustomTemplates.value = customTemplates.value
  }

  function toggleFavorite(templateId: string) {
    const index = favoriteTemplateIds.value.indexOf(templateId)
    if (index > -1) {
      favoriteTemplateIds.value.splice(index, 1)
    } else {
      favoriteTemplateIds.value.push(templateId)
    }
    storedFavorites.value = favoriteTemplateIds.value
  }

  function searchTemplates(query: string): CleaningTemplate[] {
    const lowercaseQuery = query.toLowerCase()
    return allTemplates.value.filter(template => 
      template.metadata.name.toLowerCase().includes(lowercaseQuery) ||
      template.metadata.description.toLowerCase().includes(lowercaseQuery) ||
      template.metadata.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      template.metadata.category.includes(lowercaseQuery)
    )
  }

  function importTemplate(templateData: CleaningTemplate) {
    // Validate template structure
    if (!templateData.id || !templateData.metadata || !templateData.rooms) {
      throw new Error('Invalid template format')
    }
    
    // Check if template already exists
    const exists = allTemplates.value.find(t => t.id === templateData.id)
    if (exists) {
      throw new Error('Template with this ID already exists')
    }
    
    customTemplates.value.push(templateData)
    storedCustomTemplates.value = customTemplates.value
  }

  function exportTemplate(templateId: string): CleaningTemplate | null {
    return allTemplates.value.find(t => t.id === templateId) || null
  }

  return {
    // State
    templates,
    customTemplates,
    selectedTemplate,
    currentCustomization,
    recentlyUsedTemplateIds,
    favoriteTemplateIds,
    
    // Computed
    allTemplates,
    templatesByCategory,
    recentTemplates,
    favoriteTemplates,
    estimatedTime,
    
    // Actions
    selectTemplate,
    initializeCustomization,
    toggleRoom,
    modifyTask,
    addCustomTask,
    removeTask,
    setParameter,
    generateChecklist,
    saveAsCustomTemplate,
    deleteCustomTemplate,
    toggleFavorite,
    searchTemplates,
    importTemplate,
    exportTemplate
  }
})