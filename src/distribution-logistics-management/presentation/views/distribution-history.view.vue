<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDistributionStore } from '@/distribution-logistics-management/application/distribution.store.js'
import DeliveryDetailPanel from '../components/delivery-detail-panel.vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'

const { t } = useI18n()
const store = useDistributionStore()

const filteredDeliveries = computed(() => store.filteredHistoryDeliveries)
const selectedDelivery = computed(() => store.selectedDelivery)
const summary = computed(() => store.completedSummary)

function selectDelivery(id) {
  store.selectDelivery(id)
}

function closeDetail() {
  store.clearSelectedDelivery()
}

function getStatusClass(status) {
  if (status === 'Completado') return 'history-view__status--completado'
  if (status === 'No entregado') return 'history-view__status--no-entregado'
  if (status === 'Pendiente') return 'history-view__status--pendiente'
  return 'history-view__status--en-ruta'
}

function getVehicleIcon(vehicleType) {
  if (vehicleType === 'Moto' || vehicleType === 'Motorizado') return 'pi-motorcycle'
  if (vehicleType === 'Camión' || vehicleType === 'Camion') return 'pi-truck'
  return 'pi-car'
}

function formatTimeDiff(diff) {
  if (diff === null) return '—'
  if (diff > 0) return `+${diff}m`
  if (diff < 0) return `${diff}m`
  return '0m'
}

function escapeCsv(value) {
  const str = String(value ?? '')
  return `"${str.replaceAll('"', '""')}"`
}

function handleExport() {
  if (filteredDeliveries.value.length === 0) return

  const headers = ['ID', 'Fecha', 'Repartidor', 'Vehículo', 'Placa', 'Carga', 'Destino', 'Estado', 'ETA', 'Hora real']
  const rows = filteredDeliveries.value.map((d) => [
    d.displayId, d.date, d.delivererName, d.vehicleType, d.vehiclePlate,
    d.cargo, d.destination, d.status, d.eta ?? '', d.realTime ?? '',
  ])

  const csvContent = [headers, ...rows]
      .map((row) => row.map(escapeCsv).join(','))
      .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `historial-repartos-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="history-view">
    <div class="history-view__main">
      <!-- Filters bar -->
      <div class="history-view__filters">
        <div class="history-view__filter-group">
          <i class="pi pi-calendar history-view__filter-icon" aria-hidden="true" />
          <input
            v-model="store.historyDateFilter"
            type="date"
            class="history-view__date-input"
            :aria-label="t('distribution.history.dateFilterLabel')"
          />
        </div>

        <Select
          v-model="store.historyDelivererFilter"
          :options="store.delivererNameOptions"
          class="history-view__select"
        />

        <Select
          v-model="store.historyStatusFilter"
          :options="store.statusOptions"
          class="history-view__select"
        />

        <div class="history-view__search">
          <i class="pi pi-search history-view__search-icon" aria-hidden="true" />
          <input
            v-model="store.historySearchQuery"
            type="text"
            class="history-view__search-input"
            :placeholder="t('distribution.history.searchPlaceholder')"
            :aria-label="t('distribution.history.searchPlaceholder')"
          />
        </div>

        <Button
          :label="t('distribution.history.export')"
          icon="pi pi-download"
          class="history-view__export-btn"
          :disabled="filteredDeliveries.length === 0"
          @click="handleExport"
        />
      </div>

      <!-- Summary chips -->
      <div class="history-view__summary">
        <span class="history-view__summary-chip history-view__summary-chip--completado">
          <span class="history-view__summary-dot history-view__summary-dot--completado" />
          {{ t('distribution.history.completed') }}: {{ summary.completed }}
        </span>
        <span class="history-view__summary-chip history-view__summary-chip--no-entregado">
          <span class="history-view__summary-dot history-view__summary-dot--no-entregado" />
          {{ t('distribution.history.notDelivered') }}: {{ summary.notDelivered }}
        </span>
      </div>

      <!-- Table -->
      <div class="history-view__table-wrapper">
        <table class="history-view__table" :aria-label="t('distribution.hub.history')">
          <thead>
            <tr>
              <th>{{ t('distribution.history.columns.id') }}</th>
              <th>{{ t('distribution.history.columns.date') }}</th>
              <th>{{ t('distribution.history.columns.delivererVehicle') }}</th>
              <th>{{ t('distribution.history.columns.cargo') }}</th>
              <th>{{ t('distribution.history.columns.destination') }}</th>
              <th>{{ t('distribution.history.columns.status') }}</th>
              <th>{{ t('distribution.history.columns.eta') }}</th>
              <th>{{ t('distribution.history.columns.realTime') }}</th>
              <th aria-label="Acciones"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="delivery in filteredDeliveries"
              :key="delivery.id"
              class="history-view__row"
              :class="{ 'history-view__row--selected': store.selectedDeliveryId === delivery.id }"
              @click="selectDelivery(delivery.id)"
            >
              <td class="history-view__cell-id">{{ delivery.displayId }}</td>
              <td class="history-view__cell-date">{{ delivery.date }}</td>
              <td class="history-view__cell-deliverer">
                <div class="history-view__deliverer-info">
                  <span class="history-view__deliverer-avatar history-view__deliverer-avatar--dark">
                    {{ delivery.delivererName?.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase()).join('') }}
                  </span>
                  <div>
                    <p class="history-view__deliverer-name">{{ delivery.delivererName }}</p>
                    <div class="history-view__vehicle-row">
                      <span class="history-view__vehicle-badge">
                        <i :class="`pi ${getVehicleIcon(delivery.vehicleType)}`" aria-hidden="true" />
                        {{ delivery.vehicleType }}
                      </span>
                      <span class="history-view__plate">{{ delivery.vehiclePlate }}</span>
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <span class="history-view__cargo">
                  <i class="pi pi-box" aria-hidden="true" />
                  {{ delivery.cargo }}
                </span>
              </td>
              <td class="history-view__cell-dest">{{ delivery.destination }}</td>
              <td>
                <span class="history-view__status" :class="getStatusClass(delivery.status)">
                  <span class="history-view__status-dot" />
                  {{ delivery.status }}
                </span>
              </td>
              <td class="history-view__cell-time">{{ delivery.eta ?? '—' }}</td>
              <td class="history-view__cell-time">
                {{ delivery.realTime ?? '—' }}
                <span
                  v-if="delivery.timeDiffMinutes !== null"
                  class="history-view__time-diff"
                  :class="{
                    'history-view__time-diff--late': delivery.timeDiffMinutes > 0,
                    'history-view__time-diff--early': delivery.timeDiffMinutes < 0,
                  }"
                >
                  {{ formatTimeDiff(delivery.timeDiffMinutes) }}
                </span>
              </td>
              <td>
                <button
                  class="history-view__row-btn"
                  type="button"
                  :aria-label="`Ver detalle de entrega ${delivery.displayId}`"
                  @click.stop="selectDelivery(delivery.id)"
                >
                  <i class="pi pi-chevron-right" aria-hidden="true" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="filteredDeliveries.length === 0" class="history-view__no-results">
          <i class="pi pi-inbox" aria-hidden="true" />
          <span>{{ t('distribution.history.noResults') }}</span>
        </div>
      </div>
    </div>

    <!-- Detail panel -->
    <transition name="slide-in">
      <DeliveryDetailPanel
        v-if="selectedDelivery"
        :delivery="selectedDelivery"
        @close="closeDetail"
      />
    </transition>
  </div>
</template>

<style scoped>
.history-view {
  display: flex;
  gap: 1rem;
  padding-top: 1rem;
  align-items: flex-start;
}

.history-view__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 0;
}

/* Filters */
.history-view__filters {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.history-view__filter-group {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: var(--regula-white, #fff);
  border: 1px solid var(--regula-gray-light, #e8ecf0);
  border-radius: 6px;
  padding: 0.4rem 0.75rem;
  cursor: pointer;
  transition: border-color 0.15s;
}

.history-view__filter-group:hover {
  border-color: var(--regula-steel, #a5b1bf);
}

.history-view__filter-icon {
  font-size: 0.8rem;
  color: var(--regula-text-muted, #a5b1bf);
}

.history-view__filter-icon--orange {
  color: var(--regula-orange, #f26e22);
}

.history-view__filter-label {
  font-size: 0.8rem;
  color: var(--regula-text-body, #555f6e);
  white-space: nowrap;
}

.history-view__date-input {
  border: none;
  outline: none;
  font-family: inherit;
  font-size: 0.8rem;
  color: var(--regula-text-body, #555f6e);
  background: transparent;
}

.history-view__select {
  min-width: 170px;
}

.history-view__select :deep(.p-select) {
  min-height: 38px;
  font-size: 0.8rem;
}

.history-view__search {
  position: relative;
  flex: 1;
  min-width: 150px;
  max-width: 220px;
}

.history-view__search-icon {
  position: absolute;
  left: 0.6rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--regula-steel, #a5b1bf);
  font-size: 0.8rem;
  pointer-events: none;
}

.history-view__search-input {
  width: 100%;
  padding: 0.4rem 0.75rem 0.4rem 2rem;
  border: 1px solid var(--regula-gray-light, #e8ecf0);
  border-radius: 6px;
  font-size: 0.8rem;
  color: var(--regula-text-primary, #111);
  outline: none;
  transition: border-color 0.15s;
  font-family: inherit;
}

.history-view__search-input:focus {
  border-color: var(--regula-orange, #f26e22);
}

.history-view__export-btn {
  background: var(--regula-orange, #f26e22) !important;
  border-color: var(--regula-orange, #f26e22) !important;
  font-size: 0.8rem;
  white-space: nowrap;
}

.history-view__export-btn:hover {
  background: var(--regula-orange-hover, #f25922) !important;
}

/* Summary */
.history-view__summary {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.history-view__summary-chip {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.25rem 0.6rem;
  border-radius: 9999px;
  border: 1px solid transparent;
}

.history-view__summary-chip--completado {
  background: #dcfce7;
  color: #16a34a;
  border-color: #bbf7d0;
}

.history-view__summary-chip--no-entregado {
  background: #fef9c3;
  color: #ca8a04;
  border-color: #fef08a;
}

.history-view__summary-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.history-view__summary-dot--completado { background: #16a34a; }
.history-view__summary-dot--no-entregado { background: #ca8a04; }

/* Table */
.history-view__table-wrapper {
  background: var(--regula-white, #fff);
  border: 1px solid var(--regula-gray-light, #e8ecf0);
  border-radius: var(--regula-radius-card, 12px);
  overflow: auto;
}

.history-view__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;
}

.history-view__table thead tr {
  border-bottom: 1px solid var(--regula-gray-light, #e8ecf0);
}

.history-view__table th {
  padding: 0.6rem 0.75rem;
  text-align: left;
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--regula-text-muted, #a5b1bf);
  letter-spacing: 0.05em;
  white-space: nowrap;
}

.history-view__row {
  border-bottom: 1px solid var(--regula-gray-light, #e8ecf0);
  cursor: pointer;
  transition: background 0.12s;
}

.history-view__row:hover {
  background: #fafbfc;
}

.history-view__row--selected {
  background: #fff7ed;
}

.history-view__row td {
  padding: 0.65rem 0.75rem;
  vertical-align: middle;
  color: var(--regula-text-body, #555f6e);
}

.history-view__cell-id {
  font-weight: 700;
  color: var(--regula-text-primary, #111) !important;
  white-space: nowrap;
}

.history-view__cell-date {
  white-space: nowrap;
  font-size: 0.78rem;
}

.history-view__deliverer-info {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.history-view__deliverer-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: 700;
  flex-shrink: 0;
  color: #fff;
}

.history-view__deliverer-avatar--dark {
  background: var(--regula-navy, #172d40);
}

.history-view__deliverer-name {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--regula-text-primary, #111);
  margin: 0 0 0.1rem;
  white-space: nowrap;
}

.history-view__vehicle-row {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.history-view__vehicle-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background: var(--regula-navy, #172d40);
  color: var(--regula-white, #fff);
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
}

.history-view__plate {
  font-size: 0.72rem;
  color: var(--regula-text-muted, #a5b1bf);
}

.history-view__cargo {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  white-space: nowrap;
}

.history-view__cargo .pi {
  color: var(--regula-orange, #f26e22);
  font-size: 0.8rem;
}

.history-view__cell-dest {
  font-size: 0.78rem;
  max-width: 140px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.history-view__status {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.history-view__status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.history-view__status--completado .history-view__status-dot { background: #16a34a; }
.history-view__status--completado { color: #16a34a; }

.history-view__status--no-entregado .history-view__status-dot { background: #dc2626; }
.history-view__status--no-entregado { color: #dc2626; }

.history-view__status--en-ruta .history-view__status-dot { background: var(--regula-orange, #f26e22); }
.history-view__status--en-ruta { color: var(--regula-orange, #f26e22); }

.history-view__status--pendiente .history-view__status-dot { background: var(--regula-steel, #a5b1bf); }
.history-view__status--pendiente { color: var(--regula-gray-mid, #555f6e); }

.history-view__cell-time {
  font-weight: 600;
  color: var(--regula-text-primary, #111) !important;
  white-space: nowrap;
}

.history-view__time-diff {
  font-size: 0.7rem;
  font-weight: 700;
  margin-left: 0.25rem;
}

.history-view__time-diff--late { color: #dc2626; }
.history-view__time-diff--early { color: #16a34a; }

.history-view__row-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--regula-text-muted, #a5b1bf);
  padding: 0.2rem;
  border-radius: 4px;
  transition: color 0.15s, background 0.15s;
}

.history-view__row-btn:hover {
  color: var(--regula-orange, #f26e22);
  background: #fff7ed;
}

.history-view__no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 3rem 1rem;
  color: var(--regula-text-muted, #a5b1bf);
  font-size: 0.85rem;
}

.history-view__no-results .pi {
  font-size: 2rem;
}

/* Detail panel transition */
.slide-in-enter-active,
.slide-in-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.slide-in-enter-from,
.slide-in-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
