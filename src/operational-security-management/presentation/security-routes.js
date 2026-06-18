export const securityRoutes = [

  // ========================
  // EMPRESA
  // ========================
  {
    path: 'empresa',
    component: () =>
        import('./views/company-operational-security.view.vue'),

    redirect: { name: 'company-active-alerts' },

    meta: {
      shellPreset: 'enterprise',
      pageTitle: 'Seguridad',
      breadcrumbs: ['Regula', 'Seguridad'],
      title: 'Seguridad · Empresa · REGULA'
    },

    children: [
      {
        path: 'active-alerts',
        name: 'company-active-alerts',
        component: () => import('./views/active-alerts.view.vue')
      },
      {
        path: 'company-alert-history',
        name: 'company-alert-history',
        component: () =>
            import('./views/company-alerts-history.view.vue')
      },
      {
        path: 'warehouse-status',
        name: 'warehouse-status',
        component: () =>
            import('./views/warehouse-status.view.vue')
      },
      {
        path: 'zone-analysis',
        name: 'zone-analysis',
        component: () =>
            import('./views/zone-analysis.view.vue')
      }
    ]
  },

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