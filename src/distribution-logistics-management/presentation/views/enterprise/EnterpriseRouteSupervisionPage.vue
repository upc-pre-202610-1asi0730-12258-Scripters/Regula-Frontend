<script setup lang="ts">
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import Tag from 'primevue/tag'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const mapSrc = computed(
  () =>
    'https://www.openstreetmap.org/export/embed.html?bbox=-77.095%2C-12.135%2C-76.965%2C-12.005&layer=mapnik',
)

const routeOptions = [
  { label: 'Reparto #0045 — ABC-123 — En curso', value: 'r45' },
  { label: 'Reparto #0046 — XYZ-456 — En curso', value: 'r46' },
]

const selectedRoute = ref(routeOptions[0]?.value)
</script>

<template>
  <div class="page">
    <div class="alertbar">
      <div class="alertbar__left">
        <i class="pi pi-exclamation-triangle" aria-hidden="true" />
        <span>{{ t('distributionEnterprise.supervision.alertLine') }}</span>
      </div>
      <Button size="small" class="alertbar__btn">
        <i class="pi pi-map" aria-hidden="true" />
        <span>{{ t('distributionEnterprise.supervision.viewOnMap') }}</span>
      </Button>
    </div>

    <div class="filters">
      <div class="filters__item">
        <span class="filters__label">{{ t('distributionEnterprise.supervision.activeDispatch') }}</span>
        <Dropdown v-model="selectedRoute" :options="routeOptions" option-label="label" option-value="value" />
      </div>
      <InputText class="filters__search" :placeholder="t('distributionEnterprise.supervision.searchPlaceholder')" />
      <Tag severity="warn" rounded>{{ t('distributionEnterprise.supervision.deviationActive') }}</Tag>
      <Tag severity="success" rounded>{{ t('distributionEnterprise.supervision.inProgress') }}</Tag>
    </div>

    <div class="grid">
      <section class="map">
        <div class="map__frame">
          <iframe class="map__iframe" :src="mapSrc" title="Mapa" loading="lazy" />
          <div class="map__legend">
            <div class="legend__title">{{ t('distributionEnterprise.supervision.legendTitle') }}</div>
            <div class="legend__item"><span class="swatch swatch--planned" /> {{ t('distributionEnterprise.supervision.legendPlanned') }}</div>
            <div class="legend__item"><span class="swatch swatch--actual" /> {{ t('distributionEnterprise.supervision.legendActual') }}</div>
            <div class="legend__item"><span class="swatch swatch--ok" /> {{ t('distributionEnterprise.supervision.legendCompleted') }}</div>
            <div class="legend__item"><span class="swatch swatch--pending" /> {{ t('distributionEnterprise.supervision.legendPending') }}</div>
            <div class="legend__item"><span class="swatch swatch--risk" /> {{ t('distributionEnterprise.supervision.legendRisk') }}</div>
          </div>
        </div>
      </section>

      <aside class="side">
        <div class="side__card">
          <div class="side__title">{{ t('distributionEnterprise.supervision.routeDetail') }}</div>
          <div class="side__person">
            <div class="side__avatar" aria-hidden="true">M</div>
            <div>
              <div class="side__name">Miguel Torres</div>
              <div class="side__sub">ABC-123 • Zona Norte</div>
            </div>
            <Tag severity="warn" rounded>{{ t('distributionEnterprise.supervision.inCourse') }}</Tag>
          </div>

          <div class="stops">
            <div class="stops__title">{{ t('distributionEnterprise.supervision.stopsTitle') }}</div>
            <div class="stop stop--ok">
              <div class="stop__n">1</div>
              <div class="stop__main">
                <div class="stop__addr">Av. Larco 452</div>
                <div class="stop__meta">ETA 13:45 • Real 13:48</div>
              </div>
              <Tag severity="success" rounded>{{ t('distributionEnterprise.common.delivered') }}</Tag>
            </div>
            <div class="stop stop--risk">
              <div class="stop__n">2</div>
              <div class="stop__main">
                <div class="stop__addr">Jr. Unión 118</div>
                <div class="stop__meta">ETA 14:15 • Desvío detectado</div>
              </div>
              <Tag severity="warn" rounded>{{ t('distributionEnterprise.supervision.deviation') }}</Tag>
            </div>
            <div class="stop">
              <div class="stop__n">3</div>
              <div class="stop__main">
                <div class="stop__addr">Calle Lima 90</div>
                <div class="stop__meta">ETA 14:50</div>
              </div>
              <Tag severity="secondary" rounded>{{ t('distributionEnterprise.common.pending') }}</Tag>
            </div>
          </div>
        </div>

        <div class="side__card">
          <div class="side__title">{{ t('distributionEnterprise.supervision.deviationLogTitle') }}</div>
          <div class="log">
            <div class="log__item log__item--risk">
              <div class="log__name">Desvío activo — Punto 2</div>
              <div class="log__meta">800m fuera de ruta planificada • 14:22</div>
            </div>
            <div class="log__item">
              <div class="log__name">Desvío resuelto — Punto 1</div>
              <div class="log__meta">320m • Resuelto automáticamente • 13:47</div>
            </div>
          </div>
        </div>

        <Button class="side__btn" severity="secondary" outlined>
          <i class="pi pi-download" aria-hidden="true" />
          <span>{{ t('distributionEnterprise.supervision.downloadPdf') }}</span>
        </Button>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.alertbar {
  background: #fff7d1;
  border: 1px solid #fde68a;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.alertbar__left {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 800;
  color: var(--regula-color-primary);
  font-size: 0.9rem;
}

.alertbar__btn {
  display: inline-flex;
  gap: 0.5rem;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}

.filters__item {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.filters__label {
  font-size: 0.85rem;
  font-weight: 800;
  color: var(--regula-color-primary);
}

.filters__search {
  flex: 1 1 18rem;
}

.grid {
  display: grid;
  gap: 1rem;
}

@media (min-width: 64rem) {
  .grid {
    grid-template-columns: 1fr 22rem;
    align-items: start;
  }
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
  height: clamp(26rem, 62vh, 44rem);
  border: 0;
}

.map__legend {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid var(--regula-color-border-soft);
  border-radius: 0.75rem;
  padding: 0.85rem;
  box-shadow: var(--regula-shadow-card);
  font-size: 0.75rem;
  color: var(--regula-app-text-muted);
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  width: 12.5rem;
}

.legend__title {
  font-weight: 900;
  color: var(--regula-color-primary);
  margin-bottom: 0.25rem;
}

.legend__item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.swatch {
  width: 0.75rem;
  height: 0.25rem;
  border-radius: 999px;
  display: inline-block;
}

.swatch--planned {
  background: #0f172a;
}
.swatch--actual {
  background: #22c55e;
}
.swatch--ok {
  background: #16a34a;
}
.swatch--pending {
  background: #f59e0b;
}
.swatch--risk {
  background: #ef4444;
}

.side {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.side__card {
  background: var(--regula-app-card);
  border: 1px solid var(--regula-color-border-soft);
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: var(--regula-shadow-card);
}

.side__title {
  font-weight: 900;
  color: var(--regula-color-primary);
  margin-bottom: 0.75rem;
}

.side__person {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.side__avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  background: rgba(23, 45, 64, 0.1);
  display: grid;
  place-items: center;
  font-weight: 900;
  color: var(--regula-color-primary);
}

.side__name {
  font-weight: 900;
  color: var(--regula-color-primary);
}

.side__sub {
  font-size: 0.75rem;
  color: var(--regula-app-text-muted);
  margin-top: 0.15rem;
}

.stops__title {
  font-weight: 900;
  color: var(--regula-color-primary);
  font-size: 0.85rem;
  margin-bottom: 0.75rem;
}

.stop {
  display: grid;
  grid-template-columns: 1.6rem 1fr auto;
  gap: 0.75rem;
  align-items: center;
  padding: 0.75rem;
  border-radius: 0.75rem;
  background: #f8fafc;
  border: 1px solid var(--regula-color-border-soft);
  margin-bottom: 0.6rem;
}

.stop--ok {
  background: #ecfdf5;
}

.stop--risk {
  background: #fff7ed;
}

.stop__n {
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 999px;
  display: grid;
  place-items: center;
  font-weight: 900;
  background: rgba(23, 45, 64, 0.08);
  color: var(--regula-color-primary);
}

.stop__addr {
  font-weight: 900;
  color: var(--regula-color-primary);
}

.stop__meta {
  font-size: 0.75rem;
  color: var(--regula-app-text-muted);
  margin-top: 0.2rem;
}

.log {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.log__item {
  border: 1px solid var(--regula-color-border-soft);
  border-radius: 0.75rem;
  padding: 0.75rem;
  background: #f8fafc;
}

.log__item--risk {
  background: #fee2e2;
  border-color: #fecaca;
}

.log__name {
  font-weight: 900;
  color: var(--regula-color-primary);
}

.log__meta {
  font-size: 0.75rem;
  color: var(--regula-app-text-muted);
  margin-top: 0.2rem;
}

.side__btn {
  width: 100%;
  display: inline-flex;
  justify-content: center;
  gap: 0.5rem;
}
</style>

