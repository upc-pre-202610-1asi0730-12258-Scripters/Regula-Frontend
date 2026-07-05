<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Toast from 'primevue/toast'

import { useAnalyticsStore }    from '@/operational-analytics/application/analytics.store.js'
import { useAnalyticsUiStore }  from '@/operational-analytics/application/analytics-ui.store.js'
import { ReportConfigAssembler } from '@/operational-analytics/infrastructure/report-config.assembler.js'

const { t }  = useI18n()

const analyticsStore   = useAnalyticsStore()
const analyticsUiStore = useAnalyticsUiStore()

const generateReportPath = '/distribuidor/reportes/generar'
const securityTrendsPath = '/distribuidor/reportes/tendencias'

const selectedModule = ref('inventory')
const selectedPeriod = ref('lastWeek')
const selectedFormat = ref('pdf')

const reportModules = computed(() => [
  { key: 'inventory',    icon: 'pi pi-box',      label: t('reports.modules.inventory.label'),    description: t('reports.modules.inventory.description')    },
  { key: 'alerts',       icon: 'pi pi-shield',   label: t('reports.modules.alerts.label'),       description: t('reports.modules.alerts.description')       },
  { key: 'distribution', icon: 'pi pi-truck',    label: t('reports.modules.distribution.label'), description: t('reports.modules.distribution.description') },
  { key: 'all',          icon: 'pi pi-th-large', label: t('reports.modules.all.label'),          description: t('reports.modules.all.description')          },
])

const periodOptions = computed(() => [
  { key: 'today',     label: t('reports.periods.today')     },
  { key: 'lastWeek',  label: t('reports.periods.lastWeek')  },
  { key: 'lastMonth', label: t('reports.periods.lastMonth') },
  { key: 'custom',    label: t('reports.periods.custom'), icon: 'pi pi-calendar' },
])

const formatOptions = computed(() => [
  { key: 'pdf',   icon: 'pi pi-file-pdf',   label: t('reports.formats.pdf'),   iconColor: '#e53e3e' },
  { key: 'excel', icon: 'pi pi-file-excel', label: t('reports.formats.excel'), iconColor: '#38a169' },
])

const previewModuleLabel = computed(() =>
    reportModules.value.find((m) => m.key === selectedModule.value)?.label ?? '',
)

const previewPeriodLabel = computed(() => {
  if (selectedPeriod.value === 'today')     return t('reports.preview.periodToday')
  if (selectedPeriod.value === 'lastWeek')  return t('reports.preview.periodLastWeek')
  if (selectedPeriod.value === 'lastMonth') return t('reports.preview.periodLastMonth')
  return t('reports.preview.periodCustom')
})

const previewColumns = computed(() => {
  if (selectedModule.value === 'inventory') {
    return [
      { key: 'id',                 label: 'ID'          },
      { key: 'timestamp',          label: 'Fecha'       },
      { key: 'tipo',               label: 'Tipo'        },
      { key: 'tipoBalonLabel',     label: 'Balón'       },
      { key: 'cantidad',           label: 'Cantidad'    },
      { key: 'procedenciaDestino', label: 'Destino'     },
      { key: 'motivo',             label: 'Motivo'      },
    ]
  }
  if (selectedModule.value === 'alerts') {
    return [
      { key: 'id',             label: 'ID'          },
      { key: 'fechaHora',      label: 'Fecha'       },
      { key: 'modulo',         label: 'Módulo'      },
      { key: 'tipoOperacion',  label: 'Operación'   },
      { key: 'usuarioNombre',  label: 'Usuario'     },
      { key: 'valorAnterior',  label: 'Val. Antes'  },
      { key: 'valorNuevo',     label: 'Val. Nuevo'  },
    ]
  }
  if (selectedModule.value === 'distribution') {
    return [
      { key: 'id',                   label: 'ID'          },
      { key: 'timestamp',            label: 'Fecha'       },
      { key: 'tipo',                 label: 'Tipo'        },
      { key: 'tipoBalonLabel',       label: 'Balón'       },
      { key: 'cantidad',             label: 'Cantidad'    },
      { key: 'proveedorTipoSalida',  label: 'Proveedor'   },
      { key: 'responsableNombre',    label: 'Responsable' },
    ]
  }
  // 'all' → show inventory columns
  return [
    { key: 'id',             label: 'ID'        },
    { key: 'timestamp',      label: 'Fecha'     },
    { key: 'tipo',           label: 'Tipo'      },
    { key: 'tipoBalonLabel', label: 'Balón'     },
    { key: 'cantidad',       label: 'Cantidad'  },
    { key: 'motivo',         label: 'Motivo'    },
  ]
})

// Apply period filter from the assembler and return rows for the selected module
const filteredRows = computed(() => {
  const tempConfig = ReportConfigAssembler.toEntityFromSelection({
    module: selectedModule.value,
    period: selectedPeriod.value,
    format: selectedFormat.value,
  })

  if (selectedModule.value === 'inventory') {
    return ReportConfigAssembler.filterEnterpriseMovementsByPeriod(
        analyticsStore.enterpriseMovements, tempConfig,
    )
  }
  if (selectedModule.value === 'alerts') {
    return ReportConfigAssembler.filterAuditLogsByPeriod(
        analyticsStore.auditLogs, tempConfig,
    )
  }
  if (selectedModule.value === 'distribution') {
    return ReportConfigAssembler.filterDistributorMovementsByPeriod(
        analyticsStore.distributorMovements, tempConfig,
    )
  }
  // all
  return [
    ...ReportConfigAssembler.filterEnterpriseMovementsByPeriod(analyticsStore.enterpriseMovements, tempConfig),
    ...ReportConfigAssembler.filterAuditLogsByPeriod(analyticsStore.auditLogs, tempConfig),
    ...ReportConfigAssembler.filterDistributorMovementsByPeriod(analyticsStore.distributorMovements, tempConfig),
  ]
})

// Show only the first 8 rows in the preview table; export exports everything
const previewRows = computed(() => filteredRows.value.slice(0, 8))
const totalRows   = computed(() => filteredRows.value.length)

function formatCell(val) {
  if (val === null || val === undefined) return '—'
  if (typeof val === 'string' && val.includes('T')) {
    // ISO timestamp → readable
    try {
      return new Date(val).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' })
    } catch { return val }
  }
  return String(val)
}

// ── Stats summary cards ───────────────────────────────────────────────────────
const summaryStats = computed(() => {
  const rows = filteredRows.value
  if (!rows.length) return []

  if (selectedModule.value === 'inventory') {
    const entradas = rows.filter((r) => r.tipo === 'Entrada').length
    const salidas  = rows.filter((r) => r.tipo === 'Salida').length
    const total    = rows.reduce((s, r) => s + (Number(r.cantidad) || 0), 0)
    return [
      { icon: 'pi pi-list',       label: 'Total movimientos', value: rows.length },
      { icon: 'pi pi-arrow-down', label: 'Entradas',          value: entradas,   color: '#16a34a' },
      { icon: 'pi pi-arrow-up',   label: 'Salidas',           value: salidas,    color: '#dc2626' },
      { icon: 'pi pi-box',        label: 'Unidades totales',  value: total },
    ]
  }
  if (selectedModule.value === 'alerts') {
    const updates  = rows.filter((r) => r.tipoOperacion === 'UPDATE').length
    const creates  = rows.filter((r) => r.tipoOperacion === 'CREATE').length
    const deletes  = rows.filter((r) => r.tipoOperacion === 'DELETE').length
    return [
      { icon: 'pi pi-list',    label: 'Total registros', value: rows.length },
      { icon: 'pi pi-pencil',  label: 'Actualizaciones', value: updates },
      { icon: 'pi pi-plus',    label: 'Creaciones',      value: creates, color: '#16a34a' },
      { icon: 'pi pi-trash',   label: 'Eliminaciones',   value: deletes, color: '#dc2626' },
    ]
  }
  if (selectedModule.value === 'distribution') {
    const entradas = rows.filter((r) => r.tipo === 'Entrada').length
    const salidas  = rows.filter((r) => r.tipo === 'Salida').length
    const total    = rows.reduce((s, r) => s + (Number(r.cantidad) || 0), 0)
    return [
      { icon: 'pi pi-list',       label: 'Movimientos',     value: rows.length },
      { icon: 'pi pi-arrow-down', label: 'Entradas',        value: entradas, color: '#16a34a' },
      { icon: 'pi pi-arrow-up',   label: 'Salidas',         value: salidas,  color: '#dc2626' },
      { icon: 'pi pi-truck',      label: 'Unidades totales', value: total },
    ]
  }
  return [{ icon: 'pi pi-list', label: 'Total registros', value: rows.length }]
})

// ── Preview / estimated rows ──────────────────────────────────────────────────
const estimatedRows = computed(() => `~${totalRows.value}`)

// ── Generate & export ─────────────────────────────────────────────────────────
const isGenerating = computed(() => analyticsStore.isGenerating)
const showSuccess  = computed(() => analyticsStore.showSuccess)

async function generateReport() {
  const config = ReportConfigAssembler.toEntityFromSelection({
    module: selectedModule.value,
    period: selectedPeriod.value,
    format: selectedFormat.value,
  })
  analyticsStore.setConfig(config)
  await analyticsStore.generateAndExport({
    rows:    filteredRows.value,
    columns: previewColumns.value,
    module:  previewModuleLabel.value,
    period:  previewPeriodLabel.value,
    format:  selectedFormat.value,
  })
}

function dismissSuccess() {
  analyticsStore.dismissSuccess()
}

onMounted(() => {
  analyticsStore.fetchAll()
})
</script>

<template>
  <Toast />

  <div class="reports-page">

    <!-- Tabs -->
    <div class="reports-tabs">
      <router-link :to="generateReportPath" class="reports-tab" active-class="reports-tab--active">{{ t('reports.tabs.generate') }}</router-link>
      <router-link :to="securityTrendsPath" class="reports-tab" active-class="reports-tab--active">{{ t('reports.tabs.trends') }}</router-link>
    </div>

    <!-- Success toast -->
    <Transition name="toast-slide">
      <div v-if="showSuccess" class="reports-success-toast">
        <span class="reports-success-toast__icon pi pi-check-circle" />
        <div class="reports-success-toast__body">
          <p class="reports-success-toast__title">{{ t('reports.toast.title') }}</p>
          <p class="reports-success-toast__sub">{{ t('reports.toast.subtitle') }}</p>
        </div>
        <button class="reports-success-toast__close pi pi-times" @click="dismissSuccess" />
      </div>
    </Transition>

    <!-- Main card -->
    <div class="reports-card">
      <h1 class="reports-card__title">{{ t('reports.card.title') }}</h1>

      <!-- Step 1: Module -->
      <section class="reports-section">
        <h2 class="reports-section__heading">
          <span class="reports-section__badge">1</span>
          {{ t('reports.steps.step1') }}
        </h2>
        <div class="reports-modules-grid">
          <button
              v-for="mod in reportModules"
              :key="mod.key"
              class="reports-module-card"
              :class="{ 'reports-module-card--selected': selectedModule === mod.key }"
              @click="selectedModule = mod.key"
          >
            <div class="reports-module-card__radio">
              <span v-if="selectedModule === mod.key" class="reports-module-card__radio-dot" />
            </div>
            <span class="reports-module-card__icon" :class="[mod.icon, { 'reports-module-card__icon--selected': selectedModule === mod.key }]" />
            <p class="reports-module-card__label">{{ mod.label }}</p>
            <p class="reports-module-card__desc">{{ mod.description }}</p>
          </button>
        </div>
      </section>

      <!-- Step 2: Period -->
      <section class="reports-section">
        <h2 class="reports-section__heading">
          <span class="reports-section__badge">2</span>
          {{ t('reports.steps.step2') }}
        </h2>
        <div class="reports-period-group">
          <button
              v-for="period in periodOptions"
              :key="period.key"
              class="reports-period-btn"
              :class="{ 'reports-period-btn--active': selectedPeriod === period.key }"
              @click="selectedPeriod = period.key"
          >
            <span v-if="period.icon" :class="['reports-period-btn__icon', period.icon]" />
            {{ period.label }}
          </button>
        </div>
      </section>

      <!-- Step 3: Format -->
      <section class="reports-section">
        <h2 class="reports-section__heading">
          <span class="reports-section__badge">3</span>
          {{ t('reports.steps.step3') }}
        </h2>
        <div class="reports-format-group">
          <button
              v-for="fmt in formatOptions"
              :key="fmt.key"
              class="reports-format-btn"
              :class="{ 'reports-format-btn--active': selectedFormat === fmt.key }"
              @click="selectedFormat = fmt.key"
          >
            <div class="reports-format-btn__radio">
              <span v-if="selectedFormat === fmt.key" class="reports-format-btn__radio-dot" />
            </div>
            <span :class="['reports-format-btn__icon', fmt.icon]" :style="{ color: fmt.iconColor }" />
            {{ fmt.label }}
          </button>
        </div>
      </section>

      <!-- Step 4: Data preview (live from API) -->
      <section class="reports-section">
        <h2 class="reports-section__heading">
          <span class="reports-section__badge">4</span>
          Vista previa de datos
          <span class="reports-badge-count">{{ totalRows }} registros</span>
        </h2>

        <!-- Summary stat cards -->
        <div v-if="summaryStats.length" class="reports-stats-row">
          <div v-for="stat in summaryStats" :key="stat.label" class="reports-stat-pill">
            <span :class="['reports-stat-pill__icon', stat.icon]" :style="stat.color ? { color: stat.color } : {}" />
            <div>
              <p class="reports-stat-pill__val">{{ stat.value }}</p>
              <p class="reports-stat-pill__label">{{ stat.label }}</p>
            </div>
          </div>
        </div>

        <!-- Loading state -->
        <div v-if="analyticsStore.isLoading || !analyticsStore.loaded.enterpriseMovements" class="reports-table-placeholder">
          <span class="pi pi-spin pi-spinner" /> Cargando datos de la API…
        </div>

        <!-- Empty state -->
        <div v-else-if="!previewRows.length" class="reports-table-placeholder reports-table-placeholder--empty">
          <span class="pi pi-inbox" />
          No hay registros para el período seleccionado
        </div>

        <!-- Preview table -->
        <div v-else class="reports-table-wrap">
          <table class="reports-table">
            <thead>
            <tr>
              <th v-for="col in previewColumns" :key="col.key">{{ col.label }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(row, i) in previewRows" :key="i">
              <td v-for="col in previewColumns" :key="col.key">{{ formatCell(row[col.key]) }}</td>
            </tr>
            </tbody>
          </table>
          <p v-if="totalRows > 8" class="reports-table-note">
            Mostrando 8 de {{ totalRows }} registros. El reporte exportado incluye todos.
          </p>
        </div>
      </section>

      <!-- Summary preview -->
      <section class="reports-preview">
        <h3 class="reports-preview__title">
          <span class="pi pi-eye reports-preview__eye" />
          {{ t('reports.preview.title') }}
        </h3>
        <div class="reports-preview__row">
          <span class="reports-preview__key">{{ t('reports.preview.selectedModule') }}</span>
          <span class="reports-preview__val">{{ previewModuleLabel }}</span>
        </div>
        <div class="reports-preview__row">
          <span class="reports-preview__key">{{ t('reports.preview.period') }}</span>
          <span class="reports-preview__val">{{ previewPeriodLabel }}</span>
        </div>
        <div class="reports-preview__row">
          <span class="reports-preview__key">{{ t('reports.preview.estimatedRows') }}</span>
          <span class="reports-preview__val">{{ estimatedRows }} {{ t('reports.preview.rows') }}</span>
        </div>
        <div class="reports-preview__row">
          <span class="reports-preview__key">Formato de salida</span>
          <span class="reports-preview__val">{{ selectedFormat.toUpperCase() }}</span>
        </div>
      </section>

      <!-- CTA -->
      <div class="reports-cta">
        <button
            class="reports-cta__btn"
            :disabled="isGenerating || !totalRows"
            @click="generateReport"
        >
          <span v-if="isGenerating" class="pi pi-spin pi-spinner" />
          <span v-else class="pi pi-download" />
          {{ isGenerating ? t('reports.cta.generating') : t('reports.cta.generate') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ── Page shell ────────────────────────────────────────────────────────────── */
.reports-page {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ── Tabs ──────────────────────────────────────────────────────────────────── */
.reports-tabs {
  display: flex;
  gap: 0;
  border-bottom: 2px solid #e5e7eb;
  margin-bottom: 1.5rem;
  width: 100%;
  max-width: 760px;
}

.reports-tab {
  background: none;
  border: none;
  padding: 0.65rem 1.25rem;
  font-size: 0.925rem;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  margin-bottom: -2px;
  transition: color 0.15s, border-color 0.15s;
  text-decoration: none;
}

.reports-tab--active {
  color: var(--regula-orange, #e85d04);
  border-bottom-color: var(--regula-orange, #e85d04);
}

/* ── Card ──────────────────────────────────────────────────────────────────── */
.reports-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 760px;
}

.reports-card__title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 1.75rem;
}

/* ── Section ───────────────────────────────────────────────────────────────── */
.reports-section {
  margin-bottom: 1.75rem;
}

.reports-section__heading {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem;
  flex-wrap: wrap;
}

.reports-section__badge {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #111827;
  color: #fff;
  font-size: 0.8rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.reports-badge-count {
  margin-left: auto;
  font-size: 0.75rem;
  font-weight: 600;
  background: #f3f4f6;
  color: #374151;
  border-radius: 999px;
  padding: 0.15rem 0.65rem;
}

/* ── Modules grid ──────────────────────────────────────────────────────────── */
.reports-modules-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.reports-module-card {
  position: relative;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  padding: 1rem;
  background: #fff;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}

.reports-module-card--selected {
  border-color: var(--regula-orange, #e85d04);
  background: #fff7f0;
}

.reports-module-card__radio {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
}

.reports-module-card--selected .reports-module-card__radio {
  border-color: var(--regula-orange, #e85d04);
}

.reports-module-card__radio-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--regula-orange, #e85d04);
}

.reports-module-card__icon {
  font-size: 1.4rem;
  color: #6b7280;
  display: block;
  margin-bottom: 0.5rem;
}

.reports-module-card__icon--selected { color: var(--regula-orange, #e85d04); }
.reports-module-card__label { font-size: 0.9rem; font-weight: 600; color: #111827; margin: 0 0 0.2rem; }
.reports-module-card__desc  { font-size: 0.8rem; color: #6b7280; margin: 0; }

/* ── Period ────────────────────────────────────────────────────────────────── */
.reports-period-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.reports-period-btn {
  padding: 0.4rem 1rem;
  border-radius: 999px;
  border: 1.5px solid #e5e7eb;
  background: #fff;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
}

.reports-period-btn--active {
  border-color: var(--regula-orange, #e85d04);
  color: var(--regula-orange, #e85d04);
  background: #fff7f0;
}

/* ── Format ────────────────────────────────────────────────────────────────── */
.reports-format-group {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.reports-format-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.65rem 1.25rem;
  border-radius: 8px;
  border: 1.5px solid #e5e7eb;
  background: #fff;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}

.reports-format-btn--active {
  border-color: var(--regula-orange, #e85d04);
  background: #fff7f0;
}

.reports-format-btn__radio {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.reports-format-btn--active .reports-format-btn__radio {
  border-color: var(--regula-orange, #e85d04);
}

.reports-format-btn__radio-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--regula-orange, #e85d04);
}

.reports-format-btn__icon { font-size: 1.1rem; }

/* ── Stats row ─────────────────────────────────────────────────────────────── */
.reports-stats-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  margin-bottom: 1rem;
}

.reports-stat-pill {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.5rem 0.85rem;
  flex: 1;
  min-width: 120px;
}

.reports-stat-pill__icon {
  font-size: 1.1rem;
  color: #6b7280;
}

.reports-stat-pill__val {
  font-size: 1.1rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
  line-height: 1;
}

.reports-stat-pill__label {
  font-size: 0.72rem;
  color: #6b7280;
  margin: 0;
}

/* ── Table ─────────────────────────────────────────────────────────────────── */
.reports-table-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.5rem;
  background: #f9fafb;
  border: 1px dashed #e5e7eb;
  border-radius: 8px;
  color: #9ca3af;
  font-size: 0.875rem;
}

.reports-table-placeholder--empty {
  flex-direction: column;
  gap: 0.35rem;
}

.reports-table-placeholder--empty .pi {
  font-size: 1.4rem;
}

.reports-table-wrap {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.reports-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;
}

.reports-table thead {
  background: #f9fafb;
  position: sticky;
  top: 0;
}

.reports-table th {
  padding: 0.55rem 0.75rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
  white-space: nowrap;
}

.reports-table td {
  padding: 0.5rem 0.75rem;
  color: #111827;
  border-bottom: 1px solid #f3f4f6;
  white-space: nowrap;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.reports-table tbody tr:hover {
  background: #fff7f0;
}

.reports-table tbody tr:last-child td {
  border-bottom: none;
}

.reports-table-note {
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  color: #9ca3af;
  margin: 0;
  background: #f9fafb;
  border-top: 1px solid #f3f4f6;
}

/* ── Preview summary ───────────────────────────────────────────────────────── */
.reports-preview {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;
}

.reports-preview__title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.reports-preview__eye { color: #6b7280; }

.reports-preview__row {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  padding: 0.3rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.reports-preview__row:last-child { border-bottom: none; }
.reports-preview__key { color: #6b7280; }
.reports-preview__val { color: #111827; font-weight: 500; text-align: right; }

/* ── CTA ───────────────────────────────────────────────────────────────────── */
.reports-cta {
  display: flex;
  justify-content: flex-end;
}

.reports-cta__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.5rem;
  background: var(--regula-orange, #e85d04);
  color: #fff;
  font-size: 0.925rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.1s;
}

.reports-cta__btn:hover:not(:disabled) { opacity: 0.9; }
.reports-cta__btn:active:not(:disabled) { transform: scale(0.98); }
.reports-cta__btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* ── Toast ─────────────────────────────────────────────────────────────────── */
.reports-success-toast {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-left: 4px solid #38a169;
  border-radius: 8px;
  padding: 0.85rem 1rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  z-index: 10;
  min-width: 260px;
}

.reports-success-toast__icon { font-size: 1.2rem; color: #38a169; margin-top: 1px; }
.reports-success-toast__title { font-size: 0.875rem; font-weight: 600; color: #111827; margin: 0 0 0.15rem; }
.reports-success-toast__sub   { font-size: 0.8rem; color: #6b7280; margin: 0; }
.reports-success-toast__close { background: none; border: none; color: #9ca3af; font-size: 0.8rem; cursor: pointer; padding: 0; line-height: 1; }

.toast-slide-enter-active, .toast-slide-leave-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.toast-slide-enter-from, .toast-slide-leave-to { opacity: 0; transform: translateY(-8px); }

/* ── Responsive ────────────────────────────────────────────────────────────── */
@media (max-width: 480px) {
  .reports-modules-grid { grid-template-columns: 1fr; }
  .reports-card { padding: 1.25rem; }
  .reports-stat-pill { min-width: 100px; }
}
</style>