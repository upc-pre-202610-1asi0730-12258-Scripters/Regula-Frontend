<script setup lang="ts">
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import Tag from 'primevue/tag'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const driverOptions = [
  { label: 'Carlos Ríos Vega', value: 'carlos' },
  { label: 'Miguel Torres', value: 'miguel' },
]
const plateOptions = [
  { label: 'XYZ-456', value: 'XYZ-456' },
  { label: 'ABC-123', value: 'ABC-123' },
]
const statusOptions = [
  { label: t('distributionEnterprise.common.allStatuses'), value: 'all' },
  { label: t('distributionEnterprise.common.completed'), value: 'completed' },
  { label: t('distributionEnterprise.common.pending'), value: 'pending' },
  { label: t('distributionEnterprise.supervision.deviation'), value: 'deviation' },
]

const selectedDriver = ref(driverOptions[0]?.value)
const selectedPlate = ref(plateOptions[0]?.value)
const selectedStatus = ref('all')
const query = ref('')

type Row = {
  id: string
  date: string
  responsible: string
  vehicle: string
  zone: string
  load: string
  status: 'completed' | 'pending' | 'deviation'
  eta: string
  real: string
}

const rows = computed<Row[]>(() => [
  { id: '#0120', date: '22/06/2025', responsible: 'Carlos Ríos Vega', vehicle: 'XYZ-456', zone: 'Zona Norte', load: '1,240 kg', status: 'completed', eta: '15:30', real: '15:27' },
  { id: '#0119', date: '22/06/2025', responsible: 'Miguel Torres', vehicle: 'ABC-123', zone: 'Centro Histórico', load: '980 kg', status: 'deviation', eta: '14:00', real: '14:38' },
  { id: '#0118', date: '21/06/2025', responsible: 'Lucía Mamani Quispe', vehicle: 'LHN-789', zone: 'Zona Sur', load: '2,100 kg', status: 'completed', eta: '11:00', real: '10:54' },
  { id: '#0117', date: '21/06/2025', responsible: 'Jorge Paredes Llano', vehicle: 'PQR-001', zone: 'Miraflores', load: '640 kg', status: 'pending', eta: '16:45', real: '—' },
])

function statusSeverity(s: Row['status']) {
  if (s === 'completed') return 'success'
  if (s === 'deviation') return 'danger'
  return 'warn'
}

function statusLabel(s: Row['status']) {
  if (s === 'completed') return t('distributionEnterprise.common.completed')
  if (s === 'deviation') return t('distributionEnterprise.supervision.deviation')
  return t('distributionEnterprise.common.pending')
}
</script>

<template>
  <div class="page">
    <div class="toolbar">
      <div class="toolbar__filters">
        <Dropdown :options="driverOptions" option-label="label" option-value="value" v-model="selectedDriver" />
        <Dropdown :options="plateOptions" option-label="label" option-value="value" v-model="selectedPlate" />
        <Dropdown :options="statusOptions" option-label="label" option-value="value" v-model="selectedStatus" />
        <div class="toolbar__search">
          <i class="pi pi-search" aria-hidden="true" />
          <InputText v-model="query" :placeholder="t('distributionEnterprise.history.searchPlaceholder')" />
        </div>
        <Button severity="secondary" outlined>
          <i class="pi pi-search" aria-hidden="true" />
          <span>{{ t('distributionEnterprise.history.search') }}</span>
        </Button>
        <Button severity="secondary" outlined>
          <i class="pi pi-filter-slash" aria-hidden="true" />
          <span>{{ t('distributionEnterprise.history.clear') }}</span>
        </Button>
      </div>
      <Button>
        <i class="pi pi-download" aria-hidden="true" />
        <span>{{ t('distributionEnterprise.history.export') }}</span>
      </Button>
    </div>

    <div class="stats">
      <div class="stat">
        <div class="stat__label">{{ t('distributionEnterprise.history.total') }}</div>
        <div class="stat__value">120</div>
      </div>
      <div class="stat">
        <div class="stat__label">{{ t('distributionEnterprise.common.completed') }}</div>
        <div class="stat__value">98</div>
      </div>
      <div class="stat">
        <div class="stat__label">{{ t('distributionEnterprise.common.pending') }}</div>
        <div class="stat__value">14</div>
      </div>
      <div class="stat">
        <div class="stat__label">{{ t('distributionEnterprise.supervision.deviation') }}</div>
        <div class="stat__value">8</div>
      </div>
      <div class="stat">
        <div class="stat__label">{{ t('distributionEnterprise.history.avgEta') }}</div>
        <div class="stat__value">2h 18m</div>
      </div>
    </div>

    <DataTable :value="rows" data-key="id" class="table">
      <Column field="id" header="ID" />
      <Column field="date" :header="t('distributionEnterprise.history.date')" />
      <Column field="responsible" :header="t('distributionEnterprise.history.responsible')" />
      <Column field="vehicle" :header="t('distributionEnterprise.history.vehicle')" />
      <Column field="zone" :header="t('distributionEnterprise.history.zone')" />
      <Column field="load" :header="t('distributionEnterprise.history.load')" />
      <Column :header="t('distributionEnterprise.history.status')">
        <template #body="{ data }">
          <Tag :severity="statusSeverity(data.status)" rounded>{{ statusLabel(data.status) }}</Tag>
        </template>
      </Column>
      <Column field="eta" header="ETA" />
      <Column field="real" :header="t('distributionEnterprise.history.realTime')" />
    </DataTable>

    <div class="footer">
      <span>{{ t('distributionEnterprise.history.showing', { a: 1, b: 10, total: 120 }) }}</span>
      <div class="footer__pager">
        <Button severity="secondary" text icon="pi pi-chevron-left" />
        <Button severity="secondary" text label="1" />
        <Button severity="secondary" text label="2" />
        <Button severity="secondary" text label="3" />
        <span class="dots">…</span>
        <Button severity="secondary" text label="12" />
        <Button severity="secondary" text icon="pi pi-chevron-right" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.toolbar__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  flex: 1 1 auto;
}

.toolbar__search {
  position: relative;
  min-width: 14rem;
  flex: 1 1 14rem;
}

.toolbar__search .pi {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--regula-app-text-muted);
}

.toolbar__search :deep(.p-inputtext) {
  width: 100%;
  padding-left: 2.25rem;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  gap: 0.75rem;
}

.stat {
  background: var(--regula-app-card);
  border: 1px solid var(--regula-color-border-soft);
  border-radius: 0.75rem;
  padding: 0.9rem;
  box-shadow: var(--regula-shadow-card);
}

.stat__label {
  font-size: 0.75rem;
  color: var(--regula-app-text-muted);
  font-weight: 800;
}

.stat__value {
  margin-top: 0.25rem;
  font-size: 1.25rem;
  font-weight: 900;
  color: var(--regula-color-primary);
}

.table {
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: var(--regula-shadow-card);
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  color: var(--regula-app-text-muted);
  font-size: 0.85rem;
}

.footer__pager {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.dots {
  padding: 0 0.4rem;
}
</style>

