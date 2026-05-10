<script setup>
import { useInventoryStore } from '@/inventory-management/application/inventory.store.js'
import { downloadCsv, printHtmlDocument } from '@/inventory-management/infrastructure/csv-download.helper.js'
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
const { distributorMovements, distributorMovementsLoaded } = storeToRefs(store)

const keyword = ref('')

const defaults = () => ({
  tipo: '',
  tipoBalon: '',
  dateFrom: '2024-06-01',
  dateTo: '2024-06-30',
  responsable: '',
  buscar: '',
})

const form = reactive(defaults())

const applied = reactive(defaults())

function syncApplied() {
  Object.assign(applied, form)
}

onMounted(() => {
  syncApplied()
  store.fetchDistributorMovements()
})

const tipoOptions = computed(() => [
  { label: t('inventory.history.filters.all'), value: '' },
  { label: t('inventory.history.filters.entry'), value: 'Entrada' },
  { label: t('inventory.history.filters.exit'), value: 'Salida' },
])

const balonDistOptions = computed(() => [
  { label: t('inventory.history.filters.all'), value: '' },
  { label: '5 kg', value: '5 kg' },
  { label: '10 kg', value: '10 kg' },
  { label: '15 kg', value: '15 kg' },
  { label: '45 kg', value: '45 kg' },
])

const responsableOptions = computed(() => {
  const set = new Set()
  for (const row of distributorMovements.value) {
    if (row.responsableNombre) {
      set.add(row.responsableNombre)
    }
  }
  const opts = [{ label: t('inventory.history.filters.all'), value: '' }]
  for (const name of [...set].sort()) {
    opts.push({ label: name, value: name })
  }
  return opts
})

function formatDateTime(iso) {
  const d = new Date(iso)
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}

function signedQty(row) {
  return row.cantidad * (row.cantidadSign ?? (row.tipo === 'Entrada' ? 1 : -1))
}

function rowMatchesApplied(row) {
  if (applied.tipo && row.tipo !== applied.tipo) {
    return false
  }
  if (applied.tipoBalon && row.tipoBalonLabel !== applied.tipoBalon) {
    return false
  }
  const tMs = new Date(row.timestamp).getTime()
  if (applied.dateFrom) {
    const from = new Date(`${applied.dateFrom}T00:00:00`).getTime()
    if (tMs < from) {
      return false
    }
  }
  if (applied.dateTo) {
    const to = new Date(`${applied.dateTo}T23:59:59.999`).getTime()
    if (tMs > to) {
      return false
    }
  }
  if (applied.responsable && row.responsableNombre !== applied.responsable) {
    return false
  }
  if (applied.buscar.trim()) {
    const q = applied.buscar.toLowerCase()
    const blob = [
      row.id,
      formatDateTime(row.timestamp),
      row.tipo,
      row.tipoBalonLabel,
      row.proveedorTipoSalida,
      row.responsableNombre,
    ]
        .join(' ')
        .toLowerCase()
    if (!blob.includes(q)) {
      return false
    }
  }
  return true
}

function rowMatchesKeyword(row) {
  if (!keyword.value.trim()) {
    return true
  }
  const q = keyword.value.toLowerCase()
  const blob = [
    row.id,
    formatDateTime(row.timestamp),
    row.tipo,
    row.tipoBalonLabel,
    String(signedQty(row)),
    row.proveedorTipoSalida,
    row.responsableNombre,
  ]
      .join(' ')
      .toLowerCase()
  return blob.includes(q)
}

const filteredRows = computed(() =>
    distributorMovements.value.filter((r) => rowMatchesApplied(r)).filter((r) => rowMatchesKeyword(r)),
)

function applySearch() {
  syncApplied()
}

function clearFilters() {
  Object.assign(form, defaults())
  syncApplied()
}

function exportExcel() {
  const cols = [
    { header: 'ID', value: (r) => `#${r.id}` },
    { header: 'FECHA Y HORA', value: (r) => formatDateTime(r.timestamp) },
    { header: 'TIPO', value: (r) => r.tipo },
    { header: 'TIPO BALÓN', value: (r) => r.tipoBalonLabel },
    { header: 'CANTIDAD', value: (r) => signedQty(r) },
    { header: 'PROVEEDOR / TIPO SALIDA', value: (r) => r.proveedorTipoSalida },
    { header: 'RESPONSABLE', value: (r) => r.responsableNombre },
  ]
  const stamp = new Date().toISOString().slice(0, 10)
  downloadCsv(`historial-movimientos-distribuidor-${stamp}.csv`, cols, filteredRows.value)
}

function printTable() {
  const rows = filteredRows.value
      .map(
          (r) =>
              `<tr><td>#${r.id}</td><td>${formatDateTime(r.timestamp)}</td><td>${r.tipo}</td><td>${r.tipoBalonLabel}</td><td>${signedQty(r)}</td><td>${escapeHtml(r.proveedorTipoSalida)}</td><td>${escapeHtml(r.responsableNombre)}</td></tr>`,
      )
      .join('')
  const html = `<table><thead><tr>
    <th>ID</th><th>FECHA Y HORA</th><th>TIPO</th><th>TIPO BALÓN</th><th>CANTIDAD</th><th>PROVEEDOR / TIPO SALIDA</th><th>RESPONSABLE</th>
  </tr></thead><tbody>${rows}</tbody></table>`
  printHtmlDocument(t('inventory.history.distributor.title'), html)
}

function escapeHtml(s) {
  return String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
}
</script>

<template>
  <div class="dmh">
    <div class="dmh__hero">
      <div>
        <h1 class="dmh__title">{{ t('inventory.history.distributor.title') }}</h1>
        <p class="dmh__sub">{{ t('inventory.history.distributor.subtitle') }}</p>
      </div>
    </div>

    <Card class="dmh__card surface-card">
      <template #title>
        <span class="dmh__card-title">{{ t('inventory.history.filtersTitle') }}</span>
      </template>
      <template #content>
        <div class="dmh__filters">
          <label class="dmh__field">
            <span class="dmh__label">{{ t('inventory.history.filters.type') }}</span>
            <Select
                v-model="form.tipo"
                :options="tipoOptions"
                option-label="label"
                option-value="value"
                class="dmh__input"
            />
          </label>
          <label class="dmh__field">
            <span class="dmh__label">{{ t('inventory.history.filters.cylinderType') }}</span>
            <Select
                v-model="form.tipoBalon"
                :options="balonDistOptions"
                option-label="label"
                option-value="value"
                class="dmh__input"
            />
          </label>
          <label class="dmh__field">
            <span class="dmh__label">{{ t('inventory.history.filters.from') }}</span>
            <input v-model="form.dateFrom" class="dmh__date" type="date" />
          </label>
          <label class="dmh__field">
            <span class="dmh__label">{{ t('inventory.history.filters.to') }}</span>
            <input v-model="form.dateTo" class="dmh__date" type="date" />
          </label>
          <label class="dmh__field">
            <span class="dmh__label">{{ t('inventory.history.filters.responsible') }}</span>
            <Select
                v-model="form.responsable"
                :options="responsableOptions"
                option-label="label"
                option-value="value"
                class="dmh__input"
            />
          </label>
          <label class="dmh__field dmh__field--grow">
            <span class="dmh__label">{{ t('inventory.history.filters.search') }}</span>
            <InputText
                v-model="form.buscar"
                class="dmh__input-text"
                :placeholder="t('inventory.history.distributor.searchPh')"
            />
          </label>
          <div class="dmh__field dmh__field--actions">
            <span class="dmh__label dmh__label--ghost">{{ '\u00a0' }}</span>
            <div class="dmh__btns">
              <Button
                  :label="t('inventory.history.search')"
                  icon="pi pi-search"
                  class="dmh__btn-orange"
                  type="button"
                  @click="applySearch"
              />
              <button type="button" class="dmh__clear" @click="clearFilters">
                {{ t('inventory.history.clearFilters') }}
              </button>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <Card class="dmh__card dmh__card--table surface-card">
      <template #title>
        <div class="dmh__table-head">
          <div class="dmh__table-title">
            <span>{{ t('inventory.history.distributor.movementsTitle') }}</span>
            <span class="dmh__badge">{{ filteredRows.length }}</span>
          </div>
          <div class="dmh__table-actions">
            <InputText
                v-model="keyword"
                class="dmh__keyword"
                :placeholder="t('inventory.history.keywordPh')"
            />
            <Button
                :label="t('inventory.history.distributor.exportExcel')"
                icon="pi pi-download"
                outlined
                severity="secondary"
                class="dmh__btn-outline"
                type="button"
                @click="exportExcel"
            />
            <Button
                :label="t('inventory.history.print')"
                icon="pi pi-print"
                class="dmh__btn-orange"
                type="button"
                @click="printTable"
            />
          </div>
        </div>
      </template>
      <template #content>
        <div v-if="!distributorMovementsLoaded" class="dmh__loading">
          <ProgressSpinner stroke-width="4" style="width: 42px; height: 42px" />
          <span>{{ t('inventory.history.loadingMovements') }}</span>
        </div>
        <div v-else class="dmh__table-wrap">
          <DataTable
              :value="filteredRows"
              data-key="id"
              class="dmh-table"
              show-gridlines
              responsive-layout="scroll"
              paginator
              :rows="25"
              :rows-per-page-options="[10, 25, 50]"
              :paginator-template="
              'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown'
            "
              current-page-report-template="{first}–{last} de {totalRecords}"
          >
            <template #empty>
              <span class="dmh__empty">{{ t('inventory.history.noResults') }}</span>
            </template>
            <Column :header="t('inventory.history.cols.idShort')" style="min-width: 90px">
              <template #body="{ data }">
                <span class="dmh__mov-id">#{{ data.id }}</span>
              </template>
            </Column>
            <Column :header="t('inventory.history.cols.datetime')" style="min-width: 150px">
              <template #body="{ data }">
                {{ formatDateTime(data.timestamp) }}
              </template>
            </Column>
            <Column :header="t('inventory.history.cols.kind')" style="min-width: 130px">
              <template #body="{ data }">
                <span
                    class="dmh__tipo"
                    :class="data.tipo === 'Entrada' ? 'dmh__tipo--in' : 'dmh__tipo--out'"
                >
                  <i
                      class="pi"
                      :class="data.tipo === 'Entrada' ? 'pi-arrow-down' : 'pi-arrow-up'"
                      aria-hidden="true"
                  />
                  {{ data.tipo }}
                </span>
              </template>
            </Column>
            <Column :header="t('inventory.history.cols.cylinder')" style="min-width: 90px">
              <template #body="{ data }">
                {{ data.tipoBalonLabel }}
              </template>
            </Column>
            <Column :header="t('inventory.history.cols.qty')" style="min-width: 90px">
              <template #body="{ data }">
                <strong
                    class="dmh__qty"
                    :class="signedQty(data) >= 0 ? 'dmh__qty--pos' : 'dmh__qty--neg'"
                >
                  {{ signedQty(data) >= 0 ? '+' : '' }}{{ signedQty(data) }}
                </strong>
              </template>
            </Column>
            <Column :header="t('inventory.history.distributor.colProvider')" style="min-width: 180px">
              <template #body="{ data }">
                <span class="dmh__prov">
                  <i class="pi pi-truck dmh__prov-icon" aria-hidden="true" />
                  {{ data.proveedorTipoSalida }}
                </span>
              </template>
            </Column>
            <Column :header="t('inventory.history.filters.responsible')" style="min-width: 160px">
              <template #body="{ data }">
                <span class="dmh__resp">
                  {{ data.responsableNombre }}
                  <span v-if="data.responsableIsOwner" class="dmh__owner">{{
                      t('inventory.history.distributor.ownerBadge')
                    }}</span>
                </span>
              </template>
            </Column>
          </DataTable>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.dmh {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.dmh__title {
  margin: 0;
  font-size: var(--regula-type-h2-size);
  font-weight: var(--regula-type-h2-weight);
  color: var(--regula-navy);
}

.dmh__sub {
  margin: 0.35rem 0 0;
  color: var(--regula-text-muted);
  font-size: var(--regula-type-small-size);
}

.dmh__card :deep(.p-card-title) {
  font-size: var(--regula-type-small-size);
  font-weight: 700;
  color: var(--regula-navy);
}

.dmh__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-end;
}

.dmh__field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 140px;
}

.dmh__field--grow {
  flex: 1 1 220px;
  min-width: 200px;
}

.dmh__field--actions {
  min-width: 220px;
}

.dmh__label {
  font-size: var(--regula-type-caption-size);
  font-weight: 700;
  color: var(--regula-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.dmh__label--ghost {
  visibility: hidden;
}

.dmh__input :deep(.p-select),
.dmh__input-text {
  width: 100%;
}

.dmh__date {
  border: 1px solid var(--regula-gray-light);
  border-radius: var(--regula-radius-btn);
  padding: 0.5rem 0.65rem;
  font-family: inherit;
  font-size: var(--regula-type-small-size);
  min-height: 42px;
}

.dmh__btns {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.dmh__btn-orange :deep(.p-button) {
  background: var(--regula-orange);
  border-color: var(--regula-orange);
  border-radius: var(--regula-radius-btn);
  min-height: 44px;
  font-weight: 700;
}

.dmh__btn-orange :deep(.p-button:hover) {
  background: var(--regula-orange-hover);
  border-color: var(--regula-orange-hover);
}

.dmh__clear {
  border: none;
  background: none;
  cursor: pointer;
  font-weight: 600;
  font-size: var(--regula-type-small-size);
  color: var(--regula-orange);
  text-decoration: underline;
  padding: 0.25rem;
}

.dmh__table-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  width: 100%;
}

.dmh__table-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: var(--regula-type-h3-size);
  color: var(--regula-navy);
}

.dmh__badge {
  background: var(--regula-gray-light);
  color: var(--regula-navy);
  font-size: var(--regula-type-caption-size);
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
}

.dmh__table-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.dmh__keyword {
  min-width: 160px;
}

.dmh__btn-outline :deep(.p-button) {
  border-radius: var(--regula-radius-btn);
  min-height: 44px;
  font-weight: 600;
}

.dmh__loading {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  color: var(--regula-text-muted);
}

.dmh__table-wrap {
  margin: 0 -1rem -1rem;
}

.dmh__mov-id {
  font-family: var(--regula-font-mono);
  font-weight: 700;
  color: var(--regula-orange);
}

.dmh__tipo {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  font-size: var(--regula-type-caption-size);
  font-weight: 700;
}

.dmh__tipo--in {
  background: #dcfce7;
  color: #166534;
}

.dmh__tipo--out {
  background: #fee2e2;
  color: #991b1b;
}

.dmh__qty--pos {
  color: #166534;
}

.dmh__qty--neg {
  color: #991b1b;
}

.dmh__prov {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}

.dmh__prov-icon {
  color: var(--regula-steel);
}

.dmh__resp {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  flex-wrap: wrap;
}

.dmh__owner {
  font-size: var(--regula-type-caption-size);
  font-weight: 700;
  background: var(--regula-navy);
  color: var(--regula-white);
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
}

.dmh__empty {
  color: var(--regula-text-muted);
}

.dmh-table :deep(.p-datatable-thead > tr > th) {
  background: var(--regula-navy);
  color: var(--regula-white);
  font-weight: 700;
  font-size: var(--regula-type-caption-size);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-color: color-mix(in srgb, var(--regula-white) 15%, var(--regula-navy));
  min-height: 48px;
}

.dmh-table :deep(.p-datatable-tbody > tr > td) {
  font-size: var(--regula-type-small-size);
}

.dmh-table :deep(.p-datatable-tbody > tr:nth-child(even) > td) {
  background: var(--regula-snow);
}

.dmh-table :deep(.p-datatable-tbody > tr:nth-child(odd) > td) {
  background: var(--regula-white);
}

.dmh-table :deep(.p-paginator) {
  border: none;
  background: transparent;
  padding: 0.75rem 0 0;
}
</style>
