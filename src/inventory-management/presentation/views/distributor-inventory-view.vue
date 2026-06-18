<script setup>
import useInventoryStore from '@/inventory-management/application/inventory.store.js'
import DistributorRegisterEntryPanel from '@/inventory-management/presentation/components/distributor-register-entry-panel.vue'
import DistributorRegisterExitPanel from '@/inventory-management/presentation/components/distributor-register-exit-panel.vue'
import InventoryDistributorStockPanel from '@/inventory-management/presentation/components/inventory-distributor-stock-panel.vue'
import DistributorMovementHistoryPanel from '@/inventory-management/presentation/components/distributor-movement-history-panel.vue'
import InventoryShellTabs from '@/inventory-management/presentation/components/inventory-shell-tabs.vue'
import ProgressSpinner from 'primevue/progressspinner'
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import '../inventory.css'

const { t } = useI18n()
const store = useInventoryStore()
const { distributorCards, distributorLoaded } = storeToRefs(store)

const panels = computed(() => [
  { key: 'stock', header: t('inventory.tabs.stock') },
  { key: 'entrada', header: t('inventory.tabs.entry') },
  { key: 'salida', header: t('inventory.tabs.exit') },
  { key: 'historial', header: t('inventory.tabs.history') },
])

onMounted(() => {
  store.fetchDistributorStock()
})
</script>

<template>
  <InventoryShellTabs :panels="panels" @section-change="({ key }) => store.setInventorySectionKey(key)">
    <template #stock>
      <div v-if="!distributorLoaded" class="inv-loading">
        <ProgressSpinner stroke-width="4" style="width: 42px; height: 42px" />
        <span>{{ t('common.loadingStock') }}</span>
      </div>
      <InventoryDistributorStockPanel v-else :cards="distributorCards" />
    </template>
    <template #entrada><DistributorRegisterEntryPanel /></template>
    <template #salida><DistributorRegisterExitPanel /></template>
    <template #historial><DistributorMovementHistoryPanel /></template>
  </InventoryShellTabs>
</template>
