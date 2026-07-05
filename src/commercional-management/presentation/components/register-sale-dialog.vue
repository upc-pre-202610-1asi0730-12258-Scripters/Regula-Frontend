<script setup>
import { useCommercialStore } from '@/commercional-management/application/commercial.store.js'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import { computed, reactive, ref } from 'vue'

const { t } = useI18n()
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:visible'])

const store = useCommercialStore()
const toast = useToast()

const form = reactive({
  cylinderTypeId: '10kg',
  quantity: 2,
  paymentType: 'Efectivo',
  client: '',
  distributor: 'Carlos M.',
})

const cylinderOptions = computed(() => store.cylinderCatalog)

const internalVisible = computed({
  get() {
    return props.visible
  },
  set(value) {
    emit('update:visible', value)
  },
})

const selectedCylinder = computed(() =>
    cylinderOptions.value.find((type) => type.id === form.cylinderTypeId)
)

const canSave = computed(() =>
    selectedCylinder.value &&
    Number(form.quantity) > 0
)

function closeDialog() {
  internalVisible.value = false
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
  if (!canSave.value) return

  store.registerSale({
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
      :header="t('commercial.dialog.title')"
      class="sale-dialog"
      :style="{ width: '520px' }"
      :breakpoints="{ '640px': '94vw' }"
  >
    <section class="sale-dialog__section">
      <label class="sale-dialog__label">{{ t('commercial.dialog.cylinderType') }} <span>*</span></label>

      <div class="sale-dialog__card-grid">
        <button
            v-for="type in cylinderOptions"
            :key="type.id"
            type="button"
            class="sale-dialog__option-card"
            :class="{ 'sale-dialog__option-card--selected': form.cylinderTypeId === type.id }"
            @click="selectCylinder(type.id)"
        >
<span class="sale-dialog__flame-icon">
  <img
      src="/cylinder-flame.svg"
      alt="Balón de gas"
      class="sale-dialog__flame-image"
  />
</span>          <strong>{{ type.label }}</strong>
          <small>S/. {{ type.price }}</small>

          <span v-if="form.cylinderTypeId === type.id" class="sale-dialog__check">
            <i class="pi pi-check" />
          </span>
        </button>
      </div>
    </section>

    <section class="sale-dialog__section">
      <label class="sale-dialog__label">{{ t('commercial.dialog.quantity') }} <span>*</span></label>

      <div class="sale-dialog__quantity">
        <button type="button" @click="decreaseQuantity">−</button>
        <strong>{{ form.quantity }}</strong>
        <button type="button" @click="increaseQuantity">+</button>
        <span>{{ t('inventory.forms.distEntry.units') }}</span>
      </div>
    </section>

    <section class="sale-dialog__section">
      <label class="sale-dialog__label">{{ t('commercial.dialog.paymentType') }} <span>*</span></label>

      <div class="sale-dialog__payment-grid">
        <button
            type="button"
            class="sale-dialog__payment-card"
            :class="{ 'sale-dialog__payment-card--selected': form.paymentType === 'Efectivo' }"
            @click="selectPayment('Efectivo')"
        >
          <i class="pi pi-money-bill" />
          <span>{{ t('commercial.dialog.cash') }}</span>
        </button>

        <button
            type="button"
            class="sale-dialog__payment-card"
            :class="{ 'sale-dialog__payment-card--selected': form.paymentType === 'Yape/Plin' }"
            @click="selectPayment('Yape/Plin')"
        >
          <i class="pi pi-mobile" />
          <span>{{ t('commercial.dialog.digital') }}</span>
        </button>

        <button
            type="button"
            class="sale-dialog__payment-card"
            :class="{ 'sale-dialog__payment-card--selected': form.paymentType === 'Transferencia' }"
            @click="selectPayment('Transferencia')"
        >
          <i class="pi pi-building-columns" />
          <span>{{ t('commercial.dialog.transfer') }}</span>
        </button>

      </div>
    </section>

    <section class="sale-dialog__section">
      <label class="sale-dialog__label">{{ t('commercial.dialog.client') }}</label>

      <span class="sale-dialog__input-wrapper">
        <i class="pi pi-user" />
        <InputText v-model="form.client" :placeholder="t('commercial.dialog.clientPlaceholder')" class="sale-dialog__input" />
      </span>
    </section>

    <template #footer>
      <div class="sale-dialog__footer">
        <Button :label="t('commercial.dialog.cancel')" severity="secondary" outlined class="sale-dialog__footer-btn" @click="closeDialog" />
        <Button
            :label="t('commercial.dialog.submit')"
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

.sale-dialog__card-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
}

.sale-dialog__payment-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.sale-dialog__option-card,
.sale-dialog__payment-card {
  position: relative;
  min-height: 94px;
  border: 1px solid var(--regula-gray-light);
  border-radius: 12px;
  background: white;
  color: var(--regula-text-primary);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
}

.sale-dialog__option-card--selected,
.sale-dialog__payment-card--selected {
  border-color: var(--regula-orange);
  box-shadow: 0 0 0 1px var(--regula-orange);
  color: var(--regula-orange);
}

.sale-dialog__check {
  position: absolute;
  top: -9px;
  right: -9px;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  background: var(--regula-orange);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sale-dialog__quantity {
  display: grid;
  grid-template-columns: 44px 1fr 44px 90px;
  align-items: center;
  border: 1px solid var(--regula-gray-light);
  border-radius: 10px;
  overflow: hidden;
}

.sale-dialog__quantity span {
  text-align: left;
}

.sale-dialog__quantity button {
  height: 44px;
  border: none;
  background: white;
  font-size: 1.3rem;
  cursor: pointer;
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
}

.sale-dialog__input-wrapper--error {
  border-color: #dc2626;
}

.sale-dialog__input {
  border: none;
  box-shadow: none;
  width: 100%;
}

.sale-dialog__error {
  color: #dc2626;
  font-size: 0.8rem;
  margin: 0.35rem 0 0;
}

.sale-dialog__warning {
  display: flex;
  gap: 0.8rem;
  padding: 0.9rem;
  border-radius: 12px;
  border: 1px solid var(--regula-orange);
  background: #fff7ed;
  color: var(--regula-navy);
  margin-bottom: 1rem;
}

.sale-dialog__warning i {
  color: var(--regula-orange);
}

.sale-dialog__warning p {
  margin: 0.25rem 0 0;
  color: var(--regula-text-muted);
}

.sale-dialog__stock {
  display: flex;
  gap: 0.65rem;
  padding: 0.8rem;
  border-radius: 10px;
  background: #eff6ff;
  color: #1d4ed8;
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

.sale-dialog__flame-icon {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #ffe8d6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sale-dialog__flame-image {
  width: 22px;
  height: 22px;
  object-fit: contain;
}

.sale-dialog__option-card:not(.sale-dialog__option-card--selected) .sale-dialog__flame-icon {
  background: #f1f3f6;
}

.sale-dialog__option-card:not(.sale-dialog__option-card--selected) .sale-dialog__flame-image {
  filter: grayscale(1);
  opacity: 0.45;
}

@media (max-width: 560px) {
  .sale-dialog__card-grid,
  .sale-dialog__payment-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .sale-dialog__footer {
    grid-template-columns: 1fr;
  }
}
</style>