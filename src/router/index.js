import AppShellLayout from '@/shared/presentation/layouts/app-shell-layout.vue'
import { createRouter, createWebHistory } from 'vue-router'

const RoleSelectView = () =>
    import('@/shared/presentation/views/role-select-view.vue')
const EnterpriseInventoryView = () =>
    import('@/inventory-management/presentation/views/enterprise-inventory-view.vue')
const DistributorInventoryView = () =>
    import('@/inventory-management/presentation/views/distributor-inventory-view.vue')
const DistributionSectionLayoutGate = () =>
    import('@/distribution-logistics-management/presentation/layouts/DistributionSectionLayoutGate.vue')
const DistributionSectionLayout = () =>
    import('@/distribution-logistics-management/presentation/layouts/DistributionSectionLayout.vue')
const DistributionDayDeliveriesPage = () =>
    import('@/distribution-logistics-management/presentation/views/DistributionDayDeliveriesPage.vue')
const DistributionLiveMapPage = () =>
    import('@/distribution-logistics-management/presentation/views/DistributionLiveMapPage.vue')
const DistributionHistoryPage = () =>
    import('@/distribution-logistics-management/presentation/views/DistributionHistoryPage.vue')
const EnterpriseDayDispatchesPage = () =>
    import('@/distribution-logistics-management/presentation/views/enterprise/EnterpriseDayDispatchesPage.vue')
const EnterpriseLiveMapPage = () =>
    import('@/distribution-logistics-management/presentation/views/enterprise/EnterpriseLiveMapPage.vue')
const EnterpriseRouteSupervisionPage = () =>
    import('@/distribution-logistics-management/presentation/views/enterprise/EnterpriseRouteSupervisionPage.vue')
const EnterpriseDeliveryHistoryPage = () =>
    import('@/distribution-logistics-management/presentation/views/enterprise/EnterpriseDeliveryHistoryPage.vue')
const EnterpriseDashboardPage = () =>
    import('@/distribution-logistics-management/presentation/views/dashboard/EnterpriseDashboardPage.vue')
const DistributorDashboardPage = () =>
    import('@/distribution-logistics-management/presentation/views/dashboard/DistributorDashboardPage.vue')

function getRole() {
    try {
        return sessionStorage.getItem('regula_role') || 'enterprise'
    } catch {
        return 'enterprise'
    }
}

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
            path: '/dashboard',
            component: AppShellLayout,
            redirect: '/',
            meta: {},
            children: [
                {
                    path: 'empresa',
                    name: 'dashboard-enterprise',
                    component: EnterpriseDashboardPage,
                    meta: {
                        shellPreset: 'enterprise',
                        pageTitle: 'Dashboard',
                        breadcrumbs: ['Regula', 'Dashboard'],
                        title: 'Dashboard · Empresa · REGULA',
                    },
                },
                {
                    path: 'distribuidor',
                    name: 'dashboard-distributor',
                    component: DistributorDashboardPage,
                    meta: {
                        shellPreset: 'distributor',
                        pageTitle: 'Panel Diario',
                        breadcrumbs: ['Regula', 'Dashboard'],
                        title: 'Dashboard · Distribuidor · REGULA',
                    },
                },
            ],
        },
        {
            path: '/distribucion',
            component: AppShellLayout,
            redirect: '/',
            meta: {},
            children: [
                {
                    path: '',
                    redirect: () =>
                        getRole() === 'enterprise'
                            ? { name: 'enterprise-distribution-day' }
                            : { name: 'distribution-day-deliveries' },
                },
                {
                    path: '',
                    component: DistributionSectionLayoutGate,
                    meta: {
                        pageTitle: 'Distribución',
                        breadcrumbs: ['Regula', 'Distribución'],
                    },
                    children: [
                        {
                            path: '',
                            redirect: () =>
                                getRole() === 'enterprise'
                                    ? { name: 'enterprise-distribution-day' }
                                    : { name: 'distribution-day-deliveries' },
                        },
                        {
                            path: 'entregas-del-dia',
                            name: 'distribution-day-deliveries',
                            component: DistributionDayDeliveriesPage,
                            meta: {
                                title: 'Distribución · Entregas del día · REGULA',
                                shellPreset: 'distributor',
                            },
                        },
                        {
                            path: 'mapa',
                            name: 'distribution-live-map',
                            component: DistributionLiveMapPage,
                            meta: {
                                title: 'Distribución · Mapa · REGULA',
                                shellPreset: 'distributor',
                            },
                        },
                        {
                            path: 'historial',
                            name: 'distribution-history',
                            component: DistributionHistoryPage,
                            meta: {
                                title: 'Distribución · Historial · REGULA',
                                shellPreset: 'distributor',
                            },
                        },
                        {
                            path: 'repartos-del-dia',
                            name: 'enterprise-distribution-day',
                            component: EnterpriseDayDispatchesPage,
                            meta: {
                                title: 'Distribución · Repartos del día · REGULA',
                                shellPreset: 'enterprise',
                            },
                        },
                        {
                            path: 'mapa-tiempo-real',
                            name: 'enterprise-distribution-live-map',
                            component: EnterpriseLiveMapPage,
                            meta: {
                                title: 'Distribución · Mapa en tiempo real · REGULA',
                                shellPreset: 'enterprise',
                            },
                        },
                        {
                            path: 'supervision-rutas',
                            name: 'enterprise-distribution-supervision',
                            component: EnterpriseRouteSupervisionPage,
                            meta: {
                                title: 'Distribución · Supervisión de rutas · REGULA',
                                shellPreset: 'enterprise',
                            },
                        },
                        {
                            path: 'historial-repartos',
                            name: 'enterprise-distribution-history',
                            component: EnterpriseDeliveryHistoryPage,
                            meta: {
                                title: 'Distribución · Historial de repartos · REGULA',
                                shellPreset: 'enterprise',
                            },
                        },
                    ],
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
