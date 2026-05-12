<script setup lang="ts">
import Tag from 'primevue/tag'
import { useI18n } from 'vue-i18n'

import { DriverLiveStatus } from '@/domain/distribution/live-driver-location'
import type { LiveDriverLocation } from '@/domain/distribution/live-driver-location'

const props = defineProps<{
  drivers: readonly LiveDriverLocation[]
  selectedDriverId: string | null
}>()

const emit = defineEmits<{
  select: [driverId: string]
}>()

const { t } = useI18n()

function statusKey(status: LiveDriverLocation['status']): string {
  if (status === DriverLiveStatus.Completed) return 'distribution.map.legendCompleted'
  if (status === DriverLiveStatus.NoSignal) return 'distribution.map.legendNoSignal'
  return 'distribution.map.legendInRoute'
}

function statusSeverity(
  status: LiveDriverLocation['status'],
): 'success' | 'secondary' | 'warn' {
  if (status === DriverLiveStatus.Completed) return 'success'
  if (status === DriverLiveStatus.NoSignal) return 'secondary'
  return 'warn'
}
</script>

<template>
  <aside class="panel" :aria-label="t('distribution.map.activeDriversTitle', { count: drivers.length })">
    <header class="panel__head">
      <h2 class="panel__title">
        {{ t('distribution.map.activeDriversTitle', { count: drivers.length }) }}
      </h2>
      <p class="panel__sub">
        {{ t('distribution.map.refreshSubtitle', { seconds: 30 }) }}
      </p>
    </header>

    <ul class="panel__list">
      <li v-for="d in drivers" :key="d.driverId">
        <button
          type="button"
          class="row"
          :class="{ 'row--active': d.driverId === selectedDriverId }"
          @click="emit('select', d.driverId)"
        >
          <div>
            <div class="row__name">{{ t(d.driverDisplayKey, d.driverDisplayParams ?? {}) }}</div>
            <div class="row__plate">{{ d.vehiclePlate }}</div>
          </div>
          <Tag :severity="statusSeverity(d.status)" rounded>
            {{ t(statusKey(d.status)) }}
          </Tag>
        </button>
      </li>
    </ul>

    <footer class="panel__legend" role="group" :aria-label="t('distribution.map.mapTitle')">
      <span><i class="dot dot--route" aria-hidden="true" /> {{ t('distribution.map.legendInRoute') }}</span>
      <span><i class="dot dot--done" aria-hidden="true" /> {{ t('distribution.map.legendCompleted') }}</span>
      <span><i class="dot dot--muted" aria-hidden="true" /> {{ t('distribution.map.legendNoSignal') }}</span>
    </footer>
  </aside>
</template>

<style scoped>
.panel {
  width: 100%;
  max-width: 22rem;
  align-self: flex-start;
  background: var(--regula-app-card);
  border-radius: var(--regula-radius-lg);
  padding: 1rem;
  box-shadow: var(--regula-shadow-card);
}

@media (min-width: 64rem) {
  .panel {
    flex-shrink: 0;
  }
}

.panel__head {
  margin-bottom: 1rem;
}

.panel__title {
  margin: 0 0 0.25rem;
  font-size: var(--regula-font-size-md);
}

.panel__sub {
  margin: 0;
  font-size: var(--regula-font-size-xs);
  color: var(--regula-app-text-muted);
}

.panel__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.row {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: var(--regula-radius-md);
  border: 1px solid var(--regula-color-border-soft);
  background: var(--regula-color-bg-pure);
  cursor: pointer;
  text-align: left;
}

.row > div {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.row--active {
  border-color: var(--regula-color-primary);
  box-shadow: 0 0 0 1px rgba(249, 115, 22, 0.25);
}

.row:focus-visible {
  outline: 2px solid var(--regula-color-primary);
  outline-offset: 2px;
}

.row__name {
  font-weight: 600;
  font-size: var(--regula-font-size-sm);
}

.row__plate {
  font-size: var(--regula-font-size-xs);
  color: var(--regula-app-text-muted);
}

.panel__legend {
  margin-top: 1rem;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.75rem;
  font-size: var(--regula-font-size-xs);
  color: var(--regula-app-text-muted);
}

.dot {
  display: inline-block;
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 999px;
  margin-right: 0.35rem;
  vertical-align: middle;
}

.dot--route {
  background: var(--regula-color-primary);
}

.dot--done {
  background: var(--regula-color-success);
}

.dot--muted {
  background: var(--regula-color-steel);
}
</style>
