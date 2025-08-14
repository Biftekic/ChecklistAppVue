<template>
  <div class="template-customizer">
    <div v-if="!template" class="no-template">
      <p>Please select a template first</p>
    </div>
    
    <div v-else class="customizer-content">
      <!-- Header -->
      <div class="customizer-header">
        <h2 class="template-title">{{ template.metadata.name }}</h2>
        <p class="template-description">{{ template.metadata.description }}</p>
        
        <div class="template-stats">
          <div class="stat">
            <span class="stat-label">Estimated Time:</span>
            <span class="stat-value">{{ formatTime(estimatedTime) }}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Selected Rooms:</span>
            <span class="stat-value">{{ selectedRoomsCount }} / {{ template.rooms.length }}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Total Tasks:</span>
            <span class="stat-value">{{ totalTasksCount }}</span>
          </div>
        </div>
      </div>

      <!-- Parameters Section -->
      <div v-if="template.configuration.parameters.length > 0" class="parameters-section">
        <h3 class="section-title">Configuration</h3>
        <div class="parameters-grid">
          <div v-for="param in template.configuration.parameters" :key="param.id" class="parameter">
            <label :for="param.id" class="parameter-label">
              {{ param.name }}
              <span v-if="param.required" class="required">*</span>
            </label>
            <p v-if="param.description" class="parameter-description">{{ param.description }}</p>
            
            <!-- Number Input -->
            <input
              v-if="param.type === 'number'"
              :id="param.id"
              type="number"
              v-model.number="parameterValues[param.id]"
              class="parameter-input"
              :required="param.required"
            />
            
            <!-- Text Input -->
            <input
              v-else-if="param.type === 'string'"
              :id="param.id"
              type="text"
              v-model="parameterValues[param.id]"
              class="parameter-input"
              :required="param.required"
            />
            
            <!-- Select Input -->
            <select
              v-else-if="param.type === 'select'"
              :id="param.id"
              v-model="parameterValues[param.id]"
              class="parameter-input"
              :required="param.required"
            >
              <option v-for="option in param.options" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
            
            <!-- Boolean Input -->
            <label v-else-if="param.type === 'boolean'" class="parameter-checkbox">
              <input
                :id="param.id"
                type="checkbox"
                v-model="parameterValues[param.id]"
              />
              <span>Enable</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Room Selection -->
      <div class="rooms-section">
        <div class="section-header">
          <h3 class="section-title">Select Rooms</h3>
          <div class="section-actions">
            <button @click="selectAllRooms" class="action-btn">Select All</button>
            <button @click="deselectAllRooms" class="action-btn">Deselect All</button>
          </div>
        </div>
        
        <div class="rooms-list">
          <div
            v-for="room in template.rooms"
            :key="room.id"
            :class="['room-card', { selected: isRoomSelected(room.id), required: !room.optional }]"
          >
            <div class="room-header">
              <label class="room-checkbox">
                <input
                  type="checkbox"
                  :checked="isRoomSelected(room.id)"
                  :disabled="!room.optional && template.validation.requiredRooms.includes(room.id)"
                  @change="toggleRoom(room.id)"
                />
                <span class="room-name">
                  {{ room.name }}
                  <span v-if="!room.optional" class="required-badge">Required</span>
                </span>
              </label>
              
              <div class="room-meta">
                <span class="room-time">
                  <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ room.estimatedTime }} min
                </span>
                <span class="room-tasks">
                  {{ room.tasks.length }} tasks
                </span>
              </div>
            </div>
            
            <!-- Room Tasks (expandable) -->
            <div v-if="isRoomSelected(room.id)" class="room-tasks-list">
              <div class="tasks-header">
                <button @click="toggleRoomExpanded(room.id)" class="expand-btn">
                  <svg
                    class="expand-icon"
                    :class="{ rotated: expandedRooms.includes(room.id) }"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                  Tasks
                </button>
                <button @click="addCustomTask(room.id)" class="add-task-btn">
                  <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Task
                </button>
              </div>
              
              <transition name="expand">
                <div v-show="expandedRooms.includes(room.id)" class="tasks-container">
                  <draggable
                    v-model="roomTasks[room.id]"
                    :group="{ name: 'tasks', pull: false, put: false }"
                    handle=".drag-handle"
                    @end="onTaskReorder(room.id)"
                    item-key="id"
                  >
                    <template #item="{ element: task }">
                      <div
                        :class="['task-item', { removed: removedTasks.includes(task.id) }]"
                      >
                        <div class="drag-handle">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                          </svg>
                        </div>
                        
                        <div class="task-content">
                          <div class="task-header">
                            <input
                              type="checkbox"
                              :checked="!removedTasks.includes(task.id)"
                              @change="toggleTask(task.id)"
                              :disabled="!task.customizable && template.validation.requiredTasks.includes(task.id)"
                            />
                            <span class="task-name" :class="{ 'line-through': removedTasks.includes(task.id) }">
                              {{ task.name }}
                              <span v-if="!task.customizable" class="required-badge">Required</span>
                            </span>
                          </div>
                          
                          <p class="task-description">{{ task.description }}</p>
                          
                          <div class="task-meta">
                            <span class="meta-chip priority" :class="`priority-${task.priority}`">
                              {{ task.priority }}
                            </span>
                            <span class="meta-chip">
                              {{ task.estimatedTime }} min
                            </span>
                            <span class="meta-chip">
                              {{ task.frequency }}
                            </span>
                          </div>
                          
                          <button
                            v-if="task.customizable"
                            @click="editTask(room.id, task)"
                            class="edit-task-btn"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    </template>
                  </draggable>
                  
                  <!-- Custom Tasks -->
                  <div v-for="task in getCustomTasksForRoom(room.id)" :key="task.id" class="task-item custom-task">
                    <div class="task-content">
                      <div class="task-header">
                        <span class="custom-badge">Custom</span>
                        <span class="task-name">{{ task.name }}</span>
                      </div>
                      <p class="task-description">{{ task.description }}</p>
                      <div class="task-meta">
                        <span class="meta-chip">{{ task.estimatedTime }} min</span>
                      </div>
                      <div class="task-actions">
                        <button @click="editCustomTask(task)" class="edit-task-btn">Edit</button>
                        <button @click="removeCustomTask(task.id)" class="remove-task-btn">Remove</button>
                      </div>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-footer">
        <button @click="resetCustomization" class="btn btn-secondary">
          Reset to Defaults
        </button>
        <button @click="saveAsTemplate" class="btn btn-secondary">
          Save as Template
        </button>
        <button @click="generateChecklist" class="btn btn-primary" :disabled="!canGenerate">
          Generate Checklist ({{ totalTasksCount }} tasks)
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive } from 'vue'
import { VueDraggableNext as Draggable } from 'vue-draggable-next'
import { useTemplateStore } from '@/stores/template.store'
import type { CleaningTemplate, RoomTemplate, TaskTemplate } from '@/types/template.types'

// Props
interface Props {
  template: CleaningTemplate | null
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'generate': []
  'save-template': [name: string, description: string]
  'edit-task': [roomId: string, task: TaskTemplate]
  'add-task': [roomId: string]
}>()

// Store
const templateStore = useTemplateStore()

// State
const selectedRooms = ref<string[]>([])
const expandedRooms = ref<string[]>([])
const removedTasks = ref<string[]>([])
const customTasks = ref<TaskTemplate[]>([])
const parameterValues = reactive<Record<string, any>>({})
const roomTasks = reactive<Record<string, TaskTemplate[]>>({})

// Initialize when template changes
watch(() => props.template, (newTemplate) => {
  if (newTemplate) {
    // Initialize selected rooms (required rooms are pre-selected)
    selectedRooms.value = newTemplate.rooms
      .filter(room => !room.optional || newTemplate.validation.requiredRooms.includes(room.id))
      .map(room => room.id)
    
    // Initialize parameter values
    newTemplate.configuration.parameters.forEach(param => {
      parameterValues[param.id] = param.defaultValue
    })
    
    // Initialize room tasks for drag and drop
    newTemplate.rooms.forEach(room => {
      roomTasks[room.id] = [...room.tasks]
    })
    
    // Clear other state
    expandedRooms.value = []
    removedTasks.value = []
    customTasks.value = []
  }
}, { immediate: true })

// Computed
const selectedRoomsCount = computed(() => selectedRooms.value.length)

const totalTasksCount = computed(() => {
  if (!props.template) return 0
  
  let count = 0
  selectedRooms.value.forEach(roomId => {
    const room = props.template!.rooms.find(r => r.id === roomId)
    if (room) {
      // Count original tasks that aren't removed
      count += room.tasks.filter(t => !removedTasks.value.includes(t.id)).length
      // Count custom tasks for this room
      count += customTasks.value.filter(t => t.category === roomId).length
    }
  })
  return count
})

const estimatedTime = computed(() => {
  if (!props.template) return 0
  
  let time = 0
  selectedRooms.value.forEach(roomId => {
    const room = props.template!.rooms.find(r => r.id === roomId)
    if (room) {
      room.tasks.forEach(task => {
        if (!removedTasks.value.includes(task.id)) {
          time += task.estimatedTime
        }
      })
      // Add time for custom tasks
      customTasks.value
        .filter(t => t.category === roomId)
        .forEach(task => {
          time += task.estimatedTime
        })
    }
  })
  return time
})

const canGenerate = computed(() => {
  return selectedRooms.value.length > 0 && totalTasksCount.value > 0
})

// Methods
function isRoomSelected(roomId: string): boolean {
  return selectedRooms.value.includes(roomId)
}

function toggleRoom(roomId: string) {
  const index = selectedRooms.value.indexOf(roomId)
  if (index > -1) {
    selectedRooms.value.splice(index, 1)
    // Collapse room when deselected
    const expandIndex = expandedRooms.value.indexOf(roomId)
    if (expandIndex > -1) {
      expandedRooms.value.splice(expandIndex, 1)
    }
  } else {
    selectedRooms.value.push(roomId)
  }
  
  // Update store
  templateStore.toggleRoom(roomId)
}

function selectAllRooms() {
  if (props.template) {
    selectedRooms.value = props.template.rooms.map(r => r.id)
    props.template.rooms.forEach(room => {
      templateStore.currentCustomization?.selectedRoomIds.push(room.id)
    })
  }
}

function deselectAllRooms() {
  if (props.template) {
    // Keep only required rooms
    selectedRooms.value = props.template.rooms
      .filter(room => !room.optional && props.template!.validation.requiredRooms.includes(room.id))
      .map(room => room.id)
  }
}

function toggleRoomExpanded(roomId: string) {
  const index = expandedRooms.value.indexOf(roomId)
  if (index > -1) {
    expandedRooms.value.splice(index, 1)
  } else {
    expandedRooms.value.push(roomId)
  }
}

function toggleTask(taskId: string) {
  const index = removedTasks.value.indexOf(taskId)
  if (index > -1) {
    removedTasks.value.splice(index, 1)
    // Remove from store's removed tasks
    if (templateStore.currentCustomization) {
      const storeIndex = templateStore.currentCustomization.removedTaskIds.indexOf(taskId)
      if (storeIndex > -1) {
        templateStore.currentCustomization.removedTaskIds.splice(storeIndex, 1)
      }
    }
  } else {
    removedTasks.value.push(taskId)
    templateStore.removeTask(taskId)
  }
}

function onTaskReorder(roomId: string) {
  // Update task order in the store
  const tasks = roomTasks[roomId]
  tasks.forEach((task, index) => {
    templateStore.modifyTask(task.id, { order: index })
  })
}

function editTask(roomId: string, task: TaskTemplate) {
  emit('edit-task', roomId, task)
}

function addCustomTask(roomId: string) {
  emit('add-task', roomId)
}

function editCustomTask(task: TaskTemplate) {
  // TODO: Implement edit modal for custom task
  // For now, this is a placeholder for future functionality
}

function removeCustomTask(taskId: string) {
  const index = customTasks.value.findIndex(t => t.id === taskId)
  if (index > -1) {
    customTasks.value.splice(index, 1)
  }
  
  // Remove from store
  if (templateStore.currentCustomization) {
    const storeIndex = templateStore.currentCustomization.addedTasks.findIndex(t => t.id === taskId)
    if (storeIndex > -1) {
      templateStore.currentCustomization.addedTasks.splice(storeIndex, 1)
    }
  }
}

function getCustomTasksForRoom(roomId: string): TaskTemplate[] {
  return customTasks.value.filter(t => t.category === roomId)
}

function resetCustomization() {
  if (props.template) {
    // Reset to defaults
    selectedRooms.value = props.template.rooms
      .filter(room => !room.optional)
      .map(room => room.id)
    removedTasks.value = []
    customTasks.value = []
    expandedRooms.value = []
    
    // Reset parameters
    props.template.configuration.parameters.forEach(param => {
      parameterValues[param.id] = param.defaultValue
    })
    
    // Reset store
    templateStore.initializeCustomization()
  }
}

function saveAsTemplate() {
  // Open modal to get name and description
  const name = prompt('Template name:')
  const description = prompt('Template description:')
  
  if (name && description) {
    templateStore.saveAsCustomTemplate(name, description)
    emit('save-template', name, description)
  }
}

function generateChecklist() {
  // Apply all customizations to store
  Object.entries(parameterValues).forEach(([key, value]) => {
    templateStore.setParameter(key, value)
  })
  
  // Generate the checklist
  const checklist = templateStore.generateChecklist()
  if (checklist) {
    emit('generate')
  }
}

function formatTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (mins === 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`
  }
  return `${hours}h ${mins}min`
}
</script>

<style scoped>
.template-customizer {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.no-template {
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(107 114 128);
  height: 16rem;
}

.customizer-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.customizer-header {
  @apply bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm;
}

.template-title {
  @apply text-2xl font-bold mb-2;
}

.template-description {
  @apply text-gray-600 dark:text-gray-400 mb-4;
}

.template-stats {
  @apply flex gap-6;
}

.stat {
  @apply flex flex-col;
}

.stat-label {
  @apply text-sm text-gray-500 dark:text-gray-400;
}

.stat-value {
  @apply text-lg font-semibold;
}

.parameters-section,
.rooms-section {
  @apply bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm;
}

.section-header {
  @apply flex items-center justify-between mb-4;
}

.section-title {
  @apply text-lg font-semibold;
}

.section-actions {
  @apply flex gap-2;
}

.action-btn {
  @apply px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg;
  @apply hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors;
}

.parameters-grid {
  @apply grid grid-cols-1 md:grid-cols-2 gap-4;
}

.parameter {
  @apply space-y-1;
}

.parameter-label {
  @apply block text-sm font-medium;
}

.parameter-description {
  @apply text-xs text-gray-500 dark:text-gray-400;
}

.parameter-input {
  @apply w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500;
  @apply dark:bg-gray-700 dark:text-white;
}

.parameter-checkbox {
  @apply flex items-center gap-2;
}

.required {
  @apply text-red-500;
}

.required-badge {
  @apply ml-1 px-2 py-0.5 text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded;
}

.rooms-list {
  @apply space-y-4;
}

.room-card {
  @apply border border-gray-200 dark:border-gray-700 rounded-lg p-4 transition-colors;
}

.room-card.selected {
  @apply bg-blue-50 dark:bg-blue-900/20 border-blue-500;
}

.room-card.required {
  @apply bg-gray-50 dark:bg-gray-900;
}

.room-header {
  @apply flex items-center justify-between;
}

.room-checkbox {
  @apply flex items-center gap-2;
}

.room-name {
  @apply font-medium;
}

.room-meta {
  @apply flex gap-3 text-sm text-gray-500 dark:text-gray-400;
}

.icon {
  @apply w-4 h-4;
}

.room-tasks-list {
  @apply mt-4;
}

.tasks-header {
  @apply flex items-center justify-between mb-2;
}

.expand-btn {
  @apply flex items-center gap-1 text-sm font-medium;
}

.expand-icon {
  @apply w-4 h-4 transition-transform;
}

.expand-icon.rotated {
  @apply rotate-180;
}

.add-task-btn {
  @apply flex items-center gap-1 px-2 py-1 text-xs bg-blue-500 text-white rounded;
  @apply hover:bg-blue-600 transition-colors;
}

.tasks-container {
  @apply space-y-2 mt-2;
}

.task-item {
  @apply flex gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg;
}

.task-item.removed {
  @apply opacity-50;
}

.task-item.custom-task {
  @apply bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800;
}

.drag-handle {
  @apply cursor-move p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded;
}

.drag-handle svg {
  @apply w-4 h-4 text-gray-400;
}

.task-content {
  @apply flex-1 space-y-2;
}

.task-header {
  @apply flex items-center gap-2;
}

.task-name {
  @apply font-medium;
}

.line-through {
  @apply line-through text-gray-500;
}

.task-description {
  @apply text-sm text-gray-600 dark:text-gray-400;
}

.task-meta {
  @apply flex gap-2;
}

.meta-chip {
  @apply px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 rounded;
}

.priority-critical {
  @apply bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300;
}

.priority-high {
  @apply bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300;
}

.priority-medium {
  @apply bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300;
}

.priority-low {
  @apply bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300;
}

.priority-optional {
  @apply bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300;
}

.edit-task-btn,
.remove-task-btn {
  @apply px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded;
  @apply hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors;
}

.remove-task-btn {
  @apply border-red-300 dark:border-red-600 text-red-600 dark:text-red-400;
  @apply hover:bg-red-50 dark:hover:bg-red-900/20;
}

.custom-badge {
  @apply px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded;
}

.task-actions {
  @apply flex gap-2;
}

.action-footer {
  @apply flex gap-4 justify-end p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm;
}

.btn {
  @apply px-4 py-2 rounded-lg font-medium transition-colors;
}

.btn-secondary {
  @apply border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700;
}

.btn-primary {
  @apply bg-blue-500 text-white hover:bg-blue-600;
}

.btn:disabled {
  @apply opacity-50 cursor-not-allowed;
}

/* Transitions */
.expand-enter-active,
.expand-leave-active {
  @apply transition-all duration-300 ease-in-out;
}

.expand-enter-from,
.expand-leave-to {
  @apply opacity-0 max-h-0;
}
</style>