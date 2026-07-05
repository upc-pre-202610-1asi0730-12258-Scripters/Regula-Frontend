<script setup>
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCommercialStore } from '@/commercional-management/application/commercial.store.js'
import RegisterSaleDialog from '@/commercional-management/presentation/components/register-sale-dialog.vue'
import SalesSummaryPanel from '@/commercional-management/presentation/components/sales-summary-panel.vue'
import SalesTable from '@/commercional-management/presentation/components/sales-table.vue'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'

const { t } = useI18n()
const store = useCommercialStore()
const showRegisterSaleDialog = ref(false)

function openRegisterSaleDialog() {
  showRegisterSaleDialog.value = true
}

onMounted(() => {
  if (!store.loaded) {
    store.fetchCommercialData()
  }
})
</script>

<template>
  <section class="sales-view">
    <div v-if="!store.loaded" class="sales-view__loading">
      <ProgressSpinner stroke-width="4" style="width: 42px; height: 42px" />
      <span>{{ t('commercial.salesView.loading') }}</span>
    </div>

    <template v-else>
      <div class="sales-view__header">
        <p class="sales-view__eyebrow">{{ t('commercial.salesView.eyebrow') }}</p>

        <Button
            :label="t('commercial.salesView.registerSale')"
            icon="pi pi-plus"
            class="sales-view__primary-btn"
            @click="openRegisterSaleDialog"
        />
      </div>

      <SalesSummaryPanel />

      <SalesTable />

      <RegisterSaleDialog v-model:visible="showRegisterSaleDialog" />
    </template>
  </section>
</template>

<style scoped>
.sales-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.sales-view__loading {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--regula-text-muted);
}

.sales-view__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sales-view__eyebrow {
  margin: 0;
  color: var(--regula-text-muted);
}

.sales-view__primary-btn {
  background: var(--regula-orange);
  border-color: var(--regula-orange);
  border-radius: 10px;
  font-weight: 700;
  min-height: 44px;
}
</style>