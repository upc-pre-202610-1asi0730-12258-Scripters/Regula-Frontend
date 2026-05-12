<script setup>
import { useCommercialStore } from '@/commercional-management/application/commercial.store.js'
import PendingDebtsPanel from '@/commercional-management/presentation/components/pending-debts-panel.vue'
import RegisterDebtPanel from '@/commercional-management/presentation/components/register-debt-panel.vue'
import RegisterPaymentPanel from '@/commercional-management/presentation/components/register-payment-panel.vue'
import CommercialHistoryPanel from '@/commercional-management/presentation/components/commercial-history-panel.vue'
import ProgressSpinner from 'primevue/progressspinner'
import { onMounted } from 'vue'

const store = useCommercialStore()

onMounted(() => {
  if (!store.loaded) {
    store.fetchCommercialData()
  }
  if (!store.debtLoaded) {
    store.fetchDebtData()
  }
})
</script>

<template>
  <section class="debts-view">
    <div v-if="!store.debtLoaded || !store.loaded" class="debts-view__loading">
      <ProgressSpinner stroke-width="4" style="width: 42px; height: 42px" />
      <span>Cargando información comercial...</span>
    </div>

    <template v-else>
      <div class="debts-view__header">
        <div>
          <h1 class="debts-view__title">Gestión de Deudas y Pagos</h1>
          <p class="debts-view__eyebrow">Control de deudas, créditos y abonos de clientes</p>
        </div>
      </div>

      <div class="debts-view__grid">
        <!-- Columna Izquierda: Listado de deudas pendientes -->
        <div class="debts-view__column">
          <PendingDebtsPanel />
        </div>

        <!-- Columna Derecha: Acciones (Registrar Deuda / Pago) -->
        <div class="debts-view__column">
          <div class="debts-view__actions">
            <RegisterDebtPanel />
            <RegisterPaymentPanel />
          </div>
        </div>
      </div>

      <!-- Historial inferior -->
      <div class="debts-view__history">
        <CommercialHistoryPanel />
      </div>
    </template>
  </section>
</template>

<style scoped>
.debts-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.debts-view__loading {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 0;
  color: var(--regula-text-muted);
}

.debts-view__header {
  margin-bottom: 0.5rem;
}

.debts-view__title {
  margin: 0 0 0.25rem 0;
  color: var(--regula-navy);
  font-size: 1.75rem;
}

.debts-view__eyebrow {
  margin: 0;
  color: var(--regula-text-muted);
  font-size: var(--regula-type-body-size);
}

.debts-view__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  align-items: start;
}

.debts-view__actions {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.debts-view__history {
  margin-top: 1rem;
}

@media (max-width: 992px) {
  .debts-view__grid {
    grid-template-columns: 1fr;
  }
}
</style>