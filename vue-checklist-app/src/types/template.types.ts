// Template System Type Definitions
export type TemplateCategory = 
  | 'office'
  | 'residential'
  | 'medical'
  | 'hospitality'
  | 'retail'
  | 'industrial'
  | 'educational'
  | 'specialty'

export type RoomType =
  | 'entrance'
  | 'office'
  | 'conference'
  | 'kitchen'
  | 'bathroom'
  | 'bedroom'
  | 'living_area'
  | 'storage'
  | 'hallway'
  | 'custom'

export type Frequency =
  | 'daily'
  | 'weekly'
  | 'biweekly'
  | 'monthly'
  | 'quarterly'
  | 'annual'
  | 'one_time'

export type TaskPriority = 
  | 'critical'
  | 'high'
  | 'medium'
  | 'low'
  | 'optional'

export interface TemplateMetadata {
  name: string
  category: TemplateCategory
  industry: string
  description: string
  author: string
  createdAt: Date
  updatedAt: Date
  usageCount: number
  rating: number
  tags: string[]
  image?: string
}

export interface TimeEstimate {
  min: number
  max: number
  unit: 'minutes' | 'hours'
}

export interface TeamRequirement {
  min: number
  max: number
  recommended: number
}

export interface Parameter {
  id: string
  name: string
  type: 'number' | 'string' | 'boolean' | 'select'
  required: boolean
  defaultValue?: any
  options?: string[]
  description?: string
}

export interface CustomizationRules {
  allowAddTasks: boolean
  allowRemoveTasks: boolean
  allowEditTasks: boolean
  allowReorderTasks: boolean
  requiredTasks: string[]
}

export interface TemplateConfig {
  parameters: Parameter[]
  estimatedTime: TimeEstimate
  teamSize: TeamRequirement
  frequency: Frequency[]
  customizable: CustomizationRules
}

export interface TaskTemplate {
  id: string
  name: string
  description: string
  category: string
  priority: TaskPriority
  frequency: Frequency
  estimatedTime: number // in minutes
  supplies: string[]
  validationCriteria: string[]
  customizable: boolean
  requiresPhoto: boolean
  safetyNotes?: string
  order: number
}

export interface RoomTemplate {
  id: string
  name: string
  type: RoomType
  optional: boolean
  order: number
  tasks: TaskTemplate[]
  estimatedTime: number // in minutes
  supplies: string[]
  description?: string
}

export interface SupplyRequirement {
  id: string
  name: string
  category: string
  quantity: number
  unit: string
  optional: boolean
}

export interface ValidationRules {
  minRooms: number
  maxRooms: number
  minTasks: number
  maxTasks: number
  requiredRooms: string[]
  requiredTasks: string[]
}

export interface CleaningTemplate {
  id: string
  version: string
  metadata: TemplateMetadata
  configuration: TemplateConfig
  rooms: RoomTemplate[]
  supplies: SupplyRequirement[]
  validation: ValidationRules
  isCustom?: boolean
  baseTemplateId?: string
}

export interface TemplateCustomization {
  selectedRoomIds: string[]
  taskModifications: Map<string, Partial<TaskTemplate>>
  addedTasks: TaskTemplate[]
  removedTaskIds: string[]
  parameterValues: Record<string, any>
  notes?: string
}

export interface GeneratedChecklist {
  templateId: string
  templateName: string
  customizations: TemplateCustomization
  generatedAt: Date
  estimatedTime: number
  tasks: Array<{
    id: string
    title: string
    description: string
    roomName: string
    priority: string
    estimatedTime: number
    order: number
  }>
}