export const securityRoutes = [
  {
    path: '/seguridad',
    name: 'security-hub',
    component: () => import('./views/security-hub.view.vue'),
    redirect: { name: 'active-alerts' },
    meta: {
      title: 'Alertas y Seguridad',
      requiresAuth: true
    },
    children: [
      {
        path: 'active-alerts',
        name: 'active-alerts',
        component: () => import('./views/active-alerts.view.vue'),
        meta: { title: 'Alertas Activas' }
      },
      {
        path: 'alert-history',
        name: 'alert-history',
        component: () => import('./views/alert-history.view.vue'),
        meta: { title: 'Historial de Alertas' }
      },
      {
        path: 'sensor-status',
        name: 'sensor-status',
        component: () => import('./views/sensor-status.view.vue'),
        meta: { title: 'Estado del Sensor' }
      },
      {
        path: 'route-deviations',
        name: 'route-deviations',
        component: () => import('./views/route-deviations.view.vue'),
        meta: { title: 'Desvíos de Ruta' }
      },
      {
        path: 'zone-analysis',
        name: 'zone-analysis',
        component: () => import('./views/zone-analysis.view.vue'),
        meta: { title: 'Análisis por Zona' }
      },
      {
        path:'warehouse-status',
        name: 'warehouse-status',
        component: () => import('./views/warehouse-status.view.vue'),
        meta: { title: 'Estado de almacenes' },
      },
      {
        path: 'company-alert-history',
        name: 'company-alert-history',
        component: () => import('./views/company-alerts-history.view.vue'), // Corrected filename here
        meta: { title: 'Historial de Alertas de Compañía' }
      }
    ]
  }
];
