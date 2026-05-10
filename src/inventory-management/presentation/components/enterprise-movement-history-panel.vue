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
const { enterpriseMovements, enterpriseMovementsLoaded } = storeToRefs(store)

const keyword = ref('')

const form = reactive({
  tipo: '',
  tipoBalon: '',
  dateFrom: '2025-06-01',
  dateTo: '2025-06-30',
  destino: '',
  usuario: '',
})

const applied = reactive({
  tipo: '',
  tipoBalon: '',
  dateFrom: '2025-06-01',
  dateTo: '2025-06-30',
  destino: '',
  usuario: '',
})

function syncAppliedFromForm() {
  applied.tipo = form.tipo
  applied.tipoBalon = form.tipoBalon
  applied.dateFrom = form.dateFrom
  applied.dateTo = form.dateTo
  applied.destino = form.destino.trim()
  applied.usuario = form.usuario
}

onMounted(() => {
  syncAppliedFromForm()
  store.fetchEnterpriseMovements()
})

const tipoOptions = computed(() => [
  { label: t('inventory.history.filters.all'), value: '' },
  { label: t('inventory.history.filters.entry'), value: 'Entrada' },
  { label: t('inventory.history.filters.exit'), value: 'Salida' },
])

const balonOptions = computed(() => [
  { label: t('inventory.history.filters.all'), value: '' },
  { label: t('inventory.forms.weights.kg5'), value: '5' },
  { label: t('inventory.forms.weights.kg10'), value: '10' },
  { label: t('inventory.forms.weights.kg15'), value: '15' },
  { label: t('inventory.forms.weights.kg45'), value: '45' },
])

const usuarioOptions = computed(() => {
  const set = new Set()
  for (const row of enterpriseMovements.value) {
    if (row.usuarioNombre) {
      set.add(row.usuarioNombre)
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
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

function initials(name) {
  if (!name) {
    return '?'
  }
  const parts = String(name).trim().split(/\s+/)
  const a = parts[0]?.[0] ?? ''
  const b = parts.length > 1 ? parts[parts.length - 1][0] : parts[0]?.[1] ?? ''
  return `${a}${b}`.toUpperCase() || '?'
}

function signedQty(row) {
  return row.cantidad * (row.cantidadSign ?? (row.tipo === 'Entrada' ? 1 : -1))
}

function rowMatchesFilters(row) {
  if (applied.tipo && row.tipo !== applied.tipo) {
    return false
  }
  if (applied.tipoBalon && row.tipoBalonKey !== applied.tipoBalon) {
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
  if (applied.destino) {
    const hay = `${row.procedenciaDestino ?? ''}`.toLowerCase()
    if (!hay.includes(applied.destino.toLowerCase())) {
      return false
    }
  }
  if (applied.usuario && row.usuarioNombre !== applied.usuario) {
    return false
  }
  return true
}

function rowMatchesKeyword(row, kw) {
  if (!kw.trim()) {
    return true
  }
  const q = kw.toLowerCase()
  const blob = [
    row.id,
    formatDateTime(row.timestamp),
    row.tipo,
    row.tipoBalonLabel,
    String(signedQty(row)),
    row.procedenciaDestino,
    row.motivo,
    row.usuarioNombre,
    row.observaciones,
  ]
      .join(' ')
      .toLowerCase()
  return blob.includes(q)
}

const filteredRows = computed(() => {
  const rows = enterpriseMovements.value
  return rows.filter((r) => rowMatchesFilters(r)).filter((r) => rowMatchesKeyword(r, keyword.value))
})

function applySearch() {
  syncAppliedFromForm()
}

function exportCsv() {
  const cols = [
    { header: 'ID', value: (r) => `#${r.id}` },
    { header: 'FECHA Y HORA', value: (r) => formatDateTime(r.timestamp) },
    { header: 'TIPO', value: (r) => r.tipo },
    { header: 'TIPO BALÓN', value: (r) => r.tipoBalonLabel },
    { header: 'CANTIDAD', value: (r) => signedQty(r) },
    { header: 'PROCEDENCIA / DESTINO', value: (r) => r.procedenciaDestino },
    { header: 'MOTIVO', value: (r) => r.motivo },
    { header: 'USUARIO', value: (r) => r.usuarioNombre },
    { header: 'OBS.', value: (r) => r.observaciones ?? '' },
  ]
  const stamp = new Date().toISOString().slice(0, 10)
  downloadCsv(`historial-movimientos-empresa-${stamp}.csv`, cols, filteredRows.value)
}

function printTable() {
  const rows = filteredRows.value
      .map(
          (r) =>
              `<tr><td>#${r.id}</td><td>${formatDateTime(r.timestamp)}</td><td>${r.tipo}</td><td>${r.tipoBalonLabel}</td><td>${signedQty(r)}</td><td>${escapeHtml(r.procedenciaDestino)}</td><td>${escapeHtml(r.motivo)}</td><td>${escapeHtml(r.usuarioNombre)}</td><td>${escapeHtml(r.observaciones)}</td></tr>`,
      )
      .join('')
  const html = `<table><thead><tr>
    <th>ID</th><th>FECHA Y HORA</th><th>TIPO</th><th>TIPO BALÓN</th><th>CANTIDAD</th><th>PROCEDENCIA / DESTINO</th><th>MOTIVO</th><th>USUARIO</th><th>OBS.</th>
  </tr></thead><tbody>${rows}</tbody></table>`
  printHtmlDocument(t('inventory.history.enterprise.title'), html)
}

function escapeHtml(s) {
  return String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
}
</script>

<template>
  <div class="emh">
    <div class="emh__hero">
      <div>
        <h1 class="emh__title">{{ t('inventory.history.enterprise.title') }}</h1>
        <p class="emh__sub">{{ t('inventory.history.enterprise.subtitle') }}</p>
      </div>
      <div class="emh__actions">
        <Button
            :label="t('inventory.history.exportCsv')"
            icon="pi pi-download"
            outlined
            severity="secondary"
            class="emh__btn-secondary"
            type="button"
            @click="exportCsv"
        />
        <Button
            :label="t('inventory.history.print')"
            icon="pi pi-print"
            class="emh__btn-navy"
            type="button"
            @click="printTable"
        />
      </div>
    </div>

    <Card class="emh__card surface-card">
      <template #title>
        <span class="emh__card-title">{{ t('inventory.history.filtersTitle') }}</span>
      </template>
      <template #content>
        <div class="emh__filters">
          <label class="emh__field">
            <span class="emh__label">{{ t('inventory.history.filters.type') }}</span>
            <Select
                v-model="form.tipo"
                :options="tipoOptions"
                option-label="label"
                option-value="value"
                class="emh__input"
            />
          </label>
          <label class="emh__field">
            <span class="emh__label">{{ t('inventory.history.filters.cylinderType') }}</span>
            <Select
                v-model="form.tipoBalon"
                :options="balonOptions"
                option-label="label"
                option-value="value"
                class="emh__input"
            />
          </label>
          <label class="emh__field">
            <span class="emh__label">{{ t('inventory.history.filters.from') }}</span>
            <input v-model="form.dateFrom" class="emh__date" type="date" />
          </label>
          <label class="emh__field">
            <span class="emh__label">{{ t('inventory.history.filters.to') }}</span>
            <input v-model="form.dateTo" class="emh__date" type="date" />
          </label>
          <label class="emh__field emh__field--grow">
            <span class="emh__label">{{ t('inventory.history.enterprise.destinationOrigin') }}</span>
            <InputText
                v-model="form.destino"
                class="emh__input-text"
                :placeholder="t('inventory.history.enterprise.destinationPh')"
            />
          </label>
          <label class="emh__field">
            <span class="emh__label">{{ t('inventory.history.filters.user') }}</span>
            <Select
                v-model="form.usuario"
                :options="usuarioOptions"
                option-label="label"
                option-value="value"
                class="emh__input"
            />
          </label>
          <div class="emh__field emh__field--btn">
            <span class="emh__label emh__label--ghost">{{ '\u00a0' }}</span>
            <Button
                :label="t('inventory.history.search')"
                icon="pi pi-search"
                class="emh__btn-navy"
                type="button"
                @click="applySearch"
            />
          </div>
        </div>
      </template>
    </Card>

    <Card class="emh__card emh__card--table surface-card">
      <template #title>
        <div class="emh__table-head">
          <div class="emh__table-title">
            <span>{{ t('inventory.history.enterprise.tableTitle') }}</span>
            <span class="emh__count">{{ t('inventory.history.recordsFound', { n: filteredRows.length }) }}</span>
          </div>
          <InputText
              v-model="keyword"
              class="emh__keyword"
              :placeholder="t('inventory.history.keywordPh')"
          />
        </div>
      </template>
      <template #content>
        <div v-if="!enterpriseMovementsLoaded" class="emh__loading">
          <ProgressSpinner stroke-width="4" style="width: 42px; height: 42px" />
          <span>{{ t('inventory.history.loadingMovements') }}</span>
        </div>
        <div v-else class="emh__table-wrap">
          <DataTable
              :value="filteredRows"
              data-key="id"
              class="emh-table"
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
              <span class="emh__empty">{{ t('inventory.history.noResults') }}</span>
            </template>
            <Column :header="t('inventory.history.cols.id')" style="min-width: 130px">
              <template #body="{ data }">
                <span class="emh__mov-id">#{{ data.id }}</span>
              </template>
            </Column>
            <Column :header="t('inventory.history.cols.datetime')" style="min-width: 170px">
              <template #body="{ data }">
                {{ formatDateTime(data.timestamp) }}
              </template>
            </Column>
            <Column :header="t('inventory.history.cols.kind')" style="min-width: 130px">
              <template #body="{ data }">
                <span
                    class="emh__tipo"
                    :class="
                    data.tipo === 'Entrada' ? 'emh__tipo--in' : 'emh__tipo--out'
                  "
                >
                  <i
                      class="pi"
                      :class="data.tipo === 'Entrada' ? 'pi-arrow-down' : 'pi-arrow-up'"
                      aria-hidden="true"
                  />
                  {{ data.tipo === 'Entrada' ? '+ Entrada' : '− Salida' }}
                </span>
              </template>
            </Column>
            <Column :header="t('inventory.history.cols.cylinder')" style="min-width: 140px">
              <template #body="{ data }">
                <span class="emh__balon">
                  <i class="pi pi-database" aria-hidden="true" />
                  {{ data.tipoBalonLabel }}
                </span>
              </template>
            </Column>
            <Column :header="t('inventory.history.cols.qty')" style="min-width: 100px">
              <template #body="{ data }">
                <strong
                    class="emh__qty"
                    :class="signedQty(data) >= 0 ? 'emh__qty--pos' : 'emh__qty--neg'"
                >
                  {{ signedQty(data) >= 0 ? '+' : '' }}{{ signedQty(data) }}
                </strong>
              </template>
            </Column>
            <Column :header="t('inventory.history.cols.originDest')" style="min-width: 160px">
              <template #body="{ data }">
                {{ data.procedenciaDestino }}
              </template>
            </Column>
            <Column :header="t('inventory.history.cols.reason')" style="min-width: 150px">
              <template #body="{ data }">
                {{ data.motivo }}
              </template>
            </Column>
            <Column :header="t('inventory.history.cols.user')" style="min-width: 130px">
              <template #body="{ data }">
                <span class="emh__user">
                  <span class="emh__avatar" aria-hidden="true">{{ initials(data.usuarioNombre) }}</span>
                  {{ data.usuarioNombre }}
                </span>
              </template>
            </Column>
            <Column :header="t('inventory.history.cols.notes')" style="min-width: 120px">
              <template #body="{ data }">
                <span class="emh__obs">{{ data.observaciones || '—' }}</span>
              </template>
            </Column>
            <Column header="" style="width: 48px">
              <template #body>
                <i class="pi pi-angle-right emh__chev" aria-hidden="true" />
              </template>
            </Column>
          </DataTable>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.emh {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.emh__hero {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.emh__title {
  margin: 0;
  font-size: var(--regula-type-h2-size);
  font-weight: var(--regula-type-h2-weight);
  color: var(--regula-navy);
}

.emh__sub {
  margin: 0.35rem 0 0;
  color: var(--regula-text-muted);
  font-size: var(--regula-type-small-size);
}

.emh__actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.emh__btn-secondary :deep(.p-button) {
  border-radius: var(--regula-radius-btn);
  min-height: 44px;
  font-weight: 600;
}

.emh__btn-navy :deep(.p-button) {
  background: var(--regula-navy);
  border-color: var(--regula-navy);
  border-radius: var(--regula-radius-btn);
  min-height: 44px;
  font-weight: 700;
}

.emh__btn-navy :deep(.p-button:hover) {
  filter: brightness(1.08);
}

.emh__card :deep(.p-card-title) {
  font-size: var(--regula-type-small-size);
  font-weight: 700;
  color: var(--regula-navy);
}

.emh__card-title {
  letter-spacing: 0.02em;
}

.emh__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-end;
}

.emh__field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 140px;
}

.emh__field--grow {
  flex: 1 1 220px;
  min-width: 200px;
}

.emh__field--btn {
  min-width: auto;
}

.emh__label {
  font-size: var(--regula-type-caption-size);
  font-weight: 700;
  color: var(--regula-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.emh__label--ghost {
  visibility: hidden;
}

.emh__input :deep(.p-select),
.emh__input-text {
  width: 100%;
}

.emh__date {
  border: 1px solid var(--regula-gray-light);
  border-radius: var(--regula-radius-btn);
  padding: 0.5rem 0.65rem;
  font-family: inherit;
  font-size: var(--regula-type-small-size);
  min-height: 42px;
  color: var(--regula-text-primary);
}

.emh__table-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  width: 100%;
}

.emh__table-title {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-wrap: wrap;
  font-weight: 700;
  font-size: var(--regula-type-h3-size);
  color: var(--regula-navy);
}

.emh__count {
  font-size: var(--regula-type-small-size);
  font-weight: 600;
  color: var(--regula-text-muted);
}

.emh__keyword {
  max-width: 280px;
  min-width: 180px;
}

.emh__loading {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  color: var(--regula-text-muted);
}

.emh__table-wrap {
  margin: 0 -1rem -1rem;
}

.emh__mov-id {
  font-family: var(--regula-font-mono);
  font-weight: 700;
  color: var(--regula-orange);
}

.emh__tipo {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  font-size: var(--regula-type-caption-size);
  font-weight: 700;
}

.emh__tipo--in {
  background: #dcfce7;
  color: #166534;
}

.emh__tipo--out {
  background: #fee2e2;
  color: #991b1b;
}

.emh__balon {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-weight: 600;
}

.emh__balon .pi {
  color: var(--regula-steel);
}

.emh__qty--pos {
  color: #166534;
}

.emh__qty--neg {
  color: #991b1b;
}

.emh__user {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}

.emh__avatar {
  width: 1.85rem;
  height: 1.85rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--regula-navy) 12%, var(--regula-white));
  color: var(--regula-navy);
  font-size: 0.65rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.emh__obs {
  font-size: var(--regula-type-caption-size);
  color: var(--regula-text-body);
}

.emh__chev {
  color: var(--regula-steel);
}

.emh__empty {
  color: var(--regula-text-muted);
}

.emh-table :deep(.p-datatable-thead > tr > th) {
  background: var(--regula-navy);
  color: var(--regula-white);
  font-weight: 700;
  font-size: var(--regula-type-caption-size);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-color: color-mix(in srgb, var(--regula-white) 15%, var(--regula-navy));
  min-height: 48px;
}

.emh-table :deep(.p-datatable-tbody > tr > td) {
  font-size: var(--regula-type-small-size);
}

.emh-table :deep(.p-datatable-tbody > tr:nth-child(even) > td) {
  background: var(--regula-snow);
}

.emh-table :deep(.p-datatable-tbody > tr:nth-child(odd) > td) {
  background: var(--regula-white);
}

.emh-table :deep(.p-paginator) {
  border: none;
  background: transparent;
  padding: 0.75rem 0 0;
}
</style>
