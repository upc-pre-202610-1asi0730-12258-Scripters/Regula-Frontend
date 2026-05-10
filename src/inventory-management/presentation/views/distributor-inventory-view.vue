<script setup>
import { useInventoryUiStore } from '@/inventory-management/application/inventory-ui.store.js'
import { useInventoryStore } from '@/inventory-management/application/inventory.store.js'
import DistributorRegisterEntryPanel from '@/inventory-management/presentation/components/distributor-register-entry-panel.vue'
import DistributorRegisterExitPanel from '@/inventory-management/presentation/components/distributor-register-exit-panel.vue'
import InventoryDistributorStockPanel from '@/inventory-management/presentation/components/inventory-distributor-stock-panel.vue'
import DistributorMovementHistoryPanel from '@/inventory-management/presentation/components/distributor-movement-history-panel.vue'
import InventoryShellTabs from '@/inventory-management/presentation/components/inventory-shell-tabs.vue'
import ProgressSpinner from 'primevue/progressspinner'
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const inventoryUi = useInventoryUiStore()

const store = useInventoryStore()
const { distributorCards, distributorLoaded } = storeToRefs(store)

const panels = computed(() => [
  { key: 'stock', header: t('inventory.tabs.stock') },
  { key: 'entrada', header: t('inventory.tabs.entry') },
  { key: 'salida', header: t('inventory.tabs.exit') },
  { key: 'historial', header: t('inventory.tabs.history') },
])

function onSectionChange({ key }) {
  inventoryUi.setInventorySectionKey(key)
}

onMounted(() => {
  store.fetchDistributorStock()
})
</script>

<template>
  <div class="dist-inv">
    <InventoryShellTabs :panels="panels" @section-change="onSectionChange">
      <template #stock>
        <div v-if="!distributorLoaded" class="dist-inv__loading">
          <ProgressSpinner stroke-width="4" style="width: 42px; height: 42px" />
          <span>{{ t('common.loadingStock') }}</span>
        </div>
        <InventoryDistributorStockPanel v-else :cards="distributorCards" />
      </template>

      <template #entrada>
        <DistributorRegisterEntryPanel />
      </template>
      <template #salida>
        <DistributorRegisterExitPanel />
      </template>
      <template #historial>
        <DistributorMovementHistoryPanel />
      </template>
    </InventoryShellTabs>
  </div>
</template>

<style scoped>
.dist-inv__loading {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 0;
  color: var(--regula-text-muted);
}
</style>
