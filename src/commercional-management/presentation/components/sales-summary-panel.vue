<script setup>
import { computed } from 'vue'
import { useCommercialStore } from '@/commercional-management/application/commercial.store.js'

const store = useCommercialStore()
const summary = computed(() => store.salesSummary)
</script>

<template>
  <article class="sales-summary">
    <h2>Ventas del Día</h2>

    <div class="sales-summary__grid">
      <div class="sales-summary__item">
        <span>5 kg vendidos hoy</span>
        <strong>{{ summary.fiveKg }}</strong>
      </div>

      <div class="sales-summary__item">
        <span>10 kg vendidos hoy</span>
        <strong>{{ summary.tenKg }}</strong>
      </div>

      <div class="sales-summary__item">
        <span>15 kg vendidos hoy</span>
        <strong>{{ summary.fifteenKg }}</strong>
      </div>

      <div class="sales-summary__item">
        <span>45 kg vendidos hoy</span>
        <strong>{{ summary.fortyFiveKg }}</strong>
      </div>

      <div class="sales-summary__item">
        <span>Total operaciones</span>
        <strong>{{ summary.totalOperations }}</strong>
      </div>
    </div>
  </article>
</template>

<style scoped>
.sales-summary {
  background: var(--regula-white);
  border: 1px solid var(--regula-gray-light);
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(23, 45, 64, 0.08);
  padding: 1.5rem;
}

.sales-summary h2 {
  margin: 0 0 1.2rem;
  color: var(--regula-navy);
}

.sales-summary__grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
}

.sales-summary__item {
  padding: 0 1rem;
  border-right: 1px solid var(--regula-gray-light);
}

.sales-summary__item:first-child {
  padding-left: 0;
}

.sales-summary__item:last-child {
  border-right: none;
}

.sales-summary__item span {
  display: block;
  color: var(--regula-text-muted);
  margin-bottom: 0.75rem;
}

.sales-summary__item strong {
  display: block;
  color: var(--regula-orange);
  font-size: 2rem;
}

@media (max-width: 900px) {
  .sales-summary__grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .sales-summary__item {
    border-right: none;
    padding: 0;
  }
}
</style>