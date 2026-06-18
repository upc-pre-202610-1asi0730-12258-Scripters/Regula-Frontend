<script setup>
import useInventoryStore from '@/inventory-management/application/inventory.store.js'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'

const store = useInventoryStore()

defineProps({
  rows: {
    type: Array,
    required: true,
  },
  totals: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <DataTable :value="rows" data-key="id" class="inv-table" show-gridlines responsive-layout="scroll">
    <Column header="Tipo de Balón">
      <template #body="{ data }">
        {{ store.getCylinderLabel(data.cylinderType) }}
        <span class="inv-hint">({{ data.cylinderType }})</span>
      </template>
      <template #footer><strong>Total</strong></template>
    </Column>
    <Column header="Disponible">
      <template #body="{ data }">{{ data.available }}</template>
      <template #footer><strong>{{ totals.available }}</strong></template>
    </Column>
    <Column header="En tránsito">
      <template #body="{ data }">{{ data.inTransit }}</template>
      <template #footer><strong>{{ totals.inTransit }}</strong></template>
    </Column>
    <Column header="Observado">
      <template #body="{ data }">{{ data.observed }}</template>
      <template #footer><strong>{{ totals.observed }}</strong></template>
    </Column>
    <Column header="Fuera de servicio">
      <template #body="{ data }">{{ data.outOfService }}</template>
      <template #footer><strong>{{ totals.outOfService }}</strong></template>
    </Column>
    <Column header="Total">
      <template #body="{ data }">{{ data.total }}</template>
      <template #footer><strong>{{ totals.total }}</strong></template>
    </Column>
  </DataTable>
</template>
