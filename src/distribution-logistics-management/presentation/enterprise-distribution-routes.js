// Rutas de Distribución para el perfil Empresa.
// Se mantienen separadas de las rutas del perfil Distribuidor
// (distribution-routes.js) para no alterar su comportamiento.
export const enterpriseDistributionRoutes = [
  {
    path: '',
    name: 'enterprise-distribution-hub',
    component: () => import('./views/enterprise/enterprise-distribution-hub.view.vue'),
    redirect: { name: 'enterprise-distribution-day-deliveries' },
    meta: {
      shellPreset: 'enterprise',
      pageTitle: 'Distribución',
      breadcrumbs: ['Regula', 'Distribución'],
      title: 'Distribución · REGULA',
    },
    children: [
      {
        path: 'repartos-del-dia',
        name: 'enterprise-distribution-day-deliveries',
        component: () =>
          import('./views/enterprise/enterprise-day-deliveries.view.vue'),
        meta: {
          shellPreset: 'enterprise',
          pageTitle: 'Distribución',
          breadcrumbs: ['Regula', 'Distribución', 'Repartos del Día'],
          title: 'Repartos del Día · REGULA',
        },
      },
      {
        path: 'mapa-en-tiempo-real',
        name: 'enterprise-distribution-live-map',
        component: () =>
          import('./views/enterprise/enterprise-live-map.view.vue'),
        meta: {
          shellPreset: 'enterprise',
          pageTitle: 'Distribución',
          breadcrumbs: ['Regula', 'Distribución', 'Mapa en Tiempo Real'],
          title: 'Mapa en Tiempo Real · REGULA',
        },
      },
      {
        path: 'supervision-de-rutas',
        name: 'enterprise-distribution-route-supervision',
        component: () =>
          import('./views/enterprise/enterprise-route-supervision.view.vue'),
        meta: {
          shellPreset: 'enterprise',
          pageTitle: 'Distribución',
          breadcrumbs: ['Regula', 'Distribución', 'Supervisión de Rutas'],
          title: 'Supervisión de Rutas · REGULA',
        },
      },
      {
        path: 'historial-de-repartos',
        name: 'enterprise-distribution-history',
        component: () =>
          import('./views/enterprise/enterprise-history.view.vue'),
        meta: {
          shellPreset: 'enterprise',
          pageTitle: 'Distribución',
          breadcrumbs: ['Regula', 'Distribución', 'Historial de Repartos'],
          title: 'Historial de Repartos · REGULA',
        },
      },
    ],
  },
]
