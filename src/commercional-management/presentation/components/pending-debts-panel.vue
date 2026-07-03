<script setup>
import { computed, ref } from 'vue'
import { useCommercialStore } from '@/commercional-management/application/commercial.store.js'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'

const emit = defineEmits(['go-to-tab'])

const store = useCommercialStore()

const sortMode = ref('mayor')
const detailVisible = ref(false)
const selectedClient = ref(null)

const pendingDebtMovements = computed(() => {
  return store.debtMovements.filter((movement) => {
    return movement.type === 'Deuda' &&
        movement.status !== 'Pagada' &&
        movement.status !== 'Anulada'
  })
})

const groupedClientsWithDebt = computed(() => {
  const grouped = new Map()

  pendingDebtMovements.value.forEach((movement) => {
    const clientName = String(movement.client || '').trim()

    if (!clientName) return

    const normalizedName = clientName.toLowerCase()

    if (!grouped.has(normalizedName)) {
      const existingClient = store.clients.find((client) => {
        return String(client.name || '').trim().toLowerCase() === normalizedName
      })

      grouped.set(normalizedName, {
        id: existingClient?.id || normalizedName,
        name: clientName,
        activeDebt: 0,
        debtCount: 0,
        oldestDebtDate: movement.date,
      })
    }

    const clientGroup = grouped.get(normalizedName)

    clientGroup.activeDebt += Number(movement.amount || 0)
    clientGroup.debtCount += 1

    const currentOldestDate = parseMovementDate(clientGroup.oldestDebtDate, '00:00')
    const movementDate = parseMovementDate(movement.date, movement.time)

    if (movementDate < currentOldestDate) {
      clientGroup.oldestDebtDate = movement.date
    }
  })

  return Array.from(grouped.values())
})

const sortedClients = computed(() => {
  const clients = [...groupedClientsWithDebt.value]

  if (sortMode.value === 'menor') {
    return clients.sort((a, b) => Number(a.activeDebt) - Number(b.activeDebt))
  }

  if (sortMode.value === 'nombre') {
    return clients.sort((a, b) => a.name.localeCompare(b.name))
  }

  return clients.sort((a, b) => Number(b.activeDebt) - Number(a.activeDebt))
})

const totalPendingDebt = computed(() =>
    sortedClients.value.reduce((total, client) => total + Number(client.activeDebt), 0)
)

function formatMoney(value) {
  return `S/. ${Number(value || 0).toFixed(0)}`
}

function getInitials(name) {
  return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase()
}

function getClientMovements(client) {
  return store.debtMovements
      .filter((movement) => {
        return String(movement.client || '').trim().toLowerCase() === String(client.name || '').trim().toLowerCase()
      })
      .sort((a, b) => {
        const dateA = parseMovementDate(a.date, a.time)
        const dateB = parseMovementDate(b.date, b.time)

        return dateA - dateB
      })
}

function getClientPendingDebtMovements(client) {
  return pendingDebtMovements.value
      .filter((movement) => {
        return String(movement.client || '').trim().toLowerCase() === String(client.name || '').trim().toLowerCase()
      })
      .sort((a, b) => {
        const dateA = parseMovementDate(a.date, a.time)
        const dateB = parseMovementDate(b.date, b.time)

        return dateA - dateB
      })
}

function getOldestDebtDate(client) {
  const firstDebt = getClientPendingDebtMovements(client)[0]

  return firstDebt?.date || 'Sin fecha'
}
function parseMovementDate(date, time) {
  const [day, month, year] = String(date).split('/').map(Number)
  const [hour = 0, minute = 0] = String(time || '00:00').split(':').map(Number)

  return new Date(year, month - 1, day, hour, minute)
}

function getDebtColor(index) {
  const colors = ['#ef4444', '#f97316', '#d97706', '#facc15']
  return colors[index] || '#f97316'
}

function showDetail(client) {
  selectedClient.value = client
  detailVisible.value = true
}

function goToPayment() {
  emit('go-to-tab', 'registrar-pago')
}

function goToHistory() {
  emit('go-to-tab', 'historial')
}
</script>

<template>
  <section class="pending-debts">
    <div class="pending-debts__header">
      <div>
        <h2>Clientes con deuda activa</h2>
        <p>Ordenados por mayor deuda</p>
      </div>

      <div class="pending-debts__actions">
        <div class="pending-debts__alert">
          <i class="pi pi-exclamation-circle"></i>
          <span>
            Total pendiente de cobro:
            <strong>{{ formatMoney(totalPendingDebt) }}</strong>
            · {{ sortedClients.length }} clientes con deuda
          </span>
        </div>

        <select v-model="sortMode" class="pending-debts__select" aria-label="Ordenar clientes">
          <option value="mayor">Mayor deuda primero</option>
          <option value="menor">Menor deuda primero</option>
          <option value="nombre">Nombre A-Z</option>
        </select>
      </div>
    </div>

    <div v-if="sortedClients.length > 0" class="pending-debts__grid">
      <article
          v-for="(client, index) in sortedClients"
          :key="client.id"
          class="debt-card"
          :style="{ '--debt-color': getDebtColor(index) }"
      >
        <div class="debt-card__body">
          <div class="debt-card__client">
            <div class="debt-card__avatar">
              {{ getInitials(client.name) }}
            </div>

            <div>
              <h3>{{ client.name }}</h3>
              <span>
{{ getClientPendingDebtMovements(client).length }}
{{ getClientPendingDebtMovements(client).length === 1 ? 'deuda' : 'deudas' }}
              </span>
            </div>
          </div>

          <div class="debt-card__amount">
            <strong>{{ formatMoney(client.activeDebt) }}</strong>
            <span>Deuda más antigua: {{ getOldestDebtDate(client) }}</span>
          </div>
        </div>

        <div class="debt-card__footer">
          <div class="debt-card__buttons">
            <Button
                label="Registrar pago"
                class="debt-card__pay"
                @click="goToPayment"
            />

            <Button
                label="Ver historial"
                severity="secondary"
                outlined
                class="debt-card__history"
                @click="goToHistory"
            />
          </div>

          <button type="button" class="debt-card__detail" @click="showDetail(client)">
            Ver detalle
          </button>
        </div>
      </article>
    </div>

    <div v-else class="pending-debts__empty">
      <i class="pi pi-check-circle"></i>
      <h3>No hay deudas pendientes</h3>
      <p>Cuando registres una deuda, aparecerá en esta sección.</p>
    </div>

    <Dialog
        v-model:visible="detailVisible"
        modal
        header="Detalle de deuda"
        :style="{ width: '520px' }"
    >
      <div v-if="selectedClient" class="detail">
        <div class="detail__top">
          <div class="detail__avatar">
            {{ getInitials(selectedClient.name) }}
          </div>

          <div>
            <h3>{{ selectedClient.name }}</h3>
            <p>{{ getClientPendingDebtMovements(selectedClient).length }} deuda(s) pendiente(s)</p>
          </div>

          <strong>{{ formatMoney(selectedClient.activeDebt) }}</strong>
        </div>

        <div class="detail__section">
          <h4>Movimientos recientes</h4>

          <div
              v-for="movement in getClientPendingDebtMovements(selectedClient).slice().reverse().slice(0, 5)"
              :key="`${movement.id}-${movement.date}-${movement.time}-${movement.amount}`"
              class="detail__movement"
          >
            <div>
              <strong>{{ movement.type }}</strong>
              <span>{{ movement.date }} · {{ movement.time }}</span>
            </div>

            <div class="detail__movement-amount">
              {{ formatMoney(movement.amount) }}
            </div>
          </div>

          <p v-if="getClientPendingDebtMovements(selectedClient).length === 0" class="detail__empty">
            No hay deudas pendientes registradas.
          </p>
        </div>

        <div class="detail__actions">
          <Button label="Registrar pago" class="debt-card__pay" @click="goToPayment" />
          <Button label="Ver historial" severity="secondary" outlined @click="goToHistory" />
        </div>
      </div>
    </Dialog>
  </section>
</template>

<style scoped>
.pending-debts {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.pending-debts__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.pending-debts__header h2 {
  margin: 0;
  color: var(--regula-navy);
  font-size: 1.25rem;
  font-weight: 800;
}

.pending-debts__header p {
  margin: 0.35rem 0 0;
  color: var(--regula-text-muted);
  font-size: 0.95rem;
}

.pending-debts__actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.pending-debts__alert {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  min-height: 48px;
  padding: 0 1rem;
  border: 1px solid #ef4444;
  border-radius: 8px;
  background: #fff1f2;
  color: #b91c1c;
  font-weight: 600;
  white-space: nowrap;
}

.pending-debts__alert i {
  color: #ef4444;
}

.pending-debts__select {
  min-height: 48px;
  min-width: 190px;
  padding: 0 1rem;
  border: 1px solid var(--regula-gray-light);
  border-radius: 8px;
  background: white;
  color: var(--regula-navy);
  font-weight: 600;
  outline: none;
}

.pending-debts__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.5rem;
}

.debt-card {
  position: relative;
  overflow: hidden;
  background: white;
  border: 1px solid var(--regula-gray-light);
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(23, 45, 64, 0.06);
}

.debt-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 4px;
  height: 100%;
  background: var(--debt-color);
}

.debt-card__body {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.55rem 1.6rem;
}

.debt-card__client {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.debt-card__avatar,
.detail__avatar {
  width: 48px;
  height: 48px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--debt-color) 18%, white);
  color: var(--debt-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
}

.debt-card__client h3 {
  margin: 0;
  color: var(--regula-navy);
  font-size: 1rem;
  font-weight: 800;
}

.debt-card__client span {
  display: inline-block;
  margin-top: 0.3rem;
  padding: 0.18rem 0.45rem;
  border-radius: 5px;
  background: #f3f4f6;
  color: #4b5563;
  font-size: 0.78rem;
  font-weight: 700;
}

.debt-card__amount {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
}

.debt-card__amount strong {
  color: var(--debt-color);
  font-size: 1.6rem;
  font-weight: 900;
}

.debt-card__amount span {
  margin-top: 0.35rem;
  color: var(--regula-text-muted);
  font-size: 0.8rem;
  font-weight: 600;
}

.debt-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.6rem;
  border-top: 1px solid var(--regula-gray-light);
}

.debt-card__buttons {
  display: flex;
  align-items: center;
  gap: 0.55rem;
}

.debt-card__pay {
  background: var(--regula-orange) !important;
  border-color: var(--regula-orange) !important;
  color: white !important;
  font-weight: 800;
}

.debt-card__history {
  color: var(--regula-navy) !important;
  font-weight: 800;
}

.debt-card__detail {
  border: none;
  background: transparent;
  color: var(--regula-orange);
  font-weight: 800;
  cursor: pointer;
}

.pending-debts__empty {
  padding: 3rem 1rem;
  border: 1px dashed var(--regula-gray-light);
  border-radius: 12px;
  background: white;
  text-align: center;
  color: var(--regula-text-muted);
}

.pending-debts__empty i {
  color: #22c55e;
  font-size: 2rem;
}

.pending-debts__empty h3 {
  margin: 0.8rem 0 0.25rem;
  color: var(--regula-navy);
}

.detail {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.detail__top {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--regula-gray-light);
}

.detail__top h3 {
  margin: 0;
  color: var(--regula-navy);
}

.detail__top p {
  margin: 0.25rem 0 0;
  color: var(--regula-text-muted);
}

.detail__top strong {
  margin-left: auto;
  color: #dc2626;
  font-size: 1.4rem;
}

.detail__section h4 {
  margin: 0 0 0.75rem;
  color: var(--regula-navy);
}

.detail__movement {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem;
  border: 1px solid var(--regula-gray-light);
  border-radius: 10px;
  margin-bottom: 0.55rem;
}

.detail__movement strong {
  display: block;
  color: var(--regula-navy);
}

.detail__movement span {
  color: var(--regula-text-muted);
  font-size: 0.85rem;
}

.detail__movement-amount {
  font-weight: 900;
  color: var(--regula-orange);
}

.detail__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.7rem;
}

.detail__empty {
  color: var(--regula-text-muted);
}

@media (max-width: 1100px) {
  .pending-debts__header {
    flex-direction: column;
  }

  .pending-debts__actions {
    width: 100%;
    align-items: stretch;
    flex-direction: column;
  }

  .pending-debts__alert {
    white-space: normal;
  }

  .pending-debts__select {
    width: 100%;
  }

  .pending-debts__grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .debt-card__body,
  .debt-card__footer {
    flex-direction: column;
    align-items: flex-start;
  }

  .debt-card__amount {
    align-items: flex-start;
  }

  .debt-card__buttons {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }

  .debt-card__buttons :deep(.p-button) {
    width: 100%;
  }
}
</style>