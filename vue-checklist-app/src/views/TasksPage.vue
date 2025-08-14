<template>
  <div>
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Tasks</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Manage all your tasks in one place
      </p>
    </div>

    <!-- Main Checklist Container -->
    <ChecklistContainer />
  </div>
</template>

<script setup lang="ts">
import ChecklistContainer from '@/components/ChecklistContainer.vue'
</script>