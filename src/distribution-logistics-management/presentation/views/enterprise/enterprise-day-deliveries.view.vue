<script setup>
import { computed } from 'vue'
import { useEnterpriseDistributionStore } from '@/distribution-logistics-management/application/enterprise-distribution.store.js'

const store = useEnterpriseDistributionStore()

const pending = computed(() => store.pendingDeliveries)
const completed = computed(() => store.completedToday)

function complete(id) {
  store.markAsCompleted(id)
}
</script>

<template>
  <div class="ent-day">
    <!-- Columna: Repartos Pendientes -->
    <section class="ent-day__column">
      <header class="ent-day__column-header">
        <span class="ent-day__column-title">
          <i class="pi pi-clock" aria-hidden="true" />
          Repartos Pendientes ({{ store.pendingCount }})
        </span>
        <button class="ent-day__column-menu" type="button" aria-label="Filtrar">
          <i class="pi pi-filter" aria-hidden="true" />
        </button>
      </header>

      <div class="ent-day__cards">
        <article v-for="d in pending" :key="d.id" class="ent-card">
          <header class="ent-card__top">
            <span class="ent-card__id">Reparto {{ d.id }}</span>
            <div class="ent-card__eta">
              <span class="ent-card__eta-label">ETA Estimado</span>
              <span class="ent-card__eta-value">{{ d.eta }}</span>
            </div>
          </header>

          <div class="ent-card__status-row">
            <span class="ent-card__state">
              <span class="ent-card__dot" aria-hidden="true" />
              {{ d.status }}
            </span>
            <span v-if="d.delayMinutes > 0" class="ent-card__delay">
              <i class="pi pi-exclamation-triangle" aria-hidden="true" />
              Atrasado {{ d.delayMinutes }} min
            </span>
          </div>

          <div class="ent-card__grid">
            <div class="ent-card__field">
              <i class="pi pi-user ent-card__field-icon" aria-hidden="true" />
              <div>
                <p class="ent-card__field-value">{{ d.deliverer }}</p>
                <p class="ent-card__field-sub">DNI: {{ d.dni }}</p>
              </div>
            </div>
            <div class="ent-card__field">
              <i class="pi pi-box ent-card__field-icon" aria-hidden="true" />
              <div>
                <p class="ent-card__field-value">Carga</p>
                <p class="ent-card__field-sub">{{ d.cargo }}</p>
              </div>
            </div>
            <div class="ent-card__field">
              <i class="pi pi-truck ent-card__field-icon" aria-hidden="true" />
              <div>
                <p class="ent-card__field-value">{{ d.vehicle }}</p>
                <p class="ent-card__field-sub">Placa: {{ d.plate }}</p>
              </div>
            </div>
            <div class="ent-card__field">
              <i class="pi pi-map-marker ent-card__field-icon" aria-hidden="true" />
              <div>
                <p class="ent-card__field-value">{{ d.zone }}</p>
                <p class="ent-card__field-sub">{{ d.address }}</p>
              </div>
            </div>
          </div>

          <button class="ent-card__complete-btn" type="button" @click="complete(d.id)">
            <i class="pi pi-check" aria-hidden="true" />
            Marcar como Completado
          </button>
        </article>

        <p v-if="pending.length === 0" class="ent-day__empty">
          No hay repartos pendientes.
        </p>
      </div>
    </section>

    <!-- Columna: Repartos Completados -->
    <section class="ent-day__column">
      <header class="ent-day__column-header">
        <span class="ent-day__column-title">
          <i class="pi pi-check-circle" aria-hidden="true" />
          Repartos Completados ({{ store.completedCount }})
        </span>
        <span class="ent-day__column-tag">Hoy</span>
      </header>

      <div class="ent-day__completed-list">
        <div v-for="c in completed" :key="c.id" class="ent-completed">
          <span class="ent-completed__avatar" aria-hidden="true">
            <i class="pi pi-check" />
          </span>
          <div class="ent-completed__info">
            <p class="ent-completed__id">
              Reparto {{ c.id }}
              <span class="ent-completed__badge">COMPLETADO</span>
            </p>
            <p class="ent-completed__sub">{{ c.deliverer }} • {{ c.zone }}</p>
          </div>
          <div class="ent-completed__time">
            <span class="ent-completed__time-value">{{ c.deliveredAt }}</span>
            <span class="ent-completed__time-label">Hora entrega</span>
          </div>
        </div>
      </div>

      <footer class="ent-day__completed-footer">
        <router-link
          :to="{ name: 'enterprise-distribution-history' }"
          class="ent-day__see-all"
        >
          Ver historial completo
        </router-link>
      </footer>
    </section>
  </div>
</template>

<style scoped>
.ent-day {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 1.25rem;
  padding-top: 1.25rem;
  align-items: start;
}

.ent-day__column {
  background: var(--regula-white, #fff);
  border: 1px solid var(--regula-gray-light, #e8ecf0);
  border-radius: var(--regula-radius-card, 12px);
  box-shadow: var(--regula-shadow-card, 0 2px 8px rgba(23, 45, 64, 0.08));
  padding: 1rem 1.1rem 1.1rem;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.ent-day__column-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.ent-day__column-title {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--regula-text-primary, #111);
}

.ent-day__column-title .pi {
  color: var(--regula-orange, #f26e22);
  font-size: 0.9rem;
}

.ent-day__column-menu {
  background: none;
  border: none;
  color: var(--regula-text-muted, #a5b1bf);
  cursor: pointer;
  padding: 0.25rem;
}

.ent-day__column-tag {
  font-size: 0.72rem;
  color: var(--regula-text-muted, #a5b1bf);
  font-weight: 500;
}

.ent-day__cards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.ent-day__empty {
  font-size: 0.85rem;
  color: var(--regula-text-muted, #a5b1bf);
  text-align: center;
  padding: 1.5rem 0;
  margin: 0;
}

/* Tarjeta de reparto pendiente */
.ent-card {
  border: 1px solid var(--regula-gray-light, #e8ecf0);
  border-radius: var(--regula-radius-card, 12px);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  transition: box-shadow 0.18s ease;
}

.ent-card:hover {
  box-shadow: var(--regula-shadow-card, 0 2px 8px rgba(23, 45, 64, 0.08));
}

.ent-card__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.ent-card__id {
  font-size: 1rem;
  font-weight: 700;
  color: var(--regula-text-primary, #111);
}

.ent-card__eta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.1rem;
}

.ent-card__eta-label {
  font-size: 0.68rem;
  color: var(--regula-text-muted, #a5b1bf);
}

.ent-card__eta-value {
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--regula-text-primary, #111);
  line-height: 1;
}

.ent-card__status-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.ent-card__state {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--regula-text-body, #555f6e);
}

.ent-card__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--regula-orange, #f26e22);
  display: inline-block;
}

.ent-card__delay {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: #dc2626;
}

.ent-card__delay .pi {
  font-size: 0.75rem;
}

.ent-card__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.85rem 1rem;
  padding: 0.25rem 0;
  border-top: 1px solid var(--regula-gray-light, #e8ecf0);
  padding-top: 0.85rem;
}

.ent-card__field {
  display: flex;
  align-items: flex-start;
  gap: 0.55rem;
  min-width: 0;
}

.ent-card__field-icon {
  color: var(--regula-text-muted, #a5b1bf);
  font-size: 0.95rem;
  margin-top: 0.1rem;
}

.ent-card__field-value {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--regula-text-primary, #111);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ent-card__field-sub {
  font-size: 0.74rem;
  color: var(--regula-text-muted, #a5b1bf);
  margin: 0;
}

.ent-card__complete-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.6rem;
  border: 1px solid var(--regula-gray-light, #e8ecf0);
  border-radius: var(--regula-radius-btn, 8px);
  background: var(--regula-white, #fff);
  color: var(--regula-text-primary, #111);
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}

.ent-card__complete-btn:hover {
  background: var(--regula-orange, #f26e22);
  border-color: var(--regula-orange, #f26e22);
  color: var(--regula-white, #fff);
}

.ent-card__complete-btn .pi {
  font-size: 0.8rem;
}

/* Lista de completados */
.ent-day__completed-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.ent-completed {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 0.9rem;
  border: 1px solid var(--regula-gray-light, #e8ecf0);
  border-radius: var(--regula-radius-card, 12px);
}

.ent-completed__avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--regula-gray-light, #e8ecf0);
  color: var(--regula-text-muted, #a5b1bf);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 0.7rem;
}

.ent-completed__info {
  flex: 1;
  min-width: 0;
}

.ent-completed__id {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--regula-text-primary, #111);
  margin: 0;
}

.ent-completed__badge {
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--regula-text-muted, #a5b1bf);
}

.ent-completed__sub {
  font-size: 0.78rem;
  color: var(--regula-text-body, #555f6e);
  margin: 0.1rem 0 0;
}

.ent-completed__time {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.1rem;
  flex-shrink: 0;
}

.ent-completed__time-value {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--regula-text-primary, #111);
}

.ent-completed__time-label {
  font-size: 0.65rem;
  color: var(--regula-text-muted, #a5b1bf);
}

.ent-day__completed-footer {
  margin-top: 1rem;
  text-align: center;
}

.ent-day__see-all {
  font-size: 0.82rem;
  color: var(--regula-text-muted, #a5b1bf);
  text-decoration: none;
  font-weight: 500;
}

.ent-day__see-all:hover {
  color: var(--regula-orange, #f26e22);
}

@media (max-width: 860px) {
  .ent-day {
    grid-template-columns: 1fr;
  }
  .ent-card__grid {
    grid-template-columns: 1fr;
  }
}
</style>
