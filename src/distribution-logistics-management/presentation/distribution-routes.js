export const distributionRoutes = [
  {
    path: '',
    name: 'distribution-hub',
    component: () => import('./views/distribution-hub.view.vue'),
    redirect: { name: 'distribution-day-deliveries' },
    meta: {
      shellPreset: 'distributor',
      pageTitleKey: 'pageTitles.distribution',
    },
    children: [
      {
        path: 'deliveries',
        name: 'distribution-day-deliveries',
        component: () => import('./views/distribution-day-deliveries.view.vue'),
        meta: {
          shellPreset: 'distributor',
          pageTitleKey: 'pageTitles.dayDeliveries',
        },
      },
      {
        path: 'live-map',
        name: 'distribution-live-map',
        component: () => import('./views/distribution-live-map.view.vue'),
        meta: {
          shellPreset: 'distributor',
          pageTitleKey: 'pageTitles.liveMap',
        },
      },
      {
        path: 'history',
        name: 'distribution-history',
        component: () => import('./views/distribution-history.view.vue'),
        meta: {
          shellPreset: 'distributor',
          pageTitleKey: 'pageTitles.history',
        },
      },
    ],
  },
]
