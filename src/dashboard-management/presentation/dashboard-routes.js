const DistributorDashboardView = () =>
    import('./views/distributor-dashboard-view.vue')

const dashboardRoutes = [
    {
        path: 'distribuidor',
        name: 'distributor-dashboard',
        component: DistributorDashboardView,
        meta: {
            shellPreset: 'distributor',
            pageTitleKey: 'pageTitles.dashboard',
        },
    },
]

export default dashboardRoutes
