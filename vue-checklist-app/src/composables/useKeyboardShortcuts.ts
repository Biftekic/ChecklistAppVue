import { onMounted, onUnmounted, ref } from 'vue'
import { useMagicKeys, whenever } from '@vueuse/core'

export interface KeyboardShortcut {
  key: string
  modifiers?: string[]
  action: () => void
  description: string
  category: 'navigation' | 'action' | 'search' | 'editing'
  enabled?: boolean
}

export function useKeyboardShortcuts() {
  const keys = useMagicKeys()
  const isHelpModalOpen = ref(false)
  const shortcuts = ref<KeyboardShortcut[]>([])

  // Define default shortcuts
  const defaultShortcuts: KeyboardShortcut[] = [
    // Navigation
    {
      key: 'j',
      action: () => navigateNext(),
      description: 'Navigate to next item',
      category: 'navigation',
      enabled: true
    },
    {
      key: 'k',
      action: () => navigatePrevious(),
      description: 'Navigate to previous item',
      category: 'navigation',
      enabled: true
    },
    {
      key: 'g+h',
      action: () => goToHome(),
      description: 'Go to home',
      category: 'navigation',
      enabled: true
    },
    {
      key: 'g+t',
      action: () => goToTemplates(),
      description: 'Go to templates',
      category: 'navigation',
      enabled: true
    },
    
    // Actions
    {
      key: 'cmd+n',
      modifiers: ['cmd'],
      action: () => createNewTask(),
      description: 'Create new task',
      category: 'action',
      enabled: true
    },
    {
      key: 'ctrl+n',
      modifiers: ['ctrl'],
      action: () => createNewTask(),
      description: 'Create new task',
      category: 'action',
      enabled: true
    },
    {
      key: 'space',
      action: () => toggleCurrentTask(),
      description: 'Toggle current task completion',
      category: 'action',
      enabled: true
    },
    {
      key: 'x',
      action: () => selectCurrentTask(),
      description: 'Select/deselect current task',
      category: 'action',
      enabled: true
    },
    {
      key: 'shift+x',
      modifiers: ['shift'],
      action: () => selectAllTasks(),
      description: 'Select all tasks',
      category: 'action',
      enabled: true
    },
    {
      key: 'delete',
      action: () => deleteSelectedTasks(),
      description: 'Delete selected tasks',
      category: 'action',
      enabled: true
    },
    
    // Search
    {
      key: 'cmd+k',
      modifiers: ['cmd'],
      action: () => focusSearch(),
      description: 'Focus search',
      category: 'search',
      enabled: true
    },
    {
      key: 'ctrl+k',
      modifiers: ['ctrl'],
      action: () => focusSearch(),
      description: 'Focus search',
      category: 'search',
      enabled: true
    },
    {
      key: '/',
      action: () => focusSearch(),
      description: 'Quick search',
      category: 'search',
      enabled: true
    },
    {
      key: 'escape',
      action: () => clearSearch(),
      description: 'Clear search/close modal',
      category: 'search',
      enabled: true
    },
    
    // Editing
    {
      key: 'e',
      action: () => editCurrentTask(),
      description: 'Edit current task',
      category: 'editing',
      enabled: true
    },
    {
      key: 'cmd+z',
      modifiers: ['cmd'],
      action: () => undo(),
      description: 'Undo last action',
      category: 'editing',
      enabled: true
    },
    {
      key: 'ctrl+z',
      modifiers: ['ctrl'],
      action: () => undo(),
      description: 'Undo last action',
      category: 'editing',
      enabled: true
    },
    {
      key: 'cmd+shift+z',
      modifiers: ['cmd', 'shift'],
      action: () => redo(),
      description: 'Redo last action',
      category: 'editing',
      enabled: true
    },
    {
      key: 'ctrl+shift+z',
      modifiers: ['ctrl', 'shift'],
      action: () => redo(),
      description: 'Redo last action',
      category: 'editing',
      enabled: true
    },
    {
      key: 'd+d',
      action: () => duplicateCurrentTask(),
      description: 'Duplicate current task',
      category: 'editing',
      enabled: true
    },
    
    // Help
    {
      key: '?',
      action: () => toggleHelp(),
      description: 'Show keyboard shortcuts help',
      category: 'navigation',
      enabled: true
    }
  ]

  // Event emitter for shortcuts
  const emit = (eventName: string, data?: any) => {
    window.dispatchEvent(new CustomEvent(`shortcut:${eventName}`, { detail: data }))
  }

  // Navigation functions
  function navigateNext() {
    emit('navigate', { direction: 'next' })
  }

  function navigatePrevious() {
    emit('navigate', { direction: 'previous' })
  }

  function goToHome() {
    emit('goto', { target: 'home' })
  }

  function goToTemplates() {
    emit('goto', { target: 'templates' })
  }

  // Action functions
  function createNewTask() {
    emit('create-task')
  }

  function toggleCurrentTask() {
    emit('toggle-task')
  }

  function selectCurrentTask() {
    emit('select-task')
  }

  function selectAllTasks() {
    emit('select-all')
  }

  function deleteSelectedTasks() {
    emit('delete-selected')
  }

  // Search functions
  function focusSearch() {
    emit('focus-search')
  }

  function clearSearch() {
    emit('clear-search')
  }

  // Editing functions
  function editCurrentTask() {
    emit('edit-task')
  }

  function undo() {
    emit('undo')
  }

  function redo() {
    emit('redo')
  }

  function duplicateCurrentTask() {
    emit('duplicate-task')
  }

  function toggleHelp() {
    isHelpModalOpen.value = !isHelpModalOpen.value
    emit('toggle-help', { open: isHelpModalOpen.value })
  }

  // Register shortcuts
  function registerShortcuts(customShortcuts?: KeyboardShortcut[]) {
    shortcuts.value = customShortcuts || defaultShortcuts

    // Register each shortcut with VueUse
    shortcuts.value.forEach(shortcut => {
      if (!shortcut.enabled) return

      // Handle combination keys (e.g., 'cmd+n')
      if (shortcut.key.includes('+')) {
        const keyCombo = shortcut.key.replace(/\+/g, '_')
        whenever(keys[keyCombo], () => {
          if (!isInputFocused()) {
            shortcut.action()
          }
        })
      } else {
        // Single key shortcuts
        whenever(keys[shortcut.key], () => {
          if (!isInputFocused()) {
            shortcut.action()
          }
        })
      }
    })
  }

  // Check if an input element is focused
  function isInputFocused(): boolean {
    const activeElement = document.activeElement
    if (!activeElement) return false
    
    const tagName = activeElement.tagName.toLowerCase()
    return ['input', 'textarea', 'select'].includes(tagName) ||
           activeElement.hasAttribute('contenteditable')
  }

  // Enable/disable shortcuts
  function enableShortcut(key: string) {
    const shortcut = shortcuts.value.find(s => s.key === key)
    if (shortcut) {
      shortcut.enabled = true
    }
  }

  function disableShortcut(key: string) {
    const shortcut = shortcuts.value.find(s => s.key === key)
    if (shortcut) {
      shortcut.enabled = false
    }
  }

  function disableAllShortcuts() {
    shortcuts.value.forEach(s => s.enabled = false)
  }

  function enableAllShortcuts() {
    shortcuts.value.forEach(s => s.enabled = true)
  }

  // Get shortcuts by category
  function getShortcutsByCategory(category: KeyboardShortcut['category']) {
    return shortcuts.value.filter(s => s.category === category)
  }

  // Lifecycle
  onMounted(() => {
    registerShortcuts()
  })

  onUnmounted(() => {
    disableAllShortcuts()
  })

  return {
    shortcuts,
    isHelpModalOpen,
    registerShortcuts,
    enableShortcut,
    disableShortcut,
    enableAllShortcuts,
    disableAllShortcuts,
    getShortcutsByCategory,
    toggleHelp
  }
}