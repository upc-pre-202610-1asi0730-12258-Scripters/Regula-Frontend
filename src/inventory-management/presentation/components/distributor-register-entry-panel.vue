<script setup>
import CylinderTypePicker from '@/inventory-management/presentation/components/cylinder-type-picker.vue'
import { InventoryApi } from '@/inventory-management/infrastructure/inventory-api.js'
import { pickWeightsMap } from '@/inventory-management/infrastructure/movement-reference.helper.js'
import Button from 'primevue/button'
import Card from 'primevue/card'
import InputNumber from 'primevue/inputnumber'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import Select from 'primevue/select'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const api = new InventoryApi()

const selectedKg = ref(null)
const quantity = ref(null)
const providerId = ref(null)
const providers = ref([])
const weightsMap = ref({})

const weightOptions = computed(() => [
  { key: '5', title: t('inventory.forms.weights.kg5'), subtitle: t('inventory.forms.weights.domestic') },
  { key: '10', title: t('inventory.forms.weights.kg10'), subtitle: t('inventory.forms.weights.standard') },
  { key: '15', title: t('inventory.forms.weights.kg15'), subtitle: t('inventory.forms.weights.commercial') },
  { key: '45', title: t('inventory.forms.weights.kg45'), subtitle: t('inventory.forms.weights.industrial') },
])

onMounted(async () => {
  try {
    const [pRes, mRes] = await Promise.all([api.getProviders(), api.getStockKgMaps()])
    providers.value = pRes.data || []
    weightsMap.value = pickWeightsMap(mRes.data, 'distributorEntry')
    if (!providerId.value && providers.value.length) {
      providerId.value = providers.value[0].id
    }
  } catch {
    providers.value = []
  }
})

const selectedLabel = computed(() => {
  const opt = weightOptions.value.find((w) => w.key === selectedKg.value)
  return opt ? `${opt.title} (${opt.subtitle})` : '—'
})

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

const providerName = computed(() => {
  const p = providers.value.find((x) => x.id === providerId.value)
  return p?.name || '—'
})

function resetForm() {
  selectedKg.value = null
  quantity.value = null
  if (providers.value.length) {
    providerId.value = providers.value[0].id
  }
}

function saveEntry() {}
</script>

<template>
  <Card class="dre-card">
    <template #header>
      <div class="dre-head">
        <span class="dre-head__ico">
          <i class="pi pi-question-circle" aria-hidden="true" />
        </span>
        <div>
          <div class="dre-head__title">{{ t('inventory.forms.distEntry.title') }}</div>
          <div class="dre-head__sub">{{ t('inventory.forms.distEntry.subtitle') }}</div>
        </div>
      </div>
    </template>
    <template #content>
      <div class="dre-body">
        <div class="dre-field">
          <label class="dre-label">{{ t('inventory.forms.common.cylinderType') }} *</label>
          <CylinderTypePicker v-model="selectedKg" variant="dist-cards" :options="weightOptions" />
        </div>

        <div class="dre-field">
          <label class="dre-label" for="dre-qty">{{ t('inventory.forms.common.quantity') }} *</label>
          <InputGroup>
            <InputGroupAddon>#</InputGroupAddon>
            <InputNumber
                id="dre-qty"
                v-model="quantity"
                :min="1"
                :use-grouping="false"
                placeholder="—"
                class="dre-qty"
            />
          </InputGroup>
          <p class="dre-hint">{{ t('inventory.forms.common.quantityHelpEntryDist') }}</p>
        </div>

        <div class="dre-field dre-field--full">
          <label class="dre-label" for="dre-prov">{{ t('inventory.forms.distEntry.provider') }} *</label>
          <Select
              id="dre-prov"
              v-model="providerId"
              :options="providers"
              option-label="name"
              option-value="id"
              :placeholder="t('inventory.forms.distEntry.providerPh')"
              class="dre-select"
          />
        </div>

        <div v-if="selectedKg && quantity != null" class="dre-preview">
          <div class="dre-preview__title">
            <i class="pi pi-eye" aria-hidden="true" />
            {{ t('inventory.forms.common.impactPreview') }}
          </div>
          <p class="dre-preview__row">
            <span>{{ t('inventory.forms.distEntry.selectedType') }}</span>
            <span class="dre-pill">{{ selectedLabel }}</span>
          </p>
          <p class="dre-preview__row">
            <span>{{ t('inventory.forms.distEntry.qtyIncoming') }}</span>
            <strong>+{{ quantity }} {{ t('inventory.forms.distEntry.units') }}</strong>
          </p>
          <div class="dre-flow">
            <div class="dre-box">
              <div class="dre-box__k">{{ t('inventory.forms.distEntry.stockNow') }}</div>
              <div class="dre-box__v">{{ currentStock }}</div>
            </div>
            <span class="dre-arrow">→</span>
            <div class="dre-box dre-box--new">
              <div class="dre-box__k">{{ t('inventory.forms.distEntry.stockNew') }}</div>
              <div class="dre-box__v">{{ newStock }}</div>
            </div>
          </div>
          <p class="dre-prov-line">
            <i class="pi pi-building" aria-hidden="true" />
            {{ t('inventory.forms.distEntry.providerLabel') }}
            <strong>{{ providerName }}</strong>
          </p>
        </div>

        <div class="dre-actions">
          <Button
              :label="t('inventory.forms.common.clear')"
              icon="pi pi-times"
              severity="secondary"
              outlined
              type="button"
              class="dre-clear"
              @click="resetForm"
          />
          <Button
              :label="t('inventory.forms.common.saveEntry')"
              icon="pi pi-lock"
              type="button"
              class="dre-save"
              @click="saveEntry"
          />
        </div>

        <p class="dre-foot">
          <i class="pi pi-lock" aria-hidden="true" />
          {{ t('inventory.forms.common.footerLockEntry') }}
        </p>
      </div>
    </template>
  </Card>
</template>

<style scoped>
.dre-head {
  background: var(--regula-navy);
  color: var(--regula-white);
  padding: 1.15rem 1.25rem;
  border-radius: var(--regula-radius-card) var(--regula-radius-card) 0 0;
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

.dre-head__ico {
  font-size: 1.5rem;
  opacity: 0.95;
}

.dre-head__title {
  font-weight: 700;
  font-size: var(--regula-type-h3-size);
}

.dre-head__sub {
  font-size: var(--regula-type-small-size);
  opacity: 0.92;
  margin-top: 0.25rem;
}

.dre-body {
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.dre-field--full :deep(.p-select) {
  width: 100%;
}

.dre-label {
  font-weight: 600;
  font-size: var(--regula-type-small-size);
  display: block;
  margin-bottom: 0.45rem;
  color: var(--regula-navy);
}

.dre-hint {
  margin: 0.35rem 0 0;
  font-size: var(--regula-type-caption-size);
  color: var(--regula-text-muted);
}

.dre-qty :deep(.p-inputnumber-input) {
  width: 100%;
  min-height: 44px;
}

.dre-preview {
  background: #ecfdf5;
  border: 1px solid #6ee7b7;
  border-radius: var(--regula-radius-card);
  padding: 1rem;
}

.dre-preview__title {
  font-weight: 700;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  color: var(--regula-navy);
  margin-bottom: 0.65rem;
}

.dre-preview__row {
  margin: 0 0 0.35rem;
  font-size: var(--regula-type-small-size);
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  align-items: center;
}

.dre-pill {
  background: #fef08a;
  color: #713f12;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  font-weight: 700;
  font-size: var(--regula-type-caption-size);
}

.dre-flow {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-wrap: wrap;
  margin: 0.75rem 0;
}

.dre-box {
  flex: 1 1 120px;
  background: var(--regula-white);
  border: 1px solid var(--regula-gray-light);
  border-radius: var(--regula-radius-btn);
  padding: 0.65rem;
  text-align: center;
}

.dre-box--new {
  border-color: #22c55e;
  box-shadow: 0 0 0 1px color-mix(in srgb, #22c55e 35%, transparent);
}

.dre-box__k {
  font-size: var(--regula-type-caption-size);
  color: var(--regula-text-muted);
}

.dre-box__v {
  font-weight: 800;
  font-size: var(--regula-type-h3-size);
  color: var(--regula-navy);
}

.dre-arrow {
  font-weight: 800;
  color: var(--regula-text-muted);
}

.dre-prov-line {
  margin: 0;
  font-size: var(--regula-type-small-size);
  color: var(--regula-gray-mid);
  display: flex;
  align-items: center;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.dre-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: flex-end;
}

.dre-clear :deep(.p-button),
.dre-save :deep(.p-button) {
  min-height: 44px;
  border-radius: var(--regula-radius-btn);
}

.dre-save :deep(.p-button) {
  background: var(--regula-orange);
  border-color: var(--regula-orange);
  font-weight: 700;
}

.dre-foot {
  margin: 0;
  font-size: var(--regula-type-caption-size);
  color: var(--regula-text-muted);
  display: flex;
  gap: 0.35rem;
  align-items: flex-start;
}

@media (max-width: 639px) {
  .dre-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .dre-actions :deep(.p-button) {
    width: 100%;
    justify-content: center;
  }
}
</style>
