const DistributorInventoryView = () => import('./views/distributor-inventory-view.vue')

const inventoryRoutes = [
    {
        path: 'distribuidor',
        name: 'inventory-distributor',
        component: DistributorInventoryView,
        meta: {
            shellPreset: 'distributor',
            pageTitleKey: 'pageTitles.inventory',
        },
    },
]

export default inventoryRoutes
