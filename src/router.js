/**
 * @summary Main router configuration for the application.
 * Defines navigation routes, history mode, and global route guards.
 *
 * @author Kevin Lopez
 */

import AppShellLayout from '@/shared/presentation/components/app-shell-layout.vue'
import inventoryRoutes from '@/inventory-management/presentation/inventory-routes.js'
import { createRouter, createWebHistory } from 'vue-router'

const RoleSelectView = () => import('@/shared/presentation/views/role-select-view.vue')

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'role-select',
            component: RoleSelectView,
            meta: {
                title: 'Seleccionar perfil · REGULA',
            },
        },
        {
            path: '/inventario',
            component: AppShellLayout,
            redirect: '/',
            meta: {},
            children: inventoryRoutes,
        },
        {
            path: '/:pathMatch(.*)*',
            redirect: '/',
        },
    ],
})

router.afterEach((to) => {
    document.title = to.meta?.title || 'REGULA'
})

export default router
