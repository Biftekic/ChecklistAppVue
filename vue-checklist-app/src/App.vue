<template>
  <div id="app" class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-800">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="text-3xl">✅</span>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Vue Checklist</h1>
          </div>
          
          <div class="flex items-center gap-4">
            <!-- Import/Export Actions -->
            <button
              @click="exportData"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              title="Export Data"
            >
              <span>📥</span> Export
            </button>
            <label class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 cursor-pointer">
              <span>📤</span> Import
              <input
                type="file"
                accept=".json"
                @change="importData"
                class="hidden"
              />
            </label>
            
            <!-- Theme Toggle -->
            <button
              @click="toggleTheme"
              class="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              :title="isDark ? 'Light Mode' : 'Dark Mode'"
            >
              <span class="text-2xl">{{ isDark ? '☀️' : '🌙' }}</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Sidebar -->
        <aside class="lg:col-span-1">
          <CategoryManager />
        </aside>

        <!-- Main Content Area -->
        <section class="lg:col-span-3">
          <ChecklistContainer />
        </section>
      </div>
    </main>

    <!-- Footer -->
    <footer class="mt-16 py-6 text-center text-gray-600 dark:text-gray-400 border-t dark:border-gray-800">
      <p>Built with Vue 3 + TypeScript + Tailwind CSS</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useChecklistStore } from '@/stores/checklist.store'
import ChecklistContainer from '@/components/ChecklistContainer.vue'
import CategoryManager from '@/components/CategoryManager.vue'

const store = useChecklistStore()
const isDark = ref(false)

onMounted(() => {
  // Check for saved theme preference or default to light
  const savedTheme = localStorage.getItem('theme')
  isDark.value = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
  updateTheme()
})

function toggleTheme() {
  isDark.value = !isDark.value
  updateTheme()
}

function updateTheme() {
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

function exportData() {
  const data = store.exportData()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `checklist-export-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function importData(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target?.result as string)
      const result = store.importData(data)
      if (result.success) {
        alert(`Successfully imported ${result.imported.categories} categories and ${result.imported.items} items!`)
      } else {
        alert(`Import failed: ${result.errors.join(', ')}`)
      }
    } catch (error) {
      alert('Failed to import file. Please ensure it is a valid JSON export.')
    }
  }
  reader.readAsText(file)
}
</script>

<style>
/* Global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>