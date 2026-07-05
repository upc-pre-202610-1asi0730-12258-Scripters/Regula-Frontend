<script setup>
import InventoryStockCard from '@/inventory-management/presentation/components/inventory-stock-card.vue'

defineProps({
  cards: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['registrar-entrada'])
</script>

<template>
  <div class="inv-dist">
    <div class="inv-dist__head">
      <div class="inv-dist__head-left">
        <div class="inv-dist__title">Stock disponible en tu local</div>
        <div class="inv-dist__live">
          <span class="inv-dist__dot" aria-hidden="true" />
          Actualiza en tiempo real
        </div>
      </div>
    </div>

    <div class="inv-dist__grid">
      <InventoryStockCard
          v-for="card in cards"
          :key="card.id"
          :title="card.title"
          :subtitle="card.subtitle"
          :unidades="card.unidades"
          :status-label="card.statusLabel"
          :accent="card.accent"
          :footer-hint="card.footerHint"
          :show-registrar-entrada="card.showRegistrarEntrada"
          @registrar-entrada="emit('registrar-entrada')"
      />
    </div>

    <div class="inv-dist__footer">
      <i class="pi pi-sync" aria-hidden="true" />
      El stock se actualiza automáticamente con cada registro de entrada y salida.
    </div>
  </div>
</template>

<style scoped>
.inv-dist__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.inv-dist__title {
  font-weight: 600;
  font-size: var(--regula-type-h3-size);
  color: var(--regula-navy);
  margin-bottom: 0.35rem;
  line-height: 1.4;
}

.inv-dist__live {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: var(--regula-type-small-size);
  color: var(--regula-text-muted);
}

.inv-dist__dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: #22c55e;
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.15);
}

.inv-dist__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.inv-dist__footer {
  margin-top: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: var(--regula-text-muted);
  font-size: var(--regula-type-small-size);
  line-height: 1.5;
  max-width: 52ch;
  margin-inline: auto;
  text-align: center;
}

@media (max-width: 960px) {
  .inv-dist__grid {
    grid-template-columns: 1fr;
  }

  .inv-dist__head {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
