<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <h1 class="text-2xl font-bold text-gray-900">Professional Cleaning Checklist Builder</h1>
        <p class="text-gray-600 mt-1">Select an industry and customize your cleaning checklist</p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Industry Selector -->
      <div v-if="!selectedIndustry" class="space-y-6">
        <h2 class="text-xl font-semibold text-gray-900">Choose Your Industry</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            v-for="industry in industries"
            :key="industry.id"
            @click="selectIndustry(industry)"
            class="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200 text-left"
          >
            <div class="text-4xl mb-3">{{ industry.icon }}</div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ industry.name }}</h3>
            <p class="text-sm text-gray-600">{{ industry.description }}</p>
            <div class="mt-3 flex flex-wrap gap-1">
              <span 
                v-for="cert in industry.certifications.slice(0, 2)" 
                :key="cert"
                class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
              >
                {{ cert }}
              </span>
            </div>
          </button>
        </div>
      </div>

      <!-- Template Builder -->
      <div v-else class="space-y-6">
        <!-- Back Button and Industry Info -->
        <div class="flex items-start justify-between">
          <div>
            <button 
              @click="selectedIndustry = null; selectedSections = []; customChecklist = []"
              class="flex items-center text-blue-600 hover:text-blue-800 mb-3"
            >
              <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Industries
            </button>
            <h2 class="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span class="text-3xl">{{ selectedIndustry.icon }}</span>
              {{ selectedIndustry.name }} Cleaning Checklist
            </h2>
            <p class="text-gray-600 mt-1">{{ selectedIndustry.description }}</p>
          </div>
          <button
            @click="exportChecklist"
            :disabled="customChecklist.length === 0"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Export Checklist ({{ customChecklist.length }} tasks)
          </button>
        </div>

        <!-- Regulations and Standards -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 class="font-semibold text-blue-900 mb-2">Compliance & Standards</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm font-medium text-blue-800 mb-1">Regulations:</p>
              <ul class="text-sm text-blue-700 space-y-1">
                <li v-for="reg in selectedIndustry.regulations" :key="reg" class="flex items-start">
                  <span class="mr-1">•</span> {{ reg }}
                </li>
              </ul>
            </div>
            <div>
              <p class="text-sm font-medium text-blue-800 mb-1">Required Certifications:</p>
              <ul class="text-sm text-blue-700 space-y-1">
                <li v-for="cert in selectedIndustry.certifications" :key="cert" class="flex items-start">
                  <span class="mr-1">•</span> {{ cert }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Equipment and Chemicals -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-white border rounded-lg p-4">
            <h3 class="font-semibold text-gray-900 mb-3">Required Equipment</h3>
            <ul class="text-sm text-gray-700 space-y-1">
              <li v-for="item in selectedIndustry.equipment" :key="item" class="flex items-start">
                <svg class="w-4 h-4 mr-2 mt-0.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                {{ item }}
              </li>
            </ul>
          </div>
          <div class="bg-white border rounded-lg p-4">
            <h3 class="font-semibold text-gray-900 mb-3">Cleaning Chemicals</h3>
            <ul class="text-sm text-gray-700 space-y-1">
              <li v-for="chemical in selectedIndustry.chemicals" :key="chemical" class="flex items-start">
                <svg class="w-4 h-4 mr-2 mt-0.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                {{ chemical }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Template Sections -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-900">Select Template Sections</h3>
          <div class="space-y-3">
            <div 
              v-for="section in selectedIndustry.sections" 
              :key="section.id"
              class="bg-white border rounded-lg overflow-hidden"
            >
              <div 
                @click="toggleSection(section)"
                class="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <h4 class="font-semibold text-gray-900">{{ section.name }}</h4>
                    <p class="text-sm text-gray-600 mt-1">{{ section.description }}</p>
                    <p class="text-sm text-blue-600 mt-1">
                      Estimated time: {{ section.estimatedTime }} | {{ section.tasks.length }} tasks
                    </p>
                  </div>
                  <button
                    @click.stop="toggleSection(section)"
                    class="ml-4 px-3 py-1 text-sm rounded-lg transition-colors"
                    :class="isSectionSelected(section) 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
                  >
                    {{ isSectionSelected(section) ? 'Selected' : 'Select All' }}
                  </button>
                </div>
              </div>

              <!-- Expanded Task List -->
              <div v-if="expandedSections.includes(section.id)" class="border-t">
                <div class="p-4 bg-gray-50">
                  <div class="space-y-3">
                    <div 
                      v-for="task in section.tasks" 
                      :key="task.id"
                      class="bg-white rounded-lg p-4 border"
                    >
                      <div class="flex items-start justify-between">
                        <div class="flex-1">
                          <div class="flex items-center gap-2 mb-2">
                            <input
                              type="checkbox"
                              :id="task.id"
                              :checked="isTaskSelected(task)"
                              @change="toggleTask(task, section)"
                              class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            >
                            <label :for="task.id" class="font-medium text-gray-900 cursor-pointer">
                              {{ task.name }}
                            </label>
                            <span class="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                              {{ task.frequency }}
                            </span>
                            <span class="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded">
                              {{ task.timeEstimate }}
                            </span>
                          </div>
                          <p class="text-sm text-gray-600 mb-2">{{ task.description }}</p>
                          
                          <!-- Task Details -->
                          <div class="space-y-2 text-sm">
                            <!-- Supplies -->
                            <div class="flex items-start">
                              <span class="font-medium text-gray-700 w-20">Supplies:</span>
                              <div class="flex-1 flex flex-wrap gap-1">
                                <span 
                                  v-for="supply in task.supplies" 
                                  :key="supply"
                                  class="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs"
                                >
                                  {{ supply }}
                                </span>
                              </div>
                            </div>
                            
                            <!-- Instructions -->
                            <div class="flex items-start">
                              <span class="font-medium text-gray-700 w-20">Steps:</span>
                              <ol class="flex-1 space-y-1">
                                <li 
                                  v-for="(instruction, idx) in task.instructions" 
                                  :key="idx"
                                  class="text-gray-600"
                                >
                                  {{ idx + 1 }}. {{ instruction }}
                                </li>
                              </ol>
                            </div>
                            
                            <!-- Safety Notes -->
                            <div v-if="task.safetyNotes" class="flex items-start">
                              <span class="font-medium text-red-700 w-20">Safety:</span>
                              <ul class="flex-1 space-y-1">
                                <li 
                                  v-for="note in task.safetyNotes" 
                                  :key="note"
                                  class="text-red-600 flex items-start"
                                >
                                  <span class="mr-1">⚠️</span> {{ note }}
                                </li>
                              </ul>
                            </div>
                            
                            <!-- Standards -->
                            <div v-if="task.standards" class="flex items-start">
                              <span class="font-medium text-gray-700 w-20">Standards:</span>
                              <div class="flex-1 flex flex-wrap gap-1">
                                <span 
                                  v-for="standard in task.standards" 
                                  :key="standard"
                                  class="text-xs text-blue-600"
                                >
                                  {{ standard }}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Expand/Collapse Button -->
              <button
                @click="toggleExpand(section.id)"
                class="w-full p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-colors flex items-center justify-center"
              >
                {{ expandedSections.includes(section.id) ? 'Hide Tasks' : 'Show Tasks' }}
                <svg 
                  class="w-4 h-4 ml-1 transition-transform" 
                  :class="expandedSections.includes(section.id) ? 'rotate-180' : ''"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Custom Checklist Summary -->
        <div v-if="customChecklist.length > 0" class="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 class="font-semibold text-green-900 mb-2">Your Custom Checklist</h3>
          <p class="text-sm text-green-700 mb-3">
            {{ customChecklist.length }} tasks selected | 
            Estimated total time: {{ calculateTotalTime() }}
          </p>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="section in getSelectedSectionNames()" 
              :key="section"
              class="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm"
            >
              {{ section }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { industries, type IndustryTemplate, type TemplateSection, type CleaningTask } from '@/data/cleaningIndustries'

const selectedIndustry = ref<IndustryTemplate | null>(null)
const selectedSections = ref<TemplateSection[]>([])
const customChecklist = ref<{ task: CleaningTask; section: TemplateSection }[]>([])
const expandedSections = ref<string[]>([])

const selectIndustry = (industry: IndustryTemplate) => {
  selectedIndustry.value = industry
  selectedSections.value = []
  customChecklist.value = []
  expandedSections.value = []
}

const toggleSection = (section: TemplateSection) => {
  const isSelected = isSectionSelected(section)
  
  if (isSelected) {
    // Remove all tasks from this section
    customChecklist.value = customChecklist.value.filter(item => item.section.id !== section.id)
    selectedSections.value = selectedSections.value.filter(s => s.id !== section.id)
  } else {
    // Add all tasks from this section
    selectedSections.value.push(section)
    section.tasks.forEach(task => {
      if (!isTaskSelected(task)) {
        customChecklist.value.push({ task, section })
      }
    })
  }
}

const toggleTask = (task: CleaningTask, section: TemplateSection) => {
  const index = customChecklist.value.findIndex(item => item.task.id === task.id)
  
  if (index > -1) {
    customChecklist.value.splice(index, 1)
  } else {
    customChecklist.value.push({ task, section })
  }
}

const toggleExpand = (sectionId: string) => {
  const index = expandedSections.value.indexOf(sectionId)
  if (index > -1) {
    expandedSections.value.splice(index, 1)
  } else {
    expandedSections.value.push(sectionId)
  }
}

const isSectionSelected = (section: TemplateSection) => {
  return section.tasks.every(task => isTaskSelected(task))
}

const isTaskSelected = (task: CleaningTask) => {
  return customChecklist.value.some(item => item.task.id === task.id)
}

const calculateTotalTime = () => {
  let totalMinutes = 0
  customChecklist.value.forEach(item => {
    const timeStr = item.task.timeEstimate
    const match = timeStr.match(/(\d+)/)
    if (match) {
      totalMinutes += parseInt(match[1])
    }
  })
  
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  
  if (hours > 0) {
    return `${hours}h ${minutes}min`
  }
  return `${minutes} minutes`
}

const getSelectedSectionNames = () => {
  const sectionMap = new Map<string, string>()
  customChecklist.value.forEach(item => {
    sectionMap.set(item.section.id, item.section.name)
  })
  return Array.from(sectionMap.values())
}

const exportChecklist = () => {
  if (!selectedIndustry.value || customChecklist.value.length === 0) return
  
  // Group tasks by section
  const groupedTasks = new Map<string, { section: TemplateSection; tasks: CleaningTask[] }>()
  
  customChecklist.value.forEach(item => {
    if (!groupedTasks.has(item.section.id)) {
      groupedTasks.set(item.section.id, { section: item.section, tasks: [] })
    }
    groupedTasks.get(item.section.id)!.tasks.push(item.task)
  })
  
  // Create markdown content
  let markdown = `# ${selectedIndustry.value.name} Cleaning Checklist\n\n`
  markdown += `## Overview\n${selectedIndustry.value.description}\n\n`
  
  // Add compliance info
  markdown += `## Compliance & Standards\n`
  markdown += `### Regulations\n`
  selectedIndustry.value.regulations.forEach(reg => {
    markdown += `- ${reg}\n`
  })
  markdown += `\n### Required Certifications\n`
  selectedIndustry.value.certifications.forEach(cert => {
    markdown += `- ${cert}\n`
  })
  
  // Add equipment and chemicals
  markdown += `\n## Required Equipment\n`
  selectedIndustry.value.equipment.forEach(item => {
    markdown += `- ${item}\n`
  })
  
  markdown += `\n## Cleaning Chemicals\n`
  selectedIndustry.value.chemicals.forEach(chemical => {
    markdown += `- ${chemical}\n`
  })
  
  // Add tasks by section
  markdown += `\n## Cleaning Tasks\n\n`
  markdown += `Total Tasks: ${customChecklist.value.length} | Estimated Time: ${calculateTotalTime()}\n\n`
  
  groupedTasks.forEach(({ section, tasks }) => {
    markdown += `### ${section.name}\n`
    markdown += `*${section.description}*\n`
    markdown += `Estimated Time: ${section.estimatedTime}\n\n`
    
    tasks.forEach(task => {
      markdown += `#### ☐ ${task.name}\n`
      markdown += `- **Description:** ${task.description}\n`
      markdown += `- **Time:** ${task.timeEstimate}\n`
      markdown += `- **Frequency:** ${task.frequency}\n`
      markdown += `- **Supplies:** ${task.supplies.join(', ')}\n`
      markdown += `- **Instructions:**\n`
      task.instructions.forEach((instruction, idx) => {
        markdown += `  ${idx + 1}. ${instruction}\n`
      })
      if (task.safetyNotes) {
        markdown += `- **Safety Notes:**\n`
        task.safetyNotes.forEach(note => {
          markdown += `  ⚠️ ${note}\n`
        })
      }
      if (task.standards) {
        markdown += `- **Standards:** ${task.standards.join(', ')}\n`
      }
      markdown += '\n'
    })
  })
  
  // Download the file
  const blob = new Blob([markdown], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${selectedIndustry.value.id}-cleaning-checklist.md`
  a.click()
  URL.revokeObjectURL(url)
}
</script>