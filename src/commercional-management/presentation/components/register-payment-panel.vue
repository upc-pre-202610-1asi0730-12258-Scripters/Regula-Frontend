<script setup>
import { useCommercialStore } from '@/commercional-management/application/commercial.store.js'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import InputNumber from 'primevue/inputnumber'
import { computed, reactive } from 'vue'

const store = useCommercialStore()

const form = reactive({
  clientId: 1,
  amount: 30,
})

const debtClients = computed(() => store.clientsWithDebt)
const selectedClient = computed(() => store.clients.find((client) => client.id === form.clientId))
const newBalance = computed(() => Math.max((selectedClient.value?.activeDebt || 0) - form.amount, 0))

function savePayment() {
  store.registerPayment({
    clientId: form.clientId,
    amount: form.amount,
  })
}
</script>

<template>
  <section class="payment">
    <div class="payment__card">
      <header class="payment__header">
        <div class="payment__icon">
          <i class="pi pi-wallet"></i>
        </div>
        <div>
          <h2>Registrar pago de cliente</h2>
          <p>Aplica el pago a la deuda del cliente</p>
        </div>
      </header>

      <label>Cliente *</label>
      <Dropdown
          v-model="form.clientId"
          :options="debtClients"
          option-label="name"
          option-value="id"
          class="payment__input"
      />

      <article v-if="selectedClient" class="payment__client">
        <div class="payment__avatar">{{ selectedClient.initials }}</div>
        <div>
          <h3>{{ selectedClient.name }}</h3>
          <p>Cliente activo · {{ selectedClient.debtCount }} fiado(s) pendientes</p>
        </div>
        <strong>S/. {{ selectedClient.activeDebt }}</strong>
      </article>

      <label>Monto pagado *</label>
      <InputNumber v-model="form.amount" prefix="S/. " class="payment__input" />

      <div class="payment__result">
        <div>
          <strong>Nuevo saldo tras pago</strong>
          <p>S/. {{ selectedClient?.activeDebt || 0 }} deuda - S/. {{ form.amount }} pago</p>
        </div>
        <strong>S/. {{ newBalance }}</strong>
      </div>

      <div class="payment__actions">
        <Button label="Cancelar" outlined severity="secondary" />
        <Button label="Registrar Pago" icon="pi pi-check-circle" class="payment__button" @click="savePayment" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.payment {
  display: flex;
  justify-content: center;
}

.payment__card {
  width: min(100%, 500px);
  background: white;
  border: 1px solid var(--regula-gray-light);
  border-radius: var(--regula-radius-card);
  padding: 1.75rem;
  box-shadow: 0 8px 24px rgba(23, 45, 64, 0.08);
}

.payment__header {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.payment__icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: #fff7ed;
  color: var(--regula-orange);
  display: grid;
  place-items: center;
}

.payment h2,
.payment h3 {
  margin: 0;
  color: var(--regula-navy);
}

.payment p {
  margin: 0.25rem 0 0;
  color: var(--regula-text-muted);
}

.payment label {
  display: block;
  margin: 1rem 0 0.45rem;
  font-weight: 700;
  color: var(--regula-navy);
}

.payment__input {
  width: 100%;
}

.payment__client {
  margin-top: 1rem;
  background: #f8fafc;
  border: 1px solid var(--regula-gray-light);
  border-radius: 12px;
  padding: 1rem;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1rem;
}

.payment__avatar {
  width: 42px;
  height: 42px;
  border-radius: 999px;
  background: #fee2e2;
  color: #dc2626;
  display: grid;
  place-items: center;
  font-weight: 800;
}

.payment__client > strong {
  font-size: 1.5rem;
  color: #dc2626;
}

.payment__result {
  margin-top: 1rem;
  background: #ecfdf5;
  border: 1px solid #86efac;
  color: #15803d;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.payment__result > strong {
  font-size: 1.6rem;
}

.payment__actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.85rem;
  margin-top: 1.25rem;
}

.payment__button {
  background: var(--regula-orange);
  border-color: var(--regula-orange);
}
</style>