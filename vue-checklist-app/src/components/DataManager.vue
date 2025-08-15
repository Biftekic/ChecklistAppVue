<template>
  <div class="data-manager">
    <div class="data-manager-header">
      <h2>Data Management</h2>
      <p>Export, import, and manage your checklist data</p>
    </div>

    <!-- Export Section -->
    <div class="section export-section">
      <h3>Export Data</h3>
      <div class="button-group">
        <button 
          @click="handleExportJSON"
          class="btn btn-primary flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          Export as JSON
        </button>
        
        <button 
          @click="handleExportCSV"
          class="btn btn-secondary flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
          </svg>
          Export as CSV
        </button>
      </div>
    </div>

    <!-- Import Section -->
    <div class="section import-section">
      <h3>Import Data</h3>
      <div class="import-area">
        <input 
          ref="fileInput"
          type="file" 
          accept=".json,.csv"
          @change="handleFileImport"
          class="hidden"
        />
        
        <div 
          @click="fileInput?.click()"
          @dragover.prevent
          @drop.prevent="handleFileDrop"
          class="drop-zone"
        >
          <svg class="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
          </svg>
          <p class="text-gray-600 mb-2">Click to browse or drag & drop files here</p>
          <p class="text-sm text-gray-500">Supports JSON and CSV files</p>
        </div>
      </div>
      
      <!-- Import Results -->
      <div v-if="importResult" class="import-result" 
           :class="importResult.success ? 'success' : 'error'">
        <h4 class="font-semibold mb-2">
          {{ importResult.success ? 'Import Successful' : 'Import Failed' }}
        </h4>
        <div v-if="importResult.success">
          <p>✓ {{ importResult.imported.items }} items imported</p>
          <p>✓ {{ importResult.imported.categories }} categories imported</p>
        </div>
        <div v-if="importResult.errors.length > 0">
          <p class="font-semibold">Errors:</p>
          <ul class="list-disc list-inside">
            <li v-for="error in importResult.errors" :key="error">{{ error }}</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Backup & Restore Section -->
    <div class="section backup-section">
      <h3>Backup & Restore</h3>
      
      <div class="backup-controls">
        <button 
          @click="handleCreateBackup"
          class="btn btn-primary flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V2"/>
          </svg>
          Create Backup
        </button>
      </div>

      <!-- Backup List -->
      <div v-if="backupList.length > 0" class="backup-list">
        <h4>Available Backups</h4>
        <div class="backup-items">
          <div v-for="(backup, index) in backupList" :key="index"
               class="backup-item">
            <div>
              <p>{{ formatDate(backup.date) }}</p>
              <p>
                {{ backup.itemCount }} items, {{ backup.categoryCount }} categories
              </p>
            </div>
            <button 
              @click="handleRestoreBackup(index)"
              class="btn btn-sm btn-secondary"
            >
              Restore
            </button>
          </div>
        </div>
      </div>
      <div v-else class="no-backups">
        No backups available yet
      </div>
    </div>

    <!-- Storage Stats Section -->
    <div class="section storage-section">
      <h3>Storage Usage</h3>
      
      <div v-if="storageStats" class="storage-stats">
        <div class="progress-container">
          <div class="progress-info">
            <span>Total Usage</span>
            <span>{{ formatBytes(storageStats.used) }} / {{ formatBytes(storageStats.quota) }}</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill"
                 :style="{ width: `${Math.min(storageStats.percentage, 100)}%` }">
            </div>
          </div>
        </div>

        <div class="stats-grid">
          <div>
            <p>Items</p>
            <p>{{ formatBytes(storageStats.itemsSize) }}</p>
          </div>
          <div>
            <p>Categories</p>
            <p>{{ formatBytes(storageStats.categoriesSize) }}</p>
          </div>
          <div>
            <p>Backups</p>
            <p>{{ formatBytes(storageStats.backupsSize) }}</p>
          </div>
        </div>
      </div>

      <div class="danger-zone">
        <button 
          @click="handleClearAllData"
          class="btn btn-danger flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
          Clear All Data
        </button>
      </div>
    </div>

    <!-- Success/Error Messages -->
    <Transition name="fade">
      <div v-if="message" 
           class="message"
           :class="messageType">
        {{ message }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useChecklistStore } from '@/stores/checklist.store'
import type { ImportResult, BackupInfo, StorageStats } from '@/types/checklist.types'

const checklistStore = useChecklistStore()

const importResult = ref<ImportResult | null>(null)
const backupList = ref<BackupInfo[]>([])
const storageStats = ref<StorageStats | null>(null)
const message = ref('')
const messageType = ref<'success' | 'error'>('success')
const fileInput = ref<HTMLInputElement>()

// Load initial data
onMounted(async () => {
  await loadBackupList()
  await loadStorageStats()
})

// Export functions
function handleExportJSON() {
  try {
    checklistStore.exportToJSON()
    showMessage('Data exported successfully as JSON', 'success')
  } catch (error) {
    showMessage(`Export failed: ${error}`, 'error')
  }
}

function handleExportCSV() {
  try {
    checklistStore.exportToCSV()
    showMessage('Data exported successfully as CSV', 'success')
  } catch (error) {
    showMessage(`Export failed: ${error}`, 'error')
  }
}

// Import functions
async function handleFileImport(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    await processFile(file)
  }
}

async function handleFileDrop(event: DragEvent) {
  const file = event.dataTransfer?.files[0]
  
  if (file) {
    await processFile(file)
  }
}

async function processFile(file: File) {
  try {
    importResult.value = await checklistStore.importFromFile(file)
    
    if (importResult.value.success) {
      showMessage('Data imported successfully', 'success')
      await loadBackupList()
      await loadStorageStats()
    }
  } catch (error) {
    importResult.value = {
      success: false,
      imported: { categories: 0, items: 0 },
      errors: [`Import failed: ${error}`]
    }
  }
  
  // Clear file input
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Backup functions
async function handleCreateBackup() {
  try {
    const backupDate = checklistStore.createBackup()
    showMessage(`Backup created successfully at ${new Date(backupDate).toLocaleString()}`, 'success')
    await loadBackupList()
    await loadStorageStats()
  } catch (error) {
    showMessage(`Backup failed: ${error}`, 'error')
  }
}

async function handleRestoreBackup(index: number) {
  if (confirm('Are you sure you want to restore this backup? Current data will be replaced.')) {
    try {
      const success = checklistStore.restoreFromBackup(index)
      if (success) {
        showMessage('Data restored successfully from backup', 'success')
      } else {
        showMessage('Failed to restore backup', 'error')
      }
    } catch (error) {
      showMessage(`Restore failed: ${error}`, 'error')
    }
  }
}

// Storage management
async function loadBackupList() {
  backupList.value = checklistStore.getBackupList()
}

async function loadStorageStats() {
  storageStats.value = await checklistStore.getStorageStats()
}

async function handleClearAllData() {
  checklistStore.clearAllData()
  importResult.value = null
  await loadBackupList()
  await loadStorageStats()
  showMessage('All data cleared successfully', 'success')
}

// Utility functions
function formatDate(date: Date): string {
  return new Date(date).toLocaleString()
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

function showMessage(text: string, type: 'success' | 'error') {
  message.value = text
  messageType.value = type
  
  setTimeout(() => {
    message.value = ''
  }, 3000)
}
</script>

<style scoped>
.data-manager {
  max-width: 800px;
  margin: 0 auto;
}

.data-manager-header {
  margin-bottom: 2rem;
}

.data-manager-header h2 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #1f2937;
}

.data-manager-header p {
  color: #6b7280;
  font-size: 0.875rem;
}

.section {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.section h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1f2937;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background-color: #4b5563;
}

.btn-danger {
  background-color: #ef4444;
  color: white;
}

.btn-danger:hover {
  background-color: #dc2626;
}

.btn-sm {
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
}

.button-group {
  display: flex;
  gap: 1rem;
}

.backup-controls {
  margin-bottom: 1rem;
}

.no-backups {
  color: #6b7280;
  font-style: italic;
}

.danger-zone {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.progress-container {
  margin-bottom: 1rem;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: #4b5563;
}

.drop-zone {
  background: #f9fafb;
  border: 2px dashed #d1d5db;
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.drop-zone:hover {
  background: #f3f4f6;
  border-color: #3b82f6;
}

.drop-zone svg {
  width: 3rem;
  height: 3rem;
  margin: 0 auto 1rem;
  color: #9ca3af;
}

.drop-zone p {
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.drop-zone p:last-child {
  font-size: 0.875rem;
  color: #9ca3af;
}

.import-result {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
}

.import-result.success {
  background-color: #d1fae5;
  color: #065f46;
}

.import-result.error {
  background-color: #fee2e2;
  color: #991b1b;
}

.import-result h4 {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.import-result ul {
  list-style: disc;
  padding-left: 1.5rem;
}

.backup-list {
  margin-top: 1rem;
}

.backup-list h4 {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1f2937;
}

.backup-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
}

.backup-item p {
  margin: 0;
}

.backup-item p:first-child {
  font-weight: 500;
  color: #1f2937;
}

.backup-item p:last-child {
  font-size: 0.875rem;
  color: #6b7280;
}

.storage-stats {
  margin-bottom: 1rem;
}

.storage-stats .progress-bar {
  width: 100%;
  height: 0.5rem;
  background: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
  margin: 0.5rem 0 1rem;
}

.storage-stats .progress-fill {
  height: 100%;
  background: #3b82f6;
  border-radius: 9999px;
  transition: width 0.3s;
}

.storage-stats .stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  text-align: center;
  font-size: 0.875rem;
}

.storage-stats .stats-grid p:first-child {
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.storage-stats .stats-grid p:last-child {
  font-weight: 600;
  color: #1f2937;
}

.message {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.message.success {
  background-color: #10b981;
  color: white;
}

.message.error {
  background-color: #ef4444;
  color: white;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>