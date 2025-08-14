import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import TasksPage from '@/views/TasksPage.vue'
import CategoriesPage from '@/views/CategoriesPage.vue'
import TemplatesPage from '@/views/TemplatesPage.vue'
import SettingsPage from '@/views/SettingsPage.vue'
import AboutPage from '@/views/AboutPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
    meta: { title: 'Dashboard' }
  },
  {
    path: '/tasks',
    name: 'tasks',
    component: TasksPage,
    meta: { title: 'Tasks' }
  },
  {
    path: '/categories',
    name: 'categories',
    component: CategoriesPage,
    meta: { title: 'Categories' }
  },
  {
    path: '/templates',
    name: 'templates',
    component: TemplatesPage,
    meta: { title: 'Templates' }
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsPage,
    meta: { title: 'Settings' }
  },
  {
    path: '/about',
    name: 'about',
    component: AboutPage,
    meta: { title: 'About' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Update page title based on route
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title || 'Page'} - Vue Checklist App`
  next()
})

export default router