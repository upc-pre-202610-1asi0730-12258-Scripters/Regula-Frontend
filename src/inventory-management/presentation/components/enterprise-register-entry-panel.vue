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
const providerName = ref('')
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

const currentStock = computed(() =>
    selectedKg.value ? companyStockByCylinderKey.value[selectedKg.value] ?? null : null,
)

const newStock = computed(() => {
  if (currentStock.value == null || quantity.value == null) {
    return null
  }
  return Number(currentStock.value) + Number(quantity.value)
})

function resetForm() {
  selectedKg.value = null
  quantity.value = null
  providerName.value = ''
  destination.value = ''
  movementReason.value = ''
  observation.value = ''
}

function saveEntry() {}
</script>

<template>
  <Card>
    <template #title>{{ t('inventory.forms.enterpriseEntry.title') }}</template>
    <template #content>
      <form class="inv-form" @submit.prevent="saveEntry">
        <div class="inv-field">
          <label class="inv-label">{{ t('inventory.forms.common.cylinderType') }}</label>
          <CylinderTypePicker v-model="selectedKg" :options="weightOptions" />
        </div>

        <div class="inv-field">
          <label class="inv-label" for="ere-qty">{{ t('inventory.forms.common.quantity') }}</label>
          <InputNumber id="ere-qty" v-model="quantity" :min="1" :use-grouping="false" />
        </div>

        <div class="inv-field">
          <label class="inv-label" for="ere-provider">{{ t('inventory.forms.enterpriseEntry.origin') }}</label>
          <InputText id="ere-provider" v-model="providerName" />
        </div>

        <div class="inv-field">
          <label class="inv-label" for="ere-dest">{{ t('inventory.forms.enterpriseExit.destination') }}</label>
          <InputText id="ere-dest" v-model="destination" />
        </div>

        <div class="inv-field">
          <label class="inv-label" for="ere-reason">{{ t('inventory.forms.enterpriseExit.reasonTitle') }}</label>
          <InputText id="ere-reason" v-model="movementReason" />
        </div>

        <div class="inv-field">
          <label class="inv-label" for="ere-obs">{{ t('inventory.forms.common.observations') }}</label>
          <Textarea id="ere-obs" v-model="observation" rows="3" />
        </div>

        <p v-if="selectedKg && quantity != null" class="inv-preview">
          Stock {{ currentStock }} → {{ newStock }}
        </p>

        <div class="inv-actions">
          <Button :label="t('inventory.forms.common.clearForm')" type="button" severity="secondary" outlined @click="resetForm" />
          <Button :label="t('inventory.forms.common.saveEntry')" type="submit" />
        </div>
      </form>
    </template>
  </Card>
</template>
