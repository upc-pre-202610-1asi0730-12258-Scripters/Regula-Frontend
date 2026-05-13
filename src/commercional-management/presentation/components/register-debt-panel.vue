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
  cylinderTypeId: null,
  quantity: 1,
  amount: null
})

const isFormValid = computed(() => {
  return form.clientId && form.cylinderTypeId && form.quantity > 0 && form.amount > 0
})

function submitDebt() {
  if (!isFormValid.value) return
  
  loading.value = true
  
  store.registerDebt({
    clientId: form.clientId,
    cylinderTypeId: form.cylinderTypeId,
    quantity: form.quantity,
    amount: form.amount
  }).then(() => {
    toast.add({
      severity: 'success',
      summary: 'Deuda registrada',
      detail: 'El crédito ha sido registrado exitosamente',
      life: 3000
    })
    
    // Reset form
    form.clientId = null
    form.cylinderTypeId = null
    form.quantity = 1
    form.amount = null
  }).finally(() => {
    loading.value = false
  })
}
</script>

<template>
  <section class="register-panel">
    <div class="register-panel__header">
      <i class="pi pi-credit-card icon-orange"></i>
      <h3>Registrar Deuda</h3>
    </div>
    
    <div class="register-panel__form">
      <div class="form-field">
        <label>Cliente</label>
        <Select 
          v-model="form.clientId" 
          :options="store.clients" 
          optionLabel="name" 
          optionValue="id"
          placeholder="Seleccionar cliente" 
          class="w-full"
        />
      </div>
      
      <div class="form-row">
        <div class="form-field w-full">
          <label>Producto</label>
          <Select 
            v-model="form.cylinderTypeId" 
            :options="store.cylinderTypes" 
            optionLabel="label" 
            optionValue="id"
            placeholder="Tipo balón" 
            class="w-full"
          />
        </div>
        <div class="form-field quantity-field">
          <label>Cant.</label>
          <InputNumber v-model="form.quantity" :min="1" :max="100" showButtons class="w-full" />
        </div>
      </div>
      
      <div class="form-field">
        <label>Monto de deuda (S/.)</label>
        <InputNumber 
          v-model="form.amount" 
          mode="currency" 
          currency="PEN" 
          locale="es-PE" 
          placeholder="0.00" 
          class="w-full"
        />
      </div>
      
      <Button 
        label="Registrar Deuda" 
        class="w-full submit-btn" 
        :disabled="!isFormValid"
        :loading="loading"
        @click="submitDebt"
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

.icon-orange {
  color: var(--regula-orange);
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

.form-row {
  display: flex;
  gap: 1rem;
}

.quantity-field {
  width: 120px;
  flex-shrink: 0;
}

.submit-btn {
  background: var(--regula-orange);
  border-color: var(--regula-orange);
  margin-top: 0.5rem;
  font-weight: 700;
}
</style>