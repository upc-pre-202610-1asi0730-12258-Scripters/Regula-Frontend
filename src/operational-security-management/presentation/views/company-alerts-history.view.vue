
<template>
  <div class="company-alerts p-4">

    <!-- Header -->
    <div class="mb-4">
      <h2 class="text-2xl font-bold m-0">
        {{ $t('security.company_alerts.title') }}
      </h2>
    </div>

    <!-- Filters -->
    <Card class="filters-card mb-4">

      <template #content>

        <div class="grid align-items-end">

          <!-- Status -->
          <div class="col-12 md:col-2">
            <label class="filter-label">
              {{ $t('security.company_alerts.filters.status') }}
            </label>

            <Dropdown
                v-model="selectedStatus"
                :options="statusOptions"
                optionLabel="label"
                optionValue="value"
                class="w-full"
            />
          </div>

          <!-- Type -->
          <div class="col-12 md:col-2">
            <label class="filter-label">
              {{ $t('security.company_alerts.filters.type') }}
            </label>

            <Dropdown
                v-model="selectedType"
                :options="typeOptions"
                optionLabel="label"
                optionValue="value"
                class="w-full"
            />
          </div>

          <!-- From -->
          <div class="col-12 md:col-2">
            <label class="filter-label">
              {{ $t('security.company_alerts.filters.from') }}
            </label>

            <Calendar
                v-model="fromDate"
                dateFormat="dd/mm/yy"
                showIcon
                class="w-full"
            />
          </div>

          <!-- To -->
          <div class="col-12 md:col-2">
            <label class="filter-label">
              {{ $t('security.company_alerts.filters.to') }}
            </label>

            <Calendar
                v-model="toDate"
                dateFormat="dd/mm/yy"
                showIcon
                class="w-full"
            />
          </div>

          <!-- Search -->
          <div class="col-12 md:col-2">
            <Button
                icon="pi pi-search"
                :label="$t('security.company_alerts.search')"
                severity="warning"
                class="search-button w-full"
            />
          </div>

        </div>

      </template>

    </Card>

    <!-- Table Header -->
    <div class="flex justify-content-between align-items-center mb-3">

      <small class="text-color-secondary">
        {{ $t('security.company_alerts.showing') }}
        {{ filteredAlerts.length }}
        {{ $t('security.company_alerts.of') }}
        {{ companyAlertsData.length }}
        {{ $t('security.company_alerts.alerts') }}
      </small>

      <Button
          icon="pi pi-download"
          :label="$t('security.company_alerts.export')"
          severity="secondary"
          outlined
          size="small"
      />

    </div>

    <!-- Loading -->
    <div
        v-if="securityStore.isLoading"
        class="flex justify-content-center my-6"
    >
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
    </div>

    <!-- Error -->
    <Message
        v-else-if="securityStore.error"
        severity="error"
        :closable="false"
    >
      {{ securityStore.error }}
    </Message>

    <!-- Table -->
    <Card v-else class="table-card">

      <template #content>

        <DataTable
            :value="filteredAlerts"
            paginator
            :rows="3"
            stripedRows
            responsiveLayout="scroll"
            paginatorPosition="bottom"
            tableStyle="min-width: 85rem"
        >

          <!-- ID -->
          <Column
              field="id"
              :header="$t('security.company_alerts.columns.id')"
          >
            <template #body="slotProps">

              <span class="font-semibold">
                {{ slotProps.data.id }}
              </span>

            </template>
          </Column>

          <!-- Zone -->
          <Column
              field="zone"
              :header="$t('security.company_alerts.columns.zone')"
          >
            <template #body="slotProps">

              <div class="flex align-items-center gap-2">

                <i class="pi pi-map-marker table-icon"></i>

                <span>
                  {{ slotProps.data.zone }}
                </span>

              </div>

            </template>
          </Column>

          <!-- Type -->
          <Column
              field="type"
              :header="$t('security.company_alerts.columns.type')"
          >
            <template #body="slotProps">

              <div class="flex align-items-center gap-2">

                <i
                    class="pi"
                    :class="getTypeIcon(slotProps.data.type)"
                ></i>

                <span>
                  {{ slotProps.data.type }}
                </span>

              </div>

            </template>
          </Column>

          <!-- Criticality -->
          <Column
              field="criticality"
              :header="$t('security.company_alerts.columns.criticality')"
          >
            <template #body="slotProps">

              <Tag
                  :value="slotProps.data.criticality"
                  :severity="getCriticalitySeverity(slotProps.data.criticality)"
                  rounded
              />

            </template>
          </Column>

          <!-- Date -->
          <Column
              field="dateTime"
              :header="$t('security.company_alerts.columns.datetime')"
          >
            <template #body="slotProps">

              <div class="flex align-items-center gap-2">

                <i class="pi pi-clock table-icon"></i>

                <span>
                  {{ slotProps.data.dateTime }}
                </span>

              </div>

            </template>
          </Column>

          <!-- Status -->
          <Column
              field="status"
              :header="$t('security.company_alerts.columns.status')"
          >
            <template #body="slotProps">

              <Tag
                  :value="slotProps.data.status"
                  :severity="getStatusSeverity(slotProps.data.status)"
                  rounded
              />

            </template>
          </Column>

          <!-- Operator -->
          <Column
              field="operator"
              :header="$t('security.company_alerts.columns.operator')"
          >
            <template #body="slotProps">

              <div class="flex align-items-center gap-2">

                <span>
                  {{ slotProps.data.operator ?? '--' }}
                </span>

              </div>

            </template>
          </Column>

          <!-- Attention Time -->
          <Column
              field="attentionTime"
              :header="$t('security.company_alerts.columns.attention_time')"
          >
            <template #body="slotProps">

              <div class="flex align-items-center gap-2">

                <i class="pi pi-clock table-icon"></i>

                <span>
                  {{ slotProps.data.attentionTime }}
                </span>

              </div>

            </template>
          </Column>

          <!-- Actions -->
          <Column
              :header="$t('security.company_alerts.columns.actions')"
          >

            <template #body="slotProps">

              <div class="flex gap-2">

                <!-- Attend -->
                <Button
                    v-if="slotProps.data.hasAttendAction"
                    icon="pi pi-check"
                    :label="$t('security.company_alerts.attend')"
                    severity="warning"
                    class="action-button"
                />

                <!-- View -->
                <Button
                    v-if="slotProps.data.hasViewAction"
                    icon="pi pi-eye"
                    :label="$t('security.company_alerts.view')"
                    severity="secondary"
                    outlined
                    class="action-button"
                />

              </div>

            </template>

          </Column>

        </DataTable>

      </template>

    </Card>

  </div>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue';

import {useSecurityStore} from '../../application/security.store.js';

import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Message from 'primevue/message';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';

const securityStore = useSecurityStore();

const selectedStatus = ref(null);
const selectedType = ref(null);

const fromDate = ref(null);
const toDate = ref(null);

onMounted(() => {
  securityStore.fetchCompanyAlerts();
});

const companyAlertsData = computed(() =>
    securityStore.companyAlerts.map((alert) => ({
      ...alert,
    }))
);

const filteredAlerts = computed(() => {

  return companyAlertsData.value.filter((alert) => {

    const statusMatch =
        !selectedStatus.value ||
        alert.status === selectedStatus.value;

    const typeMatch =
        !selectedType.value ||
        alert.type === selectedType.value;

    return statusMatch && typeMatch;
  });
});

const statusOptions = [
  {
    label: 'Todas',
    value: null
  },
  {
    label: 'Pendiente',
    value: 'PENDIENTE'
  },
  {
    label: 'Atendida',
    value: 'ATENDIDA'
  },
];

const typeOptions = [
  {
    label: 'Todos',
    value: null
  },
  {
    label: 'Fuga',
    value: 'Fuga'
  },
  {
    label: 'Presión',
    value: 'Presión'
  },
];

const getCriticalitySeverity = (criticality) => {

  if (!criticality) return 'secondary';

  const crit = criticality.toLowerCase();

  if (crit.includes('alta')) return 'danger';

  if (crit.includes('media')) return 'warning';

  if (crit.includes('baja')) return 'success';

  return 'info';
};

const getStatusSeverity = (status) => {

  if (!status) return 'secondary';

  const st = status.toLowerCase();

  if (st.includes('pendiente')) return 'warning';

  if (st.includes('atendida')) return 'success';

  return 'info';
};

const getTypeIcon = (type) => {

  if (!type) return 'pi-info-circle';

  const t = type.toLowerCase();

  if (t.includes('fuga')) {
    return 'pi-exclamation-triangle text-red-500';
  }

  if (t.includes('presión')) {
    return 'pi-bolt text-yellow-500';
  }

  return 'pi-info-circle';
};
</script>

<style scoped>
.company-alerts {
  width: 100%;
}

.filters-card {
  border-radius: 16px;
}

.table-card {
  border-radius: 18px;
  overflow: hidden;
}

.filter-label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #94a3b8;
}

.search-button {
  height: 42px;
}

.action-button {
  height: 42px;
}

.table-icon {
  color: #94a3b8;
}
</style>

