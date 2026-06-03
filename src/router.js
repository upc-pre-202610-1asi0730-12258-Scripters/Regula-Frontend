import { createRouter, createWebHistory } from 'vue-router'
import AppShellLayout from '@/shared/presentation/components/app-shell-layout.vue'
import inventoryRoutes from '@/inventory-management/presentation/inventory-routes.js'
import commercialRoutes from '@/commercional-management/presentation/commercial-routes.js'

const RoleSelectView = () => import('@/shared/presentation/views/role-select-view.vue')

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
            children: inventoryRoutes,
        },
        {
            path: '/comercial',
            component: AppShellLayout,
            redirect: '/comercial/ventas',
            children: commercialRoutes,
        },
        {
            path: '/ventas',
            redirect: '/comercial/ventas',
        },
        {
            path: '/deudas',
            redirect: '/comercial/deudas',
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