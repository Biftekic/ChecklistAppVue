<template>
  <div class="template-selector">
    <!-- Search and Filter Bar -->
    <div class="search-filter-bar">
      <div class="search-input-wrapper">
        <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search templates..."
          class="search-input"
          @input="handleSearch"
        />
      </div>
      
      <div class="filter-buttons">
        <button
          v-for="category in categories"
          :key="category"
          @click="toggleCategory(category)"
          :class="['filter-btn', { active: selectedCategories.includes(category) }]"
        >
          {{ formatCategory(category) }}
        </button>
      </div>
    </div>

    <!-- Quick Access Tabs -->
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="['tab', { active: activeTab === tab.id }]"
      >
        <span class="tab-icon">{{ tab.icon }}</span>
        {{ tab.label }}
        <span v-if="tab.count" class="tab-count">{{ tab.count }}</span>
      </button>
    </div>

    <!-- Templates Grid -->
    <div class="templates-container">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading templates...</p>
      </div>
      
      <div v-else-if="displayedTemplates.length === 0" class="empty-state">
        <svg class="empty-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3>No templates found</h3>
        <p>Try adjusting your search or filters</p>
      </div>
      
      <div v-else class="templates-grid">
        <div
          v-for="template in displayedTemplates"
          :key="template.id"
          @click="selectTemplate(template)"
          :class="['template-card', { selected: selectedTemplate?.id === template.id }]"
        >
          <!-- Favorite Button -->
          <button
            @click.stop="toggleFavorite(template.id)"
            class="favorite-btn"
            :class="{ favorited: isFavorite(template.id) }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" :fill="isFavorite(template.id) ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>
          
          <!-- Template Image -->
          <div class="template-image">
            <div v-if="template.metadata.image" class="image-placeholder">
              <img :src="template.metadata.image" :alt="template.metadata.name" />
            </div>
            <div v-else class="image-placeholder">
              <span class="placeholder-icon">{{ getCategoryIcon(template.metadata.category) }}</span>
            </div>
          </div>
          
          <!-- Template Info -->
          <div class="template-info">
            <h3 class="template-name">{{ template.metadata.name }}</h3>
            <p class="template-description">{{ template.metadata.description }}</p>
            
            <div class="template-meta">
              <span class="meta-item">
                <svg class="meta-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ formatTime(template.configuration.estimatedTime) }}
              </span>
              
              <span class="meta-item">
                <svg class="meta-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {{ template.configuration.teamSize.recommended }} {{ template.configuration.teamSize.recommended === 1 ? 'person' : 'people' }}
              </span>
              
              <span class="meta-item">
                <svg class="meta-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {{ template.rooms.length }} rooms
              </span>
            </div>
            
            <div class="template-rating">
              <div class="rating-stars">
                <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= Math.round(template.metadata.rating) }">
                  ★
                </span>
              </div>
              <span class="usage-count">Used {{ template.metadata.usageCount }} times</span>
            </div>
          </div>
          
          <!-- Quick Actions -->
          <div class="template-actions">
            <button @click.stop="previewTemplate(template)" class="action-btn preview-btn">
              Preview
            </button>
            <button @click.stop="useTemplate(template)" class="action-btn use-btn">
              Use Template
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTemplateStore } from '@/stores/template.store'
import type { CleaningTemplate, TemplateCategory } from '@/types/template.types'

// Props and Emits
interface Props {
  showFavorites?: boolean
  showRecent?: boolean
  maxItems?: number
}

const props = withDefaults(defineProps<Props>(), {
  showFavorites: true,
  showRecent: true,
  maxItems: 20
})

const emit = defineEmits<{
  'template-selected': [template: CleaningTemplate]
  'preview-template': [template: CleaningTemplate]
  'use-template': [template: CleaningTemplate]
}>()

// Store
const templateStore = useTemplateStore()

// State
const searchQuery = ref('')
const selectedCategories = ref<TemplateCategory[]>([])
const activeTab = ref('all')
const selectedTemplate = ref<CleaningTemplate | null>(null)
const loading = ref(false)

// Categories
const categories: TemplateCategory[] = [
  'office',
  'residential',
  'medical',
  'hospitality',
  'retail',
  'industrial',
  'educational',
  'specialty'
]

// Tabs configuration
const tabs = computed(() => [
  {
    id: 'all',
    label: 'All Templates',
    icon: '📚',
    count: templateStore.allTemplates.length
  },
  {
    id: 'recent',
    label: 'Recently Used',
    icon: '🕐',
    count: templateStore.recentTemplates.length
  },
  {
    id: 'favorites',
    label: 'Favorites',
    icon: '⭐',
    count: templateStore.favoriteTemplates.length
  },
  {
    id: 'custom',
    label: 'My Templates',
    icon: '👤',
    count: templateStore.customTemplates.length
  }
])

// Computed
const displayedTemplates = computed(() => {
  let templates: CleaningTemplate[] = []
  
  // Filter by tab
  switch (activeTab.value) {
    case 'recent':
      templates = templateStore.recentTemplates
      break
    case 'favorites':
      templates = templateStore.favoriteTemplates
      break
    case 'custom':
      templates = templateStore.customTemplates
      break
    default:
      templates = templateStore.allTemplates
  }
  
  // Filter by categories
  if (selectedCategories.value.length > 0) {
    templates = templates.filter(t => 
      selectedCategories.value.includes(t.metadata.category)
    )
  }
  
  // Filter by search query
  if (searchQuery.value) {
    templates = templateStore.searchTemplates(searchQuery.value)
      .filter(t => templates.includes(t))
  }
  
  // Limit results
  return templates.slice(0, props.maxItems)
})

// Methods
function handleSearch() {
  // Debounced search is handled by computed property
}

function toggleCategory(category: TemplateCategory) {
  const index = selectedCategories.value.indexOf(category)
  if (index > -1) {
    selectedCategories.value.splice(index, 1)
  } else {
    selectedCategories.value.push(category)
  }
}

function selectTemplate(template: CleaningTemplate) {
  selectedTemplate.value = template
  templateStore.selectTemplate(template.id)
  emit('template-selected', template)
}

function previewTemplate(template: CleaningTemplate) {
  emit('preview-template', template)
}

function useTemplate(template: CleaningTemplate) {
  templateStore.selectTemplate(template.id)
  emit('use-template', template)
}

function toggleFavorite(templateId: string) {
  templateStore.toggleFavorite(templateId)
}

function isFavorite(templateId: string): boolean {
  return templateStore.favoriteTemplateIds.includes(templateId)
}

function formatCategory(category: TemplateCategory): string {
  return category.charAt(0).toUpperCase() + category.slice(1)
}

function formatTime(time: { min: number; max: number; unit: string }): string {
  if (time.min === time.max) {
    return `${time.min} ${time.unit}`
  }
  return `${time.min}-${time.max} ${time.unit}`
}

function getCategoryIcon(category: TemplateCategory): string {
  const icons: Record<TemplateCategory, string> = {
    office: '🏢',
    residential: '🏠',
    medical: '🏥',
    hospitality: '🏨',
    retail: '🛍️',
    industrial: '🏭',
    educational: '🎓',
    specialty: '✨'
  }
  return icons[category] || '📋'
}

// Lifecycle
onMounted(() => {
  // Load templates if needed
  if (templateStore.allTemplates.length === 0) {
    loading.value = true
    // In production, this would load from API
    setTimeout(() => {
      loading.value = false
    }, 500)
  }
})
</script>

<style scoped>
.template-selector {
  @apply w-full h-full flex flex-col;
}

.search-filter-bar {
  @apply p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700;
}

.search-input-wrapper {
  @apply relative mb-4;
}

.search-icon {
  @apply absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400;
}

.search-input {
  @apply w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
  @apply dark:bg-gray-700 dark:text-white;
}

.filter-buttons {
  @apply flex flex-wrap gap-2;
}

.filter-btn {
  @apply px-3 py-1 text-sm rounded-full border border-gray-300 dark:border-gray-600;
  @apply hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors;
}

.filter-btn.active {
  @apply bg-blue-500 text-white border-blue-500;
}

.tabs {
  @apply flex gap-1 p-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700;
}

.tab {
  @apply flex items-center gap-2 px-4 py-2 rounded-lg transition-colors;
  @apply hover:bg-gray-100 dark:hover:bg-gray-800;
}

.tab.active {
  @apply bg-white dark:bg-gray-800 shadow-sm;
}

.tab-icon {
  @apply text-lg;
}

.tab-count {
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  background-color: rgb(229 231 235);
  border-radius: 9999px;
}

.dark .tab-count {
  background-color: rgb(55 65 81);
}

.templates-container {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 16rem;
}

.spinner {
  width: 2rem;
  height: 2rem;
  border-width: 4px;
  border-color: rgb(59 130 246);
  border-top-color: transparent;
  border-radius: 9999px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-icon {
  width: 4rem;
  height: 4rem;
  color: rgb(156 163 175);
  margin-bottom: 1rem;
}

.templates-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4;
}

.template-card {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700;
  @apply hover:shadow-md transition-shadow cursor-pointer relative;
}

.template-card.selected {
  @apply ring-2 ring-blue-500;
}

.favorite-btn {
  @apply absolute top-2 right-2 z-10 p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm;
  @apply hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors;
}

.favorite-btn svg {
  @apply w-5 h-5;
}

.favorite-btn.favorited {
  @apply text-yellow-500;
}

.template-image {
  @apply h-32 bg-gray-100 dark:bg-gray-700 rounded-t-lg overflow-hidden;
}

.image-placeholder {
  @apply w-full h-full flex items-center justify-center;
}

.placeholder-icon {
  @apply text-4xl;
}

.template-info {
  @apply p-4;
}

.template-name {
  @apply font-semibold text-lg mb-1;
}

.template-description {
  @apply text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2;
}

.template-meta {
  @apply flex flex-wrap gap-3 mb-3;
}

.meta-item {
  @apply flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400;
}

.meta-icon {
  @apply w-4 h-4;
}

.template-rating {
  @apply flex items-center justify-between text-sm;
}

.rating-stars {
  @apply flex;
}

.star {
  @apply text-gray-300 dark:text-gray-600;
}

.star.filled {
  @apply text-yellow-500;
}

.usage-count {
  @apply text-xs text-gray-500 dark:text-gray-400;
}

.template-actions {
  @apply flex gap-2 p-4 pt-0;
}

.action-btn {
  @apply flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors;
}

.preview-btn {
  @apply border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700;
}

.use-btn {
  @apply bg-blue-500 text-white hover:bg-blue-600;
}
</style>