const EnterpriseDashboardView = () =>
    import('./views/enterprise-dashboard-view.vue')

const DistributorDashboardView = () =>
    import('./views/distributor-dashboard-view.vue')

const dashboardRoutes = [
    {
        path: 'empresa',
        name: 'enterprise-dashboard',
        component: EnterpriseDashboardView,
        meta: {
            shellPreset: 'enterprise',
            pageTitle: 'Panel Principal',
            breadcrumbs: ['Regula', 'Dashboard'],
            title: 'Dashboard · Empresa · REGULA',
        },
    },
    {
        path: 'distribuidor',
        name: 'distributor-dashboard',
        component: DistributorDashboardView,
        meta: {
            shellPreset: 'distributor',
            pageTitle: 'Panel Diario',
            breadcrumbs: ['Regula', 'Dashboard'],
            title: 'Dashboard · Distribuidor · REGULA',
        },
    },
]

export default dashboardRoutes