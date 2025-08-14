import { createPinia } from 'pinia'

export const pinia = createPinia()

// Enable HMR for stores
if (import.meta.hot) {
  import.meta.hot.accept()
}