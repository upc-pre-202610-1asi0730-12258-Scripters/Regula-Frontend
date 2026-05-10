<script setup>
import Button from 'primevue/button'
import Card from 'primevue/card'
import InventoryStockTable from '@/inventory-management/presentation/components/inventory-stock-table.vue'

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
  <div class="inv-enterprise">
    <div class="inv-enterprise__toolbar">
      <div class="inv-enterprise__toolbar-title">Resumen de Stock</div>
      <div class="inv-enterprise__toolbar-actions">
        <span v-tooltip.bottom="'Refina por tipo de balón, estado o ubicación cuando conectemos filtros'">
          <Button
              label="Filtrar"
              icon="pi pi-filter"
              severity="secondary"
              outlined
              class="inv-btn-secondary"
          />
        </span>
        <span v-tooltip.bottom="'Crea un movimiento de inventario (entrada, salida o ajuste)'">
          <Button label="Nuevo Registro" icon="pi pi-plus" class="inv-btn-primary" />
        </span>
      </div>
    </div>

    <Card class="inv-enterprise__card surface-card shadow-1">
      <template #title>
        <div class="inv-enterprise__card-head">
          <div class="inv-enterprise__card-title">
            <span class="inv-enterprise__card-icon">
              <i class="pi pi-database" aria-hidden="true" />
            </span>
            <span>Inventario Centralizado de Balones</span>
          </div>
          <button
              type="button"
              class="inv-enterprise__kebab"
              aria-label="Más opciones para esta tabla"
              v-tooltip.bottom="'Exportar, refrescar o configurar columnas (lo habilitamos pronto)'"
          >
            <i class="pi pi-ellipsis-h" aria-hidden="true" />
          </button>
        </div>
      </template>
      <template #content>
        <InventoryStockTable :rows="rows" :totals="totals" />
      </template>
    </Card>
  </div>
</template>

<style scoped>
.inv-enterprise__toolbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.inv-enterprise__toolbar-title {
  font-weight: 600;
  font-size: var(--regula-type-h3-size);
  line-height: 1.4;
  color: var(--regula-navy);
}

.inv-enterprise__toolbar-actions {
  display: flex;
  gap: 0.65rem;
  flex-wrap: wrap;
}

.inv-enterprise__card {
  border-radius: var(--regula-radius-card);
  box-shadow: var(--regula-shadow-card);
}

.inv-btn-secondary :deep(.p-button) {
  border: 1.5px solid var(--regula-navy);
  color: var(--regula-navy);
  background: transparent;
  border-radius: var(--regula-radius-btn);
  min-height: 44px;
  padding: 0.65rem 1.25rem;
  font-weight: 600;
}

.inv-btn-secondary :deep(.p-button:hover) {
  background: var(--regula-navy);
  color: var(--regula-white);
}

.inv-btn-primary :deep(.p-button) {
  background: var(--regula-orange);
  border-color: var(--regula-orange);
  border-radius: var(--regula-radius-btn);
  min-height: 44px;
  padding: 0.65rem 1.25rem;
  font-weight: 700;
}

.inv-btn-primary :deep(.p-button:hover) {
  background: var(--regula-orange-hover);
  border-color: var(--regula-orange-hover);
}

.inv-enterprise__card :deep(.p-card-title) {
  margin: 0;
}

.inv-enterprise__card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.inv-enterprise__card-title {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-weight: 600;
  font-size: var(--regula-type-h3-size);
  color: var(--regula-navy);
}

.inv-enterprise__card-icon {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: var(--regula-radius-btn);
  background: color-mix(in srgb, var(--regula-navy) 8%, var(--regula-white));
  color: var(--regula-navy);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.inv-enterprise__kebab {
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--regula-text-muted);
  padding: 0.45rem;
  border-radius: var(--regula-radius-btn);
  min-width: 44px;
  min-height: 44px;
}

.inv-enterprise__kebab:hover {
  background: var(--regula-gray-light);
}

@media (max-width: 639px) {
  .inv-enterprise__toolbar-actions {
    width: 100%;
    justify-content: stretch;
  }

  .inv-enterprise__toolbar-actions > span {
    flex: 1 1 auto;
  }

  .inv-enterprise__toolbar-actions :deep(.p-button) {
    width: 100%;
    justify-content: center;
  }
}
</style>
