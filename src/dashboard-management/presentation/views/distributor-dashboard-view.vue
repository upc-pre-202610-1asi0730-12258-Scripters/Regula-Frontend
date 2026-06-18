<script setup>
import { onMounted } from 'vue'
import { useDashboardStore } from '@/dashboard-management/application/dashboard.store.js'

const dashboardStore = useDashboardStore()

onMounted(() => {
  dashboardStore.loadDistributorDashboard()
})

function formatCurrency(value) {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2,
  }).format(Number(value ?? 0))
}

function progressWidth(value) {
  const summary = dashboardStore.distributorDeliverySummary
  const total = Math.max(
      summary.inRoute + summary.completed + summary.notDelivered,
      1,
  )

  return `${Math.min((Number(value ?? 0) / total) * 100, 100)}%`
}
</script>

<template>
  <section class="dashboard-page">
    <div v-if="dashboardStore.errors.length" class="dashboard-alert dashboard-alert--warning">
      <i class="pi pi-info-circle" aria-hidden="true" />
      <span>No se pudieron cargar algunos datos. Verifica que <strong>npm run api</strong> esté activo.</span>
    </div>

    <div class="dashboard-alert">
      <i class="pi pi-info-circle" aria-hidden="true" />

      <div>
        <strong>Aviso del Sistema</strong>
        <p>
          Registro posiblemente duplicado detectado en la última carga de inventario.
          Revise el módulo de incidencias.
        </p>
      </div>

      <i class="pi pi-times dashboard-alert__close" aria-hidden="true" />
    </div>

    <header class="dashboard-header">
      <div>
        <h2>Buenos días, Distribuidor</h2>
        <p>Tu operación al día</p>
      </div>

      <span class="dashboard-refresh">
        <i class="pi pi-refresh" aria-hidden="true" />
        Actualiza automáticamente cada 30 seg.
      </span>
    </header>

    <p v-if="dashboardStore.distributorLoading" class="dashboard-loading">
      Cargando dashboard...
    </p>

    <div class="dashboard-kpis">
      <article class="dashboard-card dashboard-card--kpi">
        <div class="dashboard-card__top">
          <span>Alertas activas</span>
          <span class="dashboard-icon dashboard-icon--danger">
            <i class="pi pi-bell" aria-hidden="true" />
          </span>
        </div>

        <strong class="dashboard-kpi-number dashboard-kpi-number--danger">
          {{ dashboardStore.distributorActiveAlerts.length }}
        </strong>

        <div class="dashboard-tags">
          <span class="tag tag--danger">{{ dashboardStore.distributorHighAlerts }} Alta</span>
          <span class="tag tag--warning">{{ dashboardStore.distributorMediumAlerts }} Media</span>
        </div>

        <RouterLink to="/seguridad/distribuidor/active-alerts" class="dashboard-link">
          Ver alertas <i class="pi pi-arrow-right" aria-hidden="true" />
        </RouterLink>
      </article>

      <article class="dashboard-card dashboard-card--kpi">
        <div class="dashboard-card__top">
          <span>Stock disponible</span>
          <span class="dashboard-icon dashboard-icon--info">
            <i class="pi pi-box" aria-hidden="true" />
          </span>
        </div>

        <div class="stock-mini-list">
          <div
              v-for="row in dashboardStore.distributorStockRows"
              :key="row.id"
              class="stock-mini-row"
          >
            <span>{{ row.label }}</span>
            <strong>{{ row.units }}</strong>
            <span>und</span>
            <span class="status-pill" :class="`status-pill--${row.tone}`">
              {{ row.status }}
            </span>
          </div>
        </div>
      </article>

      <article class="dashboard-card dashboard-card--kpi">
        <div class="dashboard-card__top">
          <span>Entregas de hoy</span>
          <span class="dashboard-icon dashboard-icon--success">
            <i class="pi pi-truck" aria-hidden="true" />
          </span>
        </div>

        <div class="delivery-line">
          <span>En ruta</span>
          <strong>{{ dashboardStore.distributorDeliverySummary.inRoute }}</strong>
          <div class="progress">
            <span :style="{ width: progressWidth(dashboardStore.distributorDeliverySummary.inRoute) }" />
          </div>
        </div>

        <div class="delivery-line delivery-line--success">
          <span>Completadas</span>
          <strong>{{ dashboardStore.distributorDeliverySummary.completed }}</strong>
          <div class="progress">
            <span :style="{ width: progressWidth(dashboardStore.distributorDeliverySummary.completed) }" />
          </div>
        </div>

        <div class="delivery-line delivery-line--muted">
          <span>No entregadas</span>
          <strong>{{ dashboardStore.distributorDeliverySummary.notDelivered }}</strong>
          <div class="progress">
            <span :style="{ width: progressWidth(dashboardStore.distributorDeliverySummary.notDelivered) }" />
          </div>
        </div>
      </article>

      <article class="dashboard-card dashboard-card--kpi">
        <div class="dashboard-card__top">
          <span>Deudas pendientes</span>
          <span class="dashboard-icon dashboard-icon--orange">
            <i class="pi pi-wallet" aria-hidden="true" />
          </span>
        </div>

        <div>
          <strong class="dashboard-kpi-number">
            {{ dashboardStore.clientsWithDebt.length }}
          </strong>
          <span class="dashboard-muted"> clientes</span>
        </div>

        <p class="dashboard-debt">
          {{ formatCurrency(dashboardStore.totalPendingDebt) }} deuda total
        </p>

        <RouterLink to="/comercial/deudas" class="dashboard-button">
          Gestionar cobros
        </RouterLink>
      </article>
    </div>

    <section class="dashboard-card sales-summary-card">
      <div class="sales-summary-card__header">
        <h3>Resumen de Ventas del Día</h3>
        <button type="button">Exportar</button>
      </div>

      <div class="sales-summary-grid">
        <article
            v-for="item in dashboardStore.salesByCylinderType"
            :key="item.key"
            class="sales-type-card"
        >
          <span>Cilindros {{ item.label }}</span>
          <strong>{{ item.quantity }}</strong>
          <small>vendidos</small>

          <p>
            Ingreso:
            <b>{{ formatCurrency(item.income) }}</b>
          </p>

          <p>
            Devoluciones:
            <b>{{ item.returns }}</b>
          </p>
        </article>

        <article class="sales-total-card">
          <span>Total Operaciones</span>
          <strong>{{ formatCurrency(dashboardStore.distributorTotalSalesAmount) }}</strong>

          <p>
            Efectivo:
            <b>{{ formatCurrency(dashboardStore.cashSalesAmount) }}</b>
          </p>

          <p>
            Yape/Plin:
            <b>{{ formatCurrency(dashboardStore.digitalSalesAmount) }}</b>
          </p>

          <p>
            Crédito:
            <b>{{ formatCurrency(dashboardStore.creditSalesAmount) }}</b>
          </p>
        </article>
      </div>

      <footer class="stock-footer">
        <span>
          <i class="pi pi-box" aria-hidden="true" />
          Stock al cierre estimado:
        </span>

        <span class="stock-footer__values">
          <template
              v-for="row in dashboardStore.estimatedClosingStock"
              :key="`stock-${row.label}`"
          >
            <span>{{ row.label }}: <b>{{ row.units }}</b></span>
          </template>
        </span>
      </footer>
    </section>
  </section>
</template>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  color: var(--regula-navy);
}

.dashboard-alert {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  border: 1px solid var(--regula-navy);
  background: #eef6ff;
  border-radius: var(--regula-radius-card);
  padding: 1rem;
  color: var(--regula-navy);
}

.dashboard-alert p {
  margin: 0.2rem 0 0;
  color: var(--regula-gray-mid);
}

.dashboard-alert--warning {
  border-color: var(--regula-orange);
  background: #fff7ed;
}

.dashboard-alert__close {
  margin-left: auto;
  color: var(--regula-gray-mid);
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-end;
  flex-wrap: wrap;
}

.dashboard-header h2 {
  margin: 0;
  font-size: var(--regula-type-h2-size);
}

.dashboard-header p,
.dashboard-refresh,
.dashboard-loading,
.dashboard-muted {
  color: var(--regula-text-muted);
  margin: 0.25rem 0 0;
}

.dashboard-kpis {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1.25rem;
}

.dashboard-card {
  background: var(--regula-white);
  border-radius: var(--regula-radius-card);
  box-shadow: var(--regula-shadow-card);
}

.dashboard-card--kpi {
  min-height: 180px;
  padding: 1.4rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.dashboard-card__top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--regula-gray-mid);
}

.dashboard-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.dashboard-icon--danger {
  color: #ef4444;
  background: #fee2e2;
}

.dashboard-icon--info {
  color: #2563eb;
  background: #dbeafe;
}

.dashboard-icon--success {
  color: #16a34a;
  background: #dcfce7;
}

.dashboard-icon--orange {
  color: var(--regula-orange);
  background: #ffedd5;
}

.dashboard-kpi-number {
  font-size: 2rem;
  color: var(--regula-navy);
}

.dashboard-kpi-number--danger,
.dashboard-debt,
.sales-total-card strong {
  color: var(--regula-orange);
}

.dashboard-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag,
.status-pill {
  border-radius: 0.45rem;
  font-size: 0.72rem;
  font-weight: 800;
  padding: 0.25rem 0.45rem;
}

.tag--danger,
.status-pill--danger {
  background: #fee2e2;
  color: #dc2626;
}

.tag--warning,
.status-pill--warning {
  background: #fef3c7;
  color: #b45309;
}

.status-pill--success {
  background: #dcfce7;
  color: #16a34a;
}

.dashboard-link {
  margin-top: auto;
  color: var(--regula-navy);
  text-decoration: none;
  font-weight: 800;
}

.dashboard-button {
  display: inline-flex;
  justify-content: center;
  border: 1px solid var(--regula-gray-light);
  border-radius: var(--regula-radius-btn);
  padding: 0.7rem 1rem;
  text-decoration: none;
  color: var(--regula-navy);
  font-weight: 800;
  margin-top: auto;
}

.stock-mini-list {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.stock-mini-row {
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  gap: 0.5rem;
  align-items: center;
}

.delivery-line {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.35rem 0.75rem;
  color: var(--regula-gray-mid);
}

.delivery-line strong {
  color: var(--regula-orange);
}

.delivery-line--success strong {
  color: #16a34a;
}

.delivery-line--muted strong {
  color: var(--regula-steel);
}

.progress {
  grid-column: 1 / -1;
  height: 0.35rem;
  border-radius: 999px;
  background: #f1f5f9;
  overflow: hidden;
}

.progress span {
  display: block;
  height: 100%;
  background: currentColor;
  border-radius: inherit;
}

.sales-summary-card {
  overflow: hidden;
}

.sales-summary-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.4rem;
  border-bottom: 1px solid var(--regula-gray-light);
}

.sales-summary-card__header h3 {
  margin: 0;
}

.sales-summary-card__header button {
  border: none;
  border-radius: var(--regula-radius-btn);
  padding: 0.6rem 0.9rem;
  color: var(--regula-gray-mid);
  cursor: pointer;
}

.sales-summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.sales-type-card,
.sales-total-card {
  padding: 1.4rem;
  border-right: 1px solid var(--regula-gray-light);
  min-height: 155px;
}

.sales-type-card span,
.sales-total-card span {
  color: var(--regula-gray-mid);
}

.sales-type-card strong,
.sales-total-card strong {
  font-size: 1.65rem;
  margin-right: 0.5rem;
}

.sales-type-card small {
  color: var(--regula-text-muted);
  letter-spacing: 0.1em;
}

.sales-type-card p,
.sales-total-card p {
  display: flex;
  justify-content: space-between;
  margin: 0.55rem 0 0;
  color: var(--regula-gray-mid);
}

.stock-footer {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  background: #0f1f2d;
  color: var(--regula-white);
  padding: 1rem 1.4rem;
}

.stock-footer__values {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  color: var(--regula-steel);
}

.stock-footer__values b {
  color: #22c55e;
}

@media (max-width: 1100px) {
  .dashboard-kpis,
  .sales-summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .dashboard-kpis,
  .sales-summary-grid {
    grid-template-columns: 1fr;
  }

  .sales-type-card,
  .sales-total-card {
    border-right: none;
    border-bottom: 1px solid var(--regula-gray-light);
  }
}
</style>