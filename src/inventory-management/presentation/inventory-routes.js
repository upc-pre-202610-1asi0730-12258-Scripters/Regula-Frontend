const InventoryView = () => import('./views/inventory-view.vue')

const inventoryRoutes = [
    {
        path: '',
        name: 'inventory',
        component: InventoryView,
        meta: {
            shellPreset: 'distributor',
            pageTitleKey: 'pageTitles.inventory',
        },
    },
]

export default inventoryRoutes
