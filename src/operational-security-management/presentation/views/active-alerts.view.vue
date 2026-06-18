<template>
  <div class="active-alerts p-4">
    <h2 class="text-2xl font-bold mb-4">{{ $t('security.active_alerts.title') }}</h2>

    <div v-if="securityStore.isLoading" class="flex justify-content-center my-5">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
    </div>

    <div v-else-if="securityStore.error" class="p-error mb-4">
      {{ $t('security.common.error') }}
    </div>

    <div v-else class="grid">
      <div v-for="alert in securityStore.activeAlerts" :key="alert.id" class="col-12 md:col-6 lg:col-4">
        <Card class="h-full">
          <template #title>
            <div class="flex align-items-center justify-content-between">
              <span class="text-xl">{{ alert.type }}</span>
              <Tag :value="alert.criticality" :severity="getSeverity(alert.criticality)" />
            </div>
          </template>
          <template #content>
            <div class="flex flex-column gap-2 mt-2">
              <div>
                <i class="pi pi-map-marker mr-2"></i>
                <span class="font-medium">{{ $t('security.active_alerts.card.location') }}:</span> {{ alert.location }}
              </div>
              <div>
                <i class="pi pi-clock mr-2"></i>
                <span class="font-medium">{{ $t('security.active_alerts.card.timestamp') }}:</span> {{ formatDate(alert.timestamp) }}
              </div>
              <div>
                <i class="pi pi-info-circle mr-2"></i>
                <span class="font-medium">{{ $t('security.active_alerts.card.status') }}:</span> {{ alert.status }}
              </div>
            </div>
          </template>
          <template #footer>
            <div class="flex justify-content-end mt-3">
              <Button :label="$t('security.active_alerts.card.resolve_button')" icon="pi pi-check-circle" severity="success" outlined class="w-full" />
            </div>
          </template>
        </Card>
      </div>

      <div v-if="securityStore.activeAlerts.length === 0" class="col-12">
        <div class="flex flex-column align-items-center justify-content-center p-5 surface-100 border-round">
          <i class="pi pi-check-circle text-green-500 mb-3" style="font-size: 3rem"></i>
          <p class="text-xl text-500">{{ $t('security.active_alerts.empty_state') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useSecurityStore } from '../../application/security.store.js';
import Card from 'primevue/card';
import Tag from 'primevue/tag';
import Button from 'primevue/button';

const securityStore = useSecurityStore();

onMounted(() => {
  securityStore.fetchAlerts();
});

const getSeverity = (criticality) => {
  if (!criticality) return 'primary';
  const crit = criticality.toLowerCase();
  if (crit.includes('alta') || crit.includes('high')) return 'danger';
  if (crit.includes('media') || crit.includes('medium')) return 'warning';
  if (crit.includes('baja') || crit.includes('low')) return 'info';
  return 'primary';
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString();

};
</script>
