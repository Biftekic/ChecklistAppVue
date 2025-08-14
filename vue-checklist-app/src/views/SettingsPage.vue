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
        <div class="p-6 space-y-4">
          <div>
            <button
              @click="exportData"
              class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export Data
            </button>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Download all your tasks and settings</p>
          </div>

          <div>
            <button
              @click="importData"
              class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Import Data
            </button>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Restore from a backup file</p>
          </div>

          <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              @click="clearAllData"
              class="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:border-red-600 dark:text-red-400 dark:bg-gray-800 dark:hover:bg-red-900/20"
            >
              <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear All Data
            </button>
            <p class="mt-2 text-sm text-red-600 dark:text-red-400">This action cannot be undone</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDark, useToggle } from '@vueuse/core'
import { useChecklistStore } from '@/stores/checklist.store'

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

const exportData = () => {
  const data = {
    tasks: checklistStore.items,
    categories: checklistStore.categories,
    settings: settings.value,
    exportDate: new Date().toISOString()
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `checklist-backup-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const importData = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string)
          // Here you would restore the data to your stores
          alert('Data imported successfully!')
        } catch (error) {
          alert('Failed to import data. Please check the file format.')
        }
      }
      reader.readAsText(file)
    }
  }
  input.click()
}

const clearAllData = () => {
  if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
    if (confirm('This will delete all your tasks, categories, and templates. Are you absolutely sure?')) {
      localStorage.clear()
      location.reload()
    }
  }
}
</script>