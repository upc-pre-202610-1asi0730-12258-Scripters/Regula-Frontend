import AppShellLayout from '@/shared/presentation/layouts/app-shell-layout.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { securityRoutes } from '@/operational-security-management/presentation/security-routes.js'

const RoleSelectView = () =>
    import('@/shared/presentation/views/role-select-view.vue')
const EnterpriseInventoryView = () =>
    import('@/inventory-management/presentation/views/enterprise-inventory-view.vue')
const DistributorInventoryView = () =>
    import('@/inventory-management/presentation/views/distributor-inventory-view.vue')

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
