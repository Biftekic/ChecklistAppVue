<template>
  <div class="space-y-6 max-w-4xl">
    <!-- Page Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">About</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Learn more about Vue Checklist App
      </p>
    </div>

    <!-- About Content -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div class="p-6 space-y-6">
        <!-- App Info -->
        <div>
          <div class="flex items-center space-x-4 mb-4">
            <div class="h-16 w-16 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <svg class="h-10 w-10 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Vue Checklist App</h2>
              <p class="text-sm text-gray-500 dark:text-gray-400">Version {{ version }}</p>
            </div>
          </div>
          <p class="text-gray-700 dark:text-gray-300">
            A powerful and intuitive task management application built with Vue 3, TypeScript, and Tailwind CSS.
            Designed to help you organize your tasks, boost productivity, and achieve your goals.
          </p>
        </div>

        <!-- Features -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Key Features</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div v-for="feature in features" :key="feature" class="flex items-start">
              <svg class="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span class="text-sm text-gray-700 dark:text-gray-300">{{ feature }}</span>
            </div>
          </div>
        </div>

        <!-- Technologies -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Built With</h3>
          <div class="flex flex-wrap gap-2">
            <span v-for="tech in technologies" :key="tech" class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 rounded-full">
              {{ tech }}
            </span>
          </div>
        </div>

        <!-- Statistics -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Your Statistics</h3>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div class="text-center">
              <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ stats.totalTasks }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">Total Tasks</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ stats.completedTasks }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">Completed</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ stats.categories }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">Categories</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ stats.templates }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">Templates</p>
            </div>
          </div>
        </div>

        <!-- Links -->
        <div class="pt-6 border-t border-gray-200 dark:border-gray-700">
          <div class="flex flex-wrap gap-4">
            <a
              href="https://github.com/yourusername/vue-checklist-app"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub Repository
            </a>
            <a
              href="#"
              class="inline-flex items-center text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Documentation
            </a>
            <a
              href="#"
              class="inline-flex items-center text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Support
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div class="pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            © 2025 Vue Checklist App. All rights reserved.
          </p>
          <p class="mt-2 text-xs text-gray-400 dark:text-gray-500">
            Made with ❤️ using Vue.js
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useChecklistStore } from '@/stores/checklist.store'
import { useTemplateStore } from '@/stores/template.store'

const checklistStore = useChecklistStore()
const templateStore = useTemplateStore()

const version = '1.1.0'

const features = [
  'Task Management',
  'Categories & Tags',
  'Reusable Templates',
  'Advanced Filtering',
  'Bulk Operations',
  'Keyboard Shortcuts',
  'Dark Mode Support',
  'Undo/Redo System',
  'Local Storage Persistence',
  'Export/Import Data',
  'Drag & Drop Sorting',
  'Real-time Search'
]

const technologies = [
  'Vue 3',
  'TypeScript',
  'Tailwind CSS',
  'Pinia',
  'Vue Router',
  'VueUse',
  'date-fns',
  'Vite'
]

const stats = computed(() => ({
  totalTasks: checklistStore.items.length,
  completedTasks: checklistStore.items.filter(item => item.completed).length,
  categories: checklistStore.categories.length,
  templates: templateStore.templates.length
}))
</script>