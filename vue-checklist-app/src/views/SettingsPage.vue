<template>
  <div class="space-y-6 max-w-4xl">
    <!-- Page Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Manage your preferences and application settings
      </p>
    </div>

    <!-- Settings Sections -->
    <div class="space-y-6">
      <!-- General Settings -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">General</h2>
        </div>
        <div class="p-6 space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <label class="text-sm font-medium text-gray-900 dark:text-white">Dark Mode</label>
              <p class="text-sm text-gray-500 dark:text-gray-400">Enable dark theme for the application</p>
            </div>
            <button
              @click="toggleDarkMode()"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                isDarkMode ? 'bg-blue-600' : 'bg-gray-200'
              ]"
            >
              <span
                :class="[
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  isDarkMode ? 'translate-x-6' : 'translate-x-1'
                ]"
              />
            </button>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <label class="text-sm font-medium text-gray-900 dark:text-white">Auto-save</label>
              <p class="text-sm text-gray-500 dark:text-gray-400">Automatically save changes</p>
            </div>
            <button
              @click="settings.autoSave = !settings.autoSave"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                settings.autoSave ? 'bg-blue-600' : 'bg-gray-200'
              ]"
            >
              <span
                :class="[
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  settings.autoSave ? 'translate-x-6' : 'translate-x-1'
                ]"
              />
            </button>
          </div>

          <div>
            <label class="text-sm font-medium text-gray-900 dark:text-white">Default View</label>
            <select
              v-model="settings.defaultView"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="list">List View</option>
              <option value="grid">Grid View</option>
              <option value="kanban">Kanban Board</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Notifications -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">Notifications</h2>
        </div>
        <div class="p-6 space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <label class="text-sm font-medium text-gray-900 dark:text-white">Due Date Reminders</label>
              <p class="text-sm text-gray-500 dark:text-gray-400">Get notified about upcoming due dates</p>
            </div>
            <button
              @click="settings.notifications.dueDate = !settings.notifications.dueDate"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                settings.notifications.dueDate ? 'bg-blue-600' : 'bg-gray-200'
              ]"
            >
              <span
                :class="[
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  settings.notifications.dueDate ? 'translate-x-6' : 'translate-x-1'
                ]"
              />
            </button>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <label class="text-sm font-medium text-gray-900 dark:text-white">Task Completion</label>
              <p class="text-sm text-gray-500 dark:text-gray-400">Celebrate when you complete tasks</p>
            </div>
            <button
              @click="settings.notifications.completion = !settings.notifications.completion"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                settings.notifications.completion ? 'bg-blue-600' : 'bg-gray-200'
              ]"
            >
              <span
                :class="[
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  settings.notifications.completion ? 'translate-x-6' : 'translate-x-1'
                ]"
              />
            </button>
          </div>
        </div>
      </div>

      <!-- Keyboard Shortcuts -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">Keyboard Shortcuts</h2>
        </div>
        <div class="p-6">
          <div class="space-y-3">
            <div v-for="shortcut in shortcuts" :key="shortcut.key" class="flex justify-between items-center">
              <span class="text-sm text-gray-700 dark:text-gray-300">{{ shortcut.description }}</span>
              <kbd class="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600">
                {{ shortcut.key }}
              </kbd>
            </div>
          </div>
        </div>
      </div>

      <!-- Data Management -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">Data Management</h2>
        </div>
        <div class="p-6">
          <DataManager />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDark, useToggle } from '@vueuse/core'
import { useChecklistStore } from '@/stores/checklist.store'
import DataManager from '@/components/DataManager.vue'

const checklistStore = useChecklistStore()
const isDarkMode = useDark()
const toggleDarkMode = useToggle(isDarkMode)

const settings = ref({
  autoSave: true,
  defaultView: 'list',
  notifications: {
    dueDate: true,
    completion: false
  }
})

const shortcuts = [
  { key: 'Ctrl/Cmd + N', description: 'Add new task' },
  { key: 'Ctrl/Cmd + F', description: 'Search tasks' },
  { key: 'Ctrl/Cmd + A', description: 'Select all tasks' },
  { key: 'Ctrl/Cmd + D', description: 'Delete selected tasks' },
  { key: 'Ctrl/Cmd + Z', description: 'Undo last action' },
  { key: 'Ctrl/Cmd + Shift + Z', description: 'Redo last action' },
  { key: 'Escape', description: 'Close modal/Clear selection' }
]
</script>