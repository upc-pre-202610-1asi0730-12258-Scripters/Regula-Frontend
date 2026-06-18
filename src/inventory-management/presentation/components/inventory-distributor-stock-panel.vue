<script setup>
import InventoryStockCard from '@/inventory-management/presentation/components/inventory-stock-card.vue'

defineProps({
  cards: { type: Array, required: true },
})
</script>

<template>
  <div class="inv-stack">
    <h2 class="inv-title">Stock disponible</h2>
    <div class="inv-stock-grid">
      <InventoryStockCard
          v-for="card in cards"
          :key="card.id"
          :cylinder-type="card.cylinderType"
          :available="card.available"
      />
    </div>
  </div>
</template>
