<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useCommercialStore } from '@/commercional-management/application/commercial.store.js'
import Button from 'primevue/button'
import Textarea from 'primevue/textarea'

const store = useCommercialStore()
const toast = useToast()
const selectedClientName = ref('')
const loading = ref(false)
const clientDropdownOpen = ref(false)



const form = reactive({
  clientId: null,
  cylinderTypeId: '10kg',
  quantity: 1,
  amount: 50,
  note: '',
})

const clients = computed(() => {
  const grouped = new Map()

  store.clients.forEach((client) => {
    const clientName = String(client.name || '').trim()

    if (!clientName) return

    const normalizedName = clientName.toLowerCase()

    if (!grouped.has(normalizedName)) {
      const clientDebtMovements = store.debtMovements.filter((movement) => {
        return String(movement.client || '').trim().toLowerCase() === normalizedName &&
            movement.type === 'Deuda' &&
            movement.status !== 'Pagada' &&
            movement.status !== 'Anulada'
      })

      const activeDebt = clientDebtMovements.reduce((total, movement) => {
        return total + Number(movement.amount || 0)
      }, 0)

      grouped.set(normalizedName, {
        id: client.id,
        name: clientName,
        activeDebt,
        debtCount: clientDebtMovements.length,
      })
    }
  })

  return Array.from(grouped.values()).sort((a, b) => {
    return a.name.localeCompare(b.name)
  })
})

const cylinderTypes = computed(() => store.availableCylinderTypes)

const selectedClient = computed(() => {
  return clients.value.find((client) => client.id === form.clientId) || null
})

const selectedCylinder = computed(() => {
  return cylinderTypes.value.find((cylinder) => cylinder.id === form.cylinderTypeId) || null
})

const calculatedAmount = computed(() => {
  if (!selectedCylinder.value) return 0
  return Number(selectedCylinder.value.price) * Number(form.quantity || 0)
})

const newTotalDebt = computed(() => {
  return Number(selectedClient.value?.activeDebt || 0) + Number(form.amount || 0)
})

const isFormValid = computed(() => {
  return Boolean(
      form.clientId &&
      form.cylinderTypeId &&
      Number(form.quantity) > 0 &&
      Number(form.amount) > 0
  )
})

watch(
    () => calculatedAmount.value,
    (value) => {
      form.amount = value
    },
    { immediate: true }
)

watch(
    () => clients.value,
    (value) => {
      if (!form.clientId && value.length > 0) {
        form.clientId = value[0].id
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

function toggleClientDropdown() {
  clientDropdownOpen.value = !clientDropdownOpen.value
}

function selectClient(client) {
  form.clientId = client.id
  selectedClientName.value = client.name
  clientDropdownOpen.value = false
}
function selectCylinder(cylinder) {
  form.cylinderTypeId = cylinder.id
}

function increaseQuantity() {
  form.quantity += 1
}

function decreaseQuantity() {
  if (form.quantity > 1) {
    form.quantity -= 1
  }
}

function resetForm() {
  form.clientId = clients.value[0]?.id || null
  form.cylinderTypeId = '10kg'
  form.quantity = 1
  form.amount = calculatedAmount.value
  form.note = ''
  clientDropdownOpen.value = false
}

function submitDebt() {
  if (!isFormValid.value) return

  loading.value = true

  store.registerDebt({
    clientId: form.clientId,
    cylinderTypeId: form.cylinderTypeId,
    quantity: form.quantity,
    amount: form.amount,
    note: form.note,
  })
      .then(() => {
        toast.add({
          severity: 'success',
          summary: 'Deuda registrada exitosamente',
          detail: `${selectedClient.value?.name || 'Cliente'} · ${form.quantity} balón(es) · ${formatMoney(form.amount)}`,
          life: 3500,
        })

        resetForm()
      })
      .catch((error) => {
        toast.add({
          severity: 'error',
          summary: 'No se pudo registrar la deuda',
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
  <section class="register-debt">
    <div class="register-debt__card">
      <header class="register-debt__header">
        <div class="register-debt__header-content">
          <div class="register-debt__header-icon">
            <i class="pi pi-file-edit"></i>
          </div>

          <div>
            <h2>Registrar nueva deuda</h2>
            <p>Registra una nueva deuda del cliente.</p>
          </div>
        </div>
      </header>

      <form class="register-debt__form" @submit.prevent="submitDebt">
        <div class="field field--client">
          <label>Cliente <span>*</span></label>

          <button type="button" class="selected-client" @click="toggleClientDropdown">
            <i class="pi pi-user"></i>
            <strong>{{ selectedClient?.name || 'Seleccionar cliente' }}</strong>
            <i
                class="pi selected-client__chevron"
                :class="clientDropdownOpen ? 'pi-chevron-up' : 'pi-chevron-down'"
            ></i>
          </button>

          <div v-if="clientDropdownOpen" class="client-list">
            <button
                v-for="client in clients"
                :key="client.id"
                class="client-option"
                @click="selectClient(client)"
            >
              <span class="client-option__avatar">
                {{ getInitials(client.name) }}
              </span>

              <span class="client-option__info">
                <strong>{{ client.name }}</strong>
                <small>
                  {{
                    client.activeDebt > 0
                        ? `Deuda activa: ${formatMoney(client.activeDebt)}`
                        : 'Sin deuda activa'
                  }}
                </small>
              </span>

              <i v-if="form.clientId === client.id" class="pi pi-check"></i>
            </button>
          </div>
        </div>

        <div class="field">
          <label>Tipo de balón <span>*</span></label>

          <div class="cylinder-grid">
            <button
                v-for="cylinder in cylinderTypes"
                :key="cylinder.id"
                type="button"
                class="cylinder-card"
                :class="{ 'cylinder-card--active': form.cylinderTypeId === cylinder.id }"
                @click="selectCylinder(cylinder)"
            >
              <span v-if="form.cylinderTypeId === cylinder.id" class="cylinder-card__check">
                <i class="pi pi-check"></i>
              </span>

              <div
                  class="cylinder-card__image">
                <img src="/cylinder-flame.svg" alt="Balón de gas" />
              </div>

              <strong>{{ cylinder.label }}</strong>
              <small>{{ cylinder.description || 'Balón de gas' }}</small>
              <em>{{ formatMoney(cylinder.price) }}</em>
            </button>
          </div>
        </div>

        <div class="form-row">
          <div class="field">
            <label>Cantidad <span>*</span></label>

            <div class="quantity-control">
              <button type="button" @click="decreaseQuantity">−</button>
              <strong>{{ form.quantity }}</strong>
              <button type="button" @click="increaseQuantity">+</button>
            </div>

            <small class="help-text">Número de unidades que quedan como deuda.</small>
          </div>

          <div class="field">
            <label>Monto adeudado <span>*</span></label>

            <div class="money-input">
              <span>S/.</span>
              <input v-model.number="form.amount" type="number" min="1" />
            </div>

            <small class="help-text">
              Calculado automáticamente: <strong>{{ formatMoney(calculatedAmount) }}</strong>
              <span> (puede editar)</span>
            </small>
          </div>
        </div>

        <div class="field">
          <label>Nota <small>(opcional)</small></label>

          <Textarea
              v-model="form.note"
              rows="4"
              maxlength="500"
              placeholder="Añadir observaciones sobre esta deuda..."
              class="note-input"
          />

          <small class="counter">{{ form.note.length }}/500</small>
        </div>

        <div v-if="selectedClient?.activeDebt > 0" class="debt-warning">
          <div class="debt-warning__icon">
            <i class="pi pi-exclamation-triangle"></i>
          </div>

          <div>
            <h3>Este cliente ya tiene deuda</h3>
            <p>
              Cliente: <strong>{{ selectedClient.name }}</strong>
              · Deuda actual: <strong>{{ formatMoney(selectedClient.activeDebt) }}</strong>
              · Nuevo total tras guardar:
              <strong>{{ formatMoney(newTotalDebt) }}</strong>
            </p>
          </div>
        </div>

        <footer class="register-debt__footer">
          <p class="register-debt__note">
            <i class="pi pi-lock"></i>
            Cada deuda queda registrada en el historial con fecha y hora.
          </p>

          <div class="register-debt__buttons">
            <Button
                label="Limpiar"
                icon="pi pi-times"
                severity="secondary"
                outlined
                type="button"
                class="register-debt__cancel"
                @click="resetForm"
            />

            <Button
                label="Guardar Deuda"
                icon="pi pi-save"
                type="submit"
                class="register-debt__submit"
                :disabled="!isFormValid"
                :loading="loading"
            />
          </div>
        </footer>
      </form>
    </div>
  </section>
</template>

<style scoped>
.register-debt {
  width: 100%;
}

.register-debt__card {
  overflow: visible;
  border: 1px solid var(--regula-gray-light);
  border-radius: 14px;
  background: white;
  box-shadow: 0 6px 18px rgba(23, 45, 64, 0.08);
}

.register-debt__header {
  padding: 1.8rem 2rem;
  background: var(--regula-orange);
  color: white;
  border-radius: 14px 14px 0 0;
}

.register-debt__header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.register-debt__header-icon {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  border: 2px solid rgba(255, 255, 255, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
}

.register-debt__header h2 {
  margin: 0;
  font-size: 1.45rem;
  font-weight: 900;
}

.register-debt__header p {
  margin: 0.35rem 0 0;
  color: rgba(255, 255, 255, 0.92);
  font-weight: 600;
}

.register-debt__form {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.45rem;
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

.field label small {
  color: var(--regula-text-muted);
  font-weight: 600;
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

.selected-client__chevron {
  margin-left: auto;
  color: var(--regula-text-muted);
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

.client-option__avatar {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  background: #ffe2e2;
  color: #dc2626;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
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

.cylinder-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.cylinder-card {
  position: relative;
  min-height: 112px;
  border: 1px solid #d8e0ea;
  border-radius: 12px;
  background: white;
  color: var(--regula-navy);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.22rem;
  cursor: pointer;
  transition: 0.18s ease;
  padding: 1rem 0.75rem 0.85rem;
}

.cylinder-card__image {
  width: 42px;
  height: 42px;
  border-radius: 999px;
  background: #ffeadf;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cylinder-card__image img {
  width: 22px;
  height: 22px;
  object-fit: contain;
}

.cylinder-card--active .cylinder-card__image {
  background: #ffe5d6;
}
.cylinder-card strong {
  font-weight: 900;
}

.cylinder-card small {
  color: var(--regula-text-muted);
  font-weight: 600;
}

.cylinder-card em {
  color: var(--regula-orange);
  font-style: normal;
  font-weight: 800;
}

.cylinder-card--active {
  border: 2px solid var(--regula-orange);
  background: #fff7ed;
}

.cylinder-card--active .cylinder-card__image {
  background: #ffe5d6;
}

.cylinder-card--active strong {
  color: var(--regula-orange);
}

.cylinder-card__check {
  position: absolute;
  right: -9px;
  top: -9px;
  width: 24px;
  height: 24px;
  border-radius: 999px;
  background: var(--regula-orange);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;
}

.quantity-control {
  height: 52px;
  border: 1px solid #d8e0ea;
  border-radius: 10px;
  display: grid;
  grid-template-columns: 56px 1fr 56px;
  overflow: hidden;
}

.quantity-control button {
  border: none;
  background: #f8fafc;
  color: var(--regula-navy);
  font-size: 1.3rem;
  cursor: pointer;
}

.quantity-control strong {
  display: flex;
  align-items: center;
  justify-content: center;
  border-inline: 1px solid #d8e0ea;
  color: var(--regula-navy);
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
}

.help-text {
  color: var(--regula-text-muted);
  font-size: 0.84rem;
}

.help-text strong {
  color: var(--regula-orange);
}

.note-input {
  width: 100%;
  resize: none;
}

.counter {
  align-self: flex-end;
  color: var(--regula-text-muted);
}

.debt-warning {
  border: 1px solid #fbbf24;
  border-radius: 12px;
  padding: 1rem;
  background: #fffbeb;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.debt-warning__icon {
  width: 42px;
  height: 42px;
  border-radius: 999px;
  background: #fef3c7;
  color: #f59e0b;
  display: flex;
  align-items: center;
  justify-content: center;
}

.debt-warning h3 {
  margin: 0;
  color: #92400e;
  font-size: 1rem;
}

.debt-warning p {
  margin: 0.35rem 0 0;
  color: #92400e;
  font-size: 0.9rem;
}

.register-debt__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding-top: 0.5rem;
}

.register-debt__note {
  margin: 0;
  color: var(--regula-text-muted);
  font-size: 0.88rem;
}

.register-debt__buttons {
  display: flex;
  gap: 0.8rem;
}

.register-debt__cancel {
  min-width: 130px;
  font-weight: 800;
}

.register-debt__submit {
  min-width: 190px;
  background: var(--regula-orange) !important;
  border-color: var(--regula-orange) !important;
  font-weight: 900;
}

@media (max-width: 1100px) {
  .cylinder-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .register-debt__footer {
    flex-direction: column;
    align-items: stretch;
  }

  .register-debt__buttons {
    justify-content: flex-end;
  }
}

@media (max-width: 640px) {
  .register-debt__form,
  .register-debt__header {
    padding: 1.2rem;
  }

  .cylinder-grid {
    grid-template-columns: 1fr;
  }

  .register-debt__buttons {
    flex-direction: column;
  }

  .register-debt__cancel,
  .register-debt__submit {
    width: 100%;
  }
}
</style>