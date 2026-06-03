<script setup>
import { computed, ref } from 'vue'
import { useCommercialStore } from '@/commercional-management/application/commercial.store.js'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'

const store = useCommercialStore()

const showAdvancedFilters = ref(false)
const currentPage = ref(1)
const pageSize = ref(5)

const selectedCylinderFilter = ref('Todos')
const selectedQuantityFilter = ref('Todos')

const activeMenuId = ref(null)
const selectedSale = ref(null)

const cylinderFilters = ['Todos', '5 kg', '10 kg', '15 kg', '45 kg']
const quantityFilters = ['Todos', '1 unidad', '2 a 5 unidades', 'Más de 5 unidades']

const filteredSales = computed(() => {
  let result = [...store.filteredSales]

  if (selectedCylinderFilter.value !== 'Todos') {
    result = result.filter((sale) => sale.cylinderType === selectedCylinderFilter.value)
  }

  if (selectedQuantityFilter.value === '1 unidad') {
    result = result.filter((sale) => Number(sale.quantity) === 1)
  }

  if (selectedQuantityFilter.value === '2 a 5 unidades') {
    result = result.filter((sale) => Number(sale.quantity) >= 2 && Number(sale.quantity) <= 5)
  }

  if (selectedQuantityFilter.value === 'Más de 5 unidades') {
    result = result.filter((sale) => Number(sale.quantity) > 5)
  }

  return result
})

const totalPages = computed(() => {
  return Math.max(Math.ceil(filteredSales.value.length / pageSize.value), 1)
})

const paginatedSales = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredSales.value.slice(start, end)
})

const firstVisibleRecord = computed(() => {
  if (filteredSales.value.length === 0) return 0
  return (currentPage.value - 1) * pageSize.value + 1
})

const lastVisibleRecord = computed(() => {
  return Math.min(currentPage.value * pageSize.value, filteredSales.value.length)
})

function getPaymentClass(paymentType) {
  if (paymentType === 'Efectivo') return 'sales-table__badge--cash'
  if (paymentType === 'Yape/Plin') return 'sales-table__badge--digital'
  if (paymentType === 'Transferencia') return 'sales-table__badge--transfer'
  if (paymentType === 'Deuda') return 'sales-table__badge--debt'
  return ''
}

function resetPage() {
  currentPage.value = 1
}

function setPaymentFilter(filter) {
  store.setPaymentFilter(filter)
  resetPage()
}

function setSearchQuery(value) {
  store.setSearchQuery(value)
  resetPage()
}

function setCylinderFilter(filter) {
  selectedCylinderFilter.value = filter
  resetPage()
}

function setQuantityFilter(filter) {
  selectedQuantityFilter.value = filter
  resetPage()
}

function clearAdvancedFilters() {
  selectedCylinderFilter.value = 'Todos'
  selectedQuantityFilter.value = 'Todos'
  resetPage()
}

function goToPreviousPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    activeMenuId.value = null
  }
}

function goToNextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    activeMenuId.value = null
  }
}

function toggleMenu(saleId) {
  activeMenuId.value = activeMenuId.value === saleId ? null : saleId
}

function viewSaleDetail(sale) {
  selectedSale.value = sale
  activeMenuId.value = null
}

function closeSaleDetail() {
  selectedSale.value = null
}

function copySaleId(sale) {
  navigator.clipboard.writeText(sale.id)
  activeMenuId.value = null
}

function cancelSale(sale) {
  activeMenuId.value = null

  const confirmed = window.confirm(`¿Seguro que deseas anular la venta ${sale.id}? Se devolverá el stock y el registro quedará marcado como anulado.`)

  if (!confirmed) return

  store.cancelSale(sale.id)
      .catch((error) => {
        window.alert(error.message || 'No se pudo anular la venta.')
      })
}


function exportSales() {
  if (filteredSales.value.length === 0) return

  const headers = [
    'ID Transacción',
    'Hora',
    'Tipo Balón',
    'Cantidad',
    'Tipo Pago',
    'Cliente',
    'Repartidor',
  ]

  const rows = filteredSales.value.map((sale) => [
    sale.id,
    sale.time,
    sale.cylinderType,
    sale.quantity,
    sale.paymentType,
    sale.client,
    sale.distributor,
  ])

  const csvContent = [headers, ...rows]
      .map((row) =>
          row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')
      )
      .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = 'ventas-distribuidor.csv'
  link.click()

  URL.revokeObjectURL(url)
}
</script>

<template>
  <article class="sales-table-card">
    <div class="sales-table__toolbar">
      <div class="sales-table__filters">
        <button
            v-for="filter in store.paymentFilters"
            :key="filter"
            type="button"
            class="sales-table__filter-btn"
            :class="{ 'sales-table__filter-btn--active': store.selectedPaymentFilter === filter }"
            @click="setPaymentFilter(filter)"
        >
          {{ filter }}
        </button>
      </div>

      <div class="sales-table__tools">
        <span class="sales-table__search">
          <i class="pi pi-search" />

          <InputText
              :model-value="store.searchQuery"
              placeholder="Buscar cliente o ID..."
              type="search"
              @update:model-value="setSearchQuery"
          />
        </span>

        <Button
            label="Filtros"
            icon="pi pi-filter"
            outlined
            severity="secondary"
            class="sales-table__secondary-btn"
            @click="showAdvancedFilters = !showAdvancedFilters"
        />

        <Button
            label="Exportar"
            icon="pi pi-download"
            outlined
            severity="secondary"
            class="sales-table__secondary-btn"
            :disabled="filteredSales.length === 0"
            @click="exportSales"
        />
      </div>
    </div>

    <div v-if="showAdvancedFilters" class="sales-table__advanced-filters">
      <div>
        <label>Tipo de balón</label>

        <div class="sales-table__chip-group">
          <button
              v-for="filter in cylinderFilters"
              :key="filter"
              type="button"
              class="sales-table__chip"
              :class="{ 'sales-table__chip--active': selectedCylinderFilter === filter }"
              @click="setCylinderFilter(filter)"
          >
            {{ filter }}
          </button>
        </div>
      </div>

      <div>
        <label>Cantidad</label>

        <div class="sales-table__chip-group">
          <button
              v-for="filter in quantityFilters"
              :key="filter"
              type="button"
              class="sales-table__chip"
              :class="{ 'sales-table__chip--active': selectedQuantityFilter === filter }"
              @click="setQuantityFilter(filter)"
          >
            {{ filter }}
          </button>
        </div>
      </div>

      <Button
          label="Limpiar filtros"
          text
          severity="secondary"
          class="sales-table__clear-btn"
          @click="clearAdvancedFilters"
      />
    </div>

    <div class="sales-table__wrapper">
      <table class="sales-table">
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
            v-for="sale in paginatedSales"
            :key="sale.id"
            :class="{
              'sales-table__row--debt': sale.paymentType === 'Deuda' && sale.status !== 'Anulada',
              'sales-table__row--new': sale.isNew && sale.status !== 'Anulada',
              'sales-table__row--canceled': sale.status === 'Anulada',
            }"
        >
          <td>
            <strong>{{ sale.id }}</strong>
            <span v-if="sale.isNew && sale.status !== 'Anulada'" class="sales-table__new-label">NUEVO</span>
            <span v-if="sale.status === 'Anulada'" class="sales-table__canceled-label">ANULADA</span>
          </td>

          <td>{{ sale.time }}</td>
          <td>{{ sale.cylinderType }}</td>
          <td>{{ sale.quantity }}</td>

          <td>
              <span class="sales-table__badge" :class="getPaymentClass(sale.paymentType)">
                <i v-if="sale.paymentType === 'Deuda'" class="pi pi-wallet" />
                {{ sale.status === 'Anulada' ? 'Anulada' : sale.paymentType }}
              </span>
          </td>

          <td>{{ sale.client }}</td>
          <td>{{ sale.distributor }}</td>

          <td class="sales-table__actions-cell">
            <button
                type="button"
                class="sales-table__action-btn"
                @click="toggleMenu(sale.id)"
            >
              <i class="pi pi-ellipsis-v" />
            </button>

            <div v-if="activeMenuId === sale.id" class="sales-table__menu">
              <button type="button" @click="viewSaleDetail(sale)">
                <i class="pi pi-eye" />
                Ver detalle
              </button>

              <button type="button" @click="copySaleId(sale)">
                <i class="pi pi-copy" />
                Copiar ID
              </button>

              <button
                  v-if="sale.status !== 'Anulada'"
                  type="button"
                  class="sales-table__menu-danger"
                  @click="cancelSale(sale)"
              >
                <i class="pi pi-ban" />
                Anular venta
              </button>
            </div>
          </td>
        </tr>

        <tr v-if="paginatedSales.length === 0">
          <td colspan="8" class="sales-table__empty">
            No se encontraron ventas con los filtros seleccionados.
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <footer class="sales-table__pagination">
      <span>
        Mostrando {{ firstVisibleRecord }} - {{ lastVisibleRecord }} de {{ filteredSales.length }} registros
      </span>

      <div class="sales-table__pages">
        <button
            type="button"
            :disabled="currentPage === 1"
            @click="goToPreviousPage"
        >
          Anterior
        </button>

        <button type="button" class="sales-table__page-active">
          {{ currentPage }}
        </button>

        <button
            type="button"
            :disabled="currentPage === totalPages"
            @click="goToNextPage"
        >
          Siguiente
        </button>
      </div>
    </footer>

    <div v-if="selectedSale" class="sales-table__detail-overlay" @click.self="closeSaleDetail">
      <section class="sales-table__detail-modal">
        <header>
          <div>
            <p>Detalle de venta</p>
            <h3>{{ selectedSale.id }}</h3>
          </div>

          <button type="button" @click="closeSaleDetail">
            <i class="pi pi-times" />
          </button>
        </header>

        <div class="sales-table__detail-grid">
          <span>Hora</span>
          <strong>{{ selectedSale.time }}</strong>

          <span>Tipo de balón</span>
          <strong>{{ selectedSale.cylinderType }}</strong>

          <span>Cantidad</span>
          <strong>{{ selectedSale.quantity }}</strong>

          <span>Tipo de pago</span>
          <strong>{{ selectedSale.paymentType }}</strong>

          <span>Estado</span>
          <strong>{{ selectedSale.status || 'Activa' }}</strong>

          <span>Cliente</span>
          <strong>{{ selectedSale.client }}</strong>

          <span>Repartidor</span>
          <strong>{{ selectedSale.distributor }}</strong>
        </div>
      </section>
    </div>
  </article>
</template>

<style scoped>
.sales-table-card {
  background: var(--regula-white);
  border: 1px solid var(--regula-gray-light);
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(23, 45, 64, 0.08);
  overflow: visible;
}

.sales-table__toolbar {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.2rem;
  flex-wrap: wrap;
}

.sales-table__filters {
  display: flex;
  gap: 0.2rem;
  border: 1px solid var(--regula-gray-light);
  border-radius: 10px;
  padding: 0.2rem;
}

.sales-table__filter-btn {
  min-height: 36px;
  padding: 0 1rem;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--regula-text-muted);
  font-weight: 600;
  cursor: pointer;
}

.sales-table__filter-btn--active {
  background: var(--regula-gray-light);
  color: var(--regula-navy);
}

.sales-table__tools {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.sales-table__search {
  min-width: 260px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid var(--regula-gray-light);
  border-radius: 10px;
  padding: 0 0.75rem;
  min-height: 40px;
}

.sales-table__search :deep(.p-inputtext) {
  border: none;
  box-shadow: none;
  width: 100%;
  padding: 0;
}

.sales-table__secondary-btn {
  min-height: 40px;
  border-radius: 10px;
}

.sales-table__advanced-filters {
  display: flex;
  align-items: flex-end;
  gap: 1.25rem;
  flex-wrap: wrap;
  padding: 0 1.2rem 1.2rem;
  border-bottom: 1px solid var(--regula-gray-light);
}

.sales-table__advanced-filters label {
  display: block;
  margin-bottom: 0.45rem;
  color: var(--regula-navy);
  font-weight: 700;
  font-size: 0.85rem;
}

.sales-table__chip-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.sales-table__chip {
  border: 1px solid var(--regula-gray-light);
  background: white;
  color: var(--regula-text-muted);
  border-radius: 999px;
  padding: 0.45rem 0.8rem;
  font-weight: 700;
  cursor: pointer;
}

.sales-table__chip--active {
  background: var(--regula-orange);
  border-color: var(--regula-orange);
  color: white;
}

.sales-table__wrapper {
  overflow-x: auto;
}

.sales-table {
  width: 100%;
  min-width: 980px;
  border-collapse: collapse;
}

.sales-table th,
.sales-table td {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--regula-gray-light);
  text-align: left;
}

.sales-table th {
  font-size: 0.75rem;
  color: var(--regula-text-muted);
}

.sales-table td {
  color: var(--regula-navy);
}

.sales-table__row--debt {
  background: #fff1f2;
}

.sales-table__row--new {
  background: #ecfdf5;
}

.sales-table__new-label {
  margin-left: 0.5rem;
  font-size: 0.7rem;
  font-weight: 800;
  background: #22c55e;
  color: white;
  border-radius: 5px;
  padding: 0.15rem 0.35rem;
}

.sales-table__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.65rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
}

.sales-table__badge--cash {
  background: #dcfce7;
  color: #15803d;
}

.sales-table__badge--digital,
.sales-table__badge--transfer {
  background: #eff6ff;
  color: #172d40;
}

.sales-table__badge--debt {
  background: #fee2e2;
  color: #dc2626;
}

.sales-table__actions-cell {
  position: relative;
}

.sales-table__action-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  color: var(--regula-steel);
  cursor: pointer;
}

.sales-table__menu {
  position: absolute;
  right: 1rem;
  top: 3rem;
  width: 150px;
  background: white;
  border: 1px solid var(--regula-gray-light);
  border-radius: 10px;
  box-shadow: 0 12px 30px rgba(23, 45, 64, 0.16);
  padding: 0.35rem;
  z-index: 20;
}

.sales-table__menu button {
  width: 100%;
  border: none;
  background: white;
  color: var(--regula-navy);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
}

.sales-table__menu button:hover {
  background: #fff3ec;
  color: var(--regula-orange);
}

.sales-table__empty {
  text-align: center;
  color: var(--regula-text-muted);
  padding: 2rem;
}

.sales-table__pagination {
  display: flex;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  color: var(--regula-text-muted);
}

.sales-table__pages {
  display: flex;
  gap: 0.45rem;
}

.sales-table__pages button {
  min-height: 36px;
  border: 1px solid var(--regula-gray-light);
  border-radius: 8px;
  background: white;
  cursor: pointer;
  padding: 0 0.8rem;
}

.sales-table__pages button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.sales-table__page-active {
  background: var(--regula-orange) !important;
  color: white !important;
}

.sales-table__detail-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 80;
}

.sales-table__detail-modal {
  width: min(430px, 92vw);
  background: white;
  border-radius: 16px;
  padding: 1.4rem;
  box-shadow: 0 20px 50px rgba(23, 45, 64, 0.25);
}

.sales-table__detail-modal header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.sales-table__detail-modal header p {
  margin: 0;
  color: var(--regula-text-muted);
}

.sales-table__detail-modal header h3 {
  margin: 0.2rem 0 0;
  color: var(--regula-navy);
}

.sales-table__detail-modal header button {
  border: none;
  background: var(--regula-gray-light);
  border-radius: 8px;
  width: 36px;
  height: 36px;
  cursor: pointer;
}

.sales-table__detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8rem;
}

.sales-table__detail-grid span {
  color: var(--regula-text-muted);
}

.sales-table__detail-grid strong {
  color: var(--regula-navy);
  text-align: right;
}

.sales-table__row--canceled {
  background: #f3f4f6;
  opacity: 0.78;
}

.sales-table__canceled-label {
  margin-left: 0.5rem;
  font-size: 0.7rem;
  font-weight: 900;
  background: #6b7280;
  color: white;
  border-radius: 5px;
  padding: 0.15rem 0.35rem;
}

.sales-table__menu-danger {
  color: #dc2626 !important;
}

.sales-table__menu-danger:hover {
  background: #fee2e2 !important;
  color: #b91c1c !important;
}
</style>