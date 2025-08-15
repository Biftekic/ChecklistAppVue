<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Team Collaboration</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your team and collaborate on checklists
        </p>
      </div>
      <div class="flex gap-3">
        <button
          v-if="!currentTeam"
          @click="showCreateTeamModal = true"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Team
        </button>
        <button
          v-else
          @click="showInviteModal = true"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <svg class="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Invite Member
        </button>
      </div>
    </div>

    <!-- Team Selector -->
    <div v-if="teams.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Current Team
      </label>
      <select
        v-model="selectedTeamId"
        @change="switchTeam"
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
      >
        <option v-for="team in teams" :key="team.id" :value="team.id">
          {{ team.name }}
        </option>
      </select>
    </div>

    <!-- No Team State -->
    <div v-if="!currentTeam" class="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
      <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
      </svg>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No Team Yet</h3>
      <p class="text-gray-500 dark:text-gray-400 mb-6">
        Create a team to start collaborating with others
      </p>
      <button
        @click="showCreateTeamModal = true"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Create Your First Team
      </button>
    </div>

    <!-- Team Dashboard -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Team Stats -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Stats Cards -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div class="text-sm text-gray-500 dark:text-gray-400">Members</div>
            <div class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ teamStats.activeMembers }}/{{ teamStats.totalMembers }}
            </div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div class="text-sm text-gray-500 dark:text-gray-400">Checklists</div>
            <div class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ teamStats.totalChecklists }}
            </div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div class="text-sm text-gray-500 dark:text-gray-400">Tasks</div>
            <div class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ teamStats.completedTasks }}/{{ teamStats.totalTasks }}
            </div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div class="text-sm text-gray-500 dark:text-gray-400">Overdue</div>
            <div class="text-2xl font-bold text-red-600 dark:text-red-400">
              {{ teamStats.overdueTasks }}
            </div>
          </div>
        </div>

        <!-- Team Members -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-lg font-medium text-gray-900 dark:text-white">Team Members</h2>
          </div>
          <div class="p-6">
            <div class="space-y-3">
              <div
                v-for="member in activeTeamMembers"
                :key="member.id"
                class="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
              >
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                    {{ member.name.charAt(0).toUpperCase() }}
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ member.name }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      {{ member.email }}
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span
                    :class="getRoleBadgeClass(member.role)"
                    class="px-2 py-1 text-xs rounded"
                  >
                    {{ member.role }}
                  </span>
                  <button
                    v-if="currentUser?.permissions.canManageTeam && member.id !== currentUser.id"
                    @click="editMember(member)"
                    class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Pending Invites -->
            <div v-if="pendingInvites.length > 0" class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pending Invites</h3>
              <div class="space-y-2">
                <div
                  v-for="invite in pendingInvites"
                  :key="invite.id"
                  class="flex items-center justify-between text-sm"
                >
                  <span class="text-gray-600 dark:text-gray-400">{{ invite.invitedEmail }}</span>
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    Expires {{ formatRelativeTime(invite.expiresAt) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- My Assignments -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-lg font-medium text-gray-900 dark:text-white">My Assignments</h2>
          </div>
          <div class="p-6">
            <div v-if="myAssignments.length > 0" class="space-y-3">
              <div
                v-for="assignment in myAssignments"
                :key="assignment.taskId"
                class="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div>
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    Task #{{ assignment.taskId.slice(0, 8) }}
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    Due {{ assignment.dueDate ? formatDate(assignment.dueDate) : 'No due date' }}
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span
                    :class="getPriorityClass(assignment.priority)"
                    class="px-2 py-1 text-xs text-white rounded"
                  >
                    {{ assignment.priority }}
                  </span>
                  <span
                    :class="getStatusClass(assignment.status)"
                    class="px-2 py-1 text-xs rounded"
                  >
                    {{ assignment.status }}
                  </span>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
              No assignments yet
            </div>
          </div>
        </div>
      </div>

      <!-- Activity Feed -->
      <div class="space-y-6">
        <!-- Notifications -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 class="text-lg font-medium text-gray-900 dark:text-white">
              Notifications
              <span v-if="unreadNotifications.length > 0" class="ml-2 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                {{ unreadNotifications.length }}
              </span>
            </h2>
            <button
              v-if="unreadNotifications.length > 0"
              @click="markAllNotificationsRead"
              class="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              Mark all read
            </button>
          </div>
          <div class="p-6">
            <div v-if="notifications.length > 0" class="space-y-3">
              <div
                v-for="notification in notifications.slice(0, 5)"
                :key="notification.id"
                @click="markNotificationRead(notification.id)"
                class="cursor-pointer"
              >
                <div
                  :class="[
                    'p-3 rounded-lg transition-colors',
                    notification.read 
                      ? 'bg-gray-50 dark:bg-gray-700' 
                      : 'bg-blue-50 dark:bg-blue-900'
                  ]"
                >
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ notification.title }}
                  </div>
                  <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {{ notification.message }}
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    {{ formatRelativeTime(notification.createdAt) }}
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
              No notifications
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h2>
          </div>
          <div class="p-6">
            <div v-if="teamActivities.length > 0" class="space-y-3">
              <div
                v-for="activity in teamActivities.slice(0, 10)"
                :key="activity.id"
                class="flex items-start"
              >
                <div class="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-400">
                  {{ activity.memberName.charAt(0).toUpperCase() }}
                </div>
                <div class="ml-3 flex-1">
                  <div class="text-sm text-gray-900 dark:text-white">
                    <span class="font-medium">{{ activity.memberName }}</span>
                    {{ getActivityDescription(activity) }}
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {{ formatRelativeTime(activity.timestamp) }}
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
              No recent activity
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Team Modal -->
    <CreateTeamModal
      v-if="showCreateTeamModal"
      @create="handleCreateTeam"
      @close="showCreateTeamModal = false"
    />

    <!-- Invite Member Modal -->
    <InviteMemberModal
      v-if="showInviteModal"
      @invite="handleInviteMember"
      @close="showInviteModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCollaborationStore } from '@/stores/collaboration.store'
import CreateTeamModal from '@/components/CreateTeamModal.vue'
import InviteMemberModal from '@/components/InviteMemberModal.vue'
import { formatDistanceToNow } from 'date-fns'
import type { TeamActivity } from '@/types/collaboration.types'

const collaborationStore = useCollaborationStore()

// State
const showCreateTeamModal = ref(false)
const showInviteModal = ref(false)
const selectedTeamId = ref(collaborationStore.currentTeam?.id || '')

// Computed
const currentTeam = computed(() => collaborationStore.currentTeam)
const teams = computed(() => collaborationStore.teams)
const activeTeamMembers = computed(() => collaborationStore.activeTeamMembers)
const pendingInvites = computed(() => collaborationStore.pendingInvites)
const notifications = computed(() => collaborationStore.notifications)
const unreadNotifications = computed(() => collaborationStore.unreadNotifications)
const myAssignments = computed(() => collaborationStore.myAssignments)
const teamStats = computed(() => collaborationStore.teamStats)
const teamActivities = computed(() => collaborationStore.teamActivities)
const currentUser = computed(() => collaborationStore.currentUser)

// Methods
function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString()
}

function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return formatDistanceToNow(d, { addSuffix: true })
}

function getRoleBadgeClass(role: string): string {
  const classes: Record<string, string> = {
    owner: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300',
    admin: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300',
    member: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300',
    viewer: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
  }
  return classes[role] || classes.member
}

function getPriorityClass(priority?: string): string {
  const classes: Record<string, string> = {
    urgent: 'bg-red-500',
    high: 'bg-orange-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500'
  }
  return classes[priority || 'medium'] || 'bg-gray-500'
}

function getStatusClass(status: string): string {
  const classes: Record<string, string> = {
    pending: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
    in_progress: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300',
    completed: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300',
    overdue: 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300'
  }
  return classes[status] || classes.pending
}

function getActivityDescription(activity: TeamActivity): string {
  const descriptions: Record<TeamActivity['action'], string> = {
    member_joined: 'joined the team',
    member_left: 'left the team',
    member_invited: 'invited a new member',
    checklist_created: 'created a checklist',
    checklist_shared: 'shared a checklist',
    checklist_completed: 'completed a checklist',
    task_assigned: 'assigned a task',
    task_completed: 'completed a task',
    task_updated: 'updated a task',
    comment_added: 'added a comment',
    role_changed: 'changed a member role'
  }
  return descriptions[activity.action] || activity.action
}

function switchTeam() {
  if (selectedTeamId.value) {
    collaborationStore.switchTeam(selectedTeamId.value)
  }
}

function handleCreateTeam(data: { name: string; description: string }) {
  const team = collaborationStore.createTeam(data.name, data.description)
  selectedTeamId.value = team.id
  showCreateTeamModal.value = false
}

function handleInviteMember(data: { email: string; role: 'admin' | 'member' | 'viewer' }) {
  collaborationStore.inviteMember(data.email, data.role)
  showInviteModal.value = false
}

function editMember(member: any) {
  // Open member edit modal
  console.log('Edit member:', member)
}

function markNotificationRead(notificationId: string) {
  collaborationStore.markNotificationRead(notificationId)
}

function markAllNotificationsRead() {
  collaborationStore.markAllNotificationsRead()
}
</script>