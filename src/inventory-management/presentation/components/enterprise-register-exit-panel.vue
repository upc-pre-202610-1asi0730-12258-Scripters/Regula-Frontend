<script setup>
import useInventoryStore from '@/inventory-management/application/inventory.store.js'
import CylinderTypePicker from '@/inventory-management/presentation/components/cylinder-type-picker.vue'
import { pickWeightsMap } from '@/inventory-management/infrastructure/movement-reference.helper.js'
import Button from 'primevue/button'
import Card from 'primevue/card'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import Textarea from 'primevue/textarea'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useInventoryStore()
const { stockKgMaps } = storeToRefs(store)

const selectedKg = ref(null)
const quantity = ref(null)
const destination = ref('')
const motivo = ref(null)
const exitDate = ref('')
const exitTime = ref('14:15')
const observations = ref('')
const maxObs = 500

const weightOptions = computed(() => [
  { key: '5', title: t('inventory.forms.weights.kg5'), warn: false },
  { key: '10', title: t('inventory.forms.weights.kg10'), warn: true },
  { key: '15', title: t('inventory.forms.weights.kg15'), warn: false },
  { key: '45', title: t('inventory.forms.weights.kg45'), warn: false },
])

const weightsMap = computed(() => pickWeightsMap(stockKgMaps.value, 'enterpriseExit'))

onMounted(() => {
  store.fetchStockKgMaps()
  const d = new Date()
  exitDate.value = d.toISOString().slice(0, 10)
})

const stockAvailable = computed(() => {
  if (!selectedKg.value) {
    return null
  }
  return weightsMap.value[selectedKg.value] ?? null
})

const insufficient = computed(() => {
  if (stockAvailable.value == null || quantity.value == null || quantity.value === '') {
    return false
  }
  return Number(quantity.value) > Number(stockAvailable.value)
})

const insufficientMsg = computed(() => {
  if (!insufficient.value || !selectedKg.value) {
    return ''
  }
  return t('inventory.forms.enterpriseExit.stockInsufficient', {
    n: stockAvailable.value,
    kg: selectedKg.value,
  })
})

const newStock = computed(() => {
  if (stockAvailable.value == null || quantity.value == null || quantity.value === '') {
    return null
  }
  return Math.max(0, Number(stockAvailable.value) - Number(quantity.value))
})

const obsCount = computed(() => observations.value.length)

const tipoNombre = computed(() => {
  const opt = weightOptions.value.find((w) => w.key === selectedKg.value)
  return opt?.title || ''
})

function setMotivo(val) {
  motivo.value = val
}

function resetForm() {
  selectedKg.value = null
  quantity.value = null
  destination.value = ''
  motivo.value = null
  observations.value = ''
  const d = new Date()
  exitDate.value = d.toISOString().slice(0, 10)
  exitTime.value = '14:15'
}

function saveExit() {}
</script>

<template>
  <Card class="exe-card surface-card">
    <template #title>
      <div class="exe-head">
        <span class="exe-head__icon exe-head__icon--danger">
          <i class="pi pi-arrow-up" aria-hidden="true" />
        </span>
        <div>
          <div class="exe-head__title">{{ t('inventory.forms.enterpriseExit.title') }}</div>
          <div class="exe-head__sub">{{ t('inventory.forms.common.requiredHint') }}</div>
        </div>
      </div>
    </template>
    <template #content>
      <div class="exe-grid">
        <div class="exe-field exe-field--full">
          <label class="exe-label">{{ t('inventory.forms.common.cylinderType') }} *</label>
          <CylinderTypePicker
              v-model="selectedKg"
              variant="enterprise-exit"
              :options="weightOptions"
          />
        </div>

        <div class="exe-field exe-field--full">
          <label class="exe-label" for="exe-qty">{{ t('inventory.forms.common.quantity') }} *</label>
          <InputGroup :class="{ 'exe-qty--error': insufficient }">
            <InputGroupAddon>#</InputGroupAddon>
            <InputNumber
                id="exe-qty"
                v-model="quantity"
                :min="1"
                :use-grouping="false"
                placeholder="—"
                class="exe-qty-input"
            />
          </InputGroup>
          <p class="exe-hint">{{ t('inventory.forms.common.quantityHelpExit') }}</p>
          <div v-if="insufficient" class="exe-error">
            <i class="pi pi-exclamation-circle" aria-hidden="true" />
            {{ insufficientMsg }}
          </div>
        </div>

        <div class="exe-field exe-field--full">
          <label class="exe-label" for="exe-dest">{{ t('inventory.forms.enterpriseExit.destination') }} *</label>
          <span class="exe-input-wrap">
            <i class="pi pi-send exe-input-ico" aria-hidden="true" />
            <InputText
                id="exe-dest"
                v-model="destination"
                class="exe-input"
                :placeholder="t('inventory.forms.enterpriseExit.destinationPh')"
            />
          </span>
          <p class="exe-hint">{{ t('inventory.forms.enterpriseExit.destinationHelp') }}</p>
        </div>

        <div class="exe-field exe-field--full">
          <span class="exe-label">{{ t('inventory.forms.enterpriseExit.reasonTitle') }} *</span>
          <div class="exe-mot">
            <button
                type="button"
                class="exe-mot__btn"
                :class="{ 'exe-mot__btn--on': motivo === 'venta' }"
                @click="setMotivo('venta')"
            >
              {{ t('inventory.forms.enterpriseExit.reasonSale') }}
            </button>
            <button
                type="button"
                class="exe-mot__btn"
                :class="{ 'exe-mot__btn--on': motivo === 'dist' }"
                @click="setMotivo('dist')"
            >
              {{ t('inventory.forms.enterpriseExit.reasonDist') }}
            </button>
            <button
                type="button"
                class="exe-mot__btn"
                :class="{ 'exe-mot__btn--on': motivo === 'traslado' }"
                @click="setMotivo('traslado')"
            >
              {{ t('inventory.forms.enterpriseExit.reasonMove') }}
            </button>
          </div>
        </div>

        <div class="exe-split">
          <div class="exe-field">
            <label class="exe-label" for="exe-date">{{ t('inventory.forms.enterpriseExit.exitDate') }} *</label>
            <input id="exe-date" v-model="exitDate" type="date" class="exe-native" />
          </div>
          <div class="exe-field">
            <label class="exe-label" for="exe-time">{{ t('inventory.forms.enterpriseExit.exitTime') }} *</label>
            <input id="exe-time" v-model="exitTime" type="time" class="exe-native" />
          </div>
        </div>

        <div class="exe-field exe-field--full">
          <label class="exe-label" for="exe-obs">{{ t('inventory.forms.common.observations') }}</label>
          <Textarea
              id="exe-obs"
              v-model="observations"
              rows="4"
              class="exe-textarea"
              :maxlength="maxObs"
              :placeholder="t('inventory.forms.common.obsPlaceholderExit')"
          />
          <div class="exe-counter">{{ obsCount }}/{{ maxObs }}</div>
        </div>

        <div v-if="selectedKg && quantity != null && !insufficient && newStock != null" class="exe-preview">
          <p class="exe-preview__text">
            {{
              t('inventory.forms.enterpriseExit.previewLine', {
                nombre: tipoNombre,
                current: stockAvailable,
                next: newStock,
              })
            }}
          </p>
          <p class="exe-preview__warn">
            {{
              t('inventory.forms.enterpriseExit.previewWarn', {
                qty: quantity,
              })
            }}
          </p>
        </div>

        <div class="exe-actions">
          <Button
              :label="t('inventory.forms.common.clearForm')"
              icon="pi pi-refresh"
              severity="secondary"
              outlined
              type="button"
              @click="resetForm"
          />
          <Button
              :label="t('inventory.forms.common.saveExit')"
              icon="pi pi-save"
              type="button"
              class="exe-save"
              @click="saveExit"
          />
        </div>
      </div>
    </template>
  </Card>
</template>

<style scoped>
.exe-head {
  display: flex;
  gap: 0.85rem;
  align-items: flex-start;
}

.exe-head__icon {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.exe-head__icon--danger {
  background: #fee2e2;
  color: #dc2626;
}

.exe-head__title {
  font-weight: 700;
  font-size: var(--regula-type-h3-size);
  color: var(--regula-navy);
}

.exe-head__sub {
  font-size: var(--regula-type-small-size);
  color: var(--regula-text-muted);
  margin-top: 0.15rem;
}

.exe-grid {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.exe-label {
  display: block;
  font-weight: 600;
  font-size: var(--regula-type-small-size);
  margin-bottom: 0.45rem;
  color: var(--regula-navy);
}

.exe-hint {
  margin: 0.35rem 0 0;
  font-size: var(--regula-type-caption-size);
  color: var(--regula-text-muted);
}

.exe-qty--error :deep(.p-inputnumber-input) {
  border-color: #ef4444 !important;
}

.exe-error {
  margin-top: 0.5rem;
  padding: 0.5rem 0.65rem;
  border-radius: var(--regula-radius-btn);
  background: #fef2f2;
  color: #b91c1c;
  font-size: var(--regula-type-small-size);
  display: flex;
  gap: 0.35rem;
  align-items: flex-start;
}

.exe-input-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid var(--regula-steel);
  border-radius: var(--regula-radius-btn);
  padding: 0.35rem 0.65rem;
  min-height: 44px;
}

.exe-input-wrap:focus-within {
  border-color: var(--regula-orange);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--regula-orange) 22%, transparent);
}

.exe-input-ico {
  color: var(--regula-text-muted);
}

.exe-input {
  flex: 1;
  border: none !important;
  box-shadow: none !important;
  min-height: 36px;
}

.exe-mot {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
}

.exe-mot__btn {
  flex: 1 1 140px;
  min-height: 44px;
  border-radius: var(--regula-radius-btn);
  border: 2px solid var(--regula-gray-light);
  background: var(--regula-white);
  cursor: pointer;
  font-family: inherit;
  font-weight: 600;
  font-size: var(--regula-type-small-size);
  color: var(--regula-navy);
}

.exe-mot__btn--on {
  border-color: var(--regula-orange);
  background: color-mix(in srgb, var(--regula-orange) 12%, var(--regula-white));
  color: var(--regula-orange);
}

.exe-split {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.exe-native {
  width: 100%;
  min-height: 44px;
  border-radius: var(--regula-radius-btn);
  border: 1px solid var(--regula-steel);
  padding: 0.5rem 0.65rem;
  font-family: inherit;
}

.exe-textarea {
  width: 100%;
}

.exe-counter {
  text-align: right;
  font-size: var(--regula-type-caption-size);
  color: var(--regula-text-muted);
}

.exe-preview {
  background: #fffbeb;
  border: 1px solid #fcd34d;
  border-radius: var(--regula-radius-card);
  padding: 1rem;
}

.exe-preview__text {
  margin: 0;
  font-size: var(--regula-type-small-size);
  color: var(--regula-gray-mid);
  font-weight: 600;
}

.exe-preview__warn {
  margin: 0.5rem 0 0;
  font-size: var(--regula-type-small-size);
  color: #c2410c;
}

.exe-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: flex-end;
}

.exe-save :deep(.p-button) {
  background: var(--regula-orange);
  border-color: var(--regula-orange);
  font-weight: 700;
  border-radius: var(--regula-radius-btn);
  min-height: 44px;
}

@media (max-width: 639px) {
  .exe-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .exe-actions :deep(.p-button) {
    width: 100%;
    justify-content: center;
  }
}
</style>
