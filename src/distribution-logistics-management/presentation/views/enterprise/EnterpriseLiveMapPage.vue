<script setup lang="ts">
import Tag from 'primevue/tag'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

type VehicleItem = {
  id: string
  name: string
  plate: string
  zone: string
  eta: string
  status: 'in_route' | 'active'
}

const vehicles = computed<VehicleItem[]>(() => [
  { id: 'v1', name: 'Carlos Ríos\nVega', plate: 'XYZ-456', zone: 'Zona Sur', eta: '14:30', status: 'in_route' },
  { id: 'v2', name: 'Miguel Torres', plate: 'ABC-123', zone: 'Zona Norte', eta: '15:15', status: 'active' },
  { id: 'v3', name: 'Luis Gómez', plate: 'LHN-789', zone: 'Zona Este', eta: '16:00', status: 'active' },
])

const selectedId = ref('v1')
const selected = computed(() => vehicles.value.find((v) => v.id === selectedId.value))

const mapSrc = computed(
  () =>
    'https://www.openstreetmap.org/export/embed.html?bbox=-77.095%2C-12.135%2C-76.965%2C-12.005&layer=mapnik',
)
</script>

<template>
  <div class="page">
    <aside class="panel">
      <header class="panel__head">
        <div class="panel__title">
          {{ t('distributionEnterprise.liveMap.vehiclesActiveTitle') }}
          <span class="panel__count">{{ vehicles.length }}</span>
        </div>
        <div class="panel__sub">
          <span class="dot" aria-hidden="true" />
          {{ t('distributionEnterprise.liveMap.refreshNote') }}
        </div>
      </header>

      <div class="panel__list">
        <button
          v-for="v in vehicles"
          :key="v.id"
          type="button"
          class="row"
          :class="{ 'row--active': v.id === selectedId }"
          @click="selectedId = v.id"
        >
          <div class="row__avatar" aria-hidden="true">{{ v.name.trim().slice(0, 1) }}</div>
          <div class="row__main">
            <div class="row__name">{{ v.name }}</div>
            <div class="row__plate">{{ v.plate }}</div>
          </div>
          <Tag
            :severity="v.status === 'in_route' ? 'warn' : 'success'"
            rounded
          >
            {{ v.status === 'in_route' ? t('distributionEnterprise.common.inRoute') : t('distributionEnterprise.common.active') }}
          </Tag>

          <div class="row__meta">
            <span><i class="pi pi-map-marker" aria-hidden="true" /> {{ v.zone }}</span>
            <span><i class="pi pi-clock" aria-hidden="true" /> ETA {{ v.eta }}</span>
          </div>
        </button>
      </div>
    </aside>

    <section class="map">
      <div class="map__frame">
        <iframe class="map__iframe" :src="mapSrc" title="Mapa" loading="lazy" />
        <div v-if="selected" class="map__card">
          <div class="map__card-top">
            <div class="plate">{{ selected.plate }}</div>
            <Tag severity="warn" rounded>{{ t('distributionEnterprise.common.inRoute') }}</Tag>
          </div>
          <div class="map__card-line"><strong>{{ t('distributionEnterprise.common.driver') }}:</strong> {{ selected.name.replace('\\n', ' ') }}</div>
          <div class="map__card-line"><strong>{{ t('distributionEnterprise.common.load') }}:</strong> 20 balones de 10 kg</div>
          <div class="map__card-line"><strong>ETA:</strong> {{ selected.eta }}</div>
          <div class="map__card-muted">{{ t('distributionEnterprise.liveMap.lastSeen') }}</div>
        </div>
      </div>

      <div class="legend">
        <div class="legend__item"><span class="badge badge--route" /> {{ t('distributionEnterprise.common.inRoute') }}</div>
        <div class="legend__item"><span class="badge badge--active" /> {{ t('distributionEnterprise.common.active') }}</div>
        <div class="legend__item"><span class="badge badge--dest" /> {{ t('distributionEnterprise.common.destination') }}</div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page {
  display: grid;
  gap: 1.25rem;
}

@media (min-width: 64rem) {
  .page {
    grid-template-columns: 22rem 1fr;
    align-items: start;
  }
}

.panel {
  background: var(--regula-app-card);
  border: 1px solid var(--regula-color-border-soft);
  border-radius: 0.75rem;
  box-shadow: var(--regula-shadow-card);
  overflow: hidden;
}

.panel__head {
  padding: 1rem;
}

.panel__title {
  font-weight: 900;
  color: var(--regula-color-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.panel__count {
  width: 1.35rem;
  height: 1.35rem;
  border-radius: 999px;
  display: grid;
  place-items: center;
  font-size: 0.75rem;
  font-weight: 900;
  background: rgba(242, 110, 34, 0.18);
  color: var(--regula-color-accent);
}

.panel__sub {
  margin-top: 0.35rem;
  font-size: 0.75rem;
  color: var(--regula-app-text-muted);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.dot {
  width: 0.35rem;
  height: 0.35rem;
  border-radius: 999px;
  background: #22c55e;
}

.panel__list {
  padding: 0 1rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.row {
  width: 100%;
  border: 1px solid var(--regula-color-border-soft);
  border-radius: 0.75rem;
  background: var(--regula-color-bg-pure);
  padding: 0.85rem;
  display: grid;
  grid-template-columns: 2rem 1fr auto;
  gap: 0.75rem;
  text-align: left;
  cursor: pointer;
  position: relative;
}

.row--active {
  border-color: var(--regula-color-accent);
  box-shadow: 0 0 0 2px rgba(242, 110, 34, 0.18);
}

.row__avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  background: rgba(242, 110, 34, 0.15);
  display: grid;
  place-items: center;
  font-weight: 900;
  color: var(--regula-color-accent);
}

.row__name {
  font-weight: 900;
  color: var(--regula-color-primary);
  line-height: 1.2;
}

.row__plate {
  margin-top: 0.2rem;
  font-size: 0.75rem;
  color: var(--regula-app-text-muted);
}

.row__meta {
  grid-column: 1 / -1;
  margin-top: 0.65rem;
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: var(--regula-app-text-muted);
}

.map__frame {
  position: relative;
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid var(--regula-color-border-soft);
  box-shadow: var(--regula-shadow-card);
  background: var(--regula-color-bg-ice);
}

.map__iframe {
  width: 100%;
  height: clamp(22rem, 60vh, 40rem);
  border: 0;
}

.map__card {
  position: absolute;
  top: 1rem;
  left: 1rem;
  max-width: 17rem;
  background: var(--regula-color-bg-pure);
  border-radius: 0.75rem;
  border: 1px solid var(--regula-color-border-soft);
  padding: 0.9rem;
  box-shadow: var(--regula-shadow-card);
}

.map__card-top {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.plate {
  font-weight: 900;
  color: var(--regula-color-primary);
}

.map__card-line {
  font-size: 0.85rem;
  line-height: 1.35;
  margin: 0 0 0.55rem;
}

.map__card-muted {
  font-size: 0.75rem;
  color: var(--regula-app-text-muted);
  margin-top: 0.25rem;
}

.legend {
  margin-top: 0.75rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: var(--regula-app-text-muted);
}

.legend__item {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.badge {
  width: 0.65rem;
  height: 0.65rem;
  border-radius: 999px;
  display: inline-block;
}

.badge--route {
  background: #f97316;
}

.badge--active {
  background: #22c55e;
}

.badge--dest {
  background: #0ea5e9;
}
</style>

