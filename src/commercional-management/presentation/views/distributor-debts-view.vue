<script setup>
import PendingDebtsPanel from '@/commercional-management/presentation/components/pending-debts-panel.vue'
import RegisterDebtPanel from '@/commercional-management/presentation/components/register-debt-panel.vue'
import RegisterPaymentPanel from '@/commercional-management/presentation/components/register-payment-panel.vue'
import CommercialHistoryPanel from '@/commercional-management/presentation/components/commercial-history-panel.vue'
import InventoryShellTabs from '@/inventory-management/presentation/components/inventory-shell-tabs.vue'
import { useCommercialStore } from '@/commercional-management/application/commercial.store.js'
import { computed, onMounted } from 'vue'

const store = useCommercialStore()

const panels = computed(() => [
  { key: 'pendientes', header: 'Fiados Pendientes' },
  { key: 'registrar-fiado', header: 'Registrar Fiado' },
  { key: 'registrar-pago', header: 'Registrar Pago' },
  { key: 'historial', header: 'Historial' },
])

onMounted(() => {
  store.fetchDebtData()
  onMounted(() => {
    store.fetchCommercialData()
    store.fetchDebtData()
  })
})
</script>

<template>
  <section class="debts-view">
    <InventoryShellTabs :panels="panels">
      <template #pendientes>
        <PendingDebtsPanel />
      </template>

      <template #registrar-fiado>
        <RegisterDebtPanel />
      </template>

      <template #registrar-pago>
        <RegisterPaymentPanel />
      </template>

      <template #historial>
        <CommercialHistoryPanel />
      </template>
    </InventoryShellTabs>
  </section>
</template>

<style scoped>
.debts-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>