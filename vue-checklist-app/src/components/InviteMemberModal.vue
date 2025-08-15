<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click.self="$emit('close')">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Invite Team Member
        </h3>
      </div>

      <!-- Modal Content -->
      <div class="p-6 space-y-4">
        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Address *
          </label>
          <input
            v-model="email"
            type="email"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="member@example.com"
            required
          >
        </div>

        <!-- Role -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Role
          </label>
          <select
            v-model="role"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>

        <!-- Role Description -->
        <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p class="text-sm text-gray-600 dark:text-gray-300">
            <span class="font-medium">{{ roleDescriptions[role].title }}:</span>
            {{ roleDescriptions[role].description }}
          </p>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
        <button
          @click="$emit('close')"
          class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          @click="inviteMember"
          :disabled="!isValidEmail"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Send Invitation
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const emit = defineEmits<{
  invite: [data: { email: string; role: 'admin' | 'member' | 'viewer' }]
  close: []
}>()

const email = ref('')
const role = ref<'admin' | 'member' | 'viewer'>('member')

const roleDescriptions = {
  admin: {
    title: 'Admin',
    description: 'Can manage team members, create and edit all checklists, and access all features.'
  },
  member: {
    title: 'Member',
    description: 'Can create and edit checklists, complete tasks, and collaborate with the team.'
  },
  viewer: {
    title: 'Viewer',
    description: 'Can view checklists and tasks but cannot make changes.'
  }
}

const isValidEmail = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.value)
})

function inviteMember() {
  if (isValidEmail.value) {
    emit('invite', {
      email: email.value,
      role: role.value
    })
  }
}
</script>