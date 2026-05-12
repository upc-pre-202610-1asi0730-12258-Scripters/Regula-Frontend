<script setup>
import { useCommercialStore } from '@/commercional-management/application/commercial.store.js'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import { computed, reactive, ref } from 'vue'
import { useToast } from 'primevue/usetoast'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:visible'])

const store = useCommercialStore()
const toast = useToast()
const attemptedSubmit = ref(false)

const form = reactive({
  cylinderTypeId: '10kg',
  quantity: 2,
  paymentType: 'Deuda', // Cambiado de Fiado a Deuda
  client: 'Rosa Huanca',
  distributor: 'Carlos M.',
})

const internalVisible = computed({
  get() {
    return props.visible
  },
  set(value) {
    emit('update:visible', value)
  },
})

const selectedCylinder = computed(() => store.getCylinderById(form.cylinderTypeId))

const stockAfterSave = computed(() => {
  if (!selectedCylinder.value) {
    return 0
  }

  return selectedCylinder.value.stock - Number(form.quantity)
})

const requiresClient = computed(() => form.paymentType === 'Deuda')

const hasClientError = computed(() => {
  return requiresClient.value && form.client.trim().length === 0
})

const canSave = computed(() => {
  return (
      selectedCylinder.value &&
      Number(form.quantity) > 0 &&
      stockAfterSave.value >= 0 &&
      !hasClientError.value
  )
})

function closeDialog() {
  internalVisible.value = false
  attemptedSubmit.value = false
}

function selectCylinder(id) {
  form.cylinderTypeId = id
}

function selectPayment(type) {
  form.paymentType = type
}

function decreaseQuantity() {
  if (form.quantity > 1) {
    form.quantity--
  }
}

function increaseQuantity() {
  form.quantity++
}

function saveSale() {
  attemptedSubmit.value = true

  if (!canSave.value) {
    return
  }

  store
      .registerSale({
        cylinderTypeId: form.cylinderTypeId,
        quantity: form.quantity,
        paymentType: form.paymentType,
        client: form.client,
        distributor: form.distributor,
      })
      .then((result) => {
        toast.add({
          severity: 'success',
          summary: 'Venta registrada exitosamente',
          detail: `${result.sale.cylinderType} · ${result.sale.quantity} unidades · ${result.sale.paymentType}`,
          life: 3500,
        })

        closeDialog()
      })
      .catch(() => {
        toast.add({
          severity: 'error',
          summary: 'No se pudo registrar la venta',
          detail: 'Revisa el stock disponible y los campos obligatorios.',
          life: 3500,
        })
      })
}
</script>

<template>
  <Dialog
      v-model:visible="internalVisible"
      modal
      header="Registrar Nueva Venta"
      class="sale-dialog"
      :style="{ width: '520px' }"
      :breakpoints="{ '640px': '94vw' }"
  >
    <section class="sale-dialog__section">
      <label class="sale-dialog__label">Tipo de balón <span>*</span></label>

      <div class="sale-dialog__card-grid">
        <button
            v-for="type in store.cylinderTypes"
            :key="type.id"
            type="button"
            class="sale-dialog__option-card"
            :class="{ 'sale-dialog__option-card--selected': form.cylinderTypeId === type.id }"
            @click="selectCylinder(type.id)"
        >
          <i class="pi pi-circle-fill sale-dialog__option-icon" aria-hidden="true" />
          <strong>{{ type.label }}</strong>
          <small>S/. {{ type.price }}</small>

          <span v-if="form.cylinderTypeId === type.id" class="sale-dialog__check">
            <i class="pi pi-check" aria-hidden="true" />
          </span>
        </button>
      </div>
    </section>

    <section class="sale-dialog__section">
      <label class="sale-dialog__label">Cantidad <span>*</span></label>

      <div class="sale-dialog__quantity">
        <button type="button" @click="decreaseQuantity">−</button>
        <strong>{{ form.quantity }}</strong>
        <button type="button" @click="increaseQuantity">+</button>
        <span>unidades</span>
      </div>
    </section>

    <section class="sale-dialog__section">
      <label class="sale-dialog__label">Tipo de pago <span>*</span></label>

      <div class="sale-dialog__payment-grid">
        <button
            type="button"
            class="sale-dialog__payment-card"
            :class="{ 'sale-dialog__payment-card--selected': form.paymentType === 'Efectivo' }"
            @click="selectPayment('Efectivo')"
        >
          <i class="pi pi-money-bill" aria-hidden="true" />
          <span>Efectivo</span>
        </button>

        <button
            type="button"
            class="sale-dialog__payment-card"
            :class="{ 'sale-dialog__payment-card--selected': form.paymentType === 'Yape/Plin' }"
            @click="selectPayment('Yape/Plin')"
        >
          <i class="pi pi-mobile" aria-hidden="true" />
          <span>Yape/Plin</span>
        </button>

        <button
            type="button"
            class="sale-dialog__payment-card"
            :class="{ 'sale-dialog__payment-card--selected': form.paymentType === 'Transferencia' }"
            @click="selectPayment('Transferencia')"
        >
          <i class="pi pi-building-columns" aria-hidden="true" />
          <span>Transferencia</span>
        </button>

        <button
            type="button"
            class="sale-dialog__payment-card"
            :class="{ 'sale-dialog__payment-card--selected': form.paymentType === 'Deuda' }"
            @click="selectPayment('Deuda')"
        >
          <i class="pi pi-wallet" aria-hidden="true" />
          <span>Deuda</span>
        </button>
      </div>
    </section>

    <section class="sale-dialog__section">
      <label class="sale-dialog__label">
        Cliente
        <span v-if="requiresClient">*</span>
        <small v-if="requiresClient">Requerido para Deuda</small>
      </label>

      <span
          class="sale-dialog__input-wrapper"
          :class="{ 'sale-dialog__input-wrapper--error': attemptedSubmit && hasClientError }"
      >
        <i class="pi pi-user" aria-hidden="true" />
        <InputText
            v-model="form.client"
            placeholder="Buscar cliente..."
            class="sale-dialog__input"
        />
      </span>

      <p v-if="attemptedSubmit && hasClientError" class="sale-dialog__error">
        Debes ingresar un cliente para registrar una venta en deuda.
      </p>
    </section>

    <div v-if="form.paymentType === 'Deuda' && form.client" class="sale-dialog__warning">
      <i class="pi pi-exclamation-triangle" aria-hidden="true" />
      <div>
        <strong>Cliente: {{ form.client }}</strong>
        <p>Esta venta se registrará como deuda pendiente de cobro.</p>
      </div>
    </div>

    <div class="sale-dialog__stock">
      <i class="pi pi-box" aria-hidden="true" />
      <span>
        Stock de {{ selectedCylinder?.label }}:
        <strong>{{ selectedCylinder?.stock }}</strong>
        →
        Nuevo stock:
        <strong>{{ stockAfterSave }}</strong>
      </span>
    </div>

    <template #footer>
      <div class="sale-dialog__footer">
        <Button
            label="Cancelar"
            severity="secondary"
            outlined
            class="sale-dialog__footer-btn"
            @click="closeDialog"
        />
        <Button
            label="Registrar Venta"
            icon="pi pi-plus"
            class="sale-dialog__footer-btn sale-dialog__save"
            :disabled="!canSave"
            @click="saveSale"
        />
      </div>
    </template>
  </Dialog>
</template>

<style scoped>
.sale-dialog__section {
  margin-bottom: 1.25rem;
}

.sale-dialog__label {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin-bottom: 0.6rem;
  font-weight: 700;
  color: var(--regula-navy);
}

.sale-dialog__label span {
  color: var(--regula-orange);
}

.sale-dialog__label small {
  background: #fee2e2;
  color: #dc2626;
  font-size: 0.7rem;
  padding: 0.15rem 0.45rem;
  border-radius: 999px;
}

.sale-dialog__card-grid,
.sale-dialog__payment-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem;
}

.sale-dialog__option-card,
.sale-dialog__payment-card {
  position: relative;
  min-height: 94px;
  border: 1px solid var(--regula-gray-light);
  border-radius: 12px;
  background: var(--regula-white);
  color: var(--regula-text-primary);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  transition: 0.15s ease;
}

.sale-dialog__option-card--selected,
.sale-dialog__payment-card--selected {
  border-color: var(--regula-orange);
  box-shadow: 0 0 0 1px var(--regula-orange);
  background: color-mix(in srgb, var(--regula-orange) 8%, var(--regula-white));
  color: var(--regula-orange);
}

.sale-dialog__option-icon {
  font-size: 1.2rem;
  color: var(--regula-steel);
}

.sale-dialog__check {
  position: absolute;
  top: -9px;
  right: -9px;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  background: var(--regula-orange);
  color: var(--regula-white);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
}

.sale-dialog__quantity {
  display: grid;
  grid-template-columns: 44px 1fr 44px auto;
  align-items: center;
  border: 1px solid var(--regula-gray-light);
  border-radius: 10px;
  overflow: hidden;
}

.sale-dialog__quantity button {
  height: 44px;
  border: none;
  background: var(--regula-white);
  font-size: 1.3rem;
  cursor: pointer;
  color: var(--regula-navy);
}

.sale-dialog__quantity strong {
  text-align: center;
}

.sale-dialog__quantity span {
  padding: 0 0.75rem;
  color: var(--regula-text-muted);
}

.sale-dialog__input-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid var(--regula-gray-light);
  border-radius: 10px;
  padding: 0 0.75rem;
  min-height: 44px;
  background: var(--regula-white);
}

.sale-dialog__input-wrapper--error {
  border-color: #dc2626;
}

.sale-dialog__input-wrapper i {
  color: var(--regula-steel);
}

.sale-dialog__input {
  border: none;
  box-shadow: none;
  width: 100%;
}

.sale-dialog__error {
  color: #dc2626;
  font-size: var(--regula-type-caption-size);
  margin: 0.35rem 0 0;
}

.sale-dialog__warning {
  display: flex;
  gap: 0.8rem;
  padding: 0.9rem;
  border-radius: 12px;
  border: 1px solid var(--regula-orange);
  background: color-mix(in srgb, var(--regula-orange) 7%, var(--regula-white));
  color: var(--regula-navy);
  margin-bottom: 1rem;
}

.sale-dialog__warning i {
  color: var(--regula-orange);
  margin-top: 0.2rem;
}

.sale-dialog__warning p {
  margin: 0.25rem 0 0;
  color: var(--regula-text-muted);
}

.sale-dialog__stock {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.8rem;
  border-radius: 10px;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: var(--regula-type-small-size);
}

.sale-dialog__footer {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.85rem;
  width: 100%;
}

.sale-dialog__footer-btn {
  width: 100%;
  min-height: 44px;
}

.sale-dialog__save {
  background: var(--regula-orange);
  border-color: var(--regula-orange);
}

@media (max-width: 560px) {
  .sale-dialog__card-grid,
  .sale-dialog__payment-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .sale-dialog__footer {
    grid-template-columns: 1fr;
  }
}
</style>