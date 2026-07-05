<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDistributionStore } from '@/distribution-logistics-management/application/distribution.store.js'
import DelivererListItem from '../components/deliverer-list-item.vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const { t } = useI18n()
const store = useDistributionStore()
const countdown = ref(30)
let countdownInterval = null

const mapContainer = ref(null)
let map = null
let markers = []

const activeDeliverers = computed(() => store.activeDeliverers)

// Lima, Perú — centro por defecto (coincide con los datos semilla del backend).
const DEFAULT_CENTER = [-12.0464, -77.0428]

const STATUS_COLOR = {
  'En ruta': '#f26e22',
  'Completado': '#16a34a',
  'Sin señal': '#a5b1bf',
}

function buildIcon(status) {
  const color = STATUS_COLOR[status] ?? STATUS_COLOR['Sin señal']
  return L.divIcon({
    className: 'live-map-marker',
    html: `<span style="background:${color}" class="live-map-marker__dot"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  })
}

function renderMarkers() {
  if (!map) return

  markers.forEach((marker) => marker.remove())
  markers = []

  const withLocation = activeDeliverers.value.filter((d) => d.lat != null && d.lng != null)

  withLocation.forEach((deliverer) => {
    const marker = L.marker([deliverer.lat, deliverer.lng], { icon: buildIcon(deliverer.status) })
      .addTo(map)
      .bindPopup(
        `<strong>${deliverer.name}</strong><br>${deliverer.vehiclePlate}<br>${deliverer.status}`
      )
    markers.push(marker)
  })

  if (withLocation.length > 0) {
    const bounds = L.latLngBounds(withLocation.map((d) => [d.lat, d.lng]))
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 })
  }
}

onMounted(async () => {
  await nextTick()

  map = L.map(mapContainer.value).setView(DEFAULT_CENTER, 13)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(map)

  renderMarkers()

  countdownInterval = setInterval(() => {
    countdown.value -= 1
    if (countdown.value <= 0) {
      countdown.value = 30
      store.fetchDistributionData()
    }
  }, 1000)
})

watch(activeDeliverers, () => {
  renderMarkers()
})

onUnmounted(() => {
  clearInterval(countdownInterval)
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<template>
  <div class="live-map-view">
    <!-- Sidebar -->
    <aside class="live-map-view__sidebar">
      <div class="live-map-view__sidebar-header">
        <h2 class="live-map-view__sidebar-title">
          {{ t('distribution.liveMap.activeDeliverers') }}
          <span class="live-map-view__sidebar-count">({{ activeDeliverers.length }})</span>
        </h2>
        <p class="live-map-view__sidebar-refresh">
          <span class="live-map-view__dot live-map-view__dot--active" aria-hidden="true" />
          {{ t('distribution.liveMap.refreshNotice') }}
        </p>
      </div>

      <div class="live-map-view__deliverer-list">
        <DelivererListItem
          v-for="deliverer in activeDeliverers"
          :key="deliverer.id"
          :deliverer="deliverer"
        />
        <p v-if="activeDeliverers.length === 0" class="live-map-view__empty">
          {{ t('distribution.liveMap.empty') }}
        </p>
      </div>

      <!-- Legend -->
      <div class="live-map-view__legend">
        <span class="live-map-view__legend-item">
          <span class="live-map-view__dot live-map-view__dot--en-ruta" />
          {{ t('distribution.liveMap.legendEnRoute') }}
        </span>
        <span class="live-map-view__legend-item">
          <span class="live-map-view__dot live-map-view__dot--completado" />
          {{ t('distribution.liveMap.legendCompleted') }}
        </span>
        <span class="live-map-view__legend-item">
          <span class="live-map-view__dot live-map-view__dot--sin-senal" />
          {{ t('distribution.liveMap.legendNoSignal') }}
        </span>
      </div>
    </aside>

    <!-- Map Area -->
    <div class="live-map-view__map-area">
      <div class="live-map-view__map-label">
        <span class="live-map-view__map-label-dot" />
        {{ t('distribution.liveMap.liveLabel') }}
      </div>
      <div ref="mapContainer" class="live-map-view__map-container" />
      <div class="live-map-view__refresh-badge">
        <i class="pi pi-refresh" aria-hidden="true" />
        {{ t('distribution.liveMap.refreshBadge', { seconds: countdown }) }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.live-map-view {
  display: flex;
  gap: 1rem;
  height: 100%;
  min-height: 400px;
  padding-top: 1rem;
}

.live-map-view__sidebar {
  width: 240px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.live-map-view__sidebar-header {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.live-map-view__sidebar-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--regula-text-primary, #111);
  margin: 0;
}

.live-map-view__sidebar-count {
  color: var(--regula-orange, #f26e22);
}

.live-map-view__sidebar-refresh {
  font-size: 0.72rem;
  color: var(--regula-text-muted, #a5b1bf);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.live-map-view__deliverer-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.live-map-view__empty {
  font-size: 0.8rem;
  color: var(--regula-text-muted, #a5b1bf);
  text-align: center;
  padding: 1rem 0;
}

.live-map-view__legend {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-top: 0.5rem;
}

.live-map-view__legend-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  color: var(--regula-text-body, #555f6e);
}

.live-map-view__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
}

.live-map-view__dot--active {
  background: #16a34a;
  animation: pulse-dot 1.5s infinite;
}

.live-map-view__dot--en-ruta {
  background: var(--regula-orange, #f26e22);
}

.live-map-view__dot--completado {
  background: #16a34a;
}

.live-map-view__dot--sin-senal {
  background: var(--regula-steel, #a5b1bf);
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.live-map-view__map-area {
  flex: 1;
  position: relative;
  border-radius: var(--regula-radius-card, 12px);
  overflow: hidden;
  background: #e8ecf0;
  min-height: 380px;
}

.live-map-view__map-label {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  z-index: 500;
  background: var(--regula-white, #fff);
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--regula-text-primary, #111);
  display: flex;
  align-items: center;
  gap: 0.4rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.12);
}

.live-map-view__map-label-dot {
  width: 8px;
  height: 8px;
  background: #16a34a;
  border-radius: 50%;
  animation: pulse-dot 1.5s infinite;
}

.live-map-view__map-container {
  width: 100%;
  height: 100%;
  min-height: 380px;
}

.live-map-view__refresh-badge {
  position: absolute;
  bottom: 0.75rem;
  right: 0.75rem;
  z-index: 500;
  background: var(--regula-orange, #f26e22);
  color: var(--regula-white, #fff);
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.live-map-view__refresh-badge .pi {
  font-size: 0.7rem;
}
</style>

<style>
/* Global (no scoped) porque Leaflet inyecta estos nodos fuera del árbol de Vue */
.live-map-marker {
  background: transparent;
  border: none;
}

.live-map-marker__dot {
  display: block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
}
</style>
