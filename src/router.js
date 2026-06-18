import { createRouter, createWebHistory } from 'vue-router'
import AppShellLayout from '@/shared/presentation/components/app-shell-layout.vue'
import inventoryRoutes from '@/inventory-management/presentation/inventory-routes.js'
import commercialRoutes from '@/commercional-management/presentation/commercial-routes.js'
import { distributionRoutes } from '@/distribution-logistics-management/presentation/distribution-routes.js'
import { enterpriseDistributionRoutes } from '@/distribution-logistics-management/presentation/enterprise-distribution-routes.js'
import { securityRoutes } from '@/operational-security-management/presentation/security-routes.js'

const RoleSelectView = () => import('@/shared/presentation/views/role-select-view.vue')
const GenerateReportView = () => import('@/operational-analytics/presentation/views/generate-report-view.vue')
const SecurityTrendsView = () => import('@/operational-analytics/presentation/views/security-trends-view.vue')

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
            children: inventoryRoutes,
        },
        {
            path: '/seguridad',
            component: AppShellLayout,
            children: securityRoutes,
        },
        {
            path: '/comercial',
            component: AppShellLayout,
            redirect: '/comercial/ventas',
            children: commercialRoutes,
        },
        {
            path: '/distribucion',
            component: AppShellLayout,
            children: distributionRoutes,
        },
        {
            path: '/empresa/distribucion',
            component: AppShellLayout,
            children: enterpriseDistributionRoutes,
        },

        {
            path: '/reportes',
            component: AppShellLayout,
            redirect: '/reportes/generar',
            children: [
                {
                    path: 'generar',
                    name: 'reports-generate',
                    component: GenerateReportView,
                    meta: {
                        pageTitle: 'Reportes',
                        title: 'Reportes · REGULA',
                    },
                },
                {
                    path: 'tendencias',
                    name: 'reports-security-trends',
                    component: SecurityTrendsView,
                    meta: {
                        pageTitle: 'Reportes',
                        title: 'Tendencias de Seguridad · REGULA',
                    },
                },
            ],
        },
        {
            path: '/distribuidor/reportes',
            component: AppShellLayout,
            redirect: '/distribuidor/reportes/generar',
            children: [
                {
                    path: 'generar',
                    name: 'distributor-reports-generate',
                    component: GenerateReportView,
                    meta: {
                        shellPreset: 'distributor',
                        pageTitle: 'Reportes',
                        title: 'Reportes · Distribuidor · REGULA',
                    },
                },
                {
                    path: 'tendencias',
                    name: 'distributor-reports-security-trends',
                    component: SecurityTrendsView,
                    meta: {
                        shellPreset: 'distributor',
                        pageTitle: 'Reportes',
                        title: 'Tendencias de Seguridad · Distribuidor · REGULA',
                    },
                },
            ],
        },
        {
            path: '/ventas',
            redirect: '/comercial/ventas',
        },
        {
            path: '/deudas',
            redirect: '/comercial/deudas',
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