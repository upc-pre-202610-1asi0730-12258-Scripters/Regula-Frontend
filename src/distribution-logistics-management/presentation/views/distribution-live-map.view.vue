<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useDistributionStore } from '@/distribution-logistics-management/application/distribution.store.js'
import DelivererListItem from '../components/deliverer-list-item.vue'

const store = useDistributionStore()
const countdown = ref(30)
let countdownInterval = null

const activeDeliverers = computed(() => store.activeDeliverers)

onMounted(() => {
  countdownInterval = setInterval(() => {
    countdown.value -= 1
    if (countdown.value <= 0) {
      countdown.value = 30
    }
  }, 1000)
})

onUnmounted(() => {
  clearInterval(countdownInterval)
})
</script>

<template>
  <div class="live-map-view">
    <!-- Sidebar -->
    <aside class="live-map-view__sidebar">
      <div class="live-map-view__sidebar-header">
        <h2 class="live-map-view__sidebar-title">
          Repartidores activos
          <span class="live-map-view__sidebar-count">({{ activeDeliverers.length }})</span>
        </h2>
        <p class="live-map-view__sidebar-refresh">
          <span class="live-map-view__dot live-map-view__dot--active" aria-hidden="true" />
          actualiza cada 30 seg.
        </p>
      </div>

      <div class="live-map-view__deliverer-list">
        <DelivererListItem
          v-for="deliverer in activeDeliverers"
          :key="deliverer.id"
          :deliverer="deliverer"
        />
      </div>

      <!-- Legend -->
      <div class="live-map-view__legend">
        <span class="live-map-view__legend-item">
          <span class="live-map-view__dot live-map-view__dot--en-ruta" />
          En ruta
        </span>
        <span class="live-map-view__legend-item">
          <span class="live-map-view__dot live-map-view__dot--completado" />
          Completado
        </span>
        <span class="live-map-view__legend-item">
          <span class="live-map-view__dot live-map-view__dot--sin-senal" />
          Sin señal
        </span>
      </div>
    </aside>

    <!-- Map Area -->
    <div class="live-map-view__map-area">
      <div class="live-map-view__map-label">
        <span class="live-map-view__map-label-dot" />
        En vivo · Lima, Perú
      </div>
      <img
        src="/map-placeholder.png"
        alt="Mapa en tiempo real de Lima, Perú"
        class="live-map-view__map-img"
        draggable="false"
      />
      <div class="live-map-view__refresh-badge">
        <i class="pi pi-refresh" aria-hidden="true" />
        Actualiza en {{ countdown }} seg.
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
  z-index: 10;
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

.live-map-view__map-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.live-map-view__refresh-badge {
  position: absolute;
  bottom: 0.75rem;
  right: 0.75rem;
  z-index: 10;
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
