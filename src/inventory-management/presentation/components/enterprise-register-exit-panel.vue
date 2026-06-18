<script setup>
import useInventoryStore from '@/inventory-management/application/inventory.store.js'
import CylinderTypePicker from '@/inventory-management/presentation/components/cylinder-type-picker.vue'
import Button from 'primevue/button'
import Card from 'primevue/card'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useInventoryStore()
const { companyStockByCylinderKey } = storeToRefs(store)

const selectedKg = ref(null)
const quantity = ref(null)
const destination = ref('')
const movementReason = ref('')
const observation = ref('')

const weightOptions = computed(() =>
    store.cylinderTypeCatalog.map((item) => ({
        key: item.key,
        title: t(`inventory.forms.weights.kg${item.key}`),
    })),
)

onMounted(() => {
  if (!store.enterpriseLoaded) {
    store.fetchEnterpriseStock()
  }
})

const stockAvailable = computed(() =>
    selectedKg.value ? companyStockByCylinderKey.value[selectedKg.value] ?? null : null,
)

const insufficient = computed(() =>
    stockAvailable.value != null && quantity.value != null && Number(quantity.value) > Number(stockAvailable.value),
)

const newStock = computed(() => {
  if (stockAvailable.value == null || quantity.value == null) {
    return null
  }
  return Math.max(0, Number(stockAvailable.value) - Number(quantity.value))
})

function resetForm() {
  selectedKg.value = null
  quantity.value = null
  destination.value = ''
  movementReason.value = ''
  observation.value = ''
}

function saveExit() {}
</script>

<template>
  <Card>
    <template #title>{{ t('inventory.forms.enterpriseExit.title') }}</template>
    <template #content>
      <form class="inv-form" @submit.prevent="saveExit">
        <div class="inv-field">
          <label class="inv-label">{{ t('inventory.forms.common.cylinderType') }}</label>
          <CylinderTypePicker v-model="selectedKg" :options="weightOptions" />
        </div>

        <div class="inv-field">
          <label class="inv-label" for="exe-qty">{{ t('inventory.forms.common.quantity') }}</label>
          <InputNumber id="exe-qty" v-model="quantity" :min="1" :use-grouping="false" />
          <p v-if="insufficient" class="inv-hint">{{ t('inventory.forms.enterpriseExit.stockInsufficient', { n: stockAvailable, kg: selectedKg }) }}</p>
        </div>

        <div class="inv-field">
          <label class="inv-label" for="exe-dest">{{ t('inventory.forms.enterpriseExit.destination') }}</label>
          <InputText id="exe-dest" v-model="destination" />
        </div>

        <div class="inv-field">
          <label class="inv-label" for="exe-reason">{{ t('inventory.forms.enterpriseExit.reasonTitle') }}</label>
          <InputText id="exe-reason" v-model="movementReason" />
        </div>

        <div class="inv-field">
          <label class="inv-label" for="exe-obs">{{ t('inventory.forms.common.observations') }}</label>
          <Textarea id="exe-obs" v-model="observation" rows="3" />
        </div>

        <p v-if="selectedKg && quantity != null && !insufficient" class="inv-preview">
          Stock {{ stockAvailable }} → {{ newStock }}
        </p>

        <div class="inv-actions">
          <Button :label="t('inventory.forms.common.clearForm')" type="button" severity="secondary" outlined @click="resetForm" />
          <Button :label="t('inventory.forms.common.saveExit')" type="submit" />
        </div>
      </form>
    </template>
  </Card>
</template>
