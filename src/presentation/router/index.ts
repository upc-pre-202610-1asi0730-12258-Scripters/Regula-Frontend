import { createRouter, createWebHistory } from 'vue-router'

import { routes } from '@/presentation/router/routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0, left: 0 }
  },
})

export default router
