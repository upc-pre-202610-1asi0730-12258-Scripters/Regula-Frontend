<template>
  <div class="route-deviations">
    <!-- 1. Banner Informativo -->
    <div class="info-banner">
      <i class="pi pi-info-circle info-icon"></i>
      <!-- Usamos i18n-t para interpolar HTML dentro de la traducción -->
      <p class="info-text">
        <i18n-t keypath="security.route_deviations.banner" tag="span">
          <template #distance>
            <span class="mono-bold text-blue">500 m</span>
          </template>
          <template #time>
            <span class="mono-bold text-blue">3 minutos</span>
          </template>
        </i18n-t>
      </p>
    </div>

    <!-- 2. Filtros y Resumen -->
    <div class="header-actions">
      <div class="search-bar">
        <span class="p-input-icon-left w-full">
          <i class="pi pi-search" />
          <InputText v-model="filters['global'].value" :placeholder="$t('security.route_deviations.search_placeholder')" class="w-full" />
        </span>
      </div>
      
      <div class="summary-pills">
        <div class="pill">
          <span class="circle circle-gray"></span>
          <span class="pill-label">{{ $t('security.route_deviations.pills.total') }}: {{ securityStore.totalDeviations }}</span>
        </div>
        <div class="pill">
          <span class="circle circle-orange"></span>
          <span class="pill-label">{{ $t('security.route_deviations.pills.pending') }}: {{ securityStore.pendingDeviations }}</span>
        </div>
        <div class="pill">
          <span class="circle circle-green"></span>
          <span class="pill-label">{{ $t('security.route_deviations.pills.attended') }}: {{ securityStore.attendedDeviations }}</span>
        </div>
      </div>
    </div>

    <!-- 3. DataTable -->
    <div class="card-panel table-container">
      <DataTable
        :value="securityStore.routeDeviations"
        paginator
        :rows="10"
        v-model:filters="filters"
        filterDisplay="menu"
        :globalFilterFields="['unit', 'location']"
        stripedRows
        :loading="securityStore.isLoading"
        class="custom-table"
      >
        <template #empty> {{ $t('security.alert_history.empty_state') }} </template>

        <Column field="id" :header="$t('security.route_deviations.columns.id')" :sortable="true"></Column>
        <Column field="unit" :header="$t('security.route_deviations.columns.unit')" :sortable="true"></Column>
        <Column field="location" :header="$t('security.route_deviations.columns.location')" :sortable="true"></Column>
        
        <Column field="distance" :header="$t('security.route_deviations.columns.distance')" :sortable="true">
          <template #body="slotProps">
            <span class="mono-text">{{ slotProps.data.distance }} m</span>
          </template>
        </Column>
        
        <Column field="time" :header="$t('security.route_deviations.columns.time')" :sortable="true">
          <template #body="slotProps">
            <span class="mono-text">{{ slotProps.data.time }}</span>
          </template>
        </Column>

        <Column field="status" :header="$t('security.route_deviations.columns.status')" :sortable="true">
          <template #body="slotProps">
            <Tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" />
          </template>
        </Column>

        <Column :header="$t('security.route_deviations.columns.action')">
          <template #body="slotProps">
             <Button 
               :label="slotProps.data.status === 'Pendiente' ? $t('security.route_deviations.actions.review') : $t('security.route_deviations.actions.details')" 
               :icon="slotProps.data.status === 'Pendiente' ? 'pi pi-exclamation-triangle' : 'pi pi-eye'"
               :severity="slotProps.data.status === 'Pendiente' ? 'warn' : 'secondary'"
               size="small"
               outlined
             />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useSecurityStore } from '../../application/security.store.js';
import { FilterMatchMode } from '@primevue/core/api';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Tag from 'primevue/tag';
import Button from 'primevue/button';

const securityStore = useSecurityStore();

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

onMounted(() => {
  securityStore.fetchRouteDeviations();
});

const getStatusSeverity = (status) => {
  if (status === 'Pendiente') return 'warn';
  if (status === 'Atendida') return 'success';
  return 'info';
};
</script>

<style scoped>
.route-deviations {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* 1. Banner Informativo */
.info-banner {
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: var(--status-info-bg, #DBEAFE);
  border-radius: var(--radius-md, 8px);
  padding: 1rem 1.5rem;
}

.info-icon {
  color: var(--status-info-text, #1D4ED8);
  font-size: 1.5rem;
}

.info-text {
  color: var(--text-primary, #172D40);
  margin: 0;
  font-size: 0.95rem;
}

.mono-bold {
  font-family: var(--font-mono, 'JetBrains Mono', monospace, sans-serif);
  font-weight: 700;
}

.text-blue {
  color: var(--status-info-text, #1D4ED8);
}

/* 2. Filtros y Resumen */
.header-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.search-bar {
  flex: 1;
  min-width: 250px;
  max-width: 400px;
}

.summary-pills {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.pill {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #FFFFFF;
  border: 1px solid var(--border-light, #E8ECF0);
  border-radius: var(--radius-pill, 9999px);
  padding: 0.5rem 1rem;
  box-shadow: var(--shadow-sm, 0px 1px 2px rgba(0,0,0,0.05));
}

.circle {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.circle-gray { background-color: var(--gray-400, #9CA3AF); }
.circle-orange { background-color: var(--brand-orange-alert, #F25922); }
.circle-green { background-color: var(--status-ok-text, #15803D); }

.pill-label {
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--gray-700, #374151);
}

/* 3. Estilos de Tabla y Fuentes */
.table-container {
  overflow: hidden;
  background: #FFFFFF;
  border: 1px solid var(--border-light, #E8ECF0);
  border-radius: var(--radius-lg, 12px);
  box-shadow: var(--shadow-md, 0px 4px 6px -1px rgba(0, 0, 0, 0.05));
}

.mono-text {
  font-family: var(--font-mono, 'JetBrains Mono', monospace, sans-serif);
  color: var(--gray-800, #1F2937);
  font-weight: 500;
}
</style>
