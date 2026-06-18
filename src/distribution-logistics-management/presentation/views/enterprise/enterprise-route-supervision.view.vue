<script setup>
import { computed } from 'vue'
import { useEnterpriseDistributionStore } from '@/distribution-logistics-management/application/enterprise-distribution.store.js'

const store = useEnterpriseDistributionStore()

const detail = computed(() => store.selectedSupervision)

function pointCircleClass(status) {
  if (status === 'Entregado') return 'ent-point__num--done'
  if (status === 'Desvío') return 'ent-point__num--deviation'
  return 'ent-point__num--pending'
}

function pointStatusClass(status) {
  if (status === 'Entregado') return 'ent-point__status--done'
  if (status === 'Desvío') return 'ent-point__status--deviation'
  return 'ent-point__status--pending'
}

function handleDownload() {
  // placeholder — exportación de resumen
}
</script>

<template>
  <div v-if="detail" class="ent-sup">
    <!-- Toolbar -->
    <div class="ent-sup__toolbar">
      <div class="ent-sup__active">
        <i class="pi pi-truck" aria-hidden="true" />
        <span class="ent-sup__active-label">Reparto activo:</span>
        <div class="ent-sup__select">
          <span>{{ detail.label }}</span>
          <i class="pi pi-chevron-down" aria-hidden="true" />
        </div>
      </div>

      <div class="ent-sup__search">
        <i class="pi pi-search" aria-hidden="true" />
        <input
          type="text"
          placeholder="Seleccionar reparto activo o completado..."
          aria-label="Seleccionar reparto"
        />
      </div>

      <div class="ent-sup__badges">
        <span class="ent-sup__badge ent-sup__badge--deviation">
          <i class="pi pi-exclamation-triangle" aria-hidden="true" />
          {{ detail.activeDeviations }} desvío activo
        </span>
        <span class="ent-sup__badge ent-sup__badge--progress">
          <span class="ent-sup__badge-dot" aria-hidden="true" />
          {{ detail.state === 'En curso' ? 'En progreso' : detail.state }}
        </span>
      </div>
    </div>

    <!-- Cuerpo: mapa + detalle -->
    <div class="ent-sup__body">
      <div class="ent-sup__map">
        <div class="ent-sup__map-label">
          <span class="ent-sup__map-label-strong">Reparto {{ detail.id }}</span>
          <span class="ent-sup__map-label-sep">·</span>
          <span>{{ detail.deliverer }}</span>
        </div>
        <img
          src="/map-placeholder.png"
          alt="Mapa de la ruta del reparto en supervisión"
          class="ent-sup__map-img"
          draggable="false"
        />
      </div>

      <aside class="ent-sup__panel">
        <header class="ent-sup__panel-header">
          <span class="ent-sup__panel-title">Detalle de Ruta</span>
          <span class="ent-sup__panel-id">Reparto {{ detail.id }}</span>
        </header>

        <div class="ent-sup__panel-sub">
          <p class="ent-sup__driver">{{ detail.deliverer }}</p>
          <div class="ent-sup__driver-meta">
            <span>{{ detail.plate }} · {{ detail.zone }}</span>
            <span class="ent-sup__state-tag">
              <span class="ent-sup__state-dot" aria-hidden="true" />
              {{ detail.state }}
            </span>
          </div>
        </div>

        <!-- Puntos de entrega -->
        <section class="ent-sup__section">
          <h4 class="ent-sup__section-title">PUNTOS DE ENTREGA</h4>
          <div class="ent-sup__points">
            <div
              v-for="p in detail.points"
              :key="p.order"
              class="ent-point"
              :class="{ 'ent-point--deviation': p.status === 'Desvío' }"
            >
              <span class="ent-point__num" :class="pointCircleClass(p.status)">
                <i v-if="p.status === 'Entregado'" class="pi pi-check" aria-hidden="true" />
                <template v-else>{{ p.order }}</template>
              </span>
              <div class="ent-point__info">
                <div class="ent-point__top">
                  <span class="ent-point__name">{{ p.name }}</span>
                  <span class="ent-point__status" :class="pointStatusClass(p.status)">
                    <i
                      v-if="p.status === 'Desvío'"
                      class="pi pi-exclamation-triangle"
                      aria-hidden="true"
                    />
                    {{ p.status }}
                  </span>
                </div>
                <p class="ent-point__times">
                  ETA: {{ p.eta }} · Real: {{ p.real ?? '—' }}
                </p>
                <p v-if="p.detail" class="ent-point__detail">
                  {{ p.detail }}<template v-if="p.ago"> · {{ p.ago }}</template>
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- Alertas -->
        <section class="ent-sup__section">
          <h4 class="ent-sup__section-title">ALERTAS DE DESVÍO REGISTRADAS</h4>
          <div class="ent-sup__alerts">
            <div
              v-for="(a, i) in detail.alerts"
              :key="i"
              class="ent-alert"
              :class="a.type === 'active' ? 'ent-alert--active' : 'ent-alert--resolved'"
            >
              <i
                :class="[
                  'pi',
                  a.type === 'active' ? 'pi-exclamation-triangle' : 'pi-replay',
                  'ent-alert__icon',
                ]"
                aria-hidden="true"
              />
              <div class="ent-alert__info">
                <div class="ent-alert__top">
                  <span class="ent-alert__title">{{ a.title }}</span>
                  <span class="ent-alert__time">{{ a.time }}</span>
                </div>
                <p class="ent-alert__detail">{{ a.detail }}</p>
              </div>
            </div>
          </div>
        </section>

        <footer class="ent-sup__panel-footer">
          <button class="ent-sup__download" type="button" @click="handleDownload">
            <i class="pi pi-download" aria-hidden="true" />
            Descargar resumen PDF
          </button>
        </footer>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.ent-sup {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 1rem;
  height: 100%;
}

/* Toolbar */
.ent-sup__toolbar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.ent-sup__active {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.ent-sup__active > .pi {
  color: var(--regula-orange, #f26e22);
  font-size: 0.9rem;
}

.ent-sup__active-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--regula-text-body, #555f6e);
  white-space: nowrap;
}

.ent-sup__select {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.45rem 0.75rem;
  border: 1px solid var(--regula-gray-light, #e8ecf0);
  border-radius: var(--regula-radius-btn, 8px);
  background: var(--regula-white, #fff);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--regula-text-primary, #111);
}

.ent-sup__select .pi {
  font-size: 0.7rem;
  color: var(--regula-text-muted, #a5b1bf);
}

.ent-sup__search {
  flex: 1;
  min-width: 200px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.75rem;
  border: 1px solid var(--regula-gray-light, #e8ecf0);
  border-radius: var(--regula-radius-btn, 8px);
  background: var(--regula-white, #fff);
}

.ent-sup__search .pi {
  font-size: 0.8rem;
  color: var(--regula-text-muted, #a5b1bf);
}

.ent-sup__search input {
  flex: 1;
  border: none;
  outline: none;
  font-family: inherit;
  font-size: 0.82rem;
  color: var(--regula-text-primary, #111);
  background: transparent;
}

.ent-sup__badges {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.ent-sup__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.7rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid var(--regula-gray-light, #e8ecf0);
  white-space: nowrap;
}

.ent-sup__badge--deviation {
  color: #dc2626;
  border-color: #fecaca;
  background: #fff;
}

.ent-sup__badge--deviation .pi {
  font-size: 0.7rem;
}

.ent-sup__badge--progress {
  color: #16a34a;
  border-color: #bbf7d0;
}

.ent-sup__badge-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #16a34a;
  display: inline-block;
}

/* Cuerpo */
.ent-sup__body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 1rem;
  flex: 1;
  min-height: 0;
  align-items: start;
}

.ent-sup__map {
  position: relative;
  border-radius: var(--regula-radius-card, 12px);
  overflow: hidden;
  background: #e8ecf0;
  min-height: 540px;
  height: 100%;
}

.ent-sup__map-label {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  z-index: 10;
  background: var(--regula-white, #fff);
  padding: 0.35rem 0.7rem;
  border-radius: 6px;
  font-size: 0.74rem;
  color: var(--regula-text-body, #555f6e);
  display: flex;
  align-items: center;
  gap: 0.4rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
}

.ent-sup__map-label-strong {
  font-weight: 700;
  color: var(--regula-text-primary, #111);
}

.ent-sup__map-label-sep {
  color: var(--regula-text-muted, #a5b1bf);
}

.ent-sup__map-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Panel */
.ent-sup__panel {
  background: var(--regula-white, #fff);
  border: 1px solid var(--regula-gray-light, #e8ecf0);
  border-radius: var(--regula-radius-card, 12px);
  box-shadow: var(--regula-shadow-card, 0 2px 8px rgba(23, 45, 64, 0.08));
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.ent-sup__panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1rem 0.5rem;
}

.ent-sup__panel-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--regula-text-primary, #111);
}

.ent-sup__panel-id {
  font-size: 0.68rem;
  font-weight: 700;
  color: var(--regula-text-body, #555f6e);
  background: var(--regula-gray-light, #e8ecf0);
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
}

.ent-sup__panel-sub {
  padding: 0 1rem 0.85rem;
  border-bottom: 1px solid var(--regula-gray-light, #e8ecf0);
}

.ent-sup__driver {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--regula-text-primary, #111);
  margin: 0;
}

.ent-sup__driver-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-top: 0.2rem;
}

.ent-sup__driver-meta > span:first-child {
  font-size: 0.74rem;
  color: var(--regula-text-muted, #a5b1bf);
}

.ent-sup__state-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.68rem;
  font-weight: 700;
  color: #16a34a;
}

.ent-sup__state-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #16a34a;
  display: inline-block;
}

.ent-sup__section {
  padding: 0.85rem 1rem;
  border-bottom: 1px solid var(--regula-gray-light, #e8ecf0);
}

.ent-sup__section-title {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  color: var(--regula-text-muted, #a5b1bf);
  margin: 0 0 0.6rem;
}

/* Puntos */
.ent-sup__points {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.ent-point {
  display: flex;
  gap: 0.6rem;
  padding: 0.55rem;
  border-radius: 8px;
  border: 1px solid transparent;
}

.ent-point--deviation {
  border-color: #fecaca;
  background: #fff5f5;
}

.ent-point__num {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  font-weight: 700;
  flex-shrink: 0;
  color: var(--regula-white, #fff);
}

.ent-point__num--done {
  background: #16a34a;
}

.ent-point__num--deviation {
  background: var(--regula-navy, #172d40);
}

.ent-point__num--pending {
  background: var(--regula-gray-light, #e8ecf0);
  color: var(--regula-text-muted, #a5b1bf);
}

.ent-point__info {
  flex: 1;
  min-width: 0;
}

.ent-point__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.ent-point__name {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--regula-text-primary, #111);
}

.ent-point__status {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.68rem;
  font-weight: 700;
  white-space: nowrap;
}

.ent-point__status .pi {
  font-size: 0.65rem;
}

.ent-point__status--done {
  color: #16a34a;
}

.ent-point__status--deviation {
  color: var(--regula-orange, #f26e22);
}

.ent-point__status--pending {
  color: var(--regula-text-muted, #a5b1bf);
}

.ent-point__times {
  font-size: 0.7rem;
  color: var(--regula-text-muted, #a5b1bf);
  margin: 0.2rem 0 0;
}

.ent-point__detail {
  font-size: 0.7rem;
  color: var(--regula-orange, #f26e22);
  margin: 0.15rem 0 0;
  font-weight: 500;
}

/* Alertas */
.ent-sup__alerts {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.ent-alert {
  display: flex;
  gap: 0.55rem;
}

.ent-alert__icon {
  font-size: 0.85rem;
  margin-top: 0.1rem;
  flex-shrink: 0;
}

.ent-alert--active .ent-alert__icon {
  color: var(--regula-orange, #f26e22);
}

.ent-alert--resolved .ent-alert__icon {
  color: var(--regula-text-muted, #a5b1bf);
}

.ent-alert__info {
  flex: 1;
  min-width: 0;
}

.ent-alert__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.ent-alert__title {
  font-size: 0.76rem;
  font-weight: 600;
  color: var(--regula-text-primary, #111);
}

.ent-alert__time {
  font-size: 0.7rem;
  color: var(--regula-text-muted, #a5b1bf);
  flex-shrink: 0;
}

.ent-alert__detail {
  font-size: 0.7rem;
  color: var(--regula-text-muted, #a5b1bf);
  margin: 0.1rem 0 0;
}

/* Footer */
.ent-sup__panel-footer {
  padding: 0.85rem 1rem;
  margin-top: auto;
}

.ent-sup__download {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.6rem;
  border: 1px solid var(--regula-gray-light, #e8ecf0);
  border-radius: var(--regula-radius-btn, 8px);
  background: var(--regula-white, #fff);
  color: var(--regula-text-primary, #111);
  font-family: inherit;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}

.ent-sup__download:hover {
  background: var(--regula-navy, #172d40);
  border-color: var(--regula-navy, #172d40);
  color: var(--regula-white, #fff);
}

.ent-sup__download .pi {
  font-size: 0.78rem;
}

@media (max-width: 980px) {
  .ent-sup__body {
    grid-template-columns: 1fr;
  }
  .ent-sup__map {
    min-height: 360px;
  }
}
</style>
