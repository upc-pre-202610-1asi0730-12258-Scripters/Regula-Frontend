const DistributorSalesView = () =>
    import('./views/distributor-sales-view.vue')

// La vista de Deudas y Cobranzas se retiró: el backend no expone GET para
// listar deudas ni clientes, solo POST de creación (que además requiere un
// CustomerId ya existente). Sin eso, la pantalla no tenía nada real que
// mostrar. Se puede reintroducir cuando el backend agregue esos endpoints.
const commercialRoutes = [
    {
        path: 'ventas',
        name: 'commercial-sales-distributor',
        component: DistributorSalesView,
        meta: {
            shellPreset: 'distributor',
            pageTitleKey: 'pageTitles.sales',
        },
    },
]

export default commercialRoutes