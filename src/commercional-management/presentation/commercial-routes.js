const SalesView = () =>
    import('./views/sales-view.vue')

// La vista de Deudas y Cobranzas se retiró: el backend no expone GET para
// listar deudas ni clientes, solo POST de creación (que además requiere un
// CustomerId ya existente). Sin eso, la pantalla no tenía nada real que
// mostrar. Se puede reintroducir cuando el backend agregue esos endpoints.
const commercialRoutes = [
    {
        path: 'sales',
        name: 'commercial-sales',
        component: SalesView,
        meta: {
            shellPreset: 'distributor',
            pageTitleKey: 'pageTitles.sales',
        },
    },
]

export default commercialRoutes
