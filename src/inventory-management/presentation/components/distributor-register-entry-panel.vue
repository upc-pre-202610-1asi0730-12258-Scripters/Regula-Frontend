<script setup>
import useInventoryStore from '@/inventory-management/application/inventory.store.js'
import CylinderTypePicker from '@/inventory-management/presentation/components/cylinder-type-picker.vue'
import Button from 'primevue/button'
import Card from 'primevue/card'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useInventoryStore()
const { distributorStockByCylinderKey } = storeToRefs(store)

const selectedKg = ref(null)
const quantity = ref(null)
const providerName = ref('')

const weightOptions = computed(() =>
    store.cylinderTypeCatalog.map((item) => ({
        key: item.key,
        title: t(`inventory.forms.weights.kg${item.key}`),
    })),
)

onMounted(() => {
  if (!store.distributorLoaded) {
    store.fetchDistributorStock()
  }
})

const currentStock = computed(() =>
    selectedKg.value ? distributorStockByCylinderKey.value[selectedKg.value] ?? null : null,
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
}

function saveEntry() {}
</script>

<template>
  <Card>
    <template #title>{{ t('inventory.forms.distEntry.title') }}</template>
    <template #content>
      <form class="inv-form" @submit.prevent="saveEntry">
        <div class="inv-field">
          <label class="inv-label">{{ t('inventory.forms.common.cylinderType') }}</label>
          <CylinderTypePicker v-model="selectedKg" :options="weightOptions" />
        </div>

        <div class="inv-field">
          <label class="inv-label" for="dre-qty">{{ t('inventory.forms.common.quantity') }}</label>
          <InputNumber id="dre-qty" v-model="quantity" :min="1" :use-grouping="false" />
        </div>

        <div class="inv-field">
          <label class="inv-label" for="dre-prov">{{ t('inventory.forms.distEntry.provider') }}</label>
          <InputText id="dre-prov" v-model="providerName" />
        </div>

        <p v-if="selectedKg && quantity != null" class="inv-preview">
          Stock {{ currentStock }} → {{ newStock }} · {{ providerName || '—' }}
        </p>

        <div class="inv-actions">
          <Button :label="t('inventory.forms.common.clear')" type="button" severity="secondary" outlined @click="resetForm" />
          <Button :label="t('inventory.forms.common.saveEntry')" type="submit" />
        </div>
      </form>
    </template>
  </Card>
</template>
