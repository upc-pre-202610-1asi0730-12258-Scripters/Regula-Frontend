const DashboardView = () =>
    import('./views/dashboard-view.vue')

const dashboardRoutes = [
    {
        path: '',
        name: 'dashboard',
        component: DashboardView,
        meta: {
            shellPreset: 'distributor',
            pageTitleKey: 'pageTitles.dashboard',
        },
    },
]

export default dashboardRoutes
