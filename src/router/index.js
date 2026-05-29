import AppShellLayout from '@/shared/presentation/layouts/app-shell-layout.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { securityRoutes } from '@/operational-security-management/presentation/security-routes.js'

const RoleSelectView = () =>
    import('@/shared/presentation/views/role-select-view.vue')
const EnterpriseInventoryView = () =>
    import('@/inventory-management/presentation/views/enterprise-inventory-view.vue')
const DistributorInventoryView = () =>
    import('@/inventory-management/presentation/views/distributor-inventory-view.vue')
const GenerateReportView = () =>
    import('@/operational-analytics/presentation/views/generate-report-view.vue')
const DistributorSalesView = () =>
    import('@/commercional-management/presentation/views/distributor-sales-view.vue')
const DistributorDebtsView = () =>
    import('@/commercional-management/presentation/views/distributor-debts-view.vue')
import { distributionRoutes } from '@/distribution-logistics-management/presentation/distribution-routes.js'
import { enterpriseDistributionRoutes } from '@/distribution-logistics-management/presentation/enterprise-distribution-routes.js'

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
            children: [
                {
                    path: 'empresa',
                    name: 'inventory-enterprise',
                    component: EnterpriseInventoryView,
                    meta: {
                        shellPreset: 'enterprise',
                        pageTitle: 'Inventario',
                        breadcrumbs: ['Regula', 'Inventario'],
                        title: 'Inventario · Empresa · REGULA',
                    },
                },
                {
                    path: 'distribuidor',
                    name: 'inventory-distributor',
                    component: DistributorInventoryView,
                    meta: {
                        shellPreset: 'distributor',
                        pageTitle: 'Inventario',
                        breadcrumbs: ['Regula', 'Inventario'],
                        title: 'Inventario · Distribuidor · REGULA',
                    },
                },
            ],
        },
        {
            path: '/seguridad',
            component: AppShellLayout,
            // Aquí inyectamos todo el hub de seguridad que a su vez tiene las sub-rutas
            children: securityRoutes
        },{
            path: '/distribucion',
            component: AppShellLayout,
            children: distributionRoutes,
        },
        {
            // Distribución dentro de la sección Empresas
            path: '/empresa/distribucion',
            component: AppShellLayout,
            children: enterpriseDistributionRoutes,
        },
        {
            path: '/comercial',
            component: AppShellLayout,
            redirect: '/comercial/distribuidor/ventas',
            meta: {},
            children: [
                {
                    path: 'distribuidor/ventas',
                    name: 'commercial-distributor-sales',
                    component: DistributorSalesView,
                    meta: {
                        shellPreset: 'distributor',
                        pageTitle: 'Ventas',
                        breadcrumbs: ['Regula', 'Ventas'],
                        title: 'Ventas · Distribuidor · REGULA',
                    },
                },
                {
                    path: 'distribuidor/deudas',
                    name: 'commercial-distributor-debts',
                    component: DistributorDebtsView,
                    meta: {
                        shellPreset: 'distributor',
                        pageTitle: 'Deudas y Cobranzas',
                        breadcrumbs: ['Regula', 'Deudas y Cobranzas'],
                        title: 'Deudas y Cobranzas · Distribuidor · REGULA',
                    },
                },
            ],
        },
        {
            path: '/:pathMatch(.*)*',
            redirect: '/',
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
    ],
})

router.afterEach((to) => {
    document.title = to.meta?.title || 'REGULA'
})

export default router