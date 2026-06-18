<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useSecurityTrendsStore } from '@/operational-analytics/application/security-trends.store.js'

const store = useSecurityTrendsStore()

const chartCanvas = ref(null)
let chartInstance = null

async function initChart() {
  if (!chartCanvas.value) return
  const { Chart, registerables } = await import('chart.js')
  Chart.register(...registerables)

  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }

  const labels = store.chartData.map((d) => d.label)
  chartInstance = new Chart(chartCanvas.value, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Alta criticidad',
          data: store.chartData.map((d) => d.high),
          backgroundColor: '#c2410c',
          borderRadius: 3,
          barPercentage: 0.55,
          categoryPercentage: 0.75,
        },
        {
          label: 'Media criticidad',
          data: store.chartData.map((d) => d.medium),
          backgroundColor: '#ea580c',
          borderRadius: 3,
          barPercentage: 0.55,
          categoryPercentage: 0.75,
        },
        {
          label: 'Baja criticidad',
          data: store.chartData.map((d) => d.low),
          backgroundColor: '#fbbf24',
          borderRadius: 3,
          barPercentage: 0.55,
          categoryPercentage: 0.75,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            afterBody(items) {
              const total = items.reduce((s, i) => s + i.raw, 0)
              return [`Total: ${total} alertas`]
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#6b7280', font: { size: 11 } },
        },
        y: {
          beginAtZero: true,
          grid: { color: '#f3f4f6' },
          ticks: {
            color: '#9ca3af',
            font: { size: 10 },
            stepSize: 10,
          },
          title: {
            display: true,
            text: 'Cantidad de alertas',
            color: '#9ca3af',
            font: { size: 10 },
          },
        },
      },
      onHover: (_, elements) => {
        if (elements.length) {
          const idx = elements[0].index
          hoveredMonth.value = store.chartData[idx] ?? null
        } else {
          hoveredMonth.value = null
        }
      },
    },
  })
}

const hoveredMonth = ref(null)

const tooltipText = computed(() => {
  const m = hoveredMonth.value
  if (!m) return null
  return `Alta: ${m.high} · Media: ${m.medium} · Baja: ${m.low} · Total: ${m.total} alertas`
})

const periodSubtitle = computed(() => {
  if (store.selectedPeriod === 'last3months') return 'Febrero 2025 – Abril 2025'
  return 'Noviembre 2024 – Abril 2025'
})

const zoneSubtitle = computed(() => {
  if (store.selectedZone === 'all') return 'Todas las zonas'
  return store.allZones.find((z) => z.id === store.selectedZone)?.label ?? ''
})

watch(
    () => [store.chartData, store.selectedZone, store.selectedPeriod],
    async () => {
      await nextTick()
      await initChart()
    },
    { deep: true },
)

function exportChart() {
  if (!chartInstance) return
  const url  = chartInstance.toBase64Image()
  const link = document.createElement('a')
  link.href     = url
  link.download = `Regula_TendenciasSeguridad_${Date.now()}.png`
  link.click()
}

onMounted(async () => {
  await store.fetchAll()
  await nextTick()
  await initChart()
})

onBeforeUnmount(() => {
  if (chartInstance) chartInstance.destroy()
})
</script>

<template>
  <div class="trends-page">

    <div class="trends-tabs">
      <router-link to="/reportes/generar"    class="trends-tab" active-class="trends-tab--active">Generar Reporte</router-link>
      <router-link to="/reportes/tendencias" class="trends-tab" active-class="trends-tab--active">Tendencias de Seguridad</router-link>
    </div>

    <div class="trends-filters">
      <div class="trends-filter-group">
        <label class="trends-filter-label">PERÍODO</label>
        <select v-model="store.selectedPeriod" class="trends-select">
          <option value="last6months">Últimos 6 meses</option>
          <option value="last3months">Últimos 3 meses</option>
          <option value="lastYear">Último año</option>
        </select>
      </div>
      <div class="trends-filter-group">
        <label class="trends-filter-label">ZONA</label>
        <select v-model="store.selectedZone" class="trends-select">
          <option value="all">Todas</option>
          <option v-for="z in store.allZones" :key="z.id" :value="z.id">{{ z.label }}</option>
        </select>
      </div>
      <div class="trends-filter-group">
        <label class="trends-filter-label">TIPO DE EVENTO</label>
        <select v-model="store.selectedEventType" class="trends-select">
          <option value="all">Todos los tipos</option>
          <option value="high">Alta criticidad</option>
          <option value="medium">Media criticidad</option>
          <option value="low">Baja criticidad</option>
        </select>
      </div>
      <button class="trends-apply-btn" @click="store.applyFilters">
        <span class="pi pi-refresh" />
        Actualizar
      </button>
    </div>

    <div class="trends-grid">

      <div class="trends-card">

        <div class="trends-card__header">
          <div>
            <h2 class="trends-card__title">Alertas e Incidentes por Período</h2>
            <p class="trends-card__sub">{{ periodSubtitle }} · {{ zoneSubtitle }}</p>
          </div>
          <div class="trends-card__actions">
            <button class="trends-action-btn" @click="exportChart">
              <span class="pi pi-upload" /> Exportar
            </button>
            <button class="trends-action-btn">
              <span class="pi pi-expand" /> Ampliar
            </button>
          </div>
        </div>

        <div class="trends-legend">
          <span class="trends-legend__item"><em class="trends-dot trends-dot--high" />Alta criticidad</span>
          <span class="trends-legend__item"><em class="trends-dot trends-dot--medium" />Media criticidad</span>
          <span class="trends-legend__item"><em class="trends-dot trends-dot--low" />Baja criticidad</span>
        </div>

        <div v-if="store.isLoading" class="trends-chart-placeholder">
          <span class="pi pi-spin pi-spinner" /> Cargando datos…
        </div>
        <div v-else class="trends-chart-wrap">
          <canvas ref="chartCanvas" />
        </div>

        <div class="trends-tooltip-note" :class="{ 'trends-tooltip-note--hint': !hoveredMonth }">
          <span class="trends-tooltip-dot" />
          <span v-if="hoveredMonth">
            <strong>{{ hoveredMonth.label }}</strong> — {{ tooltipText }}
          </span>
          <span v-else>
            Al pasar el cursor sobre una barra verás el detalle del período
          </span>
        </div>

      </div>

      <div class="trends-stats-col">

        <div class="trends-stat-card">
          <div class="trends-stat-card__header">
            <span class="trends-stat-card__label">TOTAL DE ALERTAS</span>
            <span class="pi pi-bell trends-stat-card__bell" />
          </div>

          <div v-if="store.isLoading" class="trends-stat-card__loading">
            <span class="pi pi-spin pi-spinner" />
          </div>
          <template v-else>
            <div class="trends-stat-card__big">
              <span class="trends-stat-card__number">{{ store.totalAlerts }}</span>
              <span class="trends-stat-card__unit">eventos</span>
            </div>
            <p class="trends-stat-card__meta">
              {{ store.selectedPeriod === 'last3months' ? 'Últimos 3 meses' : 'Últimos 6 meses' }}
              · {{ zoneSubtitle }}
            </p>

            <div class="trends-breakdown">
              <div class="trends-breakdown__row">
                <span class="trends-dot trends-dot--high" />
                <span class="trends-breakdown__label">Alta</span>
                <div class="trends-breakdown__bar-wrap">
                  <div class="trends-breakdown__bar trends-breakdown__bar--high" :style="{ width: store.highPct + '%' }" />
                </div>
                <span class="trends-breakdown__val">{{ store.totalHigh }} <em>({{ store.highPct }}%)</em></span>
              </div>
              <div class="trends-breakdown__row">
                <span class="trends-dot trends-dot--medium" />
                <span class="trends-breakdown__label">Media</span>
                <div class="trends-breakdown__bar-wrap">
                  <div class="trends-breakdown__bar trends-breakdown__bar--medium" :style="{ width: store.mediumPct + '%' }" />
                </div>
                <span class="trends-breakdown__val">{{ store.totalMedium }} <em>({{ store.mediumPct }}%)</em></span>
              </div>
              <div class="trends-breakdown__row">
                <span class="trends-dot trends-dot--low" />
                <span class="trends-breakdown__label">Baja</span>
                <div class="trends-breakdown__bar-wrap">
                  <div class="trends-breakdown__bar trends-breakdown__bar--low" :style="{ width: store.lowPct + '%' }" />
                </div>
                <span class="trends-breakdown__val">{{ store.totalLow }} <em>({{ store.lowPct }}%)</em></span>
              </div>
            </div>

            <p class="trends-stat-card__trend">
              <span class="pi pi-arrow-up-right" /> +12% vs período anterior
            </p>
          </template>
        </div>

        <div v-if="store.problematicZone" class="trends-stat-card">
          <div class="trends-stat-card__header">
            <span class="trends-stat-card__label">ZONA MÁS PROBLEMÁTICA</span>
            <span class="pi pi-map-marker trends-stat-card__icon--orange" />
          </div>
          <div class="trends-zone-title">
            <span class="trends-zone-name">{{ store.problematicZone.label }}</span>
            <span class="trends-zone-badge" :class="`trends-zone-badge--${store.problematicZone.criticalityColor}`">
              ⚠ {{ store.problematicZone.criticality }}
            </span>
          </div>
          <p class="trends-stat-card__meta">{{ store.problematicZone.type }}</p>
          <p class="trends-zone-total">
            <strong>{{ store.problematicZone.total }}</strong> alertas totales
          </p>
          <div class="trends-zone-counts">
            <div class="trends-zone-count">
              <span class="trends-zone-count__val">{{ store.problematicZone.high }}</span>
              <span class="trends-zone-count__label">Alta</span>
            </div>
            <div class="trends-zone-count">
              <span class="trends-zone-count__val">{{ store.problematicZone.medium }}</span>
              <span class="trends-zone-count__label">Media</span>
            </div>
            <div class="trends-zone-count">
              <span class="trends-zone-count__val">{{ store.problematicZone.low }}</span>
              <span class="trends-zone-count__label">Baja</span>
            </div>
          </div>
          <p class="trends-stat-card__meta" style="margin-top:0.6rem">
            <span class="pi pi-circle-fill" style="color:#ef4444;font-size:0.55rem;vertical-align:middle" />
            Representa el {{ store.problematicZone.percentage }}% del total de alertas
          </p>
        </div>

        <div v-if="store.peakMonth" class="trends-stat-card">
          <div class="trends-stat-card__header">
            <span class="trends-stat-card__label">MES CON MÁS EVENTOS</span>
            <span class="pi pi-calendar trends-stat-card__icon--gray" />
          </div>
          <p class="trends-zone-name">{{ store.peakMonth.label }}</p>
          <p class="trends-zone-total"><strong>{{ store.peakMonth.total }}</strong> alertas</p>
          <div class="trends-zone-counts">
            <div class="trends-zone-count">
              <span class="trends-zone-count__val">{{ store.peakMonth.high }}</span>
              <span class="trends-zone-count__label">Alta</span>
            </div>
            <div class="trends-zone-count">
              <span class="trends-zone-count__val">{{ store.peakMonth.medium }}</span>
              <span class="trends-zone-count__label">Media</span>
            </div>
            <div class="trends-zone-count">
              <span class="trends-zone-count__val">{{ store.peakMonth.low }}</span>
              <span class="trends-zone-count__label">Baja</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.trends-page { display: flex; flex-direction: column; gap: 1.25rem; }

.trends-tabs {
  display: flex;
  border-bottom: 2px solid #e5e7eb;
}
.trends-tab {
  padding: 0.65rem 1.25rem;
  font-size: 0.925rem;
  font-weight: 500;
  color: #6b7280;
  text-decoration: none;
  border-bottom: 3px solid transparent;
  margin-bottom: -2px;
  transition: color 0.15s, border-color 0.15s;
}
.trends-tab--active {
  color: var(--regula-orange, #e85d04);
  border-bottom-color: var(--regula-orange, #e85d04);
}

.trends-filters {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 1rem;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 1rem 1.25rem;
}
.trends-filter-group { display: flex; flex-direction: column; gap: 0.25rem; }
.trends-filter-label { font-size: 0.68rem; font-weight: 700; color: #9ca3af; letter-spacing: 0.05em; }
.trends-select {
  border: 1.5px solid #e5e7eb;
  border-radius: 6px;
  padding: 0.4rem 0.75rem;
  font-size: 0.875rem;
  color: #374151;
  background: #fff;
  min-width: 160px;
  cursor: pointer;
}
.trends-apply-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 1.1rem;
  background: var(--regula-orange, #e85d04);
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  border-radius: 7px;
  cursor: pointer;
  align-self: flex-end;
  transition: opacity 0.15s;
}
.trends-apply-btn:hover { opacity: 0.9; }

.trends-grid {
  display: grid;
  grid-template-columns: 1fr 288px;
  gap: 1rem;
  align-items: start;
}

.trends-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
}
.trends-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}
.trends-card__title { font-size: 1rem; font-weight: 700; color: #111827; margin: 0 0 0.15rem; }
.trends-card__sub   { font-size: 0.775rem; color: var(--regula-orange, #e85d04); margin: 0; }
.trends-card__actions { display: flex; gap: 0.5rem; }
.trends-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.75rem;
  font-size: 0.8rem;
  color: #374151;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
}

.trends-legend { display: flex; gap: 1.25rem; margin-bottom: 1rem; flex-wrap: wrap; }
.trends-legend__item { display: flex; align-items: center; gap: 0.35rem; font-size: 0.8rem; color: #374151; }

.trends-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 2px;
  font-style: normal;
  flex-shrink: 0;
}
.trends-dot--high   { background: #c2410c; border-radius: 50%; }
.trends-dot--medium { background: #ea580c; border-radius: 50%; }
.trends-dot--low    { background: #fbbf24; border-radius: 50%; }

.trends-chart-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  height: 220px;
  color: #9ca3af;
  font-size: 0.875rem;
}
.trends-chart-wrap {
  position: relative;
  height: 240px;
  width: 100%;
}

.trends-tooltip-note {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.85rem;
  padding: 0.6rem 0.85rem;
  background: #fff7f0;
  border-radius: 7px;
  font-size: 0.8rem;
  color: #374151;
}
.trends-tooltip-note--hint { background: #f9fafb; color: #9ca3af; }
.trends-tooltip-dot {
  width: 10px; height: 10px; border-radius: 50%;
  background: var(--regula-orange, #e85d04);
  flex-shrink: 0;
}

.trends-stats-col { display: flex; flex-direction: column; gap: 1rem; }

.trends-stat-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1rem 1.15rem;
}
.trends-stat-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}
.trends-stat-card__label { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.05em; color: #9ca3af; }
.trends-stat-card__bell  { color: var(--regula-orange, #e85d04); font-size: 1rem; }
.trends-stat-card__icon--orange { color: var(--regula-orange, #e85d04); font-size: 1rem; }
.trends-stat-card__icon--gray   { color: #9ca3af; font-size: 1rem; }

.trends-stat-card__loading {
  display: flex; align-items: center; justify-content: center;
  height: 60px; color: #9ca3af;
}

.trends-stat-card__big {
  display: flex; align-items: baseline; gap: 0.4rem; margin-bottom: 0.1rem;
}
.trends-stat-card__number { font-size: 2rem; font-weight: 800; color: #111827; line-height: 1; }
.trends-stat-card__unit   { font-size: 0.85rem; color: #6b7280; }
.trends-stat-card__meta   { font-size: 0.72rem; color: #9ca3af; margin: 0 0 0.6rem; }
.trends-stat-card__trend  { font-size: 0.78rem; color: #16a34a; margin: 0.4rem 0 0; display: flex; align-items: center; gap: 0.3rem; }

.trends-breakdown { display: flex; flex-direction: column; gap: 0.45rem; margin-bottom: 0.4rem; }
.trends-breakdown__row { display: flex; align-items: center; gap: 0.4rem; font-size: 0.8rem; }
.trends-breakdown__label { color: #374151; min-width: 36px; }
.trends-breakdown__bar-wrap { flex: 1; height: 6px; background: #f3f4f6; border-radius: 3px; overflow: hidden; }
.trends-breakdown__bar { height: 100%; border-radius: 3px; transition: width 0.45s ease; }
.trends-breakdown__bar--high   { background: #c2410c; }
.trends-breakdown__bar--medium { background: #ea580c; }
.trends-breakdown__bar--low    { background: #fbbf24; }
.trends-breakdown__val { color: #111827; font-weight: 600; min-width: 68px; text-align: right; white-space: nowrap; font-size: 0.78rem; }
.trends-breakdown__val em { font-style: normal; color: #9ca3af; font-weight: 400; }

.trends-zone-title { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.1rem; }
.trends-zone-name  { font-size: 1rem; font-weight: 700; color: #111827; margin: 0; }
.trends-zone-badge {
  font-size: 0.7rem; font-weight: 600;
  border-radius: 999px; padding: 0.15rem 0.5rem;
}
.trends-zone-badge--danger  { background: #fee2e2; color: #dc2626; }
.trends-zone-badge--warning { background: #fef3c7; color: #d97706; }
.trends-zone-total { font-size: 0.875rem; color: #374151; margin: 0.35rem 0 0.6rem; }
.trends-zone-counts { display: flex; gap: 0.65rem; }
.trends-zone-count {
  display: flex; flex-direction: column; align-items: center;
  background: #f9fafb; border-radius: 8px; padding: 0.4rem 0.65rem; flex: 1;
}
.trends-zone-count__val   { font-size: 1.1rem; font-weight: 700; color: #111827; }
.trends-zone-count__label { font-size: 0.68rem; color: #9ca3af; }

@media (max-width: 900px) {
  .trends-grid { grid-template-columns: 1fr; }
}
@media (max-width: 480px) {
  .trends-filters { flex-direction: column; }
  .trends-select  { min-width: 100%; }
}
</style>