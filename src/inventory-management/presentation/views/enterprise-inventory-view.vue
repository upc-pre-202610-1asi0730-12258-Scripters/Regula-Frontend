<script setup>
import useInventoryStore from '@/inventory-management/application/inventory.store.js'
import EnterpriseRegisterEntryPanel from '@/inventory-management/presentation/components/enterprise-register-entry-panel.vue'
import EnterpriseRegisterExitPanel from '@/inventory-management/presentation/components/enterprise-register-exit-panel.vue'
import InventoryEnterpriseStockPanel from '@/inventory-management/presentation/components/inventory-enterprise-stock-panel.vue'
import EnterpriseAuditPanel from '@/inventory-management/presentation/components/enterprise-audit-panel.vue'
import EnterpriseMovementHistoryPanel from '@/inventory-management/presentation/components/enterprise-movement-history-panel.vue'
import InventoryShellTabs from '@/inventory-management/presentation/components/inventory-shell-tabs.vue'
import ProgressSpinner from 'primevue/progressspinner'
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useInventoryStore()
const { enterpriseRows, enterpriseTotals, enterpriseLoaded } = storeToRefs(store)

const panels = computed(() => [
  { key: 'stock', header: t('inventory.tabs.stock') },
  { key: 'entrada', header: t('inventory.tabs.entry') },
  { key: 'salida', header: t('inventory.tabs.exit') },
  { key: 'historial', header: t('inventory.tabs.history') },
  {
    key: 'auditoria',
    header: t('inventory.tabs.audit'),
    badge: t('inventory.tabs.auditBadge'),
  },
])

function onSectionChange({ key }) {
  store.setInventorySectionKey(key)
}

onMounted(() => {
  store.fetchEnterpriseStock()
})
</script>

<template>
  <div class="enterprise-inv">
    <InventoryShellTabs :panels="panels" @section-change="onSectionChange">
      <template #stock>
        <div v-if="!enterpriseLoaded" class="enterprise-inv__loading">
          <ProgressSpinner stroke-width="4" style="width: 42px; height: 42px" />
          <span>{{ t('common.loadingInventory') }}</span>
        </div>
        <InventoryEnterpriseStockPanel
            v-else
            :rows="enterpriseRows"
            :totals="enterpriseTotals"
        />
      </template>

      <template #entrada>
        <EnterpriseRegisterEntryPanel />
      </template>
      <template #salida>
        <EnterpriseRegisterExitPanel />
      </template>
      <template #historial>
        <EnterpriseMovementHistoryPanel />
      </template>
      <template #auditoria>
        <EnterpriseAuditPanel />
      </template>
    </InventoryShellTabs>
  </div>
</template>

<style scoped>
.enterprise-inv__loading {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 0;
  color: var(--regula-text-muted);
}
</style>
