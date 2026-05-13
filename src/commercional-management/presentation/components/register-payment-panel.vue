<script setup>
import { useCommercialStore } from '@/commercional-management/application/commercial.store.js'
import Button from 'primevue/button'
import Select from 'primevue/select'
import InputNumber from 'primevue/inputnumber'
import { reactive, ref, computed } from 'vue'
import { useToast } from 'primevue/usetoast'

const store = useCommercialStore()
const toast = useToast()
const loading = ref(false)

const form = reactive({
  clientId: null,
  amount: null
})

const selectedClient = computed(() => {
  return form.clientId ? store.clients.find(c => c.id === form.clientId) : null
})

const maxAmount = computed(() => {
  return selectedClient.value ? selectedClient.value.activeDebt : 0
})

const isFormValid = computed(() => {
  return form.clientId && form.amount > 0 && form.amount <= maxAmount.value
})

function submitPayment() {
  if (!isFormValid.value) return
  
  loading.value = true
  
  store.registerPayment({
    clientId: form.clientId,
    amount: form.amount
  }).then(() => {
    toast.add({
      severity: 'success',
      summary: 'Pago registrado',
      detail: 'El pago ha sido registrado exitosamente',
      life: 3000
    })
    
    // Reset form
    form.clientId = null
    form.amount = null
  }).finally(() => {
    loading.value = false
  })
}

function setTotalAmount() {
  if (maxAmount.value > 0) {
    form.amount = maxAmount.value
  }
}
</script>

<template>
  <section class="register-panel">
    <div class="register-panel__header">
      <i class="pi pi-money-bill icon-green"></i>
      <h3>Registrar Pago</h3>
    </div>
    
    <div class="register-panel__form">
      <div class="form-field">
        <label>Cliente (con deuda activa)</label>
        <Select 
          v-model="form.clientId" 
          :options="store.clientsWithDebt" 
          optionLabel="name" 
          optionValue="id"
          placeholder="Seleccionar cliente" 
          class="w-full"
        />
        <small v-if="selectedClient" class="text-gray-500 mt-1">
          Deuda actual: <strong>S/. {{ selectedClient.activeDebt }}</strong>
        </small>
      </div>
      
      <div class="form-field">
        <label>Monto a pagar (S/.)</label>
        <div class="amount-input-group">
          <InputNumber 
            v-model="form.amount" 
            mode="currency" 
            currency="PEN" 
            locale="es-PE" 
            placeholder="0.00" 
            :max="maxAmount"
            class="w-full flex-grow-1"
          />
          <Button label="Total" outlined severity="secondary" @click="setTotalAmount" :disabled="!selectedClient" />
        </div>
      </div>
      
      <Button 
        label="Registrar Pago" 
        severity="success"
        class="w-full submit-btn" 
        :disabled="!isFormValid"
        :loading="loading"
        @click="submitPayment"
      />
    </div>
  </section>
</template>

<style scoped>
.register-panel {
  background: white;
  border-radius: var(--regula-radius-card);
  border: 1px solid var(--regula-gray-light);
  padding: 1.5rem;
  box-shadow: 0 8px 24px rgba(23, 45, 64, 0.08);
}

.register-panel__header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.icon-green {
  color: #15803d;
  font-size: 1.5rem;
}

.register-panel h3 {
  margin: 0;
  color: var(--regula-navy);
  font-size: 1.1rem;
}

.register-panel__form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-field label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--regula-navy);
}

.amount-input-group {
  display: flex;
  gap: 0.5rem;
}

.flex-grow-1 {
  flex-grow: 1;
}

.submit-btn {
  margin-top: 0.5rem;
  font-weight: 700;
}
</style>