<script setup>
import Card from 'primevue/card'
import InventoryStockTable from '@/inventory-management/presentation/components/inventory-stock-table.vue'

defineProps({
  rows: { type: Array, required: true },
  totals: { type: Object, required: true },
})
</script>

<template>
  <Card>
    <template #title>Resumen de stock</template>
    <template #content>
      <InventoryStockTable :rows="rows" :totals="totals" />
    </template>
  </Card>
</template>
