<script setup>
import useInventoryStore from '@/inventory-management/application/inventory.store.js'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import InputText from 'primevue/inputtext'
import ProgressSpinner from 'primevue/progressspinner'
import Select from 'primevue/select'
import { storeToRefs } from 'pinia'
import { computed, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useInventoryStore()
const { enterpriseMovements, enterpriseMovementsLoaded } = storeToRefs(store)

const keyword = ref('')
const form = reactive({
  movementType: '',
  cylinderKey: '',
  dateFrom: '',
  dateTo: '',
  destination: '',
  profileId: '',
})
const applied = reactive({ ...form })

onMounted(() => {
  store.fetchEnterpriseMovements()
})

const movementTypeOptions = computed(() => [
  { label: t('inventory.history.filters.all'), value: '' },
  { label: t('inventory.history.filters.entry'), value: 'Entry' },
  { label: t('inventory.history.filters.exit'), value: 'Exit' },
])

const cylinderOptions = computed(() => [
  { label: t('inventory.history.filters.all'), value: '' },
  ...store.cylinderTypeCatalog.map((item) => ({
    label: item.cylinderType,
    value: item.key,
  })),
])

const profileOptions = computed(() => {
  const ids = [...new Set(enterpriseMovements.value.map((r) => String(r.profileId)).filter(Boolean))].sort()
  return [
    { label: t('inventory.history.filters.all'), value: '' },
    ...ids.map((id) => ({ label: id, value: id })),
  ]
})

function formatDateTime(iso) {
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString()
}

function originOrDestination(row) {
  return row.movementType === 'Entry' ? row.providerName : row.destination
}

function signedQty(row) {
  return row.movementType === 'Entry' ? row.quantity : -row.quantity
}

function applySearch() {
  Object.assign(applied, form)
  applied.destination = form.destination.trim()
}

const filteredRows = computed(() =>
    enterpriseMovements.value.filter((row) => {
      if (applied.movementType && row.movementType !== applied.movementType) {
        return false
      }
      if (applied.cylinderKey && store.getCylinderKey(row.cylinderType) !== applied.cylinderKey) {
        return false
      }
      if (applied.profileId && String(row.profileId) !== applied.profileId) {
        return false
      }
      if (applied.destination && !`${originOrDestination(row)}`.toLowerCase().includes(applied.destination.toLowerCase())) {
        return false
      }
      const tMs = new Date(row.timestamp).getTime()
      if (applied.dateFrom && tMs < new Date(`${applied.dateFrom}T00:00:00`).getTime()) {
        return false
      }
      if (applied.dateTo && tMs > new Date(`${applied.dateTo}T23:59:59.999`).getTime()) {
        return false
      }
      if (!keyword.value.trim()) {
        return true
      }
      const q = keyword.value.toLowerCase()
      return [
        row.id,
        formatDateTime(row.timestamp),
        row.movementType,
        row.cylinderType,
        row.movementReason,
        row.profileId,
        row.observation,
      ]
          .join(' ')
          .toLowerCase()
          .includes(q)
    }),
)
</script>

<template>
  <div class="inv-page">
    <div>
      <h1 class="inv-title">{{ t('inventory.history.enterprise.title') }}</h1>
      <p class="inv-subtitle">{{ t('inventory.history.enterprise.subtitle') }}</p>
    </div>

    <Card>
      <template #title>{{ t('inventory.history.filtersTitle') }}</template>
      <template #content>
        <div class="inv-filters">
          <div class="inv-field">
            <span class="inv-label">{{ t('inventory.history.filters.type') }}</span>
            <Select v-model="form.movementType" :options="movementTypeOptions" option-label="label" option-value="value" />
          </div>
          <div class="inv-field">
            <span class="inv-label">{{ t('inventory.history.filters.cylinderType') }}</span>
            <Select v-model="form.cylinderKey" :options="cylinderOptions" option-label="label" option-value="value" />
          </div>
          <div class="inv-field">
            <span class="inv-label">{{ t('inventory.history.filters.from') }}</span>
            <input v-model="form.dateFrom" type="date" />
          </div>
          <div class="inv-field">
            <span class="inv-label">{{ t('inventory.history.filters.to') }}</span>
            <input v-model="form.dateTo" type="date" />
          </div>
          <div class="inv-field">
            <span class="inv-label">{{ t('inventory.history.enterprise.destinationOrigin') }}</span>
            <InputText v-model="form.destination" />
          </div>
          <div class="inv-field">
            <span class="inv-label">{{ t('inventory.history.filters.user') }}</span>
            <Select v-model="form.profileId" :options="profileOptions" option-label="label" option-value="value" />
          </div>
          <Button :label="t('inventory.history.search')" icon="pi pi-search" type="button" @click="applySearch" />
        </div>
      </template>
    </Card>

    <Card>
      <template #title>
        <div class="inv-filters">
          <span>{{ t('inventory.history.recordsFound', { n: filteredRows.length }) }}</span>
          <InputText v-model="keyword" :placeholder="t('inventory.history.keywordPh')" />
        </div>
      </template>
      <template #content>
        <div v-if="!enterpriseMovementsLoaded" class="inv-loading">
          <ProgressSpinner stroke-width="4" style="width: 42px; height: 42px" />
          <span>{{ t('inventory.history.loadingMovements') }}</span>
        </div>
        <DataTable
            v-else
            :value="filteredRows"
            data-key="id"
            class="inv-table"
            show-gridlines
            paginator
            :rows="25"
        >
          <Column :header="t('inventory.history.cols.id')" field="id" />
          <Column :header="t('inventory.history.cols.datetime')">
            <template #body="{ data }">{{ formatDateTime(data.timestamp) }}</template>
          </Column>
          <Column :header="t('inventory.history.cols.kind')">
            <template #body="{ data }">
              <span :class="data.movementType === 'Entry' ? 'inv-badge--in' : 'inv-badge--out'">
                {{ store.getMovementTypeLabel(data.movementType) }}
              </span>
            </template>
          </Column>
          <Column :header="t('inventory.history.cols.cylinder')">
            <template #body="{ data }">{{ store.getCylinderLabel(data.cylinderType) }}</template>
          </Column>
          <Column :header="t('inventory.history.cols.qty')">
            <template #body="{ data }">{{ signedQty(data) }}</template>
          </Column>
          <Column :header="t('inventory.history.cols.originDest')">
            <template #body="{ data }">{{ originOrDestination(data) }}</template>
          </Column>
          <Column :header="t('inventory.history.cols.reason')" field="movementReason" />
          <Column :header="t('inventory.history.cols.user')" field="profileId" />
          <Column :header="t('inventory.history.cols.notes')" field="observation" />
        </DataTable>
      </template>
    </Card>
  </div>
</template>
