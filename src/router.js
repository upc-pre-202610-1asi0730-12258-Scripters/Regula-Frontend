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
const GenerateReportView = () =>
    import('@/operational-analytics/presentation/views/generate-report-view.vue')

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
            path: '/reportes',
            component: AppShellLayout,         // reutiliza el mismo layout con sidebar
            redirect: '/reportes/generar',
            children: [
                {
                    path: 'generar',
                    name: 'reports-generate',
                    component: GenerateReportView,
                    meta: {
                        shellPreset: 'enterprise',
                        pageTitle: 'Reportes',
                        breadcrumbs: ['Regula', 'Reportes'],
                        title: 'Reportes · REGULA',
                    },
                },
            ],
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
