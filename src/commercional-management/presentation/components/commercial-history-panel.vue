<script setup>
import { computed, ref, watch } from 'vue'
import { useCommercialStore } from '@/commercional-management/application/commercial.store.js'
import Button from 'primevue/button'

const store = useCommercialStore()

const selectedClient = ref('Todos')
const selectedType = ref('Todos')
const startDate = ref('')
const endDate = ref('')
const currentPage = ref(1)
const goToPageValue = ref(1)

const rowsPerPage = 6

const clientOptions = computed(() => {
  const names = store.debtMovements.map((movement) => movement.client)
  return ['Todos', ...new Set(names)]
})

const filteredMovements = computed(() => {
  return store.debtMovements
      .filter((movement) => {
        const matchesClient =
            selectedClient.value === 'Todos' || movement.client === selectedClient.value

        const matchesType =
            selectedType.value === 'Todos' || movement.type === selectedType.value

        const movementDate = parseMovementDate(movement.date)

        const matchesStartDate =
            !startDate.value || movementDate >= new Date(`${startDate.value}T00:00:00`)

        const matchesEndDate =
            !endDate.value || movementDate <= new Date(`${endDate.value}T23:59:59`)

        return matchesClient && matchesType && matchesStartDate && matchesEndDate
      })
      .sort((a, b) => {
        const dateA = parseMovementDate(a.date, a.time)
        const dateB = parseMovementDate(b.date, b.time)

        return dateB - dateA
      })
})

const totalPages = computed(() => {
  return Math.max(Math.ceil(filteredMovements.value.length / rowsPerPage), 1)
})

const paginatedMovements = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage
  const end = start + rowsPerPage

  return filteredMovements.value.slice(start, end)
})

const showingFrom = computed(() => {
  if (filteredMovements.value.length === 0) return 0
  return (currentPage.value - 1) * rowsPerPage + 1
})

const showingTo = computed(() => {
  return Math.min(currentPage.value * rowsPerPage, filteredMovements.value.length)
})

const hasFilters = computed(() => {
  return (
      selectedClient.value !== 'Todos' ||
      selectedType.value !== 'Todos' ||
      startDate.value ||
      endDate.value
  )
})

watch([selectedClient, selectedType, startDate, endDate], () => {
  currentPage.value = 1
  goToPageValue.value = 1
})

watch(currentPage, (value) => {
  goToPageValue.value = value
})

function formatMoney(value) {
  return `S/. ${Number(value || 0).toFixed(0)}`
}
function getCleanDescription(movement) {
  if (movement.type === 'Pago') {
    return 'Pago total'
  }

  return movement.description
}
function getInitials(name) {
  return String(name || '')
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase()
}

function parseMovementDate(date, time = '00:00') {
  const [day, month, year] = String(date).split('/').map(Number)
  const [hour = 0, minute = 0] = String(time || '00:00').split(':').map(Number)

  return new Date(year, month - 1, day, hour, minute)
}

function clearFilters() {
  selectedClient.value = 'Todos'
  selectedType.value = 'Todos'
  startDate.value = ''
  endDate.value = ''
  currentPage.value = 1
}

function goToPreviousPage() {
  if (currentPage.value > 1) {
    currentPage.value -= 1
  }
}

function goToNextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1
  }
}

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

function submitGoToPage() {
  const page = Number(goToPageValue.value)

  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

function exportCsv() {
  const headers = [
    'ID',
    'Fecha',
    'Hora',
    'Tipo',
    'Cliente',
    'Descripción',
    'Monto',
    'Saldo posterior',
    'Usuario',
  ]

  const rows = filteredMovements.value.map((movement) => [
    movement.id,
    movement.date,
    movement.time,
    movement.type,
    movement.client,
    movement.description,
    movement.amount,
    movement.balance,
    movement.user,
  ])

  const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(','))
      .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = 'historial-deudas.csv'
  link.click()

  URL.revokeObjectURL(url)
}
</script>

<template>
  <section class="history-panel">
    <header class="history-panel__header">
      <div class="history-panel__title">
        <div class="history-panel__icon">
          <i class="pi pi-history"></i>
        </div>

        <div>
          <h2>Historial de movimientos</h2>
          <p>Registro completo de deudas y pagos</p>
        </div>
      </div>

      <div class="history-panel__actions">
        <div class="history-panel__counter">
          <i class="pi pi-list"></i>
          {{ filteredMovements.length }} movimientos encontrados
        </div>

        <Button
            label="Exportar"
            icon="pi pi-download"
            severity="secondary"
            outlined
            @click="exportCsv"
        />
      </div>
    </header>

    <section class="history-panel__filters">
      <div class="filters-label">
        <i class="pi pi-filter"></i>
        <strong>Filtros</strong>
      </div>

      <div class="filter-field">
        <label>Cliente</label>
        <select v-model="selectedClient">
          <option v-for="client in clientOptions" :key="client" :value="client">
            {{ client === 'Todos' ? 'Todos los clientes' : client }}
          </option>
        </select>
      </div>

      <div class="filter-field">
        <label>Tipo</label>

        <div class="type-filter">
          <button
              type="button"
              :class="{ active: selectedType === 'Todos' }"
              @click="selectedType = 'Todos'"
          >
            Todos
          </button>

          <button
              type="button"
              :class="{ active: selectedType === 'Deuda' }"
              @click="selectedType = 'Deuda'"
          >
            <span class="dot dot--debt"></span>
            Deuda
          </button>

          <button
              type="button"
              :class="{ active: selectedType === 'Pago' }"
              @click="selectedType = 'Pago'"
          >
            <span class="dot dot--payment"></span>
            Pago
          </button>
        </div>
      </div>

      <div class="filter-field filter-field--dates">
        <label>Rango de fechas</label>

        <div class="date-row">
          <input v-model="startDate" type="date" />
          <span>hasta</span>
          <input v-model="endDate" type="date" />
        </div>
      </div>

      <div class="filter-buttons">
        <Button label="Buscar" icon="pi pi-search" class="search-button" />
        <Button
            label="Limpiar"
            icon="pi pi-times"
            severity="secondary"
            outlined
            @click="clearFilters"
        />
      </div>
    </section>

    <div v-if="hasFilters" class="history-panel__result-message">
      Se encontraron <strong>{{ filteredMovements.length }}</strong> movimientos con los filtros aplicados.
    </div>

    <section class="history-table">
      <table>
        <thead>
        <tr>
          <th># ID</th>
          <th>Fecha y hora</th>
          <th>Tipo</th>
          <th>Cliente</th>
          <th>Balones / Descripción</th>
          <th>Monto</th>
          <th>Saldo posterior</th>
          <th>Usuario</th>
        </tr>
        </thead>

        <tbody>
        <tr
            v-for="movement in paginatedMovements"
            :key="movement.id"
            :class="{
              'row-payment': movement.type === 'Pago',
              'row-debt': movement.type === 'Deuda',
            }"
        >
          <td class="mono">{{ movement.id }}</td>

          <td>
            <strong>{{ movement.date }}</strong>
            <span>{{ movement.time }}</span>
          </td>

          <td>
              <span
                  class="type-badge"
                  :class="movement.type === 'Pago' ? 'type-badge--payment' : 'type-badge--debt'"
              >
                <i :class="movement.type === 'Pago' ? 'pi pi-check-circle' : 'pi pi-fire'"></i>
                {{ movement.type }}
              </span>
          </td>

          <td>
            <div class="client-cell">
              <span class="client-avatar">{{ getInitials(movement.client) }}</span>
              <strong>{{ movement.client }}</strong>
            </div>
          </td>

          <td>
            <div class="description-cell">
                <span
                    class="description-icon"
                    :class="movement.type === 'Pago' ? 'description-icon--payment' : 'description-icon--debt'"
                >
                <i v-if="movement.type === 'Pago'" class="pi pi-check"></i>

                <img
                v-else
                src="/cylinder-flame.svg"
                alt=""
                class="description-icon__image"
                />
                </span>

              <div>
                <strong>{{ getCleanDescription(movement) }}</strong>
                <small v-if="movement.type === 'Pago' && movement.balance === 0">
                  Deuda liquidada completamente
                </small>
              </div>
            </div>
          </td>

          <td
              class="amount-cell"
              :class="movement.type === 'Pago' ? 'amount-cell--payment' : 'amount-cell--debt'"
          >
            {{ formatMoney(movement.amount) }}
          </td>

          <td>
              <span
                  v-if="Number(movement.balance) === 0"
                  class="balance-badge"
              >
                <i class="pi pi-check-circle"></i>
                Sin deuda
              </span>

            <strong
                v-else
                class="balance-text"
                :class="movement.type === 'Pago' ? 'balance-text--payment' : 'balance-text--debt'"
            >
              {{ formatMoney(movement.balance) }}
            </strong>
          </td>

          <td>
            <div class="user-cell">
              <span><i class="pi pi-user"></i></span>
              {{ movement.user }}
            </div>
          </td>
        </tr>

        <tr v-if="paginatedMovements.length === 0">
          <td colspan="8" class="empty-row">
            No se encontraron movimientos con los criterios seleccionados.
          </td>
        </tr>
        </tbody>
      </table>
    </section>

    <footer class="history-panel__pagination">
      <p>
        Mostrando {{ showingFrom }} a {{ showingTo }} de
        {{ filteredMovements.length }} registros
      </p>

      <div class="pagination-controls">
        <button type="button" :disabled="currentPage === 1" @click="goToPreviousPage">
          <i class="pi pi-chevron-left"></i>
        </button>

        <button
            v-for="page in totalPages"
            :key="page"
            type="button"
            :class="{ active: currentPage === page }"
            @click="goToPage(page)"
        >
          {{ page }}
        </button>

        <button type="button" :disabled="currentPage === totalPages" @click="goToNextPage">
          <i class="pi pi-chevron-right"></i>
        </button>
      </div>

      <div class="go-to-page">
        <span>Ir a página</span>
        <input v-model.number="goToPageValue" type="number" min="1" :max="totalPages" />
        <button type="button" @click="submitGoToPage">Ir</button>
      </div>
    </footer>
  </section>
</template>

<style scoped>
.history-panel {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.history-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.history-panel__title {
  display: flex;
  align-items: center;
  gap: 0.9rem;
}

.history-panel__icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: #fff7ed;
  color: var(--regula-orange);
  display: flex;
  align-items: center;
  justify-content: center;
}

.history-panel__title h2 {
  margin: 0;
  color: var(--regula-navy);
  font-size: 1.35rem;
  font-weight: 900;
}

.history-panel__title p {
  margin: 0.25rem 0 0;
  color: var(--regula-text-muted);
}

.history-panel__actions {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}

.history-panel__counter {
  min-height: 42px;
  padding: 0 1rem;
  border: 1px solid var(--regula-gray-light);
  border-radius: 8px;
  background: white;
  display: flex;
  align-items: center;
  gap: 0.45rem;
  color: #4b5563;
  font-weight: 700;
}

.history-panel__counter i {
  color: var(--regula-orange);
}

.history-panel__filters {
  display: grid;
  grid-template-columns: auto 1fr 1.2fr 1.7fr auto;
  align-items: end;
  gap: 1rem;
  padding: 1.2rem;
  border: 1px solid var(--regula-gray-light);
  border-radius: 14px;
  background: white;
}

.filters-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-bottom: 0.8rem;
  color: var(--regula-navy);
}

.filters-label i {
  color: var(--regula-orange);
}

.filter-field {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.filter-field label {
  color: #64748b;
  font-size: 0.78rem;
  text-transform: uppercase;
  font-weight: 900;
  letter-spacing: 0.03em;
}

.filter-field select,
.filter-field input {
  height: 42px;
  border: 1px solid #d8e0ea;
  border-radius: 8px;
  padding: 0 0.8rem;
  color: var(--regula-navy);
  background: white;
  outline: none;
}

.type-filter {
  display: flex;
  min-height: 42px;
  border: 1px solid #d8e0ea;
  border-radius: 8px;
  overflow: hidden;
}

.type-filter button {
  border: none;
  background: #f8fafc;
  padding: 0 0.9rem;
  color: #64748b;
  font-weight: 800;
  cursor: pointer;
}

.type-filter button.active {
  background: var(--regula-navy);
  color: white;
}

.dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 999px;
  margin-right: 0.3rem;
}

.dot--debt {
  background: #ef4444;
}

.dot--payment {
  background: #22c55e;
}

.date-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.date-row input {
  width: 100%;
}

.filter-buttons {
  display: flex;
  gap: 0.5rem;
}

.search-button {
  background: var(--regula-orange) !important;
  border-color: var(--regula-orange) !important;
  font-weight: 900;
}

.history-panel__result-message {
  padding: 0.8rem 1rem;
  border: 1px solid #fed7aa;
  border-radius: 10px;
  background: #fff7ed;
  color: #9a3412;
  font-weight: 700;
}

.history-table {
  overflow-x: auto;
  border: 1px solid var(--regula-gray-light);
  border-radius: 14px;
  background: white;
}

.history-table table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1050px;
}

.history-table thead {
  background: var(--regula-navy);
  color: white;
}

.history-table th {
  padding: 1rem;
  text-align: left;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.history-table td {
  padding: 1rem;
  border-bottom: 1px solid var(--regula-gray-light);
  color: var(--regula-navy);
}

.history-table tbody tr:last-child td {
  border-bottom: none;
}

.history-table td > span,
.history-table td > strong {
  display: block;
}

.history-table td span {
  color: var(--regula-text-muted);
  font-size: 0.85rem;
}

.mono {
  font-family: monospace;
  font-weight: 800;
}

.row-payment {
  background: #ecfdf5;
}

.row-debt {
  background: white;
}

.type-badge {
  width: fit-content;
  padding: 0.32rem 0.65rem;
  border-radius: 999px;
  display: flex !important;
  align-items: center;
  gap: 0.3rem;
  font-weight: 900;
  font-size: 0.78rem !important;
}

.type-badge--payment {
  background: #dcfce7;
  color: #15803d !important;
}

.type-badge--debt {
  background: #fee2e2;
  color: #dc2626 !important;
}

.client-cell {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.client-avatar {
  width: 30px;
  height: 30px;
  border-radius: 999px;
  background: #dbeafe;
  color: #2563eb !important;
  display: flex !important;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem !important;
  font-weight: 900;
}

.description-cell {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.description-icon {
  width: 34px;
  height: 34px;
  min-width: 34px;
  border-radius: 999px;
  display: flex !important;
  align-items: center;
  justify-content: center;
}

.description-icon--payment {
  background: #dcfce7;
  color: #16a34a !important;
}

.description-icon--debt {
  background: #fff7ed;
  color: var(--regula-orange) !important;
}

.description-icon__image {
  width: 18px;
  height: 18px;
  object-fit: contain;
  display: block;
}

.description-cell strong {
  display: block;
  font-weight: 700;
}

.description-cell small {
  color: #16a34a;
}

.amount-cell {
  font-weight: 900;
}

.amount-cell--payment {
  color: #15803d !important;
}

.amount-cell--debt {
  color: #dc2626 !important;
}

.balance-text {
  font-weight: 900;
}

.balance-text--payment {
  color: var(--regula-orange) !important;
}

.balance-text--debt {
  color: #dc2626 !important;
}

.balance-badge {
  width: fit-content;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  background: #22c55e;
  color: white !important;
  font-weight: 900;
  display: flex !important;
  align-items: center;
  gap: 0.35rem;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-cell span {
  width: 30px;
  height: 30px;
  border-radius: 999px;
  background: #ffedd5;
  color: var(--regula-orange) !important;
  display: flex !important;
  align-items: center;
  justify-content: center;
}

.empty-row {
  text-align: center;
  padding: 2rem !important;
  color: var(--regula-text-muted) !important;
}

.history-panel__pagination {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1rem;
}

.history-panel__pagination p {
  margin: 0;
  color: #64748b;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.pagination-controls button,
.go-to-page button {
  min-width: 36px;
  height: 36px;
  border: 1px solid #d8e0ea;
  border-radius: 8px;
  background: white;
  color: var(--regula-navy);
  cursor: pointer;
}

.pagination-controls button.active {
  background: var(--regula-orange);
  border-color: var(--regula-orange);
  color: white;
}

.pagination-controls button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.go-to-page {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  color: #64748b;
}

.go-to-page input {
  width: 58px;
  height: 36px;
  border: 1px solid #d8e0ea;
  border-radius: 8px;
  text-align: center;
}

@media (max-width: 1200px) {
  .history-panel__filters {
    grid-template-columns: 1fr 1fr;
  }

  .filters-label,
  .filter-buttons {
    grid-column: span 2;
  }

  .history-panel__pagination {
    grid-template-columns: 1fr;
  }

  .pagination-controls,
  .go-to-page {
    justify-content: flex-start;
  }
}

@media (max-width: 768px) {
  .history-panel__header,
  .history-panel__actions {
    flex-direction: column;
    align-items: stretch;
  }

  .history-panel__filters {
    grid-template-columns: 1fr;
  }

  .filters-label,
  .filter-buttons {
    grid-column: auto;
  }

  .date-row {
    flex-direction: column;
    align-items: stretch;
  }

}
</style>