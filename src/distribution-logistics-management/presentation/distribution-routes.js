export const distributionRoutes = [
  {
    path: '/distribucion',
    name: 'distribution-hub',
    component: () => import('./views/distribution-hub.view.vue'),
    redirect: { name: 'distribution-day-deliveries' },
    meta: {
      shellPreset: 'distributor',
      pageTitle: 'Distribución',
      breadcrumbs: ['Regula', 'Distribución'],
      title: 'Distribución · REGULA',
    },
    children: [
      {
        path: 'entregas-del-dia',
        name: 'distribution-day-deliveries',
        component: () => import('./views/distribution-day-deliveries.view.vue'),
        meta: {
          shellPreset: 'distributor',
          pageTitle: 'Distribución',
          breadcrumbs: ['Regula', 'Distribución'],
          title: 'Entregas del Día · REGULA',
        },
      },
      {
        path: 'mapa-en-tiempo-real',
        name: 'distribution-live-map',
        component: () => import('./views/distribution-live-map.view.vue'),
        meta: {
          shellPreset: 'distributor',
          pageTitle: 'Distribución',
          breadcrumbs: ['Regula', 'Distribución'],
          title: 'Mapa en Tiempo Real · REGULA',
        },
      },
      {
        path: 'historial-de-repartos',
        name: 'distribution-history',
        component: () => import('./views/distribution-history.view.vue'),
        meta: {
          shellPreset: 'distributor',
          pageTitle: 'Distribución',
          breadcrumbs: ['Regula', 'Distribución'],
          title: 'Historial de Repartos · REGULA',
        },
      },
    ],
  },
]
