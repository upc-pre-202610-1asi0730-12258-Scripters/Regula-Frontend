/**
 * @summary Route definitions for the bounded context.
 * Configures lazy-loaded navigation routes related to inventory features.
 *
 * @author Kevin Lopez
 */

const EnterpriseInventoryView = () => import('./views/enterprise-inventory-view.vue')
const DistributorInventoryView = () => import('./views/distributor-inventory-view.vue')

const inventoryRoutes = [
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
]

export default inventoryRoutes
