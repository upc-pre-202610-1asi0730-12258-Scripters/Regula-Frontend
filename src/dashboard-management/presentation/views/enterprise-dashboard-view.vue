<script setup>
import { onMounted } from 'vue'
import { useDashboardStore } from '@/dashboard-management/application/dashboard.store.js'

const dashboardStore = useDashboardStore()

onMounted(() => {
  dashboardStore.loadEnterpriseDashboard()
})
</script>

<template>
  <section class="enterprise-dashboard">
    <div v-if="dashboardStore.errors.length" class="dashboard-alert">
      <i class="pi pi-info-circle" aria-hidden="true" />
      <span>No se pudieron cargar algunos datos. Verifica que <strong>npm run api</strong> esté activo.</span>
    </div>

    <header class="dashboard-header">
      <div>
        <h2>Buenos días, Juan</h2>
        <p>Resumen operativo actualizado</p>
      </div>

      <div class="dashboard-filters" aria-label="Filtros rápidos">
        <button class="dashboard-filter dashboard-filter--active" type="button">Hoy</button>
        <button class="dashboard-filter" type="button">Última semana</button>
        <button class="dashboard-filter" type="button">Último mes</button>

        <small>
          <i class="pi pi-clock" aria-hidden="true" />
          Última actualización: 10:42 a.m. · Actualiza cada 5 min
        </small>
      </div>
    </header>

    <p v-if="dashboardStore.enterpriseLoading" class="dashboard-loading">
      Cargando dashboard...
    </p>

    <div class="kpi-grid">
      <article class="kpi-card kpi-card--orange">
        <span class="kpi-icon">
          <i class="pi pi-bell" aria-hidden="true" />
        </span>

        <strong>{{ dashboardStore.activeAlerts.length }}</strong>
        <p>alertas activas hoy</p>

        <div class="dashboard-tags">
          <span class="tag tag--danger">{{ dashboardStore.enterpriseHighAlerts }} Alta</span>
          <span class="tag tag--warning">{{ dashboardStore.enterpriseMediumAlerts }} Media</span>
        </div>
      </article>

      <article class="kpi-card kpi-card--green">
        <span class="kpi-icon">
          <i class="pi pi-arrow-down" aria-hidden="true" />
        </span>

        <strong>{{ dashboardStore.enterpriseEntriesToday }}</strong>
        <p>balones ingresados hoy</p>
        <small>vs. ayer: +8 ↑</small>
      </article>

      <article class="kpi-card kpi-card--navy">
        <span class="kpi-icon">
          <i class="pi pi-arrow-up" aria-hidden="true" />
        </span>

        <strong>{{ dashboardStore.enterpriseExitsToday }}</strong>
        <p>balones despachados hoy</p>
        <small>vs. ayer: -3 ↓</small>
      </article>

      <article class="kpi-card kpi-card--orange">
        <span class="kpi-icon">
          <i class="pi pi-box" aria-hidden="true" />
        </span>

        <strong>{{ dashboardStore.enterpriseTotalAvailableStock }}</strong>
        <p>balones disponibles</p>

        <RouterLink to="/inventario/empresa">
          {{ dashboardStore.enterpriseInventoryRows.length }} tipos · Ver desglose →
        </RouterLink>
      </article>
    </div>

    <section class="dashboard-panel operational-panel">
      <div class="panel-title-row">
        <h3>
          Carga Operativa del Día
          <small>
            <i class="pi pi-refresh" aria-hidden="true" />
            en tiempo real
          </small>
        </h3>

        <div class="panel-actions">
          <button type="button">
            <i class="pi pi-download" aria-hidden="true" />
            Exportar PDF
          </button>

          <button type="button">
            <i class="pi pi-download" aria-hidden="true" />
            Exportar Excel
          </button>
        </div>
      </div>

      <div class="operational-grid">
        <article>
          <strong>{{ dashboardStore.enterpriseEntriesToday }}</strong>
          <span>Entradas registradas</span>
          <small>Balones recibidos</small>
        </article>

        <article>
          <strong>{{ dashboardStore.enterpriseExitsToday }}</strong>
          <span>Salidas registradas</span>
          <small>Balones despachados</small>
        </article>

        <article>
          <strong>
            <b>{{ dashboardStore.enterpriseActiveDeliveries }}</b>
            / {{ dashboardStore.enterpriseCompletedDeliveries }}
          </strong>
          <span>Repartos activos / completados</span>
          <small>Entregas en curso</small>
        </article>

        <article>
          <strong>
            <b>{{ dashboardStore.activeAlerts.length }}</b>
            / {{ dashboardStore.enterpriseAttendedAlerts }}
          </strong>
          <span>Alertas generadas / atendidas</span>
          <small>Incidencias del día</small>
        </article>
      </div>
    </section>

    <div class="dashboard-bottom-grid">
      <section class="dashboard-panel inventory-panel">
        <div class="panel-title-row">
          <h3>Inventario por Tipo</h3>
          <small>actualizado hace 20 seg.</small>
        </div>

        <div class="inventory-table-wrapper">
          <table>
            <thead>
            <tr>
              <th>Tipo</th>
              <th>Disponible</th>
              <th>En tránsito</th>
              <th>Observado</th>
              <th>Fuera servicio</th>
              <th>Total</th>
            </tr>
            </thead>

            <tbody>
            <tr
                v-for="row in dashboardStore.enterpriseInventoryRows"
                :key="row.id"
            >
              <td>{{ row.type }}</td>
              <td>{{ row.available }}</td>
              <td>{{ row.inTransit }}</td>
              <td>{{ row.observed }}</td>
              <td>{{ row.outOfService }}</td>
              <td>{{ row.total }}</td>
            </tr>
            </tbody>
          </table>
        </div>

        <RouterLink to="/inventario/empresa" class="panel-link">
          Ver inventario completo →
        </RouterLink>
      </section>

      <section class="dashboard-panel warehouse-panel">
        <div class="panel-title-row">
          <h3>Estado de Almacenes</h3>
          <small>actualiza cada 30 seg.</small>
        </div>

        <article
            v-for="warehouse in dashboardStore.enterpriseWarehouseCards"
            :key="warehouse.id"
            class="warehouse-card"
            :class="`warehouse-card--${warehouse.tone}`"
        >
          <div>
            <strong>{{ warehouse.name }}</strong>
            <span>{{ warehouse.label }}</span>
            <small>Última lectura: {{ warehouse.lastReading }}</small>
          </div>

          <b v-if="warehouse.tone !== 'muted'">
            {{ warehouse.concentration }} ppm
          </b>

          <i v-else class="pi pi-question-circle" aria-hidden="true" />
        </article>

        <RouterLink to="/seguridad/empresa/warehouse-status" class="panel-link">
          Ver todos los almacenes →
        </RouterLink>
      </section>
    </div>
  </section>
</template>

<style scoped>
.enterprise-dashboard {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  color: var(--regula-navy);
}

.dashboard-alert {
  display: flex;
  gap: 0.75rem;
  border: 1px solid var(--regula-orange);
  background: #fff7ed;
  border-radius: var(--regula-radius-card);
  padding: 1rem;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
}

.dashboard-header h2 {
  margin: 0;
  font-size: var(--regula-type-h2-size);
}

.dashboard-header p,
.dashboard-loading,
.dashboard-header small,
.panel-title-row small {
  color: var(--regula-text-muted);
  margin: 0.25rem 0 0;
}

.dashboard-filters {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  flex-wrap: wrap;
  max-width: 430px;
}

.dashboard-filters small {
  flex-basis: 100%;
  text-align: right;
}

.dashboard-filter,
.panel-actions button {
  border: 1px solid var(--regula-gray-light);
  background: var(--regula-white);
  color: var(--regula-gray-mid);
  border-radius: var(--regula-radius-btn);
  padding: 0.7rem 1rem;
  font-weight: 700;
  cursor: pointer;
}

.dashboard-filter--active {
  background: var(--regula-navy);
  color: var(--regula-white);
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1.25rem;
}

.kpi-card,
.dashboard-panel {
  background: var(--regula-white);
  border-radius: var(--regula-radius-card);
  box-shadow: var(--regula-shadow-card);
}

.kpi-card {
  min-height: 145px;
  padding: 1.35rem;
  position: relative;
  border-top: 4px solid transparent;
}

.kpi-card strong {
  display: block;
  font-size: 2.4rem;
  line-height: 1;
  color: var(--regula-navy);
}

.kpi-card p {
  margin: 0.35rem 0 1rem;
  color: var(--regula-gray-mid);
}

.kpi-card small,
.kpi-card a {
  color: var(--regula-orange);
  text-decoration: none;
}

.kpi-card--orange {
  border-color: var(--regula-orange);
}

.kpi-card--green {
  border-color: #16a34a;
}

.kpi-card--green strong,
.kpi-card--green small {
  color: #16a34a;
}

.kpi-card--navy {
  border-color: var(--regula-navy);
}

.kpi-icon {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  color: var(--regula-orange);
  font-size: 1.25rem;
}

.dashboard-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 800;
  padding: 0.35rem 0.55rem;
}

.tag--danger {
  background: #fee2e2;
  color: #dc2626;
}

.tag--warning {
  background: #fef3c7;
  color: #b45309;
}

.dashboard-panel {
  padding: 1.35rem;
}

.panel-title-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
  flex-wrap: wrap;
}

.panel-title-row h3 {
  margin: 0;
}

.panel-actions {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.operational-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-top: 1.5rem;
}

.operational-grid article {
  text-align: center;
  padding: 0.8rem 1rem;
  border-right: 1px solid var(--regula-gray-light);
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.operational-grid article:last-child {
  border-right: none;
}

.operational-grid strong {
  font-size: 2rem;
  color: var(--regula-navy);
}

.operational-grid b {
  color: var(--regula-orange);
}

.operational-grid article:first-child strong {
  color: #16a34a;
}

.operational-grid span {
  font-weight: 700;
}

.operational-grid small {
  color: var(--regula-text-muted);
}

.dashboard-bottom-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 1.25rem;
  align-items: start;
}

.inventory-table-wrapper {
  overflow-x: auto;
  margin-top: 1.25rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 620px;
}

th {
  background: var(--regula-navy);
  color: var(--regula-white);
  text-align: left;
  padding: 0.85rem;
  font-size: 0.85rem;
}

td {
  padding: 0.85rem;
  border-bottom: 1px solid var(--regula-gray-light);
}

.panel-link {
  display: block;
  margin-top: 1rem;
  color: var(--regula-orange);
  text-align: right;
  text-decoration: none;
  font-weight: 700;
}

.warehouse-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.warehouse-card {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.1rem;
  border-radius: var(--regula-radius-card);
  border-left: 4px solid;
}

.warehouse-card div {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.warehouse-card span {
  width: fit-content;
  border-radius: 999px;
  padding: 0.25rem 0.55rem;
  font-size: 0.75rem;
  font-weight: 800;
}

.warehouse-card--danger {
  border-color: var(--regula-orange);
  background: #fff1f2;
}

.warehouse-card--danger span {
  color: #dc2626;
  background: #fee2e2;
}

.warehouse-card--danger b {
  color: var(--regula-orange);
}

.warehouse-card--success {
  border-color: #16a34a;
  background: #f0fdf4;
}

.warehouse-card--success span {
  color: #16a34a;
  background: #dcfce7;
}

.warehouse-card--success b {
  color: #16a34a;
}

.warehouse-card--muted {
  border-color: var(--regula-steel);
  background: #f1f5f9;
  color: var(--regula-gray-mid);
}

@media (max-width: 1100px) {
  .kpi-grid,
  .operational-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .dashboard-bottom-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .kpi-grid,
  .operational-grid {
    grid-template-columns: 1fr;
  }

  .operational-grid article {
    border-right: none;
    border-bottom: 1px solid var(--regula-gray-light);
  }

  .dashboard-filters small {
    text-align: left;
  }
}
</style>