const DistributorSalesView = () =>
    import('./views/distributor-sales-view.vue')

const DistributorDebtsView = () =>
    import('./views/distributor-debts-view.vue')

const commercialRoutes = [
    {
        path: 'ventas',
        name: 'commercial-sales-distributor',
        component: DistributorSalesView,
        meta: {
            shellPreset: 'distributor',
            pageTitle: 'Ventas',
            breadcrumbs: ['Regula', 'Ventas'],
            title: 'Ventas · REGULA',
        },
    },
    {
        path: 'deudas',
        name: 'commercial-debts-distributor',
        component: DistributorDebtsView,
        meta: {
            shellPreset: 'distributor',
            pageTitle: 'Deudas y Cobranzas',
            breadcrumbs: ['Regula', 'Deudas y Cobranzas'],
            title: 'Deudas y Cobranzas · REGULA',
        },
    },
]

export default commercialRoutes