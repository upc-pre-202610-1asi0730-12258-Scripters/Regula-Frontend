<script setup>
import useInventoryStore from '@/inventory-management/application/inventory.store.js'

const store = useInventoryStore()

defineProps({
  cylinderType: {
    type: String,
    required: true,
  },
  available: {
    type: Number,
    required: true,
  },
})
</script>

<template>
  <article class="inv-stock-card">
    <div class="inv-stock-card__title">{{ store.getCylinderLabel(cylinderType) }}</div>
    <div class="inv-hint">{{ cylinderType }}</div>
    <div class="inv-stock-card__qty">{{ available }}</div>
  </article>
</template>
