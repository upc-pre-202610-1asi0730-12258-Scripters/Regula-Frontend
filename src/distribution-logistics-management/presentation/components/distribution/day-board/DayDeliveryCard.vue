<script setup lang="ts">
import Badge from 'primevue/badge'
import Tag from 'primevue/tag'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import type { Delivery } from '@/domain/distribution/delivery'
import { VehicleType } from '@/domain/distribution/vehicle-type'

const props = defineProps<{
  delivery: Delivery
}>()

const { t } = useI18n()

const destination = computed(() =>
  t(props.delivery.destinationLineKey, props.delivery.destinationLineParams ?? {}),
)

const driverName = computed(() =>
  t(props.delivery.driver.driverDisplayKey, props.delivery.driver.driverDisplayParams ?? {}),
)

const loadText = computed(() =>
  t(props.delivery.loadDescriptionKey, props.delivery.loadDescriptionParams ?? {}),
)

const vehicleLabelKey = computed(() =>
  props.delivery.driver.vehicleType === VehicleType.Motorcycle
    ? 'distribution.dayBoard.vehicleMotorcycle'
    : 'distribution.dayBoard.vehicleVan',
)

const vehicleIcon = computed(() =>
  props.delivery.driver.vehicleType === VehicleType.Motorcycle ? 'pi pi-bolt' : 'pi pi-car',
)

const punctualityText = computed(() => {
  if (props.delivery.punctualityKey === 'delayed' && props.delivery.delayMinutes != null) {
    return t('distribution.dayBoard.punctualityDelayed', { minutes: props.delivery.delayMinutes })
  }
  if (props.delivery.punctualityKey === 'onTime') {
    return t('distribution.dayBoard.punctualityOnTime')
  }
  return ''
})

const punctualitySeverity = computed(() =>
  props.delivery.punctualityKey === 'delayed' ? 'danger' : 'success',
)
</script>

<template>
  <article class="card">
    <header class="card__head">
      <div>
        <div class="card__id">{{ delivery.humanCode }}</div>
        <div class="card__dest">{{ destination }}</div>
      </div>
      <Tag severity="warn" rounded>
        {{ t('distribution.dayBoard.statusInRoute') }}
      </Tag>
    </header>

    <div class="card__row">
      <div>
        <div class="card__label">{{ driverName }}</div>
        <div class="card__sub">
          <i :class="['pi', vehicleIcon]" aria-hidden="true" />
          {{ t(vehicleLabelKey) }}
        </div>
      </div>
      <Badge :value="delivery.driver.vehiclePlate" severity="secondary" />
    </div>

    <div class="card__row">
      <span class="card__load">{{ loadText }}</span>
    </div>

    <div class="card__row card__row--split">
      <span class="card__eta">{{ t('distribution.dayBoard.eta', { time: delivery.etaLocalTime }) }}</span>
      <Badge v-if="punctualityText" :severity="punctualitySeverity" rounded>
        {{ punctualityText }}
      </Badge>
    </div>

    <footer class="card__foot">
      <button type="button" class="card__link">
        {{ t('distribution.dayBoard.seeMap') }}
      </button>
    </footer>
  </article>
</template>

<style scoped>
.card {
  background: var(--regula-app-card);
  border-radius: var(--regula-radius-lg);
  padding: 1rem;
  box-shadow: var(--regula-shadow-card);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
}

.card__id {
  font-weight: 700;
  font-size: var(--regula-font-size-sm);
}

.card__dest {
  font-size: var(--regula-font-size-sm);
  color: var(--regula-app-text-muted);
  line-height: 1.35;
  margin-top: 0.25rem;
}

.card__row {
  font-size: var(--regula-font-size-sm);
}

.card__row--split {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.card__label {
  font-weight: 600;
}

.card__sub {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--regula-app-text-muted);
  font-size: var(--regula-font-size-xs);
  margin-top: 0.25rem;
}

.card__load {
  color: var(--regula-app-text);
  line-height: 1.35;
}

.card__eta {
  font-weight: 600;
}

.card__foot {
  display: flex;
  justify-content: flex-end;
}

.card__link {
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  color: var(--regula-color-primary);
  font-weight: 600;
  font-size: var(--regula-font-size-sm);
  text-decoration: underline;
}

.card__link:focus-visible {
  outline: 2px solid var(--regula-color-primary);
  outline-offset: 2px;
}
</style>
