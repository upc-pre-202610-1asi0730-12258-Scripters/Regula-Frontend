<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useEnterpriseDistributionStore } from '@/distribution-logistics-management/application/enterprise-distribution.store.js'

const store = useEnterpriseDistributionStore()
const selectedId = ref(null)
const countdown = ref(30)
let countdownInterval = null

const vehicles = computed(() => store.activeVehicles)

function initials(name) {
  return name
    .split(' ')
    .slice(0, 1)
    .map((w) => w[0]?.toUpperCase())
    .join('')
}

function selectVehicle(id) {
  selectedId.value = id
}

onMounted(() => {
  selectedId.value = vehicles.value[0]?.id ?? null
  countdownInterval = setInterval(() => {
    countdown.value -= 1
    if (countdown.value <= 0) countdown.value = 30
  }, 1000)
})

onUnmounted(() => {
  clearInterval(countdownInterval)
})
</script>

<template>
  <div class="ent-map">
    <!-- Sidebar de vehículos -->
    <aside class="ent-map__sidebar">
      <div class="ent-map__sidebar-header">
        <h2 class="ent-map__sidebar-title">Vehículos activos</h2>
        <span class="ent-map__count">{{ vehicles.length }}</span>
      </div>
      <p class="ent-map__refresh-note">
        <span class="ent-map__dot ent-map__dot--live" aria-hidden="true" />
        Posición actualizada cada 30 seg.
      </p>

      <div class="ent-map__list">
        <button
          v-for="v in vehicles"
          :key="v.id"
          type="button"
          class="ent-vehicle"
          :class="{ 'ent-vehicle--active': selectedId === v.id }"
          @click="selectVehicle(v.id)"
        >
          <span class="ent-vehicle__avatar">{{ initials(v.deliverer) }}</span>
          <div class="ent-vehicle__info">
            <div class="ent-vehicle__name-row">
              <span class="ent-vehicle__name">{{ v.deliverer }}</span>
              <span
                class="ent-vehicle__state"
                :class="v.state === 'En ruta' ? 'ent-vehicle__state--ruta' : 'ent-vehicle__state--activo'"
              >
                <span class="ent-vehicle__state-dot" aria-hidden="true" />
                {{ v.state }}
              </span>
            </div>
            <span class="ent-vehicle__plate">{{ v.plate }}</span>
            <div class="ent-vehicle__meta">
              <span class="ent-vehicle__zone">
                <i class="pi pi-map-marker" aria-hidden="true" />
                {{ v.zone }}
              </span>
              <span class="ent-vehicle__eta">
                <i class="pi pi-clock" aria-hidden="true" />
                ETA {{ v.eta }}
              </span>
            </div>
          </div>
        </button>
      </div>

      <p class="ent-map__refresh-footer">
        <i class="pi pi-refresh" aria-hidden="true" />
        Posición actualizada cada 30 seg.
      </p>
    </aside>

    <!-- Mapa -->
    <div class="ent-map__canvas">
      <div class="ent-map__badge">
        <span class="ent-map__dot ent-map__dot--live" aria-hidden="true" />
        En vivo · Lima, Perú
      </div>
      <img
        src="/map-placeholder.png"
        alt="Mapa en tiempo real de los vehículos activos en Lima"
        class="ent-map__img"
        draggable="false"
      />
      <div class="ent-map__refresh-badge">
        <i class="pi pi-refresh" aria-hidden="true" />
        Actualiza en {{ countdown }} seg.
      </div>
    </div>
  </div>
</template>

<style scoped>
.ent-map {
  display: flex;
  gap: 1rem;
  height: 100%;
  min-height: 460px;
  padding-top: 1rem;
}

.ent-map__sidebar {
  width: 260px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.ent-map__sidebar-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.ent-map__sidebar-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--regula-text-primary, #111);
  margin: 0;
}

.ent-map__count {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--regula-navy, #172d40);
  color: var(--regula-white, #fff);
  font-size: 0.68rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.ent-map__refresh-note {
  font-size: 0.72rem;
  color: var(--regula-text-muted, #a5b1bf);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.ent-map__list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-top: 0.25rem;
}

.ent-vehicle {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  padding: 0.75rem;
  border: 1px solid var(--regula-gray-light, #e8ecf0);
  border-radius: var(--regula-radius-card, 12px);
  background: var(--regula-white, #fff);
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.ent-vehicle:hover {
  box-shadow: var(--regula-shadow-card, 0 2px 8px rgba(23, 45, 64, 0.08));
}

.ent-vehicle--active {
  border-color: var(--regula-navy, #172d40);
  box-shadow: inset 0 0 0 1px var(--regula-navy, #172d40);
}

.ent-vehicle__avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--regula-navy, #172d40);
  color: var(--regula-white, #fff);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.78rem;
  font-weight: 700;
  flex-shrink: 0;
}

.ent-vehicle__info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.ent-vehicle__name-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.4rem;
}

.ent-vehicle__name {
  font-size: 0.84rem;
  font-weight: 700;
  color: var(--regula-text-primary, #111);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ent-vehicle__state {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.66rem;
  font-weight: 700;
  padding: 0.1rem 0.4rem;
  border-radius: 10px;
  white-space: nowrap;
}

.ent-vehicle__state-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
}

.ent-vehicle__state--ruta {
  background: #fff7ed;
  color: var(--regula-orange, #f26e22);
}

.ent-vehicle__state--ruta .ent-vehicle__state-dot {
  background: var(--regula-orange, #f26e22);
}

.ent-vehicle__state--activo {
  background: #dcfce7;
  color: #16a34a;
}

.ent-vehicle__state--activo .ent-vehicle__state-dot {
  background: #16a34a;
}

.ent-vehicle__plate {
  font-size: 0.72rem;
  color: var(--regula-text-muted, #a5b1bf);
}

.ent-vehicle__meta {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  margin-top: 0.1rem;
}

.ent-vehicle__zone,
.ent-vehicle__eta {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.72rem;
  color: var(--regula-text-body, #555f6e);
}

.ent-vehicle__zone .pi,
.ent-vehicle__eta .pi {
  font-size: 0.68rem;
  color: var(--regula-text-muted, #a5b1bf);
}

.ent-map__refresh-footer {
  margin-top: auto;
  font-size: 0.7rem;
  color: var(--regula-text-muted, #a5b1bf);
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.ent-map__refresh-footer .pi {
  font-size: 0.68rem;
}

.ent-map__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
}

.ent-map__dot--live {
  background: #16a34a;
  animation: ent-pulse 1.5s infinite;
}

@keyframes ent-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
}

.ent-map__canvas {
  flex: 1;
  position: relative;
  border-radius: var(--regula-radius-card, 12px);
  overflow: hidden;
  background: #e8ecf0;
  min-height: 440px;
}

.ent-map__badge {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  z-index: 10;
  background: var(--regula-white, #fff);
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  font-size: 0.74rem;
  font-weight: 600;
  color: var(--regula-text-primary, #111);
  display: flex;
  align-items: center;
  gap: 0.4rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
}

.ent-map__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.ent-map__refresh-badge {
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

.ent-map__refresh-badge .pi {
  font-size: 0.7rem;
}

@media (max-width: 860px) {
  .ent-map {
    flex-direction: column;
  }
  .ent-map__sidebar {
    width: 100%;
  }
}
</style>
