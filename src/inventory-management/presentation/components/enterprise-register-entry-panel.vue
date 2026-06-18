<script setup>
import useInventoryStore from '@/inventory-management/application/inventory.store.js'
import CylinderTypePicker from '@/inventory-management/presentation/components/cylinder-type-picker.vue'
import { pickWeightsMap } from '@/inventory-management/infrastructure/movement-reference.helper.js'
import Button from 'primevue/button'
import Card from 'primevue/card'
import InputNumber from 'primevue/inputnumber'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import Select from 'primevue/select'
import Textarea from 'primevue/textarea'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useInventoryStore()
const { origins, stockKgMaps } = storeToRefs(store)

const selectedKg = ref(null)
const quantity = ref(null)
const originId = ref(null)
const entryDate = ref('')
const entryTime = ref('09:30')
const observations = ref('')
const maxObs = 500

const weightOptions = computed(() => [
  { key: '5', title: t('inventory.forms.weights.kg5') },
  { key: '10', title: t('inventory.forms.weights.kg10') },
  { key: '15', title: t('inventory.forms.weights.kg15') },
  { key: '45', title: t('inventory.forms.weights.kg45') },
])

const weightsMap = computed(() => pickWeightsMap(stockKgMaps.value, 'enterpriseEntry'))

onMounted(() => {
  store.fetchOrigins()
  store.fetchStockKgMaps()
  const d = new Date()
  entryDate.value = d.toISOString().slice(0, 10)
})

watch(
    origins,
    (list) => {
      if (!originId.value && list.length) {
        originId.value = list[0].id
      }
    },
    { immediate: true },
)

const currentStock = computed(() => {
  if (!selectedKg.value) {
    return null
  }
  return weightsMap.value[selectedKg.value] ?? null
})

const newStock = computed(() => {
  if (currentStock.value == null || quantity.value == null || quantity.value === '') {
    return null
  }
  return Number(currentStock.value) + Number(quantity.value)
})

const obsCount = computed(() => observations.value.length)

function resetForm() {
  selectedKg.value = null
  quantity.value = null
  observations.value = ''
  if (origins.value.length) {
    originId.value = origins.value[0].id
  } else {
    originId.value = null
  }
  const d = new Date()
  entryDate.value = d.toISOString().slice(0, 10)
  entryTime.value = '09:30'
}

function saveEntry() {
  /* placeholder hasta backend real */
}
</script>

<template>
  <Card class="ere-card surface-card">
    <template #title>
      <div class="ere-head">
        <span class="ere-head__icon">
          <i class="pi pi-arrow-down" aria-hidden="true" />
        </span>
        <div>
          <div class="ere-head__title">{{ t('inventory.forms.enterpriseEntry.title') }}</div>
          <div class="ere-head__sub">{{ t('inventory.forms.enterpriseEntry.subtitle') }}</div>
        </div>
      </div>
    </template>
    <template #content>
      <div class="ere-grid">
        <div class="ere-field ere-field--full">
          <label class="ere-label">{{ t('inventory.forms.common.cylinderType') }} *</label>
          <CylinderTypePicker
              v-model="selectedKg"
              variant="enterprise-entry"
              :options="weightOptions"
          />
        </div>

        <div class="ere-field ere-field--full">
          <label class="ere-label" for="ere-qty">{{ t('inventory.forms.common.quantity') }} *</label>
          <InputGroup class="ere-qty-group">
            <InputGroupAddon>#</InputGroupAddon>
            <InputNumber
                id="ere-qty"
                v-model="quantity"
                input-id="ere-qty-in"
                :min="1"
                :use-grouping="false"
                placeholder="—"
                class="ere-qty-input"
            />
          </InputGroup>
          <p class="ere-hint">{{ t('inventory.forms.common.quantityHelpEntry') }}</p>
        </div>

        <div class="ere-field ere-field--full ere-field--max">
          <label class="ere-label" for="ere-origin">{{ t('inventory.forms.enterpriseEntry.origin') }} *</label>
          <Select
              id="ere-origin"
              v-model="originId"
              :options="origins"
              option-label="name"
              option-value="id"
              :placeholder="t('inventory.forms.enterpriseEntry.originPh')"
              class="ere-select"
          />
        </div>

        <div class="ere-split">
          <div class="ere-field">
            <label class="ere-label" for="ere-date">{{ t('inventory.forms.enterpriseEntry.entryDate') }} *</label>
            <input id="ere-date" v-model="entryDate" type="date" class="ere-native" />
          </div>
          <div class="ere-field">
            <label class="ere-label" for="ere-time">{{ t('inventory.forms.enterpriseEntry.entryTime') }} *</label>
            <input id="ere-time" v-model="entryTime" type="time" class="ere-native" />
          </div>
        </div>

        <div class="ere-field ere-field--full">
          <label class="ere-label" for="ere-obs">{{ t('inventory.forms.common.observations') }}</label>
          <Textarea
              id="ere-obs"
              v-model="observations"
              rows="4"
              class="ere-textarea"
              :maxlength="maxObs"
              :placeholder="t('inventory.forms.common.obsPlaceholder')"
          />
          <div class="ere-counter">{{ obsCount }}/{{ maxObs }}</div>
        </div>

        <div v-if="selectedKg && quantity != null" class="ere-preview">
          <div class="ere-preview__title">
            <i class="pi pi-eye" aria-hidden="true" />
            {{ t('inventory.forms.common.previewDynamic') }}
          </div>
          <p class="ere-preview__line">
            {{
              t('inventory.forms.enterpriseEntry.previewLine', {
                kg: selectedKg,
                current: currentStock,
              })
            }}
            →
            <strong>{{ t('inventory.forms.enterpriseEntry.previewArrow') }}</strong>
            <strong class="ere-preview__green">{{ newStock }}</strong>
          </p>
          <p class="ere-preview__foot">
            {{
              t('inventory.forms.enterpriseEntry.previewFooter', {
                qty: quantity,
              })
            }}
          </p>
        </div>

        <div class="ere-actions">
          <Button
              :label="t('inventory.forms.common.clearForm')"
              icon="pi pi-replay"
              severity="secondary"
              outlined
              type="button"
              class="ere-btn-secondary"
              @click="resetForm"
          />
          <Button
              :label="t('inventory.forms.common.saveEntry')"
              icon="pi pi-save"
              type="button"
              class="ere-btn-primary"
              @click="saveEntry"
          />
        </div>
      </div>
    </template>
  </Card>
</template>

<style scoped>
.ere-card :deep(.p-card-body) {
  padding-top: 0.25rem;
}

.ere-head {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
}

.ere-head__icon {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--regula-orange) 18%, var(--regula-white));
  color: var(--regula-orange);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
  flex-shrink: 0;
}

.ere-head__title {
  font-weight: 700;
  font-size: var(--regula-type-h3-size);
  color: var(--regula-navy);
}

.ere-head__sub {
  font-size: var(--regula-type-small-size);
  color: var(--regula-text-muted);
  margin-top: 0.15rem;
}

.ere-grid {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.ere-field--full {
  width: 100%;
}

.ere-field--max :deep(.p-select),
.ere-field--max :deep(.p-inputtext) {
  width: 100%;
}

.ere-label {
  display: block;
  font-weight: 600;
  font-size: var(--regula-type-small-size);
  margin-bottom: 0.45rem;
  color: var(--regula-navy);
}

.ere-hint {
  margin: 0.35rem 0 0;
  font-size: var(--regula-type-caption-size);
  color: var(--regula-text-muted);
}

.ere-split {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.ere-native {
  width: 100%;
  min-height: 44px;
  border-radius: var(--regula-radius-btn);
  border: 1px solid var(--regula-steel);
  padding: 0.5rem 0.65rem;
  font-family: inherit;
  font-size: var(--regula-type-body-size);
}

.ere-native:focus-visible {
  outline: none;
  border-color: var(--regula-orange);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--regula-orange) 25%, transparent);
}

.ere-qty-group :deep(.p-inputnumber-input) {
  width: 100%;
  min-height: 44px;
}

.ere-textarea {
  width: 100%;
}

.ere-counter {
  text-align: right;
  font-size: var(--regula-type-caption-size);
  color: var(--regula-text-muted);
  margin-top: 0.25rem;
}

.ere-preview {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: var(--regula-radius-card);
  padding: 1rem 1.15rem;
}

.ere-preview__title {
  font-weight: 700;
  color: var(--regula-navy);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.ere-preview__line {
  margin: 0;
  font-size: var(--regula-type-small-size);
  color: var(--regula-gray-mid);
  line-height: 1.55;
}

.ere-preview__green {
  color: #15803d;
  margin-left: 0.25rem;
}

.ere-preview__foot {
  margin: 0.5rem 0 0;
  font-size: var(--regula-type-small-size);
  color: #2563eb;
  font-weight: 600;
}

.ere-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: flex-end;
}

.ere-btn-secondary :deep(.p-button) {
  border-radius: var(--regula-radius-btn);
  min-height: 44px;
}

.ere-btn-primary :deep(.p-button) {
  background: var(--regula-orange);
  border-color: var(--regula-orange);
  border-radius: var(--regula-radius-btn);
  min-height: 44px;
  font-weight: 700;
}

@media (max-width: 639px) {
  .ere-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .ere-actions :deep(.p-button) {
    width: 100%;
    justify-content: center;
  }
}
</style>
