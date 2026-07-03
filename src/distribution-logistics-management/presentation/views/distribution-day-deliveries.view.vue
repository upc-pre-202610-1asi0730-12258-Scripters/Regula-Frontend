<script setup>
import { computed } from 'vue'
import { useDistributionStore } from '@/distribution-logistics-management/application/distribution.store.js'
import DeliveryCard from '../components/delivery-card.vue'

const store = useDistributionStore()

const enRoute = computed(() => store.enRouteDeliveries)
const completed = computed(() => store.completedDeliveries)
const failed = computed(() => store.failedDeliveries)
</script>

<template>
  <div class="day-deliveries">
    <!-- En Ruta Column -->
    <section class="day-deliveries__column">
      <header class="day-deliveries__column-header">
        <span class="day-deliveries__column-title">
          En Ruta
          <span class="day-deliveries__column-count">{{ enRoute.length }}</span>
        </span>
        <button class="day-deliveries__column-menu" type="button" aria-label="Opciones">
          <i class="pi pi-ellipsis-h" aria-hidden="true" />
        </button>
      </header>
      <div class="day-deliveries__cards">
        <DeliveryCard
          v-for="delivery in enRoute"
          :key="delivery.id"
          :delivery="delivery"
        />
        <p v-if="enRoute.length === 0" class="day-deliveries__empty">
          No hay entregas en ruta.
        </p>
      </div>
    </section>

    <!-- Completadas Column -->
    <section class="day-deliveries__column">
      <header class="day-deliveries__column-header">
        <span class="day-deliveries__column-title">
          Completadas
          <span class="day-deliveries__column-count">{{ completed.length }}</span>
        </span>
        <button class="day-deliveries__column-menu" type="button" aria-label="Opciones">
          <i class="pi pi-ellipsis-h" aria-hidden="true" />
        </button>
      </header>
      <div class="day-deliveries__cards">
        <DeliveryCard
          v-for="delivery in completed"
          :key="delivery.id"
          :delivery="delivery"
        />
        <p v-if="completed.length === 0" class="day-deliveries__empty">
          No hay entregas completadas aún.
        </p>
      </div>
    </section>

    <!-- Sin Entregas Fallidas Column -->
    <section class="day-deliveries__column">
      <header class="day-deliveries__column-header">
        <span class="day-deliveries__column-title">
          No Entregadas
          <span class="day-deliveries__column-count">{{ failed.length }}</span>
        </span>
        <button class="day-deliveries__column-menu" type="button" aria-label="Opciones">
          <i class="pi pi-ellipsis-h" aria-hidden="true" />
        </button>
      </header>
      <div class="day-deliveries__cards">
        <DeliveryCard
          v-for="delivery in failed"
          :key="delivery.id"
          :delivery="delivery"
        />
        <div v-if="failed.length === 0" class="day-deliveries__no-failed">
          <div class="day-deliveries__no-failed-icon">
            <i class="pi pi-check" aria-hidden="true" />
          </div>
          <p class="day-deliveries__no-failed-title">Sin entregas fallidas hoy</p>
          <p class="day-deliveries__no-failed-desc">
            Todas las rutas programadas se están cumpliendo sin incidencias.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.day-deliveries {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  align-items: start;
  padding-top: 1rem;
}

@media (max-width: 900px) {
  .day-deliveries {
    grid-template-columns: 1fr;
  }
}

.day-deliveries__column {
  background: #f4f6f9;
  border-radius: var(--regula-radius-card, 12px);
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-height: 200px;
}

.day-deliveries__column-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 0.25rem;
}

.day-deliveries__column-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--regula-text-primary, #111);
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.day-deliveries__column-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--regula-gray-light, #e8ecf0);
  color: var(--regula-gray-mid, #555f6e);
  border-radius: 9999px;
  width: 20px;
  height: 20px;
  font-size: 0.72rem;
  font-weight: 700;
}

.day-deliveries__column-menu {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--regula-steel, #a5b1bf);
  padding: 0.2rem;
  border-radius: 4px;
  transition: color 0.15s;
}

.day-deliveries__column-menu:hover {
  color: var(--regula-gray-mid, #555f6e);
}

.day-deliveries__cards {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.day-deliveries__empty {
  font-size: 0.8rem;
  color: var(--regula-text-muted, #a5b1bf);
  text-align: center;
  padding: 1rem 0;
}

.day-deliveries__no-failed {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 2.5rem 1rem;
  text-align: center;
}

.day-deliveries__no-failed-icon {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--regula-gray-light, #e8ecf0);
  display: flex;
  align-items: center;
  justify-content: center;
}

.day-deliveries__no-failed-icon .pi {
  font-size: 1.25rem;
  color: var(--regula-gray-mid, #555f6e);
}

.day-deliveries__no-failed-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--regula-text-primary, #111);
  margin: 0;
}

.day-deliveries__no-failed-desc {
  font-size: 0.78rem;
  color: var(--regula-text-muted, #a5b1bf);
  margin: 0;
  max-width: 180px;
}
</style>
