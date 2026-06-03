<script setup>
import { computed, ref, onMounted } from 'vue'
import { useCommercialStore } from '@/commercional-management/application/commercial.store.js'

import PendingDebtsPanel from '@/commercional-management/presentation/components/pending-debts-panel.vue'
import RegisterDebtPanel from '@/commercional-management/presentation/components/register-debt-panel.vue'
import RegisterPaymentPanel from '@/commercional-management/presentation/components/register-payment-panel.vue'
import CommercialHistoryPanel from '@/commercional-management/presentation/components/commercial-history-panel.vue'
import ProgressSpinner from 'primevue/progressspinner'

const store = useCommercialStore()

const activeTab = ref('pendientes')

const panels = computed(() => [
  { key: 'pendientes', header: 'Deudas Pendientes' },
  { key: 'registrar-deuda', header: 'Registrar Deuda' },
  { key: 'registrar-pago', header: 'Registrar Pago' },
  { key: 'historial', header: 'Historial' },
])

onMounted(() => {
  if (!store.loaded) {
    store.fetchCommercialData()
    return
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
      <div class="debts-view__top">
        <div class="debts-view__breadcrumb">
          <span>Regula</span>
          <span>›</span>
          <strong>Deudas y Cobranzas</strong>
        </div>

        <h1 class="debts-view__title">Deudas y Cobranzas</h1>
      </div>

      <nav class="debts-view__tabs">
        <button
            v-for="panel in panels"
            :key="panel.key"
            type="button"
            class="debts-view__tab"
            :class="{ 'debts-view__tab--active': activeTab === panel.key }"
            @click="activeTab = panel.key"
        >
          {{ panel.header }}
        </button>
      </nav>

      <PendingDebtsPanel
          v-if="activeTab === 'pendientes'"
          @go-to-tab="activeTab = $event"
      />
      <RegisterDebtPanel v-if="activeTab === 'registrar-deuda'" />
      <RegisterPaymentPanel v-if="activeTab === 'registrar-pago'" />
      <CommercialHistoryPanel v-if="activeTab === 'historial'" />
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

.debts-view__top {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.debts-view__breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  color: var(--regula-text-muted);
  font-size: 0.9rem;
}

.debts-view__breadcrumb strong {
  color: var(--regula-orange);
}

.debts-view__title {
  margin: 0;
  color: var(--regula-navy);
  font-size: 1.55rem;
  font-weight: 800;
}

.debts-view__tabs {
  display: flex;
  gap: 2rem;
  border-bottom: 1px solid var(--regula-gray-light);
}

.debts-view__tab {
  border: none;
  background: transparent;
  padding: 0.95rem 0;
  color: var(--regula-text-muted);
  font-weight: 700;
  cursor: pointer;
  border-bottom: 2px solid transparent;
}

.debts-view__tab--active {
  color: var(--regula-orange);
  border-bottom-color: var(--regula-orange);
}

@media (max-width: 768px) {
  .debts-view__tabs {
    gap: 1rem;
    overflow-x: auto;
  }

  .debts-view__tab {
    white-space: nowrap;
  }
}
</style>