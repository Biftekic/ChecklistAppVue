<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              Customize Template: {{ template.metadata.name }}
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Select rooms and tasks to include in your checklist
            </p>
          </div>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="px-6 py-3 bg-gray-50 dark:bg-gray-700">
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-600 dark:text-gray-300">
            Step {{ currentStep }} of 3
          </span>
          <div class="flex-1 mx-4">
            <div class="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
              <div
                class="h-full bg-blue-600 transition-all duration-300"
                :style="{ width: `${(currentStep / 3) * 100}%` }"
              ></div>
            </div>
          </div>
          <span class="text-gray-600 dark:text-gray-300">
            {{ estimatedTime }} min estimated
          </span>
        </div>
      </div>

      <!-- Modal Content -->
      <div class="overflow-y-auto max-h-[calc(90vh-200px)] p-6">
        <!-- Step 1: Select Rooms -->
        <div v-if="currentStep === 1" class="space-y-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Select Areas to Clean
          </h3>
          
          <div class="space-y-3">
            <div
              v-for="room in template.rooms"
              :key="room.id"
              class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <label class="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  v-model="selectedRooms"
                  :value="room.id"
                  :disabled="!room.optional && template.validation.requiredRooms.includes(room.id)"
                  class="mt-1 mr-3 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                >
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <div>
                      <span class="font-medium text-gray-900 dark:text-white">
                        {{ room.name }}
                      </span>
                      <span
                        v-if="!room.optional"
                        class="ml-2 px-2 py-1 text-xs bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded"
                      >
                        Required
                      </span>
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ room.tasks.length }} tasks • {{ room.estimatedTime }} min
                    </div>
                  </div>
                  <p v-if="room.description" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {{ room.description }}
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div class="mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <p class="text-sm text-blue-700 dark:text-blue-300">
              <strong>Selected:</strong> {{ selectedRooms.length }} areas • 
              <strong>Tasks:</strong> {{ getSelectedTasksCount() }} • 
              <strong>Time:</strong> {{ getSelectedTime() }} minutes
            </p>
          </div>
        </div>

        <!-- Step 2: Customize Tasks -->
        <div v-if="currentStep === 2" class="space-y-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Customize Tasks
          </h3>

          <div class="space-y-4">
            <div
              v-for="room in getSelectedRoomObjects()"
              :key="room.id"
              class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
            >
              <div class="px-4 py-3 bg-gray-50 dark:bg-gray-700">
                <h4 class="font-medium text-gray-900 dark:text-white">{{ room.name }}</h4>
              </div>
              
              <div class="p-4 space-y-3">
                <div
                  v-for="task in room.tasks"
                  :key="task.id"
                  class="flex items-start"
                >
                  <input
                    type="checkbox"
                    v-model="selectedTasks"
                    :value="`${room.id}-${task.id}`"
                    :disabled="template.validation.requiredTasks.includes(task.id)"
                    class="mt-1 mr-3 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  >
                  <div class="flex-1">
                    <div class="flex items-center">
                      <span class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ task.name }}
                      </span>
                      <span
                        v-if="template.validation.requiredTasks.includes(task.id)"
                        class="ml-2 px-2 py-0.5 text-xs bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded"
                      >
                        Required
                      </span>
                      <span
                        :class="getPriorityClass(task.priority)"
                        class="ml-2 px-2 py-0.5 text-xs text-white rounded"
                      >
                        {{ task.priority }}
                      </span>
                    </div>
                    <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {{ task.description }} • {{ task.estimatedTime }} min
                    </p>
                  </div>
                  <button
                    @click="editTask(room.id, task)"
                    class="ml-2 p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                </div>

                <!-- Add Custom Task Button -->
                <button
                  @click="addCustomTask(room.id)"
                  class="w-full mt-2 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  + Add Custom Task
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Review & Apply -->
        <div v-if="currentStep === 3" class="space-y-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Review Your Checklist
          </h3>

          <!-- Checklist Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Checklist Name
            </label>
            <input
              v-model="checklistName"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter a name for your checklist"
            >
          </div>

          <!-- Summary -->
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 class="font-medium text-gray-900 dark:text-white mb-3">Summary</h4>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div class="text-sm text-gray-500 dark:text-gray-400">Areas</div>
                <div class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ selectedRooms.length }}
                </div>
              </div>
              <div>
                <div class="text-sm text-gray-500 dark:text-gray-400">Tasks</div>
                <div class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ selectedTasks.length + customTasks.length }}
                </div>
              </div>
              <div>
                <div class="text-sm text-gray-500 dark:text-gray-400">Est. Time</div>
                <div class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ estimatedTime }} min
                </div>
              </div>
              <div>
                <div class="text-sm text-gray-500 dark:text-gray-400">Team Size</div>
                <div class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ template.configuration.teamSize.recommended }}
                </div>
              </div>
            </div>
          </div>

          <!-- Selected Items Preview -->
          <div class="space-y-3">
            <h4 class="font-medium text-gray-900 dark:text-white">Selected Items</h4>
            <div class="max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-3">
              <div
                v-for="room in getSelectedRoomObjects()"
                :key="room.id"
                class="mb-3"
              >
                <div class="font-medium text-sm text-gray-900 dark:text-white mb-1">
                  {{ room.name }}
                </div>
                <ul class="space-y-1 ml-4">
                  <li
                    v-for="task in getSelectedTasksForRoom(room.id)"
                    :key="task.id"
                    class="text-xs text-gray-600 dark:text-gray-400 flex items-center"
                  >
                    <svg class="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                    {{ task.name }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              v-model="notes"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Add any special instructions or notes..."
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
        <button
          v-if="currentStep > 1"
          @click="currentStep--"
          class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Back
        </button>
        <div v-else></div>
        
        <div class="flex gap-3">
          <button
            @click="$emit('close')"
            class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            v-if="currentStep < 3"
            @click="currentStep++"
            :disabled="!canProceed()"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
          <button
            v-else
            @click="applyTemplate"
            :disabled="!checklistName"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Create Checklist
          </button>
        </div>
      </div>
    </div>

    <!-- Task Edit Modal -->
    <TaskEditModal
      v-if="editingTask"
      :task="editingTask"
      @save="saveTaskEdit"
      @close="editingTask = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTemplateStore } from '@/stores/template.store'
import type { CleaningTemplate, TaskTemplate, RoomTemplate } from '@/types/template.types'
import TaskEditModal from '@/components/TaskEditModal.vue'

const props = defineProps<{
  template: CleaningTemplate
}>()

const emit = defineEmits<{
  close: []
  apply: [customization: any]
}>()

const templateStore = useTemplateStore()

// State
const currentStep = ref(1)
const selectedRooms = ref<string[]>([])
const selectedTasks = ref<string[]>([])
const customTasks = ref<any[]>([])
const taskModifications = ref<Map<string, Partial<TaskTemplate>>>(new Map())
const checklistName = ref(`${props.template.metadata.name} - ${new Date().toLocaleDateString()}`)
const notes = ref('')
const editingTask = ref<TaskTemplate | null>(null)

// Initialize with required rooms
props.template.validation.requiredRooms.forEach(roomId => {
  selectedRooms.value.push(roomId)
})

// Initialize with all tasks for selected rooms
props.template.rooms.forEach(room => {
  if (selectedRooms.value.includes(room.id)) {
    room.tasks.forEach(task => {
      selectedTasks.value.push(`${room.id}-${task.id}`)
    })
  }
})

// Computed
const estimatedTime = computed(() => {
  let total = 0
  selectedTasks.value.forEach(taskKey => {
    const [roomId, taskId] = taskKey.split('-')
    const room = props.template.rooms.find(r => r.id === roomId)
    const task = room?.tasks.find(t => t.id === taskId)
    if (task) {
      const modification = taskModifications.value.get(taskId)
      total += modification?.estimatedTime || task.estimatedTime
    }
  })
  customTasks.value.forEach(task => {
    total += task.estimatedTime || 0
  })
  return total
})

// Methods
function getSelectedRoomObjects(): RoomTemplate[] {
  return props.template.rooms.filter(room => selectedRooms.value.includes(room.id))
}

function getSelectedTasksCount(): number {
  return getSelectedRoomObjects().reduce((count, room) => count + room.tasks.length, 0)
}

function getSelectedTime(): number {
  return getSelectedRoomObjects().reduce((time, room) => time + room.estimatedTime, 0)
}

function getSelectedTasksForRoom(roomId: string): TaskTemplate[] {
  const room = props.template.rooms.find(r => r.id === roomId)
  if (!room) return []
  
  return room.tasks.filter(task => 
    selectedTasks.value.includes(`${roomId}-${task.id}`)
  )
}

function getPriorityClass(priority: string): string {
  const classes: Record<string, string> = {
    critical: 'bg-red-500',
    high: 'bg-orange-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500',
    optional: 'bg-gray-400'
  }
  return classes[priority] || 'bg-gray-400'
}

function canProceed(): boolean {
  switch (currentStep.value) {
    case 1:
      return selectedRooms.value.length > 0
    case 2:
      return selectedTasks.value.length >= props.template.validation.minTasks
    default:
      return true
  }
}

function editTask(roomId: string, task: TaskTemplate) {
  editingTask.value = { ...task }
}

function saveTaskEdit(modifiedTask: TaskTemplate) {
  taskModifications.value.set(modifiedTask.id, modifiedTask)
  editingTask.value = null
}

function addCustomTask(roomId: string) {
  // This would open a modal to add a custom task
  // For now, we'll just add a placeholder
  const customTask = {
    id: `custom-${Date.now()}`,
    roomId,
    name: 'Custom Task',
    description: 'User-defined task',
    priority: 'medium',
    estimatedTime: 10,
    supplies: []
  }
  customTasks.value.push(customTask)
}

function applyTemplate() {
  // Store the customization in the template store
  templateStore.currentCustomization = {
    selectedRoomIds: selectedRooms.value,
    taskModifications: taskModifications.value,
    addedTasks: customTasks.value,
    removedTaskIds: [],
    parameterValues: {},
    notes: notes.value
  }
  
  // Generate the checklist
  const checklist = templateStore.generateChecklist()
  
  emit('apply', {
    template: props.template,
    customization: templateStore.currentCustomization,
    checklistName: checklistName.value,
    checklist
  })
}
</script>