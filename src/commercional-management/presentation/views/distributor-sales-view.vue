<script setup>
import { useCommercialStore } from '@/commercional-management/application/commercial.store.js'
import RegisterSaleDialog from '@/commercional-management/presentation/components/register-sale-dialog.vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import ProgressSpinner from 'primevue/progressspinner'
import { computed, onMounted, ref } from 'vue'

const store = useCommercialStore()
const showRegisterSaleDialog = ref(false)

const summary = computed(() => store.salesSummary)
const filteredSales = computed(() => store.filteredSales)

function openRegisterSaleDialog() {
  showRegisterSaleDialog.value = true
}

function getPaymentClass(paymentType) {
  if (paymentType === 'Efectivo') return 'sales-view__badge--cash'
  if (paymentType === 'Yape/Plin') return 'sales-view__badge--digital'
  if (paymentType === 'Transferencia') return 'sales-view__badge--transfer'
  if (paymentType === 'Fiado') return 'sales-view__badge--debt'
  return ''
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
      <span>Cargando ventas del distribuidor...</span>
    </div>

    <template v-else>
      <div class="sales-view__header">
        <div>
          <p class="sales-view__eyebrow">Registro de ventas de la jornada</p>
        </div>

        <Button
            label="Registrar Venta"
            icon="pi pi-plus"
            class="sales-view__primary-btn"
            @click="openRegisterSaleDialog"
        />
      </div>

      <article class="sales-view__summary-card">
        <h2>Ventas del Día</h2>

        <div class="sales-view__summary-grid">
          <div class="sales-view__summary-item">
            <span>5 kg vendidos hoy</span>
            <strong>{{ summary.fiveKg }}</strong>
          </div>

          <div class="sales-view__summary-item">
            <span>10 kg vendidos hoy</span>
            <strong>{{ summary.tenKg }}</strong>
          </div>

          <div class="sales-view__summary-item">
            <span>15 kg vendidos hoy</span>
            <strong>{{ summary.fifteenKg }}</strong>
          </div>

          <div class="sales-view__summary-item">
            <span>45 kg vendidos hoy</span>
            <strong>{{ summary.fortyFiveKg }}</strong>
          </div>

          <div class="sales-view__summary-item">
            <span>Total operaciones</span>
            <strong>{{ summary.totalOperations }}</strong>
          </div>
        </div>
      </article>

      <article class="sales-view__table-card">
        <div class="sales-view__toolbar">
          <div class="sales-view__filters" role="group" aria-label="Filtros por tipo de pago">
            <button
                v-for="filter in store.paymentFilters"
                :key="filter"
                type="button"
                class="sales-view__filter-btn"
                :class="{ 'sales-view__filter-btn--active': store.selectedPaymentFilter === filter }"
                @click="store.setPaymentFilter(filter)"
            >
              {{ filter }}
            </button>
          </div>

          <div class="sales-view__tools">
            <span class="sales-view__search">
              <i class="pi pi-search" aria-hidden="true" />
              <InputText
                  :model-value="store.searchQuery"
                  placeholder="Buscar cliente o ID..."
                  type="search"
                  @update:model-value="store.setSearchQuery"
              />
            </span>

            <Button
                label="Filtros"
                icon="pi pi-filter"
                outlined
                severity="secondary"
                class="sales-view__secondary-btn"
            />

            <Button
                label="Exportar"
                icon="pi pi-download"
                outlined
                severity="secondary"
                class="sales-view__secondary-btn"
            />
          </div>
        </div>

        <div class="sales-view__table-wrapper">
          <table class="sales-view__table">
            <thead>
            <tr>
              <th>ID TRANSACCIÓN</th>
              <th>HORA</th>
              <th>TIPO BALÓN</th>
              <th>CANTIDAD</th>
              <th>TIPO PAGO</th>
              <th>CLIENTE</th>
              <th>REPARTIDOR</th>
              <th>ACCIONES</th>
            </tr>
            </thead>

            <tbody>
            <tr
                v-for="sale in filteredSales"
                :key="sale.id"
                :class="{
                  'sales-view__row--debt': sale.paymentType === 'Fiado',
                  'sales-view__row--new': sale.isNew,
                }"
            >
              <td>
                <strong>{{ sale.id }}</strong>
                <span v-if="sale.isNew" class="sales-view__new-label">NUEVO</span>
              </td>
              <td>{{ sale.time }}</td>
              <td>{{ sale.cylinderType }}</td>
              <td>{{ sale.quantity }}</td>
              <td>
                  <span class="sales-view__badge" :class="getPaymentClass(sale.paymentType)">
                    <i v-if="sale.paymentType === 'Fiado'" class="pi pi-wallet" aria-hidden="true" />
                    {{ sale.paymentType }}
                  </span>
              </td>
              <td>{{ sale.client }}</td>
              <td>{{ sale.distributor }}</td>
              <td>
                <button
                    type="button"
                    class="sales-view__action-btn"
                    aria-label="Ver acciones de venta"
                >
                  <i class="pi pi-ellipsis-v" aria-hidden="true" />
                </button>
              </td>
            </tr>

            <tr v-if="filteredSales.length === 0">
              <td colspan="8" class="sales-view__empty">
                No se encontraron ventas con los filtros seleccionados.
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <footer class="sales-view__pagination">
          <span>
            Mostrando 1 a {{ filteredSales.length }} de {{ store.sales.length }} registros
          </span>

          <div class="sales-view__pages">
            <button type="button" disabled>Anterior</button>
            <button type="button" class="sales-view__page-active">1</button>
            <button type="button">2</button>
            <button type="button">3</button>
            <span>...</span>
            <button type="button">Siguiente</button>
          </div>
        </footer>
      </article>

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
  padding: 1rem 0;
  color: var(--regula-text-muted);
}

.sales-view__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.sales-view__eyebrow {
  margin: 0;
  color: var(--regula-text-muted);
  font-size: var(--regula-type-body-size);
}

.sales-view__primary-btn {
  background: var(--regula-orange);
  border-color: var(--regula-orange);
  min-height: 44px;
  border-radius: var(--regula-radius-btn);
  font-weight: 700;
}

.sales-view__summary-card,
.sales-view__table-card {
  background: var(--regula-white);
  border: 1px solid var(--regula-gray-light);
  border-radius: var(--regula-radius-card);
  box-shadow: 0 8px 24px rgba(23, 45, 64, 0.08);
}

.sales-view__summary-card {
  padding: 1.5rem;
}

.sales-view__summary-card h2 {
  margin: 0 0 1.2rem;
  font-size: var(--regula-type-h2-size);
  color: var(--regula-navy);
}

.sales-view__summary-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.sales-view__summary-item {
  padding: 0 1rem;
  border-right: 1px solid var(--regula-gray-light);
}

.sales-view__summary-item:first-child {
  padding-left: 0;
}

.sales-view__summary-item:last-child {
  border-right: none;
}

.sales-view__summary-item span {
  display: block;
  color: var(--regula-text-muted);
  margin-bottom: 0.75rem;
}

.sales-view__summary-item strong {
  display: block;
  color: var(--regula-orange);
  font-size: 2rem;
  line-height: 1;
}

.sales-view__table-card {
  overflow: hidden;
}

.sales-view__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.2rem;
  flex-wrap: wrap;
}

.sales-view__filters {
  display: inline-flex;
  gap: 0.15rem;
  border: 1px solid var(--regula-gray-light);
  border-radius: 10px;
  padding: 0.2rem;
  background: var(--regula-white);
}

.sales-view__filter-btn {
  min-height: 36px;
  padding: 0 1.1rem;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--regula-text-muted);
  cursor: pointer;
  font-family: inherit;
  font-weight: 600;
}

.sales-view__filter-btn--active {
  background: var(--regula-gray-light);
  color: var(--regula-navy);
}

.sales-view__tools {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.sales-view__search {
  min-width: 260px;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid var(--regula-gray-light);
  border-radius: 10px;
  padding: 0 0.75rem;
  min-height: 40px;
  background: var(--regula-white);
}

.sales-view__search i {
  color: var(--regula-steel);
}

.sales-view__search :deep(.p-inputtext) {
  border: none;
  padding: 0;
  width: 100%;
  box-shadow: none;
}

.sales-view__secondary-btn {
  min-height: 40px;
  border-radius: 10px;
}

.sales-view__table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.sales-view__table {
  width: 100%;
  border-collapse: collapse;
  min-width: 980px;
}

.sales-view__table th {
  text-align: left;
  padding: 1rem 1.25rem;
  color: var(--regula-text-muted);
  font-size: 0.75rem;
  letter-spacing: 0.04em;
  font-weight: 800;
  border-top: 1px solid var(--regula-gray-light);
  border-bottom: 1px solid var(--regula-gray-light);
}

.sales-view__table td {
  padding: 1rem 1.25rem;
  color: var(--regula-navy);
  border-bottom: 1px solid var(--regula-gray-light);
  vertical-align: middle;
}

.sales-view__row--debt {
  background: #fff1f2;
}

.sales-view__row--new {
  background: #ecfdf5;
  border-left: 4px solid #22c55e;
}

.sales-view__new-label {
  margin-left: 0.5rem;
  font-size: 0.7rem;
  font-weight: 800;
  background: #22c55e;
  color: white;
  border-radius: 5px;
  padding: 0.15rem 0.35rem;
}

.sales-view__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.65rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
}

.sales-view__badge--cash {
  background: #dcfce7;
  color: #15803d;
}

.sales-view__badge--digital,
.sales-view__badge--transfer {
  background: #eff6ff;
  color: #172d40;
}

.sales-view__badge--debt {
  background: #fee2e2;
  color: #dc2626;
}

.sales-view__action-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  color: var(--regula-steel);
  cursor: pointer;
}

.sales-view__empty {
  text-align: center;
  color: var(--regula-text-muted);
  padding: 2rem !important;
}

.sales-view__pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  color: var(--regula-text-muted);
  flex-wrap: wrap;
}

.sales-view__pages {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}

.sales-view__pages button {
  min-height: 36px;
  min-width: 36px;
  border: 1px solid var(--regula-gray-light);
  border-radius: 8px;
  background: var(--regula-white);
  color: var(--regula-navy);
  cursor: pointer;
  font-family: inherit;
}

.sales-view__pages button:disabled {
  color: var(--regula-steel);
  background: #f8fafc;
  cursor: not-allowed;
}

.sales-view__page-active {
  background: var(--regula-orange) !important;
  border-color: var(--regula-orange) !important;
  color: var(--regula-white) !important;
}

@media (max-width: 900px) {
  .sales-view__summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.2rem;
  }

  .sales-view__summary-item {
    border-right: none;
    padding: 0;
  }
}

@media (max-width: 640px) {
  .sales-view__primary-btn {
    width: 100%;
  }

  .sales-view__filters {
    width: 100%;
    overflow-x: auto;
  }

  .sales-view__tools,
  .sales-view__search {
    width: 100%;
  }
}
</style>