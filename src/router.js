import { createRouter, createWebHistory } from 'vue-router'
import { watch } from 'vue'
import AppShellLayout from '@/shared/presentation/components/app-shell-layout.vue'
import inventoryRoutes from '@/inventory-management/presentation/inventory-routes.js'
import commercialRoutes from '@/commercional-management/presentation/commercial-routes.js'
import { distributionRoutes } from '@/distribution-logistics-management/presentation/distribution-routes.js'
import dashboardRoutes from '@/dashboard-management/presentation/dashboard-routes.js'
import { IamRoutes } from '@/iam/presentation/iam-routes.js'
import { useIamStore } from '@/iam/application/iam.store.js'
import { useBillingStore } from '@/billing/application/billing.store.js'
import i18n from './i18n.js'

const SubscribeView = () => import('@/billing/presentation/views/subscribe-view.vue')

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        ...IamRoutes,
        {
            path: '/suscripcion',
            name: 'billing-subscribe',
            component: SubscribeView,
            meta: { pageTitleKey: 'pageTitles.subscribe' },
        },
        {
            path: '/',
            redirect: '/dashboard/distribuidor',
        },
        {
            path: '/dashboard',
            component: AppShellLayout,
            redirect: '/dashboard/distribuidor',
            children: dashboardRoutes,
        },
        {
            path: '/inventario',
            component: AppShellLayout,
            redirect: '/inventario/distribuidor',
            children: inventoryRoutes,
        },
        {
            path: '/comercial',
            component: AppShellLayout,
            redirect: '/comercial/ventas',
            children: commercialRoutes,
        },
        {
            path: '/distribucion',
            component: AppShellLayout,
            children: distributionRoutes,
        },
        {
            path: '/ventas',
            redirect: '/comercial/ventas',
        },
        {
            path: '/:pathMatch(.*)*',
            redirect: '/',
        },
    ],
})

// Routes reachable without an active session.
const PUBLIC_ROUTE_NAMES = new Set(['iam-sign-in', 'iam-sign-up'])

router.beforeEach(async (to) => {
    if (PUBLIC_ROUTE_NAMES.has(to.name)) {
        return true
    }

    const iamStore = useIamStore()
    if (!iamStore.isSignedIn) {
        return { name: 'iam-sign-in' }
    }

    // Evita el loop: la propia pantalla de suscripción no debe redirigir a sí misma.
    if (to.name === 'billing-subscribe') {
        return true
    }

    const billingStore = useBillingStore()
    if (!billingStore.checked) {
        await billingStore.fetchStatus()
    }

    if (!billingStore.isActive) {
        return { name: 'billing-subscribe' }
    }

    return true
})

function applyDocumentTitle(route) {
    const key = route?.meta?.pageTitleKey
    const label = key ? i18n.global.t(key) : null
    document.title = label ? `${label} · REGULA` : 'REGULA'
}

router.afterEach((to) => {
    applyDocumentTitle(to)
})

// Si cambias de idioma sin navegar (ej. estás parado en el Dashboard y
// cambias a English), el título de la pestaña también debe actualizarse.
watch(i18n.global.locale, () => {
    applyDocumentTitle(router.currentRoute.value)
})

export default router
