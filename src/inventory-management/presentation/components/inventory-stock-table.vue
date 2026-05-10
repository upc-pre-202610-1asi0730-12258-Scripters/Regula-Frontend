<script setup>
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'

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

function alertClass(row, field) {
  if (field === 'disponible' && row.highlightDisponible) {
    return 'inv-cell--alert'
  }
  if (field === 'observado' && row.highlightObservado) {
    return 'inv-cell--alert'
  }
  return ''
}
</script>

<template>
  <div class="inv-table-wrap">
    <DataTable
        :value="rows"
        data-key="id"
        class="inv-table"
        show-gridlines
        responsive-layout="scroll"
    >
      <Column header="Tipo de Balón" style="min-width: 220px">
        <template #body="{ data }">
          <div class="inv-type">
            <span class="inv-type__badge">{{ data.badgeLabel }}</span>
            <span class="inv-type__name">{{ data.tipoNombre }}</span>
          </div>
        </template>
        <template #footer>
          <strong>Total General</strong>
        </template>
      </Column>

      <Column header="Disponible" style="min-width: 110px">
        <template #body="{ data }">
          <div
              class="inv-metric"
              :class="alertClass(data, 'disponible')"
          >
            <span>{{ data.disponible }}</span>
            <i
                v-if="data.warnDisponible"
                class="pi pi-exclamation-triangle inv-warn-icon"
                aria-hidden="true"
            />
          </div>
        </template>
        <template #footer>
          <strong>{{ totals.disponible }}</strong>
        </template>
      </Column>

      <Column header="En tránsito" style="min-width: 110px">
        <template #body="{ data }">
          <span>{{ data.enTransito }}</span>
        </template>
        <template #footer>
          <strong>{{ totals.enTransito }}</strong>
        </template>
      </Column>

      <Column header="Observado" style="min-width: 110px">
        <template #body="{ data }">
          <span :class="alertClass(data, 'observado')">{{ data.observado }}</span>
        </template>
        <template #footer>
          <strong>{{ totals.observado }}</strong>
        </template>
      </Column>

      <Column header="Fuera de servicio" style="min-width: 140px">
        <template #body="{ data }">
          <span>{{ data.fueraServicio }}</span>
        </template>
        <template #footer>
          <strong>{{ totals.fueraServicio }}</strong>
        </template>
      </Column>

      <Column header="Total" style="min-width: 100px">
        <template #body="{ data }">
          <span>{{ data.total }}</span>
        </template>
        <template #footer>
          <strong>{{ totals.total }}</strong>
        </template>
      </Column>

      <Column header="Acciones" style="min-width: 90px">
        <template #body>
          <span class="text-400">—</span>
        </template>
        <template #footer>
          <span />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
.inv-table-wrap {
  border-radius: var(--regula-radius-card);
  overflow: hidden;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.inv-table :deep(.p-datatable-thead > tr > th) {
  background: var(--regula-navy);
  color: var(--regula-white);
  font-weight: 700;
  font-size: var(--regula-type-small-size);
  border-color: color-mix(in srgb, var(--regula-white) 15%, var(--regula-navy));
  min-height: 48px;
}

.inv-table :deep(.p-datatable-tbody > tr > td) {
  font-size: var(--regula-type-body-size);
}

.inv-table :deep(.p-datatable-tbody > tr:nth-child(even) > td) {
  background: var(--regula-snow);
}

.inv-table :deep(.p-datatable-tbody > tr:nth-child(odd) > td) {
  background: var(--regula-white);
}

.inv-table :deep(.p-datatable-tfoot > tr > td) {
  background: var(--regula-gray-light);
  font-weight: 700;
  border-color: var(--regula-steel);
  color: var(--regula-navy);
}

.inv-type {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.inv-type__badge {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--regula-navy) 8%, var(--regula-white));
  color: var(--regula-navy);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: 700;
  font-family: var(--regula-font-mono);
}

.inv-type__name {
  font-weight: 600;
  color: var(--regula-text-primary);
}

.inv-metric {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.inv-warn-icon {
  color: var(--regula-orange-alert);
  font-size: 0.95rem;
}

.inv-cell--alert {
  display: inline-block;
  padding: 0.15rem 0.45rem;
  border-radius: 0.35rem;
  background: #fee2e2;
}
</style>
