<script setup>
import { computed } from 'vue'
import { useEnterpriseDistributionStore } from '@/distribution-logistics-management/application/enterprise-distribution.store.js'

const store = useEnterpriseDistributionStore()

const rows = computed(() => store.filteredHistory)
const summary = computed(() => store.historySummary)

function vehicleIcon(type) {
  if (type === 'Camión') return 'pi-truck'
  if (type === 'Furgoneta') return 'pi-truck'
  return 'pi-car'
}

function statusClass(status) {
  if (status === 'Completado') return 'ent-hist__status--done'
  if (status === 'Con desvío') return 'ent-hist__status--deviation'
  return 'ent-hist__status--pending'
}

function formatKg(kg) {
  return kg.toLocaleString('es-PE')
}
</script>

<template>
  <div class="ent-hist">
    <!-- Filtros -->
    <div class="ent-hist__filters">
      <div class="ent-hist__filter">
        <i class="pi pi-calendar" aria-hidden="true" />
        <span>15/06/2025</span>
        <i class="pi pi-chevron-down ent-hist__chev" aria-hidden="true" />
      </div>
      <span class="ent-hist__dash">—</span>
      <div class="ent-hist__filter">
        <i class="pi pi-calendar" aria-hidden="true" />
        <span>22/06/2025</span>
        <i class="pi pi-chevron-down ent-hist__chev" aria-hidden="true" />
      </div>
      <div class="ent-hist__filter">
        <i class="pi pi-user" aria-hidden="true" />
        <span>Carlos Ríos Vega</span>
      </div>
      <div class="ent-hist__filter">
        <i class="pi pi-truck" aria-hidden="true" />
        <span>XYZ-456</span>
      </div>
      <div class="ent-hist__filter">
        <span>Todos los estados</span>
        <i class="pi pi-chevron-down ent-hist__chev" aria-hidden="true" />
      </div>

      <button class="ent-hist__btn ent-hist__btn--primary" type="button">
        <i class="pi pi-search" aria-hidden="true" />
        Buscar
      </button>
      <button class="ent-hist__btn" type="button">
        <i class="pi pi-replay" aria-hidden="true" />
        Limpiar
      </button>
      <button class="ent-hist__btn" type="button">
        <i class="pi pi-download" aria-hidden="true" />
        Exportar
      </button>
    </div>

    <!-- Resumen -->
    <div class="ent-hist__summary">
      <div class="ent-hist__chip">
        <i class="pi pi-list ent-hist__chip-icon" aria-hidden="true" />
        <div>
          <p class="ent-hist__chip-label">Total repartos</p>
          <p class="ent-hist__chip-value">{{ summary.total }}</p>
        </div>
      </div>
      <div class="ent-hist__chip">
        <i class="pi pi-check-circle ent-hist__chip-icon ent-hist__chip-icon--green" aria-hidden="true" />
        <div>
          <p class="ent-hist__chip-label">Completados</p>
          <p class="ent-hist__chip-value">{{ summary.completed }}</p>
        </div>
      </div>
      <div class="ent-hist__chip">
        <i class="pi pi-clock ent-hist__chip-icon" aria-hidden="true" />
        <div>
          <p class="ent-hist__chip-label">Pendientes</p>
          <p class="ent-hist__chip-value">{{ summary.pending }}</p>
        </div>
      </div>
      <div class="ent-hist__chip">
        <i class="pi pi-exclamation-triangle ent-hist__chip-icon ent-hist__chip-icon--orange" aria-hidden="true" />
        <div>
          <p class="ent-hist__chip-label">Con desvío</p>
          <p class="ent-hist__chip-value">{{ summary.withDeviation }}</p>
        </div>
      </div>
      <div class="ent-hist__chip">
        <i class="pi pi-stopwatch ent-hist__chip-icon" aria-hidden="true" />
        <div>
          <p class="ent-hist__chip-label">ETA promedio</p>
          <p class="ent-hist__chip-value">{{ summary.avgEta }}</p>
        </div>
      </div>
    </div>

    <!-- Tabla -->
    <div class="ent-hist__table-wrap">
      <table class="ent-hist__table" aria-label="Historial de repartos">
        <thead>
          <tr>
            <th>ID</th>
            <th>FECHA</th>
            <th>RESPONSABLE</th>
            <th>VEHÍCULO</th>
            <th>ZONA DESTINO</th>
            <th>CARGA</th>
            <th>ESTADO</th>
            <th>ETA</th>
            <th>HORA REAL</th>
            <th aria-label="Acciones"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in rows" :key="r.id" class="ent-hist__row">
            <td class="ent-hist__cell-id">{{ r.id }}</td>
            <td class="ent-hist__cell-muted">{{ r.date }}</td>
            <td>
              <p class="ent-hist__resp-name">{{ r.deliverer }}</p>
              <p class="ent-hist__resp-dni">DNI: {{ r.dni }}</p>
            </td>
            <td>
              <p class="ent-hist__veh-plate">
                <i :class="`pi ${vehicleIcon(r.vehicle)}`" aria-hidden="true" />
                {{ r.plate }}
              </p>
              <p class="ent-hist__veh-type">{{ r.vehicle }}</p>
            </td>
            <td>
              <span class="ent-hist__zone">
                <i class="pi pi-map-marker" aria-hidden="true" />
                {{ r.zone }}
              </span>
            </td>
            <td class="ent-hist__cell-cargo">
              {{ formatKg(r.cargoKg) }} <span class="ent-hist__kg">kg</span>
            </td>
            <td>
              <span class="ent-hist__status" :class="statusClass(r.status)">
                <i
                  v-if="r.status === 'Con desvío'"
                  class="pi pi-exclamation-triangle"
                  aria-hidden="true"
                />
                <span v-else class="ent-hist__status-dot" aria-hidden="true" />
                {{ r.status }}
              </span>
            </td>
            <td class="ent-hist__cell-muted">{{ r.eta }}</td>
            <td class="ent-hist__cell-strong">{{ r.real ?? '—' }}</td>
            <td>
              <button class="ent-hist__row-btn" type="button" aria-label="Más opciones">
                <i class="pi pi-ellipsis-h" aria-hidden="true" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Footer / paginación -->
    <div class="ent-hist__footer">
      <span class="ent-hist__count">
        Mostrando <strong>1–10</strong> de 120 repartos
      </span>
      <div class="ent-hist__pagination">
        <button class="ent-hist__page-btn" type="button" aria-label="Anterior" disabled>
          <i class="pi pi-chevron-left" aria-hidden="true" />
        </button>
        <button class="ent-hist__page-btn ent-hist__page-btn--active" type="button">1</button>
        <button class="ent-hist__page-btn" type="button">2</button>
        <button class="ent-hist__page-btn" type="button">3</button>
        <span class="ent-hist__page-ellipsis">…</span>
        <button class="ent-hist__page-btn" type="button">12</button>
        <button class="ent-hist__page-btn" type="button" aria-label="Siguiente">
          <i class="pi pi-chevron-right" aria-hidden="true" />
        </button>
      </div>
      <div class="ent-hist__rows-per-page">
        Filas por página:
        <span class="ent-hist__rows-select">
          10
          <i class="pi pi-chevron-down" aria-hidden="true" />
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ent-hist {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 1rem;
}

/* Filtros */
.ent-hist__filters {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.ent-hist__filter {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.7rem;
  border: 1px solid var(--regula-gray-light, #e8ecf0);
  border-radius: var(--regula-radius-btn, 8px);
  background: var(--regula-white, #fff);
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--regula-text-body, #555f6e);
  white-space: nowrap;
}

.ent-hist__filter .pi {
  font-size: 0.78rem;
  color: var(--regula-text-muted, #a5b1bf);
}

.ent-hist__chev {
  margin-left: 0.15rem;
  font-size: 0.65rem !important;
}

.ent-hist__dash {
  color: var(--regula-text-muted, #a5b1bf);
}

.ent-hist__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.85rem;
  border: 1px solid var(--regula-gray-light, #e8ecf0);
  border-radius: var(--regula-radius-btn, 8px);
  background: var(--regula-white, #fff);
  color: var(--regula-text-body, #555f6e);
  font-family: inherit;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.ent-hist__btn:hover {
  background: var(--regula-snow, #f8f8fb);
}

.ent-hist__btn .pi {
  font-size: 0.75rem;
}

.ent-hist__btn--primary {
  background: var(--regula-navy, #172d40);
  border-color: var(--regula-navy, #172d40);
  color: var(--regula-white, #fff);
}

.ent-hist__btn--primary:hover {
  background: #101922;
}

/* Resumen */
.ent-hist__summary {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.75rem;
}

.ent-hist__chip {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.7rem 0.85rem;
  background: var(--regula-white, #fff);
  border: 1px solid var(--regula-gray-light, #e8ecf0);
  border-radius: var(--regula-radius-card, 12px);
}

.ent-hist__chip-icon {
  font-size: 1rem;
  color: var(--regula-text-muted, #a5b1bf);
}

.ent-hist__chip-icon--green {
  color: #16a34a;
}

.ent-hist__chip-icon--orange {
  color: var(--regula-orange, #f26e22);
}

.ent-hist__chip-label {
  font-size: 0.68rem;
  color: var(--regula-text-muted, #a5b1bf);
  margin: 0;
}

.ent-hist__chip-value {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--regula-text-primary, #111);
  margin: 0;
}

/* Tabla */
.ent-hist__table-wrap {
  border-radius: var(--regula-radius-card, 12px);
  overflow: hidden;
  border: 1px solid var(--regula-gray-light, #e8ecf0);
  overflow-x: auto;
}

.ent-hist__table {
  width: 100%;
  border-collapse: collapse;
  background: var(--regula-white, #fff);
}

.ent-hist__table thead th {
  background: var(--regula-navy, #172d40);
  color: var(--regula-white, #fff);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-align: left;
  padding: 0.75rem 0.85rem;
  white-space: nowrap;
}

.ent-hist__row {
  border-bottom: 1px solid var(--regula-gray-light, #e8ecf0);
}

.ent-hist__row:last-child {
  border-bottom: none;
}

.ent-hist__row:hover {
  background: var(--regula-snow, #f8f8fb);
}

.ent-hist__table td {
  padding: 0.7rem 0.85rem;
  vertical-align: middle;
  font-size: 0.8rem;
}

.ent-hist__cell-id {
  font-weight: 700;
  color: var(--regula-text-primary, #111);
}

.ent-hist__cell-muted {
  color: var(--regula-text-body, #555f6e);
  white-space: nowrap;
}

.ent-hist__cell-strong {
  font-weight: 700;
  color: var(--regula-text-primary, #111);
}

.ent-hist__resp-name {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--regula-text-primary, #111);
  margin: 0;
}

.ent-hist__resp-dni {
  font-size: 0.68rem;
  color: var(--regula-text-muted, #a5b1bf);
  margin: 0.1rem 0 0;
}

.ent-hist__veh-plate {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--regula-text-primary, #111);
  margin: 0;
}

.ent-hist__veh-plate .pi {
  font-size: 0.75rem;
  color: var(--regula-text-muted, #a5b1bf);
}

.ent-hist__veh-type {
  font-size: 0.68rem;
  color: var(--regula-text-muted, #a5b1bf);
  margin: 0.1rem 0 0;
}

.ent-hist__zone {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: var(--regula-text-body, #555f6e);
}

.ent-hist__zone .pi {
  font-size: 0.78rem;
  color: var(--regula-orange, #f26e22);
}

.ent-hist__cell-cargo {
  font-weight: 700;
  color: var(--regula-text-primary, #111);
  white-space: nowrap;
}

.ent-hist__kg {
  font-size: 0.68rem;
  font-weight: 500;
  color: var(--regula-text-muted, #a5b1bf);
}

.ent-hist__status {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.74rem;
  font-weight: 600;
  white-space: nowrap;
}

.ent-hist__status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  display: inline-block;
}

.ent-hist__status .pi {
  font-size: 0.7rem;
}

.ent-hist__status--done {
  color: #16a34a;
}

.ent-hist__status--done .ent-hist__status-dot {
  background: #16a34a;
}

.ent-hist__status--deviation {
  color: var(--regula-orange, #f26e22);
}

.ent-hist__status--pending {
  color: var(--regula-text-muted, #a5b1bf);
}

.ent-hist__status--pending .ent-hist__status-dot {
  background: var(--regula-text-muted, #a5b1bf);
}

.ent-hist__row-btn {
  background: none;
  border: none;
  color: var(--regula-text-muted, #a5b1bf);
  cursor: pointer;
  padding: 0.25rem 0.4rem;
  border-radius: 6px;
}

.ent-hist__row-btn:hover {
  background: var(--regula-gray-light, #e8ecf0);
  color: var(--regula-text-primary, #111);
}

/* Footer */
.ent-hist__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.ent-hist__count {
  font-size: 0.78rem;
  color: var(--regula-text-body, #555f6e);
}

.ent-hist__pagination {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.ent-hist__page-btn {
  min-width: 30px;
  height: 30px;
  padding: 0 0.4rem;
  border: 1px solid var(--regula-gray-light, #e8ecf0);
  border-radius: 6px;
  background: var(--regula-white, #fff);
  color: var(--regula-text-body, #555f6e);
  font-family: inherit;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;
}

.ent-hist__page-btn:hover:not(:disabled) {
  background: var(--regula-snow, #f8f8fb);
}

.ent-hist__page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.ent-hist__page-btn--active {
  background: var(--regula-navy, #172d40);
  border-color: var(--regula-navy, #172d40);
  color: var(--regula-white, #fff);
}

.ent-hist__page-ellipsis {
  color: var(--regula-text-muted, #a5b1bf);
  padding: 0 0.2rem;
}

.ent-hist__rows-per-page {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.78rem;
  color: var(--regula-text-body, #555f6e);
}

.ent-hist__rows-select {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.6rem;
  border: 1px solid var(--regula-gray-light, #e8ecf0);
  border-radius: 6px;
  font-weight: 600;
  color: var(--regula-text-primary, #111);
}

.ent-hist__rows-select .pi {
  font-size: 0.6rem;
  color: var(--regula-text-muted, #a5b1bf);
}

@media (max-width: 900px) {
  .ent-hist__summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
