<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Welcome back! Here's an overview of your tasks.
        </p>
      </div>
      <div class="flex space-x-3">
        <router-link
          to="/tasks"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          New Task
        </router-link>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Tasks"
        :value="stats.totalTasks"
        change="+12%"
        icon="tasks"
        color="blue"
      />
      <StatsCard
        title="Completed"
        :value="stats.completedTasks"
        change="+8%"
        icon="check"
        color="green"
      />
      <StatsCard
        title="Pending"
        :value="stats.pendingTasks"
        change="-5%"
        icon="clock"
        color="yellow"
      />
      <StatsCard
        title="Categories"
        :value="stats.totalCategories"
        change="+2"
        icon="folder"
        color="purple"
      />
    </div>

    <!-- Quick Actions -->
    <div>
      <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h2>
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <QuickActionButton
          label="Add Task"
          icon="plus"
          to="/tasks"
          color="blue"
        />
        <QuickActionButton
          label="New Category"
          icon="folder-plus"
          to="/categories"
          color="green"
        />
        <QuickActionButton
          label="Create Template"
          icon="template"
          to="/templates"
          color="purple"
        />
        <QuickActionButton
          label="Settings"
          icon="cog"
          to="/settings"
          color="gray"
        />
      </div>
    </div>

    <!-- Recent Tasks & Activity Feed -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Recent Tasks -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">Recent Tasks</h3>
        </div>
        <div class="p-6">
          <div v-if="recentTasks.length > 0" class="space-y-4">
            <div v-for="task in recentTasks" :key="task.id" class="flex items-center justify-between">
              <div class="flex items-center">
                <input
                  type="checkbox"
                  :checked="task.completed"
                  disabled
                  class="h-4 w-4 text-blue-600 rounded border-gray-300 dark:border-gray-600"
                />
                <span class="ml-3 text-sm" :class="task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'">
                  {{ task.title }}
                </span>
              </div>
              <span class="text-xs text-gray-500 dark:text-gray-400">
                {{ formatDate(task.createdAt) }}
              </span>
            </div>
          </div>
          <div v-else class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">No tasks yet</p>
            <router-link to="/tasks" class="mt-3 inline-block text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
              Create your first task →
            </router-link>
          </div>
        </div>
      </div>

      <!-- Activity Feed -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h3>
        </div>
        <div class="p-6">
          <div v-if="recentActivity.length > 0" class="flow-root">
            <ul class="-mb-8">
              <li v-for="(activity, index) in recentActivity" :key="activity.id">
                <div class="relative pb-8">
                  <span v-if="index !== recentActivity.length - 1" class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" />
                  <div class="relative flex space-x-3">
                    <div :class="['h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-800', getActivityColor(activity.type)]">
                      <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getActivityIcon(activity.type)" />
                      </svg>
                    </div>
                    <div class="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                      <div>
                        <p class="text-sm text-gray-900 dark:text-white">{{ activity.description }}</p>
                      </div>
                      <div class="whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                        <time>{{ formatTime(activity.timestamp) }}</time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div v-else class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">No recent activity</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useChecklistStore } from '@/stores/checklist.store'
import StatsCard from '@/components/dashboard/StatsCard.vue'
import QuickActionButton from '@/components/dashboard/QuickActionButton.vue'
import { format, formatDistanceToNow } from 'date-fns'

const checklistStore = useChecklistStore()

interface Activity {
  id: string
  type: 'created' | 'completed' | 'deleted' | 'updated'
  description: string
  timestamp: Date
}

const stats = computed(() => {
  const items = checklistStore.filteredItems || []
  return {
    totalTasks: items.length,
    completedTasks: items.filter(item => item.completed).length,
    pendingTasks: items.filter(item => !item.completed).length,
    totalCategories: checklistStore.categories.length
  }
})

const recentTasks = computed(() => {
  const items = [...(checklistStore.items || [])]
  return items
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
})

const recentActivity = ref<Activity[]>([])

const formatDate = (date: Date | string) => {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, 'MMM d')
}

const formatTime = (date: Date) => {
  return formatDistanceToNow(date, { addSuffix: true })
}

const getActivityColor = (type: Activity['type']) => {
  const colors = {
    created: 'bg-blue-500',
    completed: 'bg-green-500',
    deleted: 'bg-red-500',
    updated: 'bg-yellow-500'
  }
  return colors[type]
}

const getActivityIcon = (type: Activity['type']) => {
  const icons = {
    created: 'M12 4v16m8-8H4',
    completed: 'M5 13l4 4L19 7',
    deleted: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
    updated: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
  }
  return icons[type]
}

onMounted(() => {
  // In a real app, this would fetch from an API or activity store
  // For now, we'll create some sample activity based on existing tasks
  const items = checklistStore.items || []
  const activities: Activity[] = []
  
  items.slice(0, 3).forEach(item => {
    if (item.completed) {
      activities.push({
        id: `${item.id}-completed`,
        type: 'completed',
        description: `Completed "${item.title}"`,
        timestamp: new Date(item.updatedAt)
      })
    }
    activities.push({
      id: `${item.id}-created`,
      type: 'created',
      description: `Created "${item.title}"`,
      timestamp: new Date(item.createdAt)
    })
  })
  
  recentActivity.value = activities
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 5)
})
</script>