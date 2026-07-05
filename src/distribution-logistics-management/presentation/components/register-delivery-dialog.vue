<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useDistributionStore } from '@/distribution-logistics-management/application/distribution.store.js'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import { useToast } from 'primevue/usetoast'

const { t } = useI18n()
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:visible'])

const store = useDistributionStore()
const toast = useToast()
const { responsibles, vehicles } = storeToRefs(store)
const attemptedSubmit = ref(false)

function defaultScheduledTime() {
  const now = new Date()
  now.setSeconds(0, 0)
  // yyyy-MM-ddTHH:mm, el formato que espera <input type="datetime-local">
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
}

const form = reactive({
  responsibleId: null,
  vehicleId: null,
  itemCount: 1,
  cargo: '',
  destination: '',
  scheduledTime: defaultScheduledTime(),
})

onMounted(() => {
  store.fetchCatalogs()
})

const vehicleOptions = computed(() =>
    vehicles.value.map(v => ({ id: v.id, label: `${v.plate} · ${v.type} (${v.brand})` }))
)

const internalVisible = computed({
  get() {
    return props.visible
  },
  set(value) {
    emit('update:visible', value)
  },
})

const canSave = computed(() =>
    form.responsibleId &&
    form.vehicleId &&
    Number(form.itemCount) > 0 &&
    form.cargo.trim().length > 0 &&
    form.destination.trim().length > 0 &&
    form.scheduledTime
)

function resetForm() {
  form.responsibleId = null
  form.vehicleId = null
  form.itemCount = 1
  form.cargo = ''
  form.destination = ''
  form.scheduledTime = defaultScheduledTime()
  attemptedSubmit.value = false
}

function closeDialog() {
  internalVisible.value = false
  resetForm()
}

function saveDelivery() {
  attemptedSubmit.value = true
  if (!canSave.value) return

  store.createDelivery({
    responsibleId: form.responsibleId,
    vehicleId: form.vehicleId,
    itemCount: form.itemCount,
    cargo: form.cargo.trim(),
    destination: form.destination.trim(),
    // datetime-local no trae segundos/zona: se manda tal cual, el backend lo parsea como DateTime.
    scheduledTime: form.scheduledTime,
  })
      .then(() => {
        toast.add({
          severity: 'success',
          summary: 'Entrega registrada',
          detail: `${form.cargo} · ${form.destination}`,
          life: 3500,
        })
        closeDialog()
      })
      .catch((error) => {
        toast.add({
          severity: 'error',
          summary: 'No se pudo registrar la entrega',
          detail: error.response?.data?.error || error.response?.data?.detail || error.message,
          life: 4500,
        })
      })
}
</script>

<template>
  <Dialog
      v-model:visible="internalVisible"
      modal
      :header="t('distribution.registerDialog.title')"
      class="rd-dialog"
      :style="{ width: '480px' }"
      :breakpoints="{ '640px': '94vw' }"
  >
    <div class="rd-body">
      <div class="rd-field">
        <label class="rd-label" for="rd-responsible">{{ t('distribution.registerDialog.responsible') }}</label>
        <Select
            id="rd-responsible"
            v-model="form.responsibleId"
            :options="responsibles"
            option-label="name"
            option-value="id"
            :placeholder="t('distribution.registerDialog.responsiblePlaceholder')"
            class="rd-select"
            :class="{ 'p-invalid': attemptedSubmit && !form.responsibleId }"
        />
        <p class="rd-hint">{{ t('distribution.registerDialog.responsibleHint') }}</p>
      </div>

      <div class="rd-field">
        <label class="rd-label" for="rd-vehicle">{{ t('distribution.registerDialog.vehicle') }}</label>
        <Select
            id="rd-vehicle"
            v-model="form.vehicleId"
            :options="vehicleOptions"
            option-label="label"
            option-value="id"
            :placeholder="t('distribution.registerDialog.vehiclePlaceholder')"
            class="rd-select"
            :class="{ 'p-invalid': attemptedSubmit && !form.vehicleId }"
        />
      </div>

      <div class="rd-field rd-field--split">
        <div>
          <label class="rd-label" for="rd-qty">{{ t('distribution.registerDialog.quantity') }}</label>
          <InputNumber id="rd-qty" v-model="form.itemCount" :min="1" :use-grouping="false" class="rd-qty" />
        </div>
        <div>
          <label class="rd-label" for="rd-time">{{ t('distribution.registerDialog.scheduledTime') }}</label>
          <input id="rd-time" v-model="form.scheduledTime" type="datetime-local" class="rd-date" />
        </div>
      </div>

      <div class="rd-field">
        <label class="rd-label" for="rd-cargo">{{ t('distribution.registerDialog.cargo') }}</label>
        <InputText
            id="rd-cargo"
            v-model="form.cargo"
            :placeholder="t('distribution.registerDialog.cargoPlaceholder')"
            class="rd-input"
            :class="{ 'p-invalid': attemptedSubmit && !form.cargo.trim() }"
        />
      </div>

      <div class="rd-field">
        <label class="rd-label" for="rd-dest">{{ t('distribution.registerDialog.destination') }}</label>
        <InputText
            id="rd-dest"
            v-model="form.destination"
            :placeholder="t('distribution.registerDialog.destinationPlaceholder')"
            class="rd-input"
            :class="{ 'p-invalid': attemptedSubmit && !form.destination.trim() }"
        />
      </div>

      <p v-if="attemptedSubmit && !canSave" class="rd-error">
        {{ t('distribution.registerDialog.validationError') }}
      </p>
    </div>

    <template #footer>
      <div class="rd-actions">
        <Button :label="t('distribution.registerDialog.cancel')" severity="secondary" outlined type="button" @click="closeDialog" />
        <Button
            :label="t('distribution.registerDialog.submit')"
            icon="pi pi-plus"
            type="button"
            class="rd-save"
            :loading="store.creating"
            @click="saveDelivery"
        />
      </div>
    </template>
  </Dialog>
</template>

<style scoped>
.rd-body {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.rd-field--split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.rd-label {
  display: block;
  font-weight: 600;
  font-size: 0.85rem;
  margin-bottom: 0.4rem;
  color: var(--regula-navy, #172d40);
}

.rd-hint {
  margin: 0.3rem 0 0;
  font-size: 0.75rem;
  color: var(--regula-text-muted, #a5b1bf);
}

.rd-select,
.rd-input {
  width: 100%;
}

.rd-qty {
  width: 100%;
}

.rd-qty :deep(.p-inputnumber-input) {
  width: 100%;
  min-height: 44px;
}

.rd-date {
  width: 100%;
  min-height: 44px;
  border: 1px solid var(--regula-gray-light, #e8ecf0);
  border-radius: var(--regula-radius-btn, 8px);
  padding: 0 0.75rem;
  font-family: inherit;
  font-size: 0.9rem;
}

.rd-error {
  color: #dc2626;
  font-size: 0.8rem;
  margin: 0;
}

.rd-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  width: 100%;
}

.rd-save :deep(.p-button) {
  background: var(--regula-orange, #f26e22);
  border-color: var(--regula-orange, #f26e22);
}

@media (max-width: 480px) {
  .rd-field--split {
    grid-template-columns: 1fr;
  }
}
</style>
