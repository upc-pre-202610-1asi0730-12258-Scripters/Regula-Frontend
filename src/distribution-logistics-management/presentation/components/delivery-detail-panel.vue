<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  delivery: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['close'])

function getVehicleIcon(vehicleType) {
  if (vehicleType === 'Moto' || vehicleType === 'Motorizado') return 'pi-motorcycle'
  if (vehicleType === 'Camión' || vehicleType === 'Camion') return 'pi-truck'
  return 'pi-car'
}

function formatTimeDiff(minutes) {
  if (minutes === null) return null
  if (minutes === 0) return t('distribution.detailPanel.onTime')
  if (minutes > 0) return `+${minutes}m`
  return `${minutes}m`
}
</script>

<template>
  <aside class="delivery-detail-panel">
    <header class="delivery-detail-panel__header">
      <div class="delivery-detail-panel__header-inner">
        <i class="pi pi-truck delivery-detail-panel__header-icon" aria-hidden="true" />
        <span class="delivery-detail-panel__header-title">{{ t('distribution.detailPanel.title') }}</span>
      </div>
      <button
        class="delivery-detail-panel__close-btn"
        type="button"
        :aria-label="t('distribution.detailPanel.close')"
        @click="emit('close')"
      >
        <i class="pi pi-times" aria-hidden="true" />
      </button>
    </header>

    <div class="delivery-detail-panel__id-row">
      <span class="delivery-detail-panel__id">{{ delivery.displayId }}</span>
      <span class="delivery-detail-panel__status-dot">●</span>
      <span class="delivery-detail-panel__status-label">{{ delivery.status }}</span>
    </div>
    <p class="delivery-detail-panel__date">{{ delivery.date }} · {{ delivery.realTime ?? delivery.eta }}</p>

    <div class="delivery-detail-panel__body">
      <!-- Repartidor -->
      <section class="delivery-detail-panel__section">
        <h4 class="delivery-detail-panel__section-title">{{ t('distribution.detailPanel.responsible') }}</h4>
        <div class="delivery-detail-panel__person-row">
          <span class="delivery-detail-panel__avatar">
            {{ delivery.delivererName?.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase()).join('') }}
          </span>
          <div>
            <p class="delivery-detail-panel__person-name">{{ delivery.delivererName }}</p>
            <p class="delivery-detail-panel__person-meta">{{ delivery.vehiclePlate }}</p>
          </div>
        </div>
      </section>

      <!-- Vehículo -->
      <section class="delivery-detail-panel__section">
        <h4 class="delivery-detail-panel__section-title">{{ t('distribution.detailPanel.vehicle') }}</h4>
        <div class="delivery-detail-panel__vehicle-row">
          <div class="delivery-detail-panel__vehicle-item">
            <i :class="`pi ${getVehicleIcon(delivery.vehicleType)} delivery-detail-panel__vehicle-icon`" aria-hidden="true" />
            <span class="delivery-detail-panel__vehicle-label">{{ t('distribution.detailPanel.type') }}</span>
            <span class="delivery-detail-panel__vehicle-value">{{ delivery.vehicleType }}</span>
          </div>
          <div class="delivery-detail-panel__vehicle-item">
            <i class="pi pi-id-card delivery-detail-panel__vehicle-icon" aria-hidden="true" />
            <span class="delivery-detail-panel__vehicle-label">{{ t('distribution.detailPanel.plate') }}</span>
            <span class="delivery-detail-panel__vehicle-value">{{ delivery.vehiclePlate }}</span>
          </div>
        </div>
      </section>

      <!-- Carga y Destino -->
      <section class="delivery-detail-panel__section">
        <h4 class="delivery-detail-panel__section-title">{{ t('distribution.detailPanel.cargoAndDestination') }}</h4>
        <div class="delivery-detail-panel__info-row">
          <i class="pi pi-box" aria-hidden="true" />
          <div>
            <span class="delivery-detail-panel__info-label">{{ t('distribution.detailPanel.cargo') }}</span>
            <p class="delivery-detail-panel__info-value">{{ delivery.cargo }}</p>
          </div>
        </div>
        <div class="delivery-detail-panel__info-row">
          <i class="pi pi-map-marker" aria-hidden="true" />
          <div>
            <span class="delivery-detail-panel__info-label">{{ t('distribution.detailPanel.destination') }}</span>
            <p class="delivery-detail-panel__info-value">{{ delivery.destination }}</p>
          </div>
        </div>
      </section>

      <!-- Tiempos -->
      <section class="delivery-detail-panel__section">
        <h4 class="delivery-detail-panel__section-title">{{ t('distribution.detailPanel.times') }}</h4>
        <div class="delivery-detail-panel__times-grid">
          <div class="delivery-detail-panel__time-cell">
            <span class="delivery-detail-panel__time-label">{{ t('distribution.detailPanel.eta') }}</span>
            <span class="delivery-detail-panel__time-value">{{ delivery.eta ?? '—' }}</span>
          </div>
          <div class="delivery-detail-panel__time-cell">
            <span class="delivery-detail-panel__time-label">{{ t('distribution.detailPanel.realTime') }}</span>
            <span class="delivery-detail-panel__time-value">{{ delivery.realTime ?? '—' }}</span>
          </div>
          <div class="delivery-detail-panel__time-cell">
            <span class="delivery-detail-panel__time-label">{{ t('distribution.detailPanel.difference') }}</span>
            <span
              class="delivery-detail-panel__time-value"
              :class="{
                'delivery-detail-panel__time-value--late': delivery.timeDiffMinutes > 0,
                'delivery-detail-panel__time-value--early': delivery.timeDiffMinutes < 0,
              }"
            >
              {{ formatTimeDiff(delivery.timeDiffMinutes) ?? '—' }}
            </span>
          </div>
        </div>
      </section>
    </div>
  </aside>
</template>

<style scoped>
.delivery-detail-panel {
  background: var(--regula-white, #fff);
  border: 1px solid var(--regula-gray-light, #e8ecf0);
  border-radius: var(--regula-radius-card, 12px);
  width: 260px;
  min-width: 240px;
  max-width: 280px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: var(--regula-shadow-card, 0 2px 8px rgba(23,45,64,0.08));
}

.delivery-detail-panel__header {
  background: var(--regula-navy, #172d40);
  color: var(--regula-white, #fff);
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.delivery-detail-panel__header-inner {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.delivery-detail-panel__header-icon {
  color: var(--regula-orange, #f26e22);
  font-size: 1rem;
}

.delivery-detail-panel__header-title {
  font-size: 0.875rem;
  font-weight: 600;
}

.delivery-detail-panel__close-btn {
  background: none;
  border: none;
  color: var(--regula-white, #fff);
  cursor: pointer;
  padding: 0.2rem;
  opacity: 0.7;
  transition: opacity 0.15s;
}

.delivery-detail-panel__close-btn:hover {
  opacity: 1;
}

.delivery-detail-panel__id-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem 0.1rem;
}

.delivery-detail-panel__id {
  font-size: 1rem;
  font-weight: 700;
  color: var(--regula-text-primary, #111);
}

.delivery-detail-panel__status-dot {
  font-size: 0.5rem;
  color: #16a34a;
}

.delivery-detail-panel__status-label {
  font-size: 0.78rem;
  color: #16a34a;
  font-weight: 600;
}

.delivery-detail-panel__date {
  font-size: 0.75rem;
  color: var(--regula-text-muted, #a5b1bf);
  margin: 0;
  padding: 0 1rem 0.5rem;
}

.delivery-detail-panel__body {
  flex: 1;
  overflow-y: auto;
  padding: 0 0 0.5rem;
}

.delivery-detail-panel__section {
  padding: 0.75rem 1rem 0.5rem;
  border-top: 1px solid var(--regula-gray-light, #e8ecf0);
}

.delivery-detail-panel__section-title {
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--regula-text-muted, #a5b1bf);
  letter-spacing: 0.07em;
  margin: 0 0 0.5rem;
}

.delivery-detail-panel__person-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.delivery-detail-panel__avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--regula-navy, #172d40);
  color: var(--regula-white, #fff);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  flex-shrink: 0;
}

.delivery-detail-panel__person-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--regula-text-primary, #111);
  margin: 0;
}

.delivery-detail-panel__person-meta {
  font-size: 0.75rem;
  color: var(--regula-text-muted, #a5b1bf);
  margin: 0;
}

.delivery-detail-panel__vehicle-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.delivery-detail-panel__vehicle-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.delivery-detail-panel__vehicle-icon {
  color: var(--regula-steel, #a5b1bf);
  font-size: 0.875rem;
  width: 16px;
}

.delivery-detail-panel__vehicle-label {
  font-size: 0.75rem;
  color: var(--regula-text-muted, #a5b1bf);
  width: 40px;
}

.delivery-detail-panel__vehicle-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--regula-text-primary, #111);
}

.delivery-detail-panel__info-row {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.delivery-detail-panel__info-row .pi {
  color: var(--regula-orange, #f26e22);
  font-size: 0.875rem;
  margin-top: 0.1rem;
}

.delivery-detail-panel__info-label {
  display: block;
  font-size: 0.7rem;
  color: var(--regula-text-muted, #a5b1bf);
}

.delivery-detail-panel__info-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--regula-text-primary, #111);
  margin: 0;
}

.delivery-detail-panel__times-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.delivery-detail-panel__time-cell {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.delivery-detail-panel__time-label {
  font-size: 0.7rem;
  color: var(--regula-text-muted, #a5b1bf);
}

.delivery-detail-panel__time-value {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--regula-text-primary, #111);
}

.delivery-detail-panel__time-value--late {
  color: #dc2626;
}

.delivery-detail-panel__time-value--early {
  color: #16a34a;
}
</style>
