<script setup>
import useInventoryStore from '@/inventory-management/application/inventory.store.js'
import CylinderTypePicker from '@/inventory-management/presentation/components/cylinder-type-picker.vue'
import Button from 'primevue/button'
import Card from 'primevue/card'
import InputNumber from 'primevue/inputnumber'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import { useToast } from 'primevue/usetoast'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useInventoryStore()
const toast = useToast()
const { distributorAvailableByKg } = storeToRefs(store)

const selectedKg = ref(null)
const quantity = ref(null)
const exitKind = ref(null)
const saving = ref(false)
const weightOptions = computed(() => [
  { key: '5', title: t('inventory.forms.weights.kg5'), subtitle: t('inventory.forms.weights.domestic') },
  { key: '10', title: t('inventory.forms.weights.kg10'), subtitle: t('inventory.forms.weights.standard') },
  { key: '15', title: t('inventory.forms.weights.kg15'), subtitle: t('inventory.forms.weights.commercial') },
  { key: '45', title: t('inventory.forms.weights.kg45'), subtitle: t('inventory.forms.weights.industrial') },
])

const exitKindOptions = computed(() => [
  { key: 'venta', title: t('inventory.forms.distExit.saleDirect'), icon: 'pi pi-shopping-cart' },
  { key: 'entrega', title: t('inventory.forms.distExit.delivery'), icon: 'pi pi-truck' },
  { key: 'devol', title: t('inventory.forms.distExit.returnSupplier'), icon: 'pi pi-replay' },
])

const stockAvailable = computed(() => {
  if (!selectedKg.value) {
    return null
  }
  return distributorAvailableByKg.value[selectedKg.value] ?? 0
})

const newStock = computed(() => {
  if (stockAvailable.value == null || quantity.value == null || quantity.value === '') {
    return null
  }
  return Math.max(0, Number(stockAvailable.value) - Number(quantity.value))
})

const selectedKgLabel = computed(() => {
  const o = weightOptions.value.find((w) => w.key === selectedKg.value)
  return o?.title || '—'
})

const exitKindLabel = computed(() => {
  const o = exitKindOptions.value.find((w) => w.key === exitKind.value)
  return o?.title || '—'
})

const canSave = computed(() =>
    selectedKg.value &&
    Number(quantity.value) > 0 &&
    exitKind.value &&
    Number(quantity.value) <= Number(stockAvailable.value ?? 0)
)

function resetForm() {
  selectedKg.value = null
  quantity.value = null
  exitKind.value = null
}

function saveExit() {
  if (!canSave.value) return
  saving.value = true
  store.registerDistributorExit({
    kgKey: selectedKg.value,
    quantity: quantity.value,
    exitKind: exitKind.value,
  })
      .then(() => {
        toast.add({
          severity: 'success',
          summary: t('inventory.forms.common.saveExit'),
          detail: `-${quantity.value} · ${selectedKgLabel.value}`,
          life: 3500,
        })
        resetForm()
      })
      .catch((error) => {
        toast.add({
          severity: 'error',
          summary: 'No se pudo registrar la salida',
          detail: error.response?.data?.detail || error.message,
          life: 4000,
        })
      })
      .finally(() => {
        saving.value = false
      })
}
</script>

<template>
  <Card class="dxe-card">
    <template #header>
      <div class="dxe-head">
        <span class="dxe-head__ico">
          <i class="pi pi-upload" aria-hidden="true" />
        </span>
        <div>
          <div class="dxe-head__title">{{ t('inventory.forms.distExit.title') }}</div>
          <div class="dxe-head__sub">{{ t('inventory.forms.distExit.subtitle') }}</div>
        </div>
      </div>
    </template>
    <template #content>
      <div class="dxe-body">
        <div class="dxe-field">
          <label class="dxe-label">{{ t('inventory.forms.common.cylinderType') }} *</label>
          <CylinderTypePicker v-model="selectedKg" variant="dist-cards" :options="weightOptions" />
        </div>

        <div class="dxe-field">
          <label class="dxe-label" for="dxe-qty">{{ t('inventory.forms.common.quantity') }} *</label>
          <InputGroup>
            <InputGroupAddon>#</InputGroupAddon>
            <InputNumber
                id="dxe-qty"
                v-model="quantity"
                :min="1"
                :use-grouping="false"
                placeholder="—"
                class="dxe-qty"
            />
          </InputGroup>
          <p class="dxe-hint">{{ t('inventory.forms.common.quantityHelpExit') }}</p>
        </div>

        <div class="dxe-field">
          <label class="dxe-label">{{ t('inventory.forms.distExit.exitKindTitle') }} *</label>
          <CylinderTypePicker v-model="exitKind" variant="dist-cards" :options="exitKindOptions" />
        </div>

        <div v-if="selectedKg && quantity != null && exitKind" class="dxe-preview">
          <p class="dxe-preview__row">
            <strong>{{ t('inventory.forms.distExit.selectedLine') }}</strong>
            {{ selectedKgLabel }}
          </p>
          <p class="dxe-preview__row dxe-preview__danger">
            <strong>{{ t('inventory.forms.distExit.qtyOut') }}</strong>
            −{{ quantity }} {{ t('inventory.forms.distEntry.units') }}
          </p>
          <p class="dxe-preview__row">
            <strong>{{ t('inventory.forms.distExit.exitKindLine') }}</strong>
            {{ exitKindLabel }}
          </p>
          <div class="dxe-flow">
            <div class="dxe-box">
              <div class="dxe-box__k">{{ t('inventory.forms.distEntry.stockNow') }}</div>
              <div class="dxe-box__v">{{ stockAvailable }}</div>
            </div>
            <span class="dxe-mid">−{{ quantity }}</span>
            <div class="dxe-box dxe-box--danger">
              <div class="dxe-box__k">{{ t('inventory.forms.distEntry.stockNew') }}</div>
              <div class="dxe-box__v">{{ newStock }}</div>
            </div>
          </div>
          <p class="dxe-sum">
            {{
              t('inventory.forms.distExit.stockLine', {
                kg: selectedKg,
                a: stockAvailable,
                b: newStock,
              })
            }}
          </p>
        </div>

        <div class="dxe-actions">
          <Button
              :label="t('inventory.forms.common.clear')"
              icon="pi pi-replay"
              severity="secondary"
              outlined
              type="button"
              @click="resetForm"
          />
          <Button
              :label="t('inventory.forms.common.saveExit')"
              icon="pi pi-save"
              type="button"
              class="dxe-save"
              :loading="saving"
              :disabled="!canSave"
              @click="saveExit"
          />
        </div>

        <p class="dxe-foot">
          <i class="pi pi-lock" aria-hidden="true" />
          {{ t('inventory.forms.common.footerLockExit') }}
        </p>
      </div>
    </template>
  </Card>
</template>

<style scoped>
.dxe-head {
  background: var(--regula-navy);
  color: var(--regula-white);
  padding: 1.15rem 1.25rem;
  border-radius: var(--regula-radius-card) var(--regula-radius-card) 0 0;
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

.dxe-head__ico {
  font-size: 1.5rem;
}

.dxe-head__title {
  font-weight: 700;
  font-size: var(--regula-type-h3-size);
}

.dxe-head__sub {
  font-size: var(--regula-type-small-size);
  opacity: 0.92;
  margin-top: 0.25rem;
}

.dxe-body {
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.dxe-label {
  font-weight: 600;
  font-size: var(--regula-type-small-size);
  display: block;
  margin-bottom: 0.45rem;
  color: var(--regula-navy);
}

.dxe-hint {
  margin: 0.35rem 0 0;
  font-size: var(--regula-type-caption-size);
  color: var(--regula-text-muted);
}

.dxe-qty :deep(.p-inputnumber-input) {
  width: 100%;
  min-height: 44px;
}

.dxe-preview {
  border: 2px solid #fecaca;
  background: #fff1f2;
  border-radius: var(--regula-radius-card);
  padding: 1rem;
}

.dxe-preview__row {
  margin: 0 0 0.35rem;
  font-size: var(--regula-type-small-size);
  color: var(--regula-navy);
}

.dxe-preview__danger {
  color: #b91c1c;
  font-weight: 700;
}

.dxe-flow {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-wrap: wrap;
  margin: 0.75rem 0;
}

.dxe-box {
  flex: 1 1 120px;
  background: var(--regula-white);
  border: 1px solid var(--regula-gray-light);
  border-radius: var(--regula-radius-btn);
  padding: 0.65rem;
  text-align: center;
}

.dxe-box--danger .dxe-box__v {
  color: #b91c1c;
}

.dxe-box__k {
  font-size: var(--regula-type-caption-size);
  color: var(--regula-text-muted);
}

.dxe-box__v {
  font-weight: 800;
  font-size: var(--regula-type-h3-size);
}

.dxe-mid {
  font-weight: 800;
  color: #b91c1c;
}

.dxe-sum {
  margin: 0;
  font-size: var(--regula-type-caption-size);
  color: var(--regula-text-muted);
}

.dxe-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: flex-end;
}

.dxe-save :deep(.p-button) {
  background: var(--regula-orange);
  border-color: var(--regula-orange);
  font-weight: 700;
  min-height: 44px;
  border-radius: var(--regula-radius-btn);
}

.dxe-foot {
  margin: 0;
  font-size: var(--regula-type-caption-size);
  color: var(--regula-text-muted);
  display: flex;
  gap: 0.35rem;
}

@media (max-width: 639px) {
  .dxe-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .dxe-actions :deep(.p-button) {
    width: 100%;
    justify-content: center;
  }
}
</style>
