<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useCommercialStore } from '@/commercional-management/application/commercial.store.js'
import Button from 'primevue/button'

const store = useCommercialStore()
const toast = useToast()

const loading = ref(false)
const clientDropdownOpen = ref(false)

const form = reactive({
  clientId: null,
  debtMovementId: null,
})

const pendingDebtMovements = computed(() => {
  return store.debtMovements.filter((movement) => {
    return movement.type === 'Deuda' &&
        movement.status !== 'Pagada' &&
        movement.status !== 'Anulada'
  })
})

const clientsWithDebt = computed(() => {
  const groupedClients = new Map()

  pendingDebtMovements.value.forEach((movement) => {
    const clientName = movement.client
    const existingClient = store.clients.find((client) => {
      return client.name.trim().toLowerCase() === clientName.trim().toLowerCase()
    })

    const clientId = existingClient?.id || clientName

    if (!groupedClients.has(clientName)) {
      groupedClients.set(clientName, {
        id: clientId,
        name: clientName,
        activeDebt: 0,
        debtCount: 0,
      })
    }

    const clientGroup = groupedClients.get(clientName)

    clientGroup.activeDebt += Number(movement.amount || 0)
    clientGroup.debtCount += 1
  })

  return Array.from(groupedClients.values())
})

const selectedClient = computed(() => {
  return clientsWithDebt.value.find((client) => client.id === form.clientId) || null
})

const clientDebtMovements = computed(() => {
  if (!selectedClient.value) return []

  return pendingDebtMovements.value
      .filter((movement) => {
        return movement.client.trim().toLowerCase() === selectedClient.value.name.trim().toLowerCase()
      })
      .slice()
      .sort((a, b) => parseMovementDate(a.date, a.time) - parseMovementDate(b.date, b.time))
})

const selectedDebtMovement = computed(() => {
  return clientDebtMovements.value.find((movement) => movement.id === form.debtMovementId) || null
})

const selectedDebtAmount = computed(() => {
  return Number(selectedDebtMovement.value?.amount || 0)
})

const totalDebtAmount = computed(() => {
  return clientDebtMovements.value.reduce((total, movement) => {
    return total + Number(movement.amount || 0)
  }, 0)
})

const remainingBalance = computed(() => {
  return Math.max(totalDebtAmount.value - selectedDebtAmount.value, 0)
})

const isFormValid = computed(() => {
  return Boolean(
      form.clientId &&
      form.debtMovementId &&
      selectedDebtAmount.value > 0
  )
})

watch(
    () => clientsWithDebt.value,
    (clients) => {
      if (!form.clientId && clients.length > 0) {
        form.clientId = clients[0].id
      }

      const stillExists = clients.some((client) => client.id === form.clientId)

      if (!stillExists) {
        form.clientId = clients[0]?.id || null
        form.debtMovementId = null
      }
    },
    { immediate: true }
)

function formatMoney(value) {
  return `S/. ${Number(value || 0).toFixed(0)}`
}

function getInitials(name) {
  return String(name || '')
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase()
}

function parseMovementDate(date, time) {
  const [day, month, year] = String(date).split('/').map(Number)
  const [hour = 0, minute = 0] = String(time || '00:00').split(':').map(Number)

  return new Date(year, month - 1, day, hour, minute)
}

function toggleClientDropdown() {
  clientDropdownOpen.value = !clientDropdownOpen.value
}

function selectClient(client) {
  form.clientId = client.id
  form.debtMovementId = null
  clientDropdownOpen.value = false
}

function selectDebtMovement(movement) {
  form.debtMovementId = movement.id
}
function resetForm() {
  form.debtMovementId = null
  clientDropdownOpen.value = false
}

watch(
    () => clientDebtMovements.value,
    (movements) => {
      const stillExists = movements.some((movement) => movement.id === form.debtMovementId)

      if (!stillExists) {
        form.debtMovementId = movements[0]?.id || null
      }
    },
    { immediate: true }
)

function submitPayment() {
  if (!isFormValid.value || !selectedClient.value) return

  const clientName = selectedClient.value.name
  const paidAmount = selectedDebtAmount.value
  const balanceAfterPayment = remainingBalance.value

  loading.value = true

  store.registerPayment({
    clientId: form.clientId,
    debtMovementId: form.debtMovementId,
  })
      .then(() => {
        toast.add({
          severity: 'success',
          summary: 'Pago registrado exitosamente',
          detail: `${clientName} · ${formatMoney(paidAmount)} abonados · Saldo restante: ${formatMoney(balanceAfterPayment)}`,
          life: 3500,
        })

        resetForm()
      })
      .catch((error) => {
        toast.add({
          severity: 'error',
          summary: 'No se pudo registrar el pago',
          detail: error.message || 'Revisa los datos ingresados.',
          life: 3500,
        })
      })
      .finally(() => {
        loading.value = false
      })
}
</script>

<template>
  <section class="register-payment">
    <div class="register-payment__card">
      <header class="register-payment__header">
        <div class="register-payment__header-icon">
          <i class="pi pi-money-bill"></i>
        </div>

        <div>
          <h2>Registrar pago de cliente</h2>
          <p>Aplica el pago a la deuda del cliente</p>
        </div>
      </header>

      <form class="register-payment__form" @submit.prevent="submitPayment">
        <div class="field field--client">
          <label>Cliente <span>*</span></label>

          <button
              type="button"
              class="selected-client"
              @click="toggleClientDropdown"
              :disabled="clientsWithDebt.length === 0"
          >
            <i class="pi pi-user"></i>
            <strong>{{ selectedClient?.name || 'Seleccionar cliente' }}</strong>
            <i
                class="pi selected-client__chevron"
                :class="clientDropdownOpen ? 'pi-chevron-up' : 'pi-chevron-down'"
            ></i>
          </button>

          <small class="help-text">
            <i class="pi pi-info-circle"></i>
            Solo se muestran clientes con deuda activa
          </small>

          <div v-if="clientDropdownOpen" class="client-list">
            <button
                v-for="client in clientsWithDebt"
                :key="client.id"
                type="button"
                class="client-option"
                :class="{ 'client-option--active': form.clientId === client.id }"
                @click="selectClient(client)"
            >
              <span class="client-option__avatar">
                {{ getInitials(client.name) }}
              </span>

              <span class="client-option__info">
                <strong>{{ client.name }}</strong>
                <small>Deuda activa: {{ formatMoney(client.activeDebt) }}</small>
              </span>

              <i v-if="form.clientId === client.id" class="pi pi-check"></i>
            </button>
          </div>
        </div>

        <div v-if="selectedClient" class="client-debt-card">
          <div class="client-debt-card__left">
            <div class="client-debt-card__client">
              <span class="client-debt-card__avatar">
                {{ getInitials(selectedClient.name) }}
              </span>

              <div>
                <h3>{{ selectedClient.name }}</h3>
                <p>
                  Cliente activo ·
                  {{ clientDebtMovements.length }}
                  {{ clientDebtMovements.length === 1 ? 'deuda pendiente' : 'deudas pendientes' }}
                </p>
              </div>
            </div>

            <div class="client-debt-card__list">
              <h4>Deudas activas</h4>

              <button
                  v-for="movement in clientDebtMovements"
                  :key="`${movement.id}-${movement.date}-${movement.time}-${movement.amount}`"
                  type="button"
                  class="debt-item"
                  :class="{ 'debt-item--selected': form.debtMovementId === movement.id }"
                  @click="selectDebtMovement(movement)"
              >
                <div class="debt-item__icon">
                  <i class="pi pi-fire"></i>
                </div>

                <div>
                  <strong>{{ movement.date }}</strong>
                  <span>{{ movement.description }}</span>
                </div>

                <div class="debt-item__amount">
                  <strong>{{ formatMoney(movement.amount) }}</strong>
                  <span>{{ form.debtMovementId === movement.id ? 'Seleccionada' : 'Pendiente' }}</span>
                </div>
              </button>

              <p v-if="clientDebtMovements.length === 0" class="client-debt-card__empty">
                No hay movimientos de deuda registrados.
              </p>
            </div>
          </div>

          <div class="client-debt-card__right">
            <span>Deuda total</span>
            <strong>{{ formatMoney(totalDebtAmount) }}</strong>
          </div>
        </div>

        <div v-else class="empty-state">
          <i class="pi pi-check-circle"></i>
          <h3>No hay clientes con deuda activa</h3>
          <p>Cuando registres una deuda, aparecerá aquí para poder registrar pagos.</p>
        </div>

        <div v-if="selectedClient" class="payment-row">
          <div class="selected-payment-card">
            <div>
              <h3>Deuda seleccionada para pagar</h3>
              <p v-if="selectedDebtMovement">
                {{ selectedDebtMovement.description }} · {{ selectedDebtMovement.date }}
              </p>
              <p v-else>
                Selecciona una deuda activa de la lista.
              </p>
            </div>

            <strong>{{ formatMoney(selectedDebtAmount) }}</strong>
          </div>

          <div class="new-balance-card">
            <div class="new-balance-card__icon">
              <i class="pi pi-calculator"></i>
            </div>

            <div>
              <h3>Nuevo saldo tras pago completo</h3>
              <p>
                {{ formatMoney(totalDebtAmount) }} deuda −
                {{ formatMoney(selectedDebtAmount) }} pago
              </p>
            </div>

            <div class="new-balance-card__amount">
              <strong>{{ formatMoney(remainingBalance) }}</strong>
              <span>Saldo restante</span>
            </div>
          </div>
        </div>

        <footer class="register-payment__footer">
          <Button
              label="Cancelar"
              icon="pi pi-times"
              severity="secondary"
              outlined
              type="button"
              class="register-payment__cancel"
              @click="resetForm"
          />

          <Button
              label="Registrar Pago"
              icon="pi pi-check-circle"
              type="submit"
              class="register-payment__submit"
              :disabled="!isFormValid"
              :loading="loading"
          />
        </footer>
      </form>
    </div>
  </section>
</template>

<style scoped>
.register-payment {
  width: 100%;
}

.register-payment__card {
  overflow: visible;
  border: 1px solid var(--regula-gray-light);
  border-radius: 14px;
  background: white;
  box-shadow: 0 6px 18px rgba(23, 45, 64, 0.08);
}

.register-payment__header {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1.9rem 2rem;
  border-radius: 14px 14px 0 0;
  background: var(--regula-orange);
  color: white;
}

.register-payment__header-icon {
  width: 54px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}

.register-payment__header h2 {
  margin: 0;
  font-size: 1.45rem;
  font-weight: 900;
}

.register-payment__header p {
  margin: 0.3rem 0 0;
  color: rgba(255, 255, 255, 0.92);
  font-weight: 600;
}

.register-payment__form {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.field label {
  color: var(--regula-navy);
  font-weight: 900;
}

.field label span {
  color: var(--regula-orange);
}

.field--client {
  position: relative;
  z-index: 30;
}

.selected-client {
  width: 100%;
  min-height: 52px;
  padding: 0 1rem;
  border: 1px solid #d8e0ea;
  border-radius: 10px;
  background: white;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: var(--regula-navy);
  cursor: pointer;
  text-align: left;
}

.selected-client:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.selected-client__chevron {
  margin-left: auto;
  color: var(--regula-text-muted);
}

.help-text {
  color: var(--regula-text-muted);
  font-size: 0.88rem;
}

.help-text i {
  color: var(--regula-orange);
  margin-right: 0.25rem;
}

.client-list {
  position: absolute;
  top: calc(100% + 0.45rem);
  left: 0;
  z-index: 50;
  width: 100%;
  max-height: 320px;
  overflow-y: auto;
  border: 1px solid #d8e0ea;
  border-radius: 10px;
  background: white;
  box-shadow: 0 12px 28px rgba(23, 45, 64, 0.16);
}

.client-option {
  width: 100%;
  border: none;
  background: white;
  padding: 0.9rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.85rem;
  cursor: pointer;
  text-align: left;
}

.client-option--active {
  background: #fff7ed;
  box-shadow: inset 4px 0 0 var(--regula-orange);
}

.client-option__avatar,
.client-debt-card__avatar {
  width: 42px;
  height: 42px;
  border-radius: 999px;
  background: #ffe2e2;
  color: #dc2626;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  flex: none;
}

.client-option__info {
  display: flex;
  flex-direction: column;
}

.client-option__info strong {
  color: var(--regula-navy);
}

.client-option__info small {
  margin-top: 0.15rem;
  color: var(--regula-text-muted);
  font-weight: 700;
}

.client-option .pi-check {
  margin-left: auto;
  color: var(--regula-orange);
}

.client-debt-card {
  display: grid;
  grid-template-columns: 1fr 280px;
  border: 1px solid #d8e0ea;
  border-radius: 12px;
  overflow: hidden;
  background: #fbfcfe;
}

.client-debt-card__left {
  padding: 1.4rem;
}

.client-debt-card__client {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.2rem;
}

.client-debt-card__client h3 {
  margin: 0;
  color: var(--regula-navy);
  font-size: 1.1rem;
  font-weight: 900;
}

.client-debt-card__client p {
  margin: 0.25rem 0 0;
  color: var(--regula-text-muted);
  font-weight: 600;
}

.client-debt-card__list h4 {
  margin: 0 0 0.75rem;
  color: #64748b;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.debt-item {
  display: grid;
  grid-template-columns: 42px 1fr auto;
  align-items: center;
  gap: 0.75rem;
  padding: 0.8rem;
  margin-bottom: 0.6rem;
  border: 1px solid #d8e0ea;
  border-radius: 10px;
  background: white;
}

.debt-item__icon {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  background: #fff7ed;
  color: var(--regula-orange);
  display: flex;
  align-items: center;
  justify-content: center;
}

.debt-item strong {
  display: block;
  color: var(--regula-navy);
}

.debt-item span {
  display: block;
  margin-top: 0.15rem;
  color: var(--regula-text-muted);
  font-size: 0.85rem;
}

.debt-item__amount {
  text-align: right;
}

.debt-item__amount strong {
  color: #dc2626;
}

.debt-item__amount span {
  color: var(--regula-orange);
  font-weight: 700;
}

.client-debt-card__right {
  border-left: 1px solid #d8e0ea;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.client-debt-card__right span {
  color: #64748b;
  font-weight: 800;
}

.client-debt-card__right strong {
  margin-top: 0.8rem;
  color: #dc2626;
  font-size: 2.8rem;
  font-weight: 900;
}

.client-debt-card__empty {
  color: var(--regula-text-muted);
}

.payment-row {
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: 2rem;
  align-items: end;
}

.money-input {
  height: 52px;
  border: 1.5px solid var(--regula-orange);
  border-radius: 10px;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.money-input span {
  padding-left: 1rem;
  color: var(--regula-navy);
  font-weight: 900;
}

.money-input input {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  padding: 0 1rem;
  color: var(--regula-navy);
  font-weight: 900;
  font-size: 1rem;
}

.new-balance-card {
  min-height: 98px;
  border: 1px solid #86efac;
  border-radius: 12px;
  background: #ecfdf5;
  padding: 1rem 1.2rem;
  display: grid;
  grid-template-columns: 48px 1fr auto;
  align-items: center;
  gap: 1rem;
}

.new-balance-card__icon {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  background: #dcfce7;
  color: #16a34a;
  display: flex;
  align-items: center;
  justify-content: center;
}

.new-balance-card h3 {
  margin: 0;
  color: #15803d;
  font-size: 1rem;
  font-weight: 900;
}

.new-balance-card p {
  margin: 0.3rem 0 0;
  color: #15803d;
}

.new-balance-card__amount {
  text-align: right;
}

.new-balance-card__amount strong {
  display: block;
  color: #15803d;
  font-size: 2.2rem;
  font-weight: 900;
}

.new-balance-card__amount span {
  color: #15803d;
  font-weight: 700;
}

.register-payment__footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
  padding-top: 1.2rem;
  border-top: 1px solid var(--regula-gray-light);
}

.register-payment__cancel {
  min-width: 150px;
  font-weight: 800;
}

.register-payment__submit {
  min-width: 220px;
  background: var(--regula-orange) !important;
  border-color: var(--regula-orange) !important;
  font-weight: 900;
}

.empty-state {
  padding: 2rem;
  border: 1px dashed #d8e0ea;
  border-radius: 12px;
  text-align: center;
  color: var(--regula-text-muted);
}

.empty-state i {
  color: #22c55e;
  font-size: 2rem;
}

.empty-state h3 {
  margin: 0.8rem 0 0.3rem;
  color: var(--regula-navy);
}

@media (max-width: 1100px) {
  .client-debt-card,
  .payment-row {
    grid-template-columns: 1fr;
  }

  .client-debt-card__right {
    border-left: none;
    border-top: 1px solid #d8e0ea;
    padding: 1.5rem;
  }

  .register-payment__footer {
    flex-direction: column;
  }

  .register-payment__cancel,
  .register-payment__submit {
    width: 100%;
  }
}

@media (max-width: 640px) {
  .register-payment__header,
  .register-payment__form {
    padding: 1.2rem;
  }

  .debt-item {
    grid-template-columns: 34px 1fr;
  }

  .debt-item__amount {
    grid-column: 2;
    text-align: left;
  }

  .new-balance-card {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .new-balance-card__icon {
    margin: 0 auto;
  }

  .new-balance-card__amount {
    text-align: center;
  }

  .debt-item {
    width: 100%;
    border: 1px solid #d8e0ea;
    background: white;
    text-align: left;
    cursor: pointer;
  }

  .debt-item--selected {
    border-color: var(--regula-orange);
    background: #fff7ed;
    box-shadow: inset 4px 0 0 var(--regula-orange);
  }

  .selected-payment-card {
    border: 1px solid #d8e0ea;
    border-radius: 12px;
    padding: 1rem 1.2rem;
    background: #fff7ed;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .selected-payment-card h3 {
    margin: 0;
    color: var(--regula-navy);
    font-size: 1rem;
    font-weight: 900;
  }

  .selected-payment-card p {
    margin: 0.25rem 0 0;
    color: var(--regula-text-muted);
    font-weight: 700;
  }

  .selected-payment-card strong {
    color: #dc2626;
    font-size: 1.4rem;
    font-weight: 900;
  }
}
</style>