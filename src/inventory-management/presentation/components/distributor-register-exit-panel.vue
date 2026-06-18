<script setup>
import useInventoryStore from '@/inventory-management/application/inventory.store.js'
import CylinderTypePicker from '@/inventory-management/presentation/components/cylinder-type-picker.vue'
import Button from 'primevue/button'
import Card from 'primevue/card'
import InputNumber from 'primevue/inputnumber'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useInventoryStore()
const { distributorStockByCylinderKey } = storeToRefs(store)

const selectedKg = ref(null)
const quantity = ref(null)
const outboundType = ref(null)

const weightOptions = computed(() =>
    store.cylinderTypeCatalog.map((item) => ({
        key: item.key,
        title: t(`inventory.forms.weights.kg${item.key}`),
    })),
)

const outboundOptions = computed(() =>
    store.outboundTypeCatalog.map((item) => ({
        key: item.outboundType,
        title: store.getOutboundTypeLabel(item.outboundType),
    })),
)

onMounted(() => {
  if (!store.distributorLoaded) {
    store.fetchDistributorStock()
  }
})

const stockAvailable = computed(() =>
    selectedKg.value ? distributorStockByCylinderKey.value[selectedKg.value] ?? null : null,
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
  outboundType.value = null
}

function saveExit() {}
</script>

<template>
  <Card>
    <template #title>{{ t('inventory.forms.distExit.title') }}</template>
    <template #content>
      <form class="inv-form" @submit.prevent="saveExit">
        <div class="inv-field">
          <label class="inv-label">{{ t('inventory.forms.common.cylinderType') }}</label>
          <CylinderTypePicker v-model="selectedKg" :options="weightOptions" />
        </div>

        <div class="inv-field">
          <label class="inv-label" for="dxe-qty">{{ t('inventory.forms.common.quantity') }}</label>
          <InputNumber id="dxe-qty" v-model="quantity" :min="1" :use-grouping="false" />
        </div>

        <div class="inv-field">
          <span class="inv-label">{{ t('inventory.forms.distExit.exitKindTitle') }}</span>
          <div class="inv-picker">
            <button
                v-for="opt in outboundOptions"
                :key="opt.key"
                type="button"
                class="inv-picker__btn"
                :class="{ 'inv-picker__btn--on': outboundType === opt.key }"
                @click="outboundType = opt.key"
            >
              {{ opt.title }}
            </button>
          </div>
        </div>

        <p v-if="selectedKg && quantity != null && outboundType" class="inv-preview">
          Stock {{ stockAvailable }} → {{ newStock }}
        </p>

        <div class="inv-actions">
          <Button :label="t('inventory.forms.common.clear')" type="button" severity="secondary" outlined @click="resetForm" />
          <Button :label="t('inventory.forms.common.saveExit')" type="submit" />
        </div>
      </form>
    </template>
  </Card>
</template>
