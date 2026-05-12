import AppShellLayout from '@/shared/presentation/layouts/app-shell-layout.vue'
import { createRouter, createWebHistory } from 'vue-router'

const RoleSelectView = () =>
    import('@/shared/presentation/views/role-select-view.vue')
const EnterpriseInventoryView = () =>
    import('@/inventory-management/presentation/views/enterprise-inventory-view.vue')
const DistributorInventoryView = () =>
    import('@/inventory-management/presentation/views/distributor-inventory-view.vue')
const DistributorSalesView = () =>
    import('@/commercional-management/presentation/views/distributor-sales-view.vue')
const DistributorDebtsView = () =>
    import('@/commercional-management/presentation/views/distributor-debts-view.vue')

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
                    path: 'distribuidor/fiados',
                    name: 'commercial-distributor-debts',
                    component: DistributorDebtsView,
                    meta: {
                        shellPreset: 'distributor',
                        pageTitle: 'Fiados y Cobranzas',
                        breadcrumbs: ['Regula', 'Fiados y Cobranzas'],
                        title: 'Fiados y Cobranzas · Distribuidor · REGULA',
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