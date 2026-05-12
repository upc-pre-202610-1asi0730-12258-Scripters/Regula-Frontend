import type { RouteRecordRaw } from 'vue-router'

import DistributionSectionLayout from '@/presentation/layouts/DistributionSectionLayout.vue'
import RegulaShellLayout from '@/presentation/layouts/RegulaShellLayout.vue'
import AlertsSecurityPage from '@/presentation/pages/AlertsSecurityPage.vue'
import CreditCollectionsPage from '@/presentation/pages/CreditCollectionsPage.vue'
import DashboardPage from '@/presentation/pages/DashboardPage.vue'
import DistributionDayDeliveriesPage from '@/presentation/pages/DistributionDayDeliveriesPage.vue'
import DistributionHistoryPage from '@/presentation/pages/DistributionHistoryPage.vue'
import DistributionLiveMapPage from '@/presentation/pages/DistributionLiveMapPage.vue'
import InventoryPage from '@/presentation/pages/InventoryPage.vue'
import ReportsAnalysisPage from '@/presentation/pages/ReportsAnalysisPage.vue'
import SalesPage from '@/presentation/pages/SalesPage.vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: RegulaShellLayout,
    children: [
      {
        path: '',
        redirect: { name: 'DistributionDayDeliveries' },
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: DashboardPage,
        meta: {
          titleKey: 'pages.dashboardTitle',
          descriptionKey: 'meta.appDescription',
        },
      },
      {
        path: 'alerts-security',
        name: 'AlertsSecurity',
        component: AlertsSecurityPage,
        meta: {
          titleKey: 'pages.alertsTitle',
          descriptionKey: 'meta.appDescription',
        },
      },
      {
        path: 'inventory',
        name: 'Inventory',
        component: InventoryPage,
        meta: {
          titleKey: 'pages.inventoryTitle',
          descriptionKey: 'meta.appDescription',
        },
      },
      {
        path: 'distribution',
        component: DistributionSectionLayout,
        meta: {
          titleKey: 'distribution.pageTitle',
          descriptionKey: 'meta.appDescription',
        },
        children: [
          {
            path: '',
            redirect: { name: 'DistributionDayDeliveries' },
          },
          {
            path: 'day-deliveries',
            name: 'DistributionDayDeliveries',
            component: DistributionDayDeliveriesPage,
            meta: {
              titleKey: 'distribution.tabs.dayDeliveries',
              descriptionKey: 'meta.appDescription',
            },
          },
          {
            path: 'live-map',
            name: 'DistributionLiveMap',
            component: DistributionLiveMapPage,
            meta: {
              titleKey: 'distribution.tabs.liveMap',
              descriptionKey: 'meta.appDescription',
            },
          },
          {
            path: 'history',
            name: 'DistributionHistory',
            component: DistributionHistoryPage,
            meta: {
              titleKey: 'distribution.tabs.history',
              descriptionKey: 'meta.appDescription',
            },
          },
        ],
      },
      {
        path: 'sales',
        name: 'Sales',
        component: SalesPage,
        meta: {
          titleKey: 'pages.salesTitle',
          descriptionKey: 'meta.appDescription',
        },
      },
      {
        path: 'credit-collections',
        name: 'CreditCollections',
        component: CreditCollectionsPage,
        meta: {
          titleKey: 'pages.creditTitle',
          descriptionKey: 'meta.appDescription',
        },
      },
      {
        path: 'reports-analysis',
        name: 'ReportsAnalysis',
        component: ReportsAnalysisPage,
        meta: {
          titleKey: 'pages.reportsTitle',
          descriptionKey: 'meta.appDescription',
        },
      },
    ],
  },
]
