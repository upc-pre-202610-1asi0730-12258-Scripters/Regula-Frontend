<script setup>
import { useCommercialStore } from '@/commercional-management/application/commercial.store.js'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import { computed, reactive } from 'vue'

const store = useCommercialStore()

const form = reactive({
  clientId: 1,
  cylinderTypeId: '10kg',
  quantity: 2,
  amount: 50,
  note: '',
})

const selectedClient = computed(() => store.clients.find((client) => client.id === form.clientId))

function saveDebt() {
  store.registerDebt({
    clientId: form.clientId,
    cylinderTypeId: form.cylinderTypeId,
    quantity: form.quantity,
    amount: form.amount,
    note: form.note,
  })
}
</script>

<template>
  <section class="debt-form">
    <div class="debt-form__card">
      <header class="debt-form__header">
        <div class="debt-form__icon">
          <i class="pi pi-file"></i>
        </div>
        <div>
          <h2>Registrar nuevo fiado</h2>
          <p>Completa los campos para registrar la deuda</p>
        </div>
      </header>

      <label>Cliente *</label>
      <Dropdown
          v-model="form.clientId"
          :options="store.clients"
          option-label="name"
          option-value="id"
          class="debt-form__input"
      />

      <label>Tipo de balón *</label>
      <div class="debt-form__types">
        <button
            v-for="type in store.cylinderTypes"
            :key="type.id"
            type="button"
            :class="{ active: form.cylinderTypeId === type.id }"
            @click="form.cylinderTypeId = type.id; form.amount = type.price * form.quantity"
        >
          <i class="pi pi-circle-fill"></i>
          <strong>{{ type.label }}</strong>
          <span>S/. {{ type.price }}</span>
        </button>
      </div>

      <label>Cantidad *</label>
      <InputNumber
          v-model="form.quantity"
          show-buttons
          :min="1"
          class="debt-form__input"
          @update:model-value="form.amount = store.getCylinderById(form.cylinderTypeId)?.price * form.quantity"
      />

      <label>Monto adeudado *</label>
      <InputNumber v-model="form.amount" prefix="S/. " class="debt-form__input" />

      <label>Nota</label>
      <Textarea v-model="form.note" rows="4" class="debt-form__input" />

      <div v-if="selectedClient?.activeDebt > 0" class="debt-form__warning">
        <i class="pi pi-exclamation-triangle"></i>
        <div>
          <strong>Este cliente ya tiene deuda</strong>
          <p>
            Deuda actual: S/. {{ selectedClient.activeDebt }} · Nuevo total:
            S/. {{ selectedClient.activeDebt + form.amount }}
          </p>
        </div>
      </div>

      <Button label="Registrar fiado" icon="pi pi-check" class="debt-form__button" @click="saveDebt" />
    </div>
  </section>
</template>

<style scoped>
.debt-form {
  display: flex;
  justify-content: center;
}

.debt-form__card {
  width: min(100%, 540px);
  background: var(--regula-white);
  border: 1px solid var(--regula-gray-light);
  border-radius: var(--regula-radius-card);
  padding: 1.75rem;
  box-shadow: 0 8px 24px rgba(23, 45, 64, 0.08);
}

.debt-form__header {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.debt-form__icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: #fff7ed;
  color: var(--regula-orange);
  display: grid;
  place-items: center;
}

.debt-form h2 {
  margin: 0;
  color: var(--regula-navy);
}

.debt-form p {
  margin: 0.25rem 0 0;
  color: var(--regula-text-muted);
}

.debt-form label {
  display: block;
  margin: 1rem 0 0.45rem;
  font-weight: 700;
  color: var(--regula-navy);
}

.debt-form__input {
  width: 100%;
}

.debt-form__types {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
}

.debt-form__types button {
  min-height: 104px;
  border: 1px solid var(--regula-gray-light);
  border-radius: 12px;
  background: white;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
}

.debt-form__types button.active {
  border-color: var(--regula-orange);
  box-shadow: 0 0 0 1px var(--regula-orange);
  color: var(--regula-orange);
  background: #fff7ed;
}

.debt-form__warning {
  margin-top: 1rem;
  display: flex;
  gap: 0.75rem;
  border: 1px solid #facc15;
  background: #fefce8;
  color: #92400e;
  padding: 1rem;
  border-radius: 12px;
}

.debt-form__button {
  width: 100%;
  margin-top: 1rem;
  background: var(--regula-orange);
  border-color: var(--regula-orange);
}
</style>