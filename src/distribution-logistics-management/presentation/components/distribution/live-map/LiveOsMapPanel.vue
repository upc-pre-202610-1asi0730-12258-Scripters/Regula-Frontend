<script setup lang="ts">
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { DriverLiveStatus } from '@/domain/distribution/live-driver-location'
import type { LiveDriverLocation } from '@/domain/distribution/live-driver-location'

const props = defineProps<{
  selectedDriver: LiveDriverLocation | undefined
  showNoSignalCard: boolean
  secondsRefresh: number
}>()

const { t } = useI18n()

const statusLabelKey = computed(() => {
  const d = props.selectedDriver
  if (!d) return 'distribution.map.legendInRoute'
  if (d.status === DriverLiveStatus.Completed) return 'distribution.map.legendCompleted'
  if (d.status === DriverLiveStatus.NoSignal) return 'distribution.map.legendNoSignal'
  return 'distribution.map.legendInRoute'
})

const statusSeverity = computed(() => {
  const d = props.selectedDriver
  if (!d) return 'warn' as const
  if (d.status === DriverLiveStatus.Completed) return 'success' as const
  if (d.status === DriverLiveStatus.NoSignal) return 'secondary' as const
  return 'warn' as const
})

const mapSrc = computed(
  () =>
    'https://www.openstreetmap.org/export/embed.html?bbox=-77.095%2C-12.135%2C-76.965%2C-12.005&layer=mapnik',
)

const driverName = computed(() =>
  props.selectedDriver
    ? t(props.selectedDriver.driverDisplayKey, props.selectedDriver.driverDisplayParams ?? {})
    : '',
)

const loadText = computed(() => {
  const d = props.selectedDriver
  if (!d?.loadDescriptionKey) return ''
  return t(d.loadDescriptionKey, d.loadDescriptionParams ?? {})
})

const destinationText = computed(() => {
  const d = props.selectedDriver
  if (!d?.destinationLineKey) return ''
  return t(d.destinationLineKey, d.destinationLineParams ?? {})
})
</script>

<template>
  <div class="map">
    <div class="map__frame-wrap">
      <iframe
        class="map__frame"
        :title="t('distribution.map.mapIframeTitle')"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        :src="mapSrc"
      />

      <div v-if="selectedDriver" class="map__overlay">
        <div v-if="showNoSignalCard" class="card card--alert" role="status">
          <div class="card__title">{{ driverName }} · {{ selectedDriver.vehiclePlate }}</div>
          <p class="card__line">
            {{
              t('distribution.map.noSignalTitle', {
                time: selectedDriver.noSignalSinceLocalTime ?? '—',
              })
            }}
          </p>
          <p class="card__muted">{{ t('distribution.map.noSignalLastKnown') }}</p>
        </div>

        <div v-else class="card" role="region" :aria-label="t('distribution.map.selectDriver')">
          <header class="card__head">
            <div>
              <div class="card__title">{{ driverName }}</div>
              <div class="card__plate">{{ selectedDriver.vehiclePlate }}</div>
            </div>
            <Tag :severity="statusSeverity" rounded>{{ t(statusLabelKey) }}</Tag>
          </header>
          <p v-if="selectedDriver.activeDeliveryHumanCode" class="card__line">
            <strong>{{ t('distribution.map.popupDelivery') }}:</strong>
            {{ selectedDriver.activeDeliveryHumanCode }}
          </p>
          <p v-if="loadText" class="card__line">
            <strong>{{ t('distribution.map.popupLoad') }}:</strong> {{ loadText }}
          </p>
          <p v-if="destinationText" class="card__line">
            <strong>{{ t('distribution.map.popupDestination') }}:</strong> {{ destinationText }}
          </p>
          <p v-if="selectedDriver.etaLocalTime" class="card__line">
            {{ t('distribution.map.popupEta', { time: selectedDriver.etaLocalTime }) }}
          </p>
          <p class="card__muted">
            {{ t('distribution.map.positionRefreshNote', { seconds: 30 }) }}
          </p>
        </div>
      </div>
    </div>

    <Button type="button" class="map__refresh" severity="secondary" :label="t('distribution.map.refreshIn', { seconds: secondsRefresh })" />
  </div>
</template>

<style scoped>
.map {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.map__frame-wrap {
  position: relative;
  border-radius: var(--regula-radius-lg);
  overflow: hidden;
  box-shadow: var(--regula-shadow-card);
  background: var(--regula-color-border-soft);
  min-height: 18rem;
}

@media (min-width: 64rem) {
  .map__frame-wrap {
    min-height: 28rem;
  }
}

.map__frame {
  width: 100%;
  height: clamp(18rem, 50vh, 36rem);
  border: 0;
}

.map__overlay {
  position: absolute;
  right: 0.75rem;
  bottom: 0.75rem;
  left: 0.75rem;
  display: flex;
  justify-content: flex-end;
  pointer-events: none;
}

.card {
  pointer-events: auto;
  max-width: 20rem;
  background: var(--regula-color-bg-pure);
  border-radius: var(--regula-radius-lg);
  padding: 1rem;
  box-shadow: var(--regula-shadow-card);
}

.card--alert {
  background: var(--regula-color-danger-soft);
  border: 1px solid var(--regula-color-accent-alert);
}

.card__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.card__title {
  font-weight: 700;
  font-size: var(--regula-font-size-sm);
  line-height: 1.2;
}

.card__plate {
  font-size: var(--regula-font-size-xs);
  color: var(--regula-app-text-muted);
}

.card__line {
  margin: 0 0 0.75rem;
  font-size: var(--regula-font-size-sm);
  line-height: 1.35;
}

.card__muted {
  margin: 0;
  font-size: var(--regula-font-size-xs);
  color: var(--regula-app-text-muted);
}

.map__refresh {
  align-self: flex-end;
}
</style>
