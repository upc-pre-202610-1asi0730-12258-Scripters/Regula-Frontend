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
import { useToast } from 'primevue/usetoast'
import { storeToRefs } from 'pinia'
import { computed, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const toast = useToast()
const store = useInventoryStore()
const { auditLogs, auditLogsLoaded } = storeToRefs(store)

const keyword = ref('')

const form = reactive({
  usuario: '',
  modulo: '',
  tipoOperacion: '',
  dateFrom: '2025-06-01',
  dateTo: '2025-06-30',
})

const applied = reactive({ ...form })

function syncApplied() {
  Object.assign(applied, form)
}

onMounted(() => {
  syncApplied()
  store.fetchAuditLogs()
})

const usuarioOptions = computed(() => {
  const set = new Set()
  for (const row of auditLogs.value) {
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

const moduloOptions = computed(() => {
  const set = new Set()
  for (const row of auditLogs.value) {
    if (row.modulo) {
      set.add(row.modulo)
    }
  }
  const opts = [{ label: t('inventory.history.filters.all'), value: '' }]
  for (const m of [...set].sort()) {
    opts.push({ label: m, value: m })
  }
  return opts
})

const tipoOpOptions = computed(() => [
  { label: t('inventory.history.filters.all'), value: '' },
  { label: 'UPDATE', value: 'UPDATE' },
  { label: 'INSERT', value: 'INSERT' },
  { label: 'ANULACIÓN', value: 'ANULACIÓN' },
])

function parseRowDate(row) {
  const s = row.fechaHora
  if (!s) {
    return null
  }
  const normalized = String(s).trim().replace(' ', 'T')
  const d = new Date(normalized)
  return Number.isNaN(d.getTime()) ? null : d
}

function rowMatchesApplied(row) {
  if (applied.usuario && row.usuarioNombre !== applied.usuario) {
    return false
  }
  if (applied.modulo && row.modulo !== applied.modulo) {
    return false
  }
  if (applied.tipoOperacion && row.tipoOperacion !== applied.tipoOperacion) {
    return false
  }
  const d = parseRowDate(row)
  if (d && applied.dateFrom) {
    const from = new Date(`${applied.dateFrom}T00:00:00`).getTime()
    if (d.getTime() < from) {
      return false
    }
  }
  if (d && applied.dateTo) {
    const to = new Date(`${applied.dateTo}T23:59:59.999`).getTime()
    if (d.getTime() > to) {
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
    row.modulo,
    row.tipoOperacion,
    row.datosIngresados,
    row.usuarioNombre,
    row.fechaHora,
    row.valorAnterior,
    row.valorNuevo,
  ]
      .join(' ')
      .toLowerCase()
  return blob.includes(q)
}

const filteredRows = computed(() =>
    auditLogs.value.filter((r) => rowMatchesApplied(r)).filter((r) => rowMatchesKeyword(r)),
)

function applySearch() {
  syncApplied()
}

function moduloIcon(modulo) {
  if (modulo === 'Inventario') {
    return 'pi pi-box'
  }
  if (modulo === 'Distribución') {
    return 'pi pi-truck'
  }
  return 'pi pi-cog'
}

function opClass(op) {
  if (op === 'UPDATE') {
    return 'eap__op--update'
  }
  if (op === 'INSERT') {
    return 'eap__op--insert'
  }
  return 'eap__op--void'
}

function nuevoClass(val) {
  if (String(val).toUpperCase() === 'ANULADO') {
    return 'eap__val-nuevo--warn'
  }
  return 'eap__val-nuevo--ok'
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

function exportCsv() {
  const cols = [
    { header: 'ID', value: (r) => `#${r.id}` },
    { header: 'MÓDULO', value: (r) => r.modulo },
    { header: 'TIPO OP.', value: (r) => r.tipoOperacion },
    { header: 'DATOS INGRESADOS', value: (r) => r.datosIngresados },
    { header: 'USUARIO', value: (r) => r.usuarioNombre },
    { header: 'FECHA Y HORA', value: (r) => r.fechaHora },
    { header: 'VALOR ANTERIOR', value: (r) => r.valorAnterior },
    { header: 'VALOR NUEVO', value: (r) => r.valorNuevo },
  ]
  const stamp = new Date().toISOString().slice(0, 10)
  downloadCsv(`log-auditoria-${stamp}.csv`, cols, filteredRows.value)
}

function printTable() {
  const rows = filteredRows.value
      .map(
          (r) =>
              `<tr><td>#${r.id}</td><td>${escapeHtml(r.modulo)}</td><td>${r.tipoOperacion}</td><td>${escapeHtml(r.datosIngresados)}</td><td>${escapeHtml(r.usuarioNombre)}</td><td>${r.fechaHora}</td><td>${escapeHtml(r.valorAnterior)}</td><td>${escapeHtml(r.valorNuevo)}</td></tr>`,
      )
      .join('')
  const html = `<table><thead><tr>
    <th>ID</th><th>MÓDULO</th><th>TIPO OP.</th><th>DATOS INGRESADOS</th><th>USUARIO</th><th>FECHA Y HORA</th><th>VALOR ANTERIOR</th><th>VALOR NUEVO</th>
  </tr></thead><tbody>${rows}</tbody></table>`
  printHtmlDocument(t('inventory.audit.title'), html)
}

function escapeHtml(s) {
  return String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
}

function onVoidClick(row) {
  toast.add({
    severity: 'info',
    summary: t('inventory.audit.voidToastTitle'),
    detail: t('inventory.audit.voidToastDetail', { id: row.id }),
    life: 4000,
  })
}
</script>

<template>
  <div class="eap">
    <div class="eap__hero">
      <div>
        <h1 class="eap__title">{{ t('inventory.audit.title') }}</h1>
        <p class="eap__sub">{{ t('inventory.audit.subtitle') }}</p>
      </div>
      <div class="eap__actions">
        <Button
            :label="t('inventory.history.exportCsv')"
            icon="pi pi-download"
            outlined
            severity="secondary"
            class="eap__btn-secondary"
            type="button"
            @click="exportCsv"
        />
        <Button
            :label="t('inventory.history.print')"
            icon="pi pi-print"
            class="eap__btn-navy"
            type="button"
            @click="printTable"
        />
      </div>
    </div>

    <div class="eap__info" role="status">
      <i class="pi pi-info-circle eap__info-icon" aria-hidden="true" />
      <p class="eap__info-text">{{ t('inventory.audit.immutableHint') }}</p>
    </div>

    <Card class="eap__card surface-card">
      <template #title>
        <span class="eap__card-title">{{ t('inventory.history.filtersTitle') }}</span>
      </template>
      <template #content>
        <div class="eap__filters">
          <label class="eap__field">
            <span class="eap__label">{{ t('inventory.history.filters.user') }}</span>
            <Select
                v-model="form.usuario"
                :options="usuarioOptions"
                option-label="label"
                option-value="value"
                class="eap__input"
            />
          </label>
          <label class="eap__field">
            <span class="eap__label">{{ t('inventory.audit.module') }}</span>
            <Select
                v-model="form.modulo"
                :options="moduloOptions"
                option-label="label"
                option-value="value"
                class="eap__input"
            />
          </label>
          <label class="eap__field">
            <span class="eap__label">{{ t('inventory.audit.actionType') }}</span>
            <Select
                v-model="form.tipoOperacion"
                :options="tipoOpOptions"
                option-label="label"
                option-value="value"
                class="eap__input"
            />
          </label>
          <label class="eap__field">
            <span class="eap__label">{{ t('inventory.history.filters.from') }}</span>
            <input v-model="form.dateFrom" class="eap__date" type="date" />
          </label>
          <label class="eap__field">
            <span class="eap__label">{{ t('inventory.history.filters.to') }}</span>
            <input v-model="form.dateTo" class="eap__date" type="date" />
          </label>
          <div class="eap__field eap__field--btn">
            <span class="eap__label eap__label--ghost">{{ '\u00a0' }}</span>
            <Button
                :label="t('inventory.history.search')"
                icon="pi pi-search"
                class="eap__btn-navy"
                type="button"
                @click="applySearch"
            />
          </div>
        </div>
      </template>
    </Card>

    <Card class="eap__card eap__card--table surface-card">
      <template #title>
        <div class="eap__table-head">
          <div class="eap__table-title">
            <i class="pi pi-shield eap__shield" aria-hidden="true" />
            <span>{{ t('inventory.audit.eventsCount', { n: filteredRows.length }) }}</span>
            <span class="eap__pill">{{ t('inventory.audit.adminViewBadge') }}</span>
          </div>
          <InputText v-model="keyword" class="eap__keyword" :placeholder="t('inventory.audit.searchPh')" />
        </div>
      </template>
      <template #content>
        <div v-if="!auditLogsLoaded" class="eap__loading">
          <ProgressSpinner stroke-width="4" style="width: 42px; height: 42px" />
          <span>{{ t('inventory.audit.loading') }}</span>
        </div>
        <div v-else class="eap__table-wrap">
          <DataTable
              :value="filteredRows"
              data-key="id"
              class="eap-table"
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
              <span class="eap__empty">{{ t('inventory.history.noResults') }}</span>
            </template>
            <Column :header="t('inventory.audit.cols.uniqueId')" style="min-width: 130px">
              <template #body="{ data }">
                <span class="eap__audit-id">#{{ data.id }}</span>
              </template>
            </Column>
            <Column :header="t('inventory.audit.cols.module')" style="min-width: 140px">
              <template #body="{ data }">
                <span class="eap__mod">
                  <i class="pi eap__mod-icon" :class="moduloIcon(data.modulo)" aria-hidden="true" />
                  {{ data.modulo }}
                </span>
              </template>
            </Column>
            <Column :header="t('inventory.audit.cols.op')" style="min-width: 110px">
              <template #body="{ data }">
                <span class="eap__op" :class="opClass(data.tipoOperacion)">{{ data.tipoOperacion }}</span>
              </template>
            </Column>
            <Column :header="t('inventory.audit.cols.details')" style="min-width: 220px">
              <template #body="{ data }">
                <span class="eap__datos">{{ data.datosIngresados }}</span>
              </template>
            </Column>
            <Column :header="t('inventory.history.cols.user')" style="min-width: 130px">
              <template #body="{ data }">
                <span class="eap__user">
                  <span class="eap__avatar" aria-hidden="true">{{ initials(data.usuarioNombre) }}</span>
                  {{ data.usuarioNombre }}
                </span>
              </template>
            </Column>
            <Column :header="t('inventory.history.cols.datetime')" style="min-width: 170px">
              <template #body="{ data }">
                {{ data.fechaHora }}
              </template>
            </Column>
            <Column :header="t('inventory.audit.cols.prev')" style="min-width: 90px">
              <template #body="{ data }">
                <span class="eap__val-ant">{{ data.valorAnterior }}</span>
              </template>
            </Column>
            <Column :header="t('inventory.audit.cols.next')" style="min-width: 100px">
              <template #body="{ data }">
                <span class="eap__val-nuevo" :class="nuevoClass(data.valorNuevo)">{{ data.valorNuevo }}</span>
              </template>
            </Column>
            <Column :header="t('inventory.audit.cols.actions')" style="min-width: 150px">
              <template #body="{ data }">
                <Button
                    v-if="data.accionEstado === 'voidable'"
                    :label="t('inventory.audit.voidAction')"
                    icon="pi pi-ban"
                    severity="danger"
                    outlined
                    size="small"
                    class="eap__void-btn"
                    type="button"
                    @click="onVoidClick(data)"
                />
                <span v-else-if="data.accionEstado === 'voided'" class="eap__voided">
                  <i class="pi pi-check-circle" aria-hidden="true" />
                  {{ t('inventory.audit.alreadyVoided') }}
                </span>
                <span v-else class="eap__no-void">{{ t('inventory.audit.notVoidable') }}</span>
              </template>
            </Column>
          </DataTable>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.eap {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.eap__hero {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.eap__title {
  margin: 0;
  font-size: var(--regula-type-h2-size);
  font-weight: var(--regula-type-h2-weight);
  color: var(--regula-navy);
}

.eap__sub {
  margin: 0.35rem 0 0;
  color: var(--regula-text-muted);
  font-size: var(--regula-type-small-size);
}

.eap__actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.eap__btn-secondary :deep(.p-button) {
  border-radius: var(--regula-radius-btn);
  min-height: 44px;
  font-weight: 600;
}

.eap__btn-navy :deep(.p-button) {
  background: var(--regula-navy);
  border-color: var(--regula-navy);
  border-radius: var(--regula-radius-btn);
  min-height: 44px;
  font-weight: 700;
}

.eap__btn-navy :deep(.p-button:hover) {
  filter: brightness(1.08);
}

.eap__info {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  padding: 0.85rem 1rem;
  border-radius: var(--regula-radius-card);
  background: #e0f2fe;
  border: 1px solid #bae6fd;
  color: #0c4a6e;
}

.eap__info-icon {
  font-size: 1.25rem;
  margin-top: 0.1rem;
}

.eap__info-text {
  margin: 0;
  font-size: var(--regula-type-small-size);
  line-height: 1.5;
}

.eap__card :deep(.p-card-title) {
  font-size: var(--regula-type-small-size);
  font-weight: 700;
  color: var(--regula-navy);
}

.eap__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-end;
}

.eap__field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 140px;
}

.eap__field--btn {
  min-width: auto;
}

.eap__label {
  font-size: var(--regula-type-caption-size);
  font-weight: 700;
  color: var(--regula-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.eap__label--ghost {
  visibility: hidden;
}

.eap__input :deep(.p-select) {
  width: 100%;
}

.eap__date {
  border: 1px solid var(--regula-gray-light);
  border-radius: var(--regula-radius-btn);
  padding: 0.5rem 0.65rem;
  font-family: inherit;
  font-size: var(--regula-type-small-size);
  min-height: 42px;
}

.eap__table-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  width: 100%;
}

.eap__table-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  font-weight: 700;
  font-size: var(--regula-type-h3-size);
  color: var(--regula-navy);
}

.eap__shield {
  color: var(--regula-orange);
}

.eap__pill {
  font-size: var(--regula-type-caption-size);
  font-weight: 700;
  background: #fef9c3;
  color: #854d0e;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  border: 1px solid #fde047;
}

.eap__keyword {
  max-width: 280px;
  min-width: 180px;
}

.eap__loading {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  color: var(--regula-text-muted);
}

.eap__table-wrap {
  margin: 0 -1rem -1rem;
}

.eap__audit-id {
  font-family: var(--regula-font-mono);
  font-weight: 700;
  color: #1565c0;
}

.eap__mod {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.15rem 0.5rem;
  border-radius: 6px;
  background: var(--regula-gray-light);
  font-size: var(--regula-type-caption-size);
  font-weight: 600;
  color: var(--regula-text-primary);
}

.eap__mod-icon {
  color: var(--regula-steel);
}

.eap__op {
  display: inline-block;
  padding: 0.15rem 0.45rem;
  border-radius: 6px;
  font-size: var(--regula-type-caption-size);
  font-weight: 700;
}

.eap__op--update {
  background: #dbeafe;
  color: #1e40af;
}

.eap__op--insert {
  background: #dcfce7;
  color: #166534;
}

.eap__op--void {
  background: #fef3c7;
  color: #b45309;
}

.eap__datos {
  font-family: var(--regula-font-mono);
  font-size: var(--regula-type-caption-size);
  color: var(--regula-text-body);
}

.eap__user {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}

.eap__avatar {
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

.eap__val-ant {
  color: #c62828;
  font-weight: 600;
}

.eap__val-nuevo {
  font-weight: 700;
}

.eap__val-nuevo--ok {
  color: #2e7d32;
}

.eap__val-nuevo--warn {
  color: #e65100;
}

.eap__void-btn :deep(.p-button) {
  font-weight: 700;
  border-width: 2px;
}

.eap__voided {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: #2e7d32;
  font-weight: 600;
  font-size: var(--regula-type-caption-size);
}

.eap__no-void {
  color: var(--regula-text-muted);
  font-size: var(--regula-type-caption-size);
}

.eap__empty {
  color: var(--regula-text-muted);
}

.eap-table :deep(.p-datatable-thead > tr > th) {
  background: var(--regula-navy);
  color: var(--regula-white);
  font-weight: 700;
  font-size: var(--regula-type-caption-size);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-color: color-mix(in srgb, var(--regula-white) 15%, var(--regula-navy));
  min-height: 48px;
}

.eap-table :deep(.p-datatable-tbody > tr > td) {
  font-size: var(--regula-type-small-size);
}

.eap-table :deep(.p-datatable-tbody > tr:nth-child(even) > td) {
  background: var(--regula-snow);
}

.eap-table :deep(.p-datatable-tbody > tr:nth-child(odd) > td) {
  background: var(--regula-white);
}

.eap-table :deep(.p-paginator) {
  border: none;
  background: transparent;
  padding: 0.75rem 0 0;
}
</style>
