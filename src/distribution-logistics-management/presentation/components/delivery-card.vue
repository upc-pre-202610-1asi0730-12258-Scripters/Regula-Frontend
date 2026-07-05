<script setup>
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import { useI18n } from 'vue-i18n'
import { useDistributionStore } from '@/distribution-logistics-management/application/distribution.store.js'
import { useToast } from 'primevue/usetoast'

const props = defineProps({
  delivery: {
    type: Object,
    required: true,
  },
})

const { t } = useI18n()
const store = useDistributionStore()
const toast = useToast()

function getStatusSeverity(status) {
  if (status === 'En Ruta') return 'info'
  if (status === 'Completado') return 'success'
  if (status === 'No entregado') return 'danger'
  return 'secondary'
}

function getVehicleIcon(vehicleType) {
  if (vehicleType === 'Moto' || vehicleType === 'Motorizado') return 'pi-motorcycle'
  if (vehicleType === 'Camión' || vehicleType === 'Camion') return 'pi-truck'
  return 'pi-car'
}

const vehicleTypeLabel = (vt) => {
  if (vt === 'Camioneta') return 'Camioneta'
  if (vt === 'Camión' || vt === 'Camion') return 'Camión'
  return 'Motorizado'
}

function changeStatus(status) {
  store.updateStatus(props.delivery.id, status)
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: 'No se pudo actualizar el estado',
        detail: error.response?.data?.error || error.response?.data?.detail || error.message,
        life: 4000,
      })
    })
}
</script>

<template>
  <article class="delivery-card">
    <header class="delivery-card__header">
      <span class="delivery-card__id">{{ delivery.displayId }}</span>
      <Tag
        :value="delivery.status"
        :severity="getStatusSeverity(delivery.status)"
        class="delivery-card__status-tag"
      />
    </header>

    <h3 class="delivery-card__title">{{ delivery.cargo }}</h3>
    <p v-if="delivery.destination" class="delivery-card__destination">{{ delivery.destination }}</p>

    <div class="delivery-card__meta">
      <span class="delivery-card__meta-item">
        <i class="pi pi-user" aria-hidden="true" />
        {{ delivery.delivererName }}
        <span class="delivery-card__badge delivery-card__badge--vehicle">
          {{ vehicleTypeLabel(delivery.vehicleType) }}
        </span>
      </span>
      <span class="delivery-card__meta-item">
        <i :class="`pi ${getVehicleIcon(delivery.vehicleType)}`" aria-hidden="true" />
        {{ delivery.vehiclePlate }}
      </span>
      <span class="delivery-card__meta-item">
        <i class="pi pi-box" aria-hidden="true" />
        {{ delivery.cargo }}
      </span>
    </div>

    <footer class="delivery-card__footer">
      <span
        v-if="delivery.status === 'En Ruta'"
        class="delivery-card__eta"
        :class="delivery.timeDiffMinutes > 0 ? 'delivery-card__eta--late' : ''"
      >
        <i class="pi pi-clock" aria-hidden="true" />
        {{ t('distribution.deliveryCard.eta') }}: {{ delivery.eta ?? '—' }}
        <span v-if="delivery.timeDiffMinutes !== null && delivery.timeDiffMinutes > 0" class="delivery-card__late-badge">
          {{ t('distribution.deliveryCard.late', { minutes: delivery.timeDiffMinutes }) }}
        </span>
      </span>
      <span v-if="delivery.status === 'Completado'" class="delivery-card__completed-time">
        {{ delivery.realTime }}
      </span>
    </footer>

    <div class="delivery-card__actions">
      <Button
        v-if="delivery.status === 'Pendiente'"
        :label="t('distribution.deliveryCard.markEnRoute')"
        icon="pi pi-arrow-right"
        size="small"
        :loading="store.updatingStatusId === delivery.id"
        class="delivery-card__action-btn delivery-card__action-btn--primary"
        @click="changeStatus('En Ruta')"
      />
      <template v-else-if="delivery.status === 'En Ruta'">
        <Button
          :label="t('distribution.deliveryCard.markCompleted')"
          icon="pi pi-check"
          size="small"
          :loading="store.updatingStatusId === delivery.id"
          class="delivery-card__action-btn delivery-card__action-btn--success"
          @click="changeStatus('Completado')"
        />
        <Button
          :label="t('distribution.deliveryCard.markNotDelivered')"
          icon="pi pi-times"
          size="small"
          outlined
          :loading="store.updatingStatusId === delivery.id"
          class="delivery-card__action-btn"
          @click="changeStatus('No entregado')"
        />
      </template>
    </div>
  </article>
</template>

<style scoped>
.delivery-card {
  background: var(--regula-white, #fff);
  border: 1px solid var(--regula-gray-light, #e8ecf0);
  border-radius: var(--regula-radius-card, 12px);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: box-shadow 0.18s ease;
}

.delivery-card:hover {
  box-shadow: var(--regula-shadow-card, 0 2px 8px rgba(23,45,64,0.08));
}

.delivery-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.delivery-card__id {
  font-size: var(--regula-type-small-size, 0.875rem);
  color: var(--regula-text-muted, #a5b1bf);
  font-weight: 600;
}

.delivery-card__status-tag {
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.delivery-card__title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--regula-text-primary, #111);
  margin: 0;
}

.delivery-card__destination {
  font-size: var(--regula-type-small-size, 0.875rem);
  color: var(--regula-text-body, #555f6e);
  margin: 0;
}

.delivery-card__meta {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-top: 0.25rem;
}

.delivery-card__meta-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: var(--regula-type-small-size, 0.875rem);
  color: var(--regula-text-body, #555f6e);
}

.delivery-card__meta-item .pi {
  color: var(--regula-steel, #a5b1bf);
  font-size: 0.8rem;
}

.delivery-card__badge {
  display: inline-block;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
}

.delivery-card__badge--vehicle {
  background: var(--regula-gray-light, #e8ecf0);
  color: var(--regula-gray-mid, #555f6e);
}

.delivery-card__footer {
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.delivery-card__eta {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: var(--regula-type-small-size, 0.875rem);
  color: var(--regula-text-body, #555f6e);
}

.delivery-card__eta .pi {
  font-size: 0.8rem;
}

.delivery-card__late-badge {
  font-size: 0.7rem;
  color: #dc2626;
  font-weight: 600;
}

.delivery-card__completed-time {
  font-size: var(--regula-type-small-size, 0.875rem);
  color: var(--regula-text-muted, #a5b1bf);
}

.delivery-card__actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
}

.delivery-card__action-btn {
  flex: 1;
  min-width: 110px;
  font-size: 0.78rem;
}

.delivery-card__action-btn--primary :deep(.p-button) {
  background: var(--regula-orange, #f26e22);
  border-color: var(--regula-orange, #f26e22);
}

.delivery-card__action-btn--success :deep(.p-button) {
  background: #16a34a;
  border-color: #16a34a;
}
</style>
