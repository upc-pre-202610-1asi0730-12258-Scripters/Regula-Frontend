<template>
  <div class="alert-history p-4">
    <h2 class="text-2xl font-bold mb-4">{{ $t('security.alert_history.title') }}</h2>

    <div v-if="securityStore.isLoading" class="flex justify-content-center my-5">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
    </div>

    <div v-else-if="securityStore.error" class="p-error mb-4">
      {{ $t('security.common.error') }}
    </div>

    <div v-else class="card">
      <DataTable
          :value="[...securityStore.alertHistory]"
          paginator
          :rows="10"
          :rowsPerPageOptions="[5, 10, 20, 50]"
          tableStyle="min-width: 50rem"
          v-model:filters="filters"
          filterDisplay="menu"
          :globalFilterFields="['type', 'location', 'criticality']"
          stripedRows
      >
        <template #header>
          <div class="flex justify-content-between">
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText v-model="filters['global'].value" :placeholder="$t('security.alert_history.search_placeholder')" />
            </span>
          </div>
        </template>

        <template #empty> {{ $t('security.alert_history.empty_state') }} </template>

        <Column field="id" :header="$t('security.alert_history.columns.id')" sortable></Column>

        <Column field="type" :header="$t('security.alert_history.columns.type')" sortable></Column>

        <Column field="location" :header="$t('security.alert_history.columns.location')" sortable></Column>

        <Column field="criticality" :header="$t('security.alert_history.columns.criticality')" sortable>
          <template #body="slotProps">
            <Tag :value="slotProps.data.criticality" :severity="getSeverity(slotProps.data.criticality)" />
          </template>
        </Column>

        <Column field="timestamp" :header="$t('security.alert_history.columns.timestamp')" sortable>
          <template #body="slotProps">
            {{ formatDate(slotProps.data.timestamp) }}
          </template>
        </Column>

        <Column field="status" :header="$t('security.alert_history.columns.status')" sortable>
          <template #body="slotProps">
             <span class="text-green-600 font-medium">
               <i class="pi pi-check-circle mr-1"></i>
               {{ slotProps.data.status }}
             </span>
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

const securityStore = useSecurityStore();

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

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
