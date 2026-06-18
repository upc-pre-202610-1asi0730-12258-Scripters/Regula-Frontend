<script setup>
import useInventoryStore from '@/inventory-management/application/inventory.store.js'
import EnterpriseRegisterEntryPanel from '@/inventory-management/presentation/components/enterprise-register-entry-panel.vue'
import EnterpriseRegisterExitPanel from '@/inventory-management/presentation/components/enterprise-register-exit-panel.vue'
import InventoryEnterpriseStockPanel from '@/inventory-management/presentation/components/inventory-enterprise-stock-panel.vue'
import EnterpriseMovementHistoryPanel from '@/inventory-management/presentation/components/enterprise-movement-history-panel.vue'
import InventoryShellTabs from '@/inventory-management/presentation/components/inventory-shell-tabs.vue'
import ProgressSpinner from 'primevue/progressspinner'
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import '../inventory.css'

const { t } = useI18n()
const store = useInventoryStore()
const { enterpriseRows, enterpriseTotals, enterpriseLoaded } = storeToRefs(store)

const panels = computed(() => [
  { key: 'stock', header: t('inventory.tabs.stock') },
  { key: 'entrada', header: t('inventory.tabs.entry') },
  { key: 'salida', header: t('inventory.tabs.exit') },
  { key: 'historial', header: t('inventory.tabs.history') },
])

onMounted(() => {
  store.fetchEnterpriseStock()
})
</script>

<template>
  <InventoryShellTabs :panels="panels" @section-change="({ key }) => store.setInventorySectionKey(key)">
    <template #stock>
      <div v-if="!enterpriseLoaded" class="inv-loading">
        <ProgressSpinner stroke-width="4" style="width: 42px; height: 42px" />
        <span>{{ t('common.loadingInventory') }}</span>
      </div>
      <InventoryEnterpriseStockPanel v-else :rows="enterpriseRows" :totals="enterpriseTotals" />
    </template>
    <template #entrada><EnterpriseRegisterEntryPanel /></template>
    <template #salida><EnterpriseRegisterExitPanel /></template>
    <template #historial><EnterpriseMovementHistoryPanel /></template>
  </InventoryShellTabs>
</template>
