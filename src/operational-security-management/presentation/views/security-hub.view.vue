<template>
  <div class="security-hub">
    <div class="security-hub__header">
      <h1 class="security-hub__title">{{ $t('security.hub.title') }}</h1>
    </div>

    <div class="security-hub__tabs-container">
      <nav class="security-hub__tabs" aria-label="Navegación de Seguridad">
        <router-link
          v-for="tab in tabs"
          :key="tab.name"
          :to="{ name: tab.routeName }"
          class="security-hub__tab"
          exact-active-class="security-hub__tab--active"
        >
          {{ $t(`security.hub.tabs.${tab.localeKey}`) }}
        </router-link>
      </nav>
    </div>

    <div class="security-hub__content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const getRole = () => {
    try {
        return sessionStorage.getItem('regula_role') === 'distributor' ? 'distributor' : 'enterprise';
    } catch {
        return 'enterprise';
    }
};

const tabs = computed(() => {
    const role = getRole();
    const activeAlertsRoute = role === 'distributor' ? 'distributor-active-alerts' : 'enterprise-active-alerts';

    return [
      { name: 'Alertas Activas', localeKey: 'active_alerts', routeName: activeAlertsRoute },
      { name: 'Historial de Alertas', localeKey: 'alert_history', routeName: 'alert-history' },
      { name: 'Estado del Sensor', localeKey: 'sensor_status', routeName: 'sensor-status' },
      { name: 'Desvíos de Ruta', localeKey: 'route_deviations', routeName: 'route-deviations' },
      { name: 'Análisis por Zona', localeKey: 'zone_analysis', routeName: 'zone-analysis' }
    ];
});
</script>

<style scoped>
.security-hub {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 1.5rem;
}

.security-hub__header {
  display: flex;
  align-items: center;
  padding-bottom: 0.5rem;
}

.security-hub__title {
  font-family: var(--font-primary, 'Inter', sans-serif);
  color: var(--text-primary, #172D40);
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
}

.security-hub__tabs-container {
  border-bottom: 1px solid var(--border-light, #E8ECF0);
  width: 100%;
  overflow-x: auto;
}

.security-hub__tabs {
  display: flex;
  gap: 2rem;
}

.security-hub__tab {
  text-decoration: none;
  font-family: var(--font-primary, 'Inter', sans-serif);
  color: var(--gray-500, #6B7280);
  font-size: 0.95rem;
  font-weight: 500;
  padding: 0.75rem 0;
  border-bottom: 2px solid transparent;
  transition: color 0.2s ease, border-color 0.2s ease;
  white-space: nowrap;
}

.security-hub__tab:hover {
  color: var(--gray-700, #374151);
}

.security-hub__tab--active {
  color: var(--brand-orange-primary, #F26E22);
  border-bottom-color: var(--brand-orange-primary, #F26E22);
  font-weight: 600;
}

.security-hub__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>