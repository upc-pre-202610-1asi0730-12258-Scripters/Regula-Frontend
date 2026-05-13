export const securityRoutes = [
  {
    path: '', // <-- Se corrige la ruta relativa
    name: 'security-hub',
    component: () => import('./views/security-hub.view.vue'),
    redirect: () => {
        try {
            return sessionStorage.getItem('regula_role') === 'distributor'
                ? { name: 'distributor-active-alerts' }
                : { name: 'enterprise-active-alerts' };
        } catch {
            return { name: 'enterprise-active-alerts' };
        }
    },
    meta: {
      title: 'Alertas y Seguridad',
      requiresAuth: true
    },
    children: [
      {
        path: 'empresa/active-alerts',
        name: 'enterprise-active-alerts',
        component: () => import('./views/active-alerts.view.vue'),
        meta: {
            title: 'Alertas Activas · Empresa',
            shellPreset: 'enterprise'
        }
      },
      {
        path: 'distribuidor/active-alerts',
        name: 'distributor-active-alerts',
        component: () => import('./views/active-alerts.view.vue'),
        meta: {
            title: 'Alertas Activas · Distribuidor',
            shellPreset: 'distributor'
        }
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
      }
    ]
  }
];
