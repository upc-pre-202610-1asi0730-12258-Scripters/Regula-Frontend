export const securityRoutes = [

  // ========================
  // DISTRIBUIDOR
  // ========================
  {
    path: 'distribuidor',
    component: () =>
        import('./views/distributor-operational-security.view.vue'),

    redirect: { name: 'distributor-active-alerts' },

    meta: {
      shellPreset: 'distributor',
      pageTitle: 'Seguridad',
      breadcrumbs: ['Regula', 'Seguridad'],
      title: 'Seguridad · Distribuidor · REGULA'
    },

    children: [
      {
        path: 'active-alerts',
        name: 'distributor-active-alerts',
        component: () => import('./views/active-alerts.view.vue')
      },
      {
        path: 'alert-history',
        name: 'alert-history',
        component: () => import('./views/alert-history.view.vue')
      },
      {
        path: 'sensor-status',
        name: 'sensor-status',
        component: () => import('./views/sensor-status.view.vue')
      },
      {
        path: 'route-deviations',
        name: 'route-deviations',
        component: () => import('./views/route-deviations.view.vue')
      }
    ]
  }
];
