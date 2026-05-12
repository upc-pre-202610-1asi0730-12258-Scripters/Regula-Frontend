<script setup>
import { useCommercialStore } from '@/commercional-management/application/commercial.store.js'
import Button from 'primevue/button'

const store = useCommercialStore()
</script>

<template>
  <section class="pending">
    <div class="pending__top">
      <div>
        <h2>Clientes con deuda activa</h2>
        <p>Ordenados por mayor deuda</p>
      </div>

      <div class="pending__alert">
        <i class="pi pi-exclamation-circle"></i>
        Total pendiente de cobro: <strong>S/. {{ store.totalPendingDebt }}</strong> ·
        {{ store.clientsWithDebt.length }} clientes con deuda
      </div>
    </div>

    <div class="pending__grid">
      <article v-for="client in store.clientsWithDebt" :key="client.id" class="pending__card">
        <div class="pending__card-main">
          <div class="pending__avatar">{{ client.initials }}</div>

          <div>
            <h3>{{ client.name }}</h3>
            <span>{{ client.debtCount }} fiado(s)</span>
          </div>

          <div class="pending__amount">S/. {{ client.activeDebt }}</div>
        </div>

        <p class="pending__oldest">Fiado más antiguo: {{ client.oldestDebt }}</p>

        <div class="pending__actions">
          <Button label="Registrar pago" class="pending__primary" />
          <Button label="Ver historial" outlined severity="secondary" />
          <button type="button" class="pending__detail">Ver detalle</button>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.pending__top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.pending__top h2 {
  margin: 0;
  color: var(--regula-navy);
}

.pending__top p {
  margin: 0.25rem 0 0;
  color: var(--regula-text-muted);
}

.pending__alert {
  border: 1px solid #ef4444;
  color: #b91c1c;
  background: #fff1f2;
  padding: 0.75rem 1rem;
  border-radius: 10px;
}

.pending__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem;
}

.pending__card {
  background: var(--regula-white);
  border: 1px solid var(--regula-gray-light);
  border-left: 4px solid var(--regula-orange);
  border-radius: var(--regula-radius-card);
  box-shadow: 0 8px 24px rgba(23, 45, 64, 0.08);
  overflow: hidden;
}

.pending__card-main {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 1.5rem;
}

.pending__avatar {
  width: 48px;
  height: 48px;
  border-radius: 999px;
  background: #fee2e2;
  color: #dc2626;
  display: grid;
  place-items: center;
  font-weight: 800;
}

.pending__card h3 {
  margin: 0;
  color: var(--regula-navy);
}

.pending__card span {
  font-size: 0.8rem;
  background: #f1f5f9;
  padding: 0.15rem 0.4rem;
  border-radius: 6px;
}

.pending__amount {
  font-size: 1.6rem;
  font-weight: 800;
  color: #dc2626;
}

.pending__oldest {
  padding: 0 1.5rem 1rem;
  margin: 0;
  text-align: right;
  color: var(--regula-text-muted);
}

.pending__actions {
  border-top: 1px solid var(--regula-gray-light);
  padding: 1rem 1.5rem;
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.pending__primary {
  background: var(--regula-orange);
  border-color: var(--regula-orange);
}

.pending__detail {
  margin-left: auto;
  border: none;
  background: transparent;
  color: var(--regula-orange);
  font-weight: 700;
  cursor: pointer;
}

@media (max-width: 900px) {
  .pending__grid {
    grid-template-columns: 1fr;
  }
}
</style>