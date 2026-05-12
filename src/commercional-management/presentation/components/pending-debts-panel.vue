<script setup>
import { useCommercialStore } from '@/commercional-management/application/commercial.store.js'
import Button from 'primevue/button'

const store = useCommercialStore()
</script>

<template>
  <section class="pending">
    <div class="pending__header">
      <h2>Deudas Pendientes</h2>
      <span class="pending__badge">Total: S/. {{ store.totalPendingDebt }}</span>
    </div>

    <div class="pending__list">
      <div v-for="client in store.clientsWithDebt" :key="client.id" class="pending__item">
        <div class="pending__client-info">
          <div class="pending__avatar">
            <i class="pi pi-user" aria-hidden="true"></i>
          </div>

          <div>
            <strong>{{ client.name }}</strong>
            <span>{{ client.debtCount }} deudas pendientes</span>
          </div>
        </div>

        <div class="pending__amount">
          <strong>S/. {{ client.activeDebt }}</strong>
        </div>
      </div>

      <div v-if="store.clientsWithDebt.length === 0" class="pending__empty">
        <i class="pi pi-check-circle" aria-hidden="true" />
        <p>No hay deudas pendientes por cobrar.</p>
      </div>
    </div>

    <Button label="Ver todas las cuentas" severity="secondary" outlined class="pending__btn" />
  </section>
</template>

<style scoped>
.pending {
  background: white;
  border-radius: var(--regula-radius-card);
  border: 1px solid var(--regula-gray-light);
  padding: 1.5rem;
  box-shadow: 0 8px 24px rgba(23, 45, 64, 0.08);
}

.pending__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.pending h2 {
  margin: 0;
  color: var(--regula-navy);
  font-size: 1.2rem;
}

.pending__badge {
  background: #fee2e2;
  color: #dc2626;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  font-weight: 800;
  font-size: 0.85rem;
}

.pending__list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.pending__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border: 1px solid var(--regula-gray-light);
  border-radius: 12px;
}

.pending__client-info {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.pending__avatar {
  width: 42px;
  height: 42px;
  background: var(--regula-surface);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--regula-steel);
}

.pending__client-info strong {
  display: block;
  color: var(--regula-navy);
  margin-bottom: 0.15rem;
}

.pending__client-info span {
  font-size: 0.8rem;
  color: var(--regula-text-muted);
}

.pending__amount strong {
  color: #dc2626;
  font-size: 1.1rem;
}

.pending__btn {
  width: 100%;
}

.pending__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
  color: var(--regula-text-muted);
}

.pending__empty i {
  font-size: 2rem;
  color: #22c55e;
  margin-bottom: 0.75rem;
}
</style>