<script setup lang="ts">
import Button from 'primevue/button'
import Drawer from 'primevue/drawer'
import Tag from 'primevue/tag'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { DeliveryHistoryOutcome } from '@/domain/distribution/delivery-history-outcome'
import type { DeliveryHistoryEntry } from '@/domain/distribution/delivery-history-entry'
import { VehicleType } from '@/domain/distribution/vehicle-type'
import { useUiDateFormatter } from '@/presentation/composables/use-ui-date-formatter'

const visible = defineModel<boolean>('visible', { default: false })

const props = defineProps<{
  entry: DeliveryHistoryEntry | null
}>()

const { t } = useI18n()
const { formatLongDateTime } = useUiDateFormatter()

const headerTitle = computed(() => (props.entry ? props.entry.humanCode : ''))

const outcomeSeverity = computed(() =>
  props.entry?.outcome === DeliveryHistoryOutcome.Completed ? 'success' : 'danger',
)

const outcomeLabelKey = computed(() =>
  props.entry?.outcome === DeliveryHistoryOutcome.Completed
    ? 'distribution.history.outcomeCompleted'
    : 'distribution.history.outcomeNotDelivered',
)

const subtitle = computed(() => {
  if (!props.entry) return ''
  return formatLongDateTime(props.entry.dateIso, props.entry.actualLocalTime)
})

const vehicleIcon = computed(() =>
  props.entry?.vehicleType === VehicleType.Motorcycle ? 'pi pi-bolt' : 'pi pi-car',
)

const vehicleLabelKey = computed(() =>
  props.entry?.vehicleType === VehicleType.Motorcycle
    ? 'distribution.dayBoard.vehicleMotorcycle'
    : 'distribution.dayBoard.vehicleVan',
)

const actualTimeClass = computed(() => {
  const d = props.entry?.deltaMinutes ?? 0
  if (d < 0) return 'drawer__strong drawer__time--early'
  if (d > 0) return 'drawer__strong drawer__time--late'
  return 'drawer__strong'
})

const deltaClass = computed(() => {
  const d = props.entry?.deltaMinutes ?? 0
  if (d < 0) return 'drawer__delta--early'
  if (d > 0) return 'drawer__delta--late'
  return ''
})

function deltaSign(delta: number) {
  return delta > 0 ? '+' : ''
}
</script>

<template>
  <Drawer
    v-model:visible="visible"
    position="right"
    class="drawer"
    :block-scroll="true"
    :dismissable="true"
    :show-close-icon="true"
    :aria-label="t('distribution.history.drawerTitle')"
  >
    <template v-if="entry">
      <div class="drawer__hero">
        <div class="drawer__hero-icon" aria-hidden="true">
          <i class="pi pi-truck" />
        </div>
        <div class="drawer__hero-text">
          <div class="drawer__hero-row">
            <span class="drawer__hero-id">{{ headerTitle }}</span>
            <Tag :severity="outcomeSeverity" rounded>{{ t(outcomeLabelKey) }}</Tag>
          </div>
          <p class="drawer__hero-sub">{{ subtitle }}</p>
        </div>
      </div>

      <div class="drawer__section">
        <h3 class="drawer__h">{{ t('distribution.history.drawerDriver') }}</h3>
        <div class="drawer__row">
          <div class="drawer__avatar" aria-hidden="true">{{ entry.driverInitials }}</div>
          <div>
            <div class="drawer__strong">{{ t(entry.driverDisplayKey, entry.driverDisplayParams ?? {}) }}</div>
            <div class="drawer__muted">{{ entry.humanCode }}</div>
          </div>
        </div>
      </div>

      <div class="drawer__section">
        <h3 class="drawer__h">{{ t('distribution.history.drawerVehicle') }}</h3>
        <div class="drawer__row">
          <i :class="['pi', vehicleIcon]" aria-hidden="true" />
          <div>
            <div class="drawer__strong">{{ t(vehicleLabelKey) }}</div>
            <div class="drawer__muted">{{ entry.vehiclePlate }}</div>
          </div>
        </div>
      </div>

      <div class="drawer__section">
        <h3 class="drawer__h">{{ t('distribution.history.drawerLoadDestination') }}</h3>
        <div class="drawer__stack">
          <div class="drawer__row">
            <i class="pi pi-database" aria-hidden="true" />
            <span>{{ t(entry.loadDescriptionKey, entry.loadDescriptionParams ?? {}) }}</span>
          </div>
          <div class="drawer__row">
            <i class="pi pi-map-marker" aria-hidden="true" />
            <span>{{ t(entry.destinationLineKey, entry.destinationLineParams ?? {}) }}</span>
          </div>
        </div>
      </div>

      <div class="drawer__section">
        <h3 class="drawer__h">{{ t('distribution.history.drawerTimes') }}</h3>
        <div class="drawer__grid">
          <div>
            <div class="drawer__muted">{{ t('distribution.history.drawerEta') }}</div>
            <div class="drawer__strong">{{ entry.etaLocalTime }}</div>
          </div>
          <div>
            <div class="drawer__muted">{{ t('distribution.history.drawerActual') }}</div>
            <div :class="actualTimeClass">{{ entry.actualLocalTime }}</div>
          </div>
          <div>
            <div class="drawer__muted">{{ t('distribution.history.drawerDelta') }}</div>
            <div class="drawer__strong" :class="deltaClass">
              {{
                t('distribution.history.deltaMinutes', {
                  sign: deltaSign(entry.deltaMinutes),
                  minutes: Math.abs(entry.deltaMinutes),
                })
              }}
            </div>
          </div>
        </div>
      </div>

      <Button
        type="button"
        icon="pi pi-download"
        class="drawer__cta"
        :label="t('distribution.history.drawerDownload')"
      />
    </template>
  </Drawer>
</template>

<style scoped>
.drawer__hero {
  display: flex;
  gap: var(--regula-space-3);
  padding: var(--regula-space-4);
  background: var(--regula-color-primary);
  color: #ffffff;
  border-radius: var(--regula-radius-md);
  margin-bottom: var(--regula-space-5);
}

.drawer__hero-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--regula-radius-md);
  background: rgba(242, 110, 34, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
}

.drawer__hero-row {
  display: flex;
  align-items: center;
  gap: var(--regula-space-2);
  flex-wrap: wrap;
}

.drawer__hero-id {
  font-weight: 800;
  font-size: var(--regula-font-size-lg);
}

.drawer__hero-sub {
  margin: var(--regula-space-2) 0 0;
  font-size: var(--regula-font-size-sm);
  opacity: 0.85;
}

.drawer__section {
  margin-bottom: var(--regula-space-5);
}

.drawer__h {
  margin: 0 0 var(--regula-space-2);
  font-size: var(--regula-font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--regula-app-text-muted);
}

.drawer__row {
  display: flex;
  align-items: center;
  gap: var(--regula-space-3);
  font-size: var(--regula-font-size-sm);
}

.drawer__stack {
  display: flex;
  flex-direction: column;
  gap: var(--regula-space-3);
}

.drawer__avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 999px;
  background: var(--regula-color-bg-ice);
  color: var(--regula-color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: var(--regula-font-size-sm);
}

.drawer__strong {
  font-weight: 600;
}

.drawer__muted {
  color: var(--regula-app-text-muted);
  font-size: var(--regula-font-size-xs);
}

.drawer__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--regula-space-3);
}

@media (max-width: 47.999rem) {
  .drawer__grid {
    grid-template-columns: 1fr;
  }
}

.drawer__time--early {
  color: var(--regula-color-success);
}

.drawer__time--late {
  color: var(--regula-color-warning);
}

.drawer__delta--early {
  color: var(--regula-color-success);
}

.drawer__delta--late {
  color: var(--regula-color-warning);
}

.drawer__cta {
  width: 100%;
  margin-top: var(--regula-space-2);
}
</style>
