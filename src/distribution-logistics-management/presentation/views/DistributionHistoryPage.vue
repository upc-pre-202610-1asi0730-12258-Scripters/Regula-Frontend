<script setup lang="ts">
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import DatePicker from 'primevue/datepicker'
import Dropdown from 'primevue/dropdown'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import Tag from 'primevue/tag'
import { useToast } from 'primevue/usetoast'
import { storeToRefs } from 'pinia'
import { computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { DeliveryHistoryOutcome } from '@/domain/distribution/delivery-history-outcome'
import { VehicleType } from '@/domain/distribution/vehicle-type'
import DeliveryHistoryDetailDrawer from '@/distribution-logistics-management/presentation/components/distribution/history/DeliveryHistoryDetailDrawer.vue'
import { useUiDateFormatter } from '@/presentation/composables/use-ui-date-formatter'
import type { HistoryOutcomeFilter } from '@/distribution-logistics-management/presentation/stores/use-distribution-history-store'
import { useDistributionHistoryStore } from '@/distribution-logistics-management/presentation/stores/use-distribution-history-store'

const { t } = useI18n()
const toast = useToast()
const { formatIsoDate } = useUiDateFormatter()
const store = useDistributionHistoryStore()
const {
  selectedDay,
  driverRecordId,
  outcomeFilter,
  plateSearch,
  filteredEntries,
  loading,
  errorKey,
  summaryCompleted,
  summaryNotDelivered,
  detailVisible,
  detailEntry,
} = storeToRefs(store)

const driverOptions = computed(() => [
  { label: t('distribution.history.filtersDriver'), value: '' },
  { label: t('distribution.mock.driver.juanLopez'), value: 'drv-1' },
  { label: t('distribution.mock.driver.pedroSalas'), value: 'drv-2' },
])

const statusOptions = computed(() => [
  { label: t('distribution.history.statusFilterAll'), value: 'ALL' as HistoryOutcomeFilter },
  { label: t('distribution.history.statusFilterCompleted'), value: DeliveryHistoryOutcome.Completed },
  { label: t('distribution.history.statusFilterNotDelivered'), value: DeliveryHistoryOutcome.NotDelivered },
])

onMounted(() => {
  void store.loadHistory()
})

watch([selectedDay, driverRecordId, plateSearch], () => {
  void store.loadHistory()
})

function vehicleIcon(vt: string) {
  return vt === VehicleType.Van ? 'pi pi-car' : 'pi pi-bolt'
}

function outcomeSeverity(outcome: string) {
  return outcome === DeliveryHistoryOutcome.Completed ? 'success' : 'danger'
}

function outcomeLabelKey(outcome: string) {
  return outcome === DeliveryHistoryOutcome.Completed
    ? 'distribution.history.outcomeCompleted'
    : 'distribution.history.outcomeNotDelivered'
}

function deltaSign(delta: number) {
  return delta > 0 ? '+' : ''
}

async function onExport() {
  await store.requestExport()
  toast.add({
    severity: 'success',
    summary: t('distribution.history.export'),
    detail: t('distribution.history.exportQueued'),
    life: 3500,
  })
}
</script>

<template>
  <div class="history">
    <div class="history__toolbar">
      <div class="history__filters">
        <DatePicker
          v-model="selectedDay"
          show-icon
          fluid
          date-format="dd/mm/yy"
          :aria-label="t('distribution.history.filtersDate')"
        />
        <Dropdown
          v-model="driverRecordId"
          :options="driverOptions"
          option-label="label"
          option-value="value"
          :placeholder="t('distribution.history.filtersDriver')"
          class="history__dropdown"
          :aria-label="t('distribution.history.filtersDriver')"
        />
        <Dropdown
          v-model="outcomeFilter"
          :options="statusOptions"
          option-label="label"
          option-value="value"
          :placeholder="t('distribution.history.filtersStatus')"
          class="history__dropdown"
          :aria-label="t('distribution.history.filtersStatus')"
        />
        <IconField class="history__search">
          <InputIcon class="pi pi-search" />
          <InputText
            v-model="plateSearch"
            type="search"
            :placeholder="t('distribution.history.searchPlatePlaceholder')"
            :aria-label="t('distribution.history.searchPlatePlaceholder')"
          />
        </IconField>
      </div>
      <Button
        type="button"
        icon="pi pi-download"
        :label="t('distribution.history.export')"
        class="history__export"
        @click="onExport"
      />
    </div>

    <div class="history__badges" role="status">
      <Tag severity="success" rounded>
        {{ t('distribution.history.summaryCompleted', { count: summaryCompleted }) }}
      </Tag>
      <Tag severity="danger" rounded>
        {{ t('distribution.history.summaryNotDelivered', { count: summaryNotDelivered }) }}
      </Tag>
    </div>

    <Message v-if="errorKey" severity="error" class="history__msg" :closable="false">
      {{ t(errorKey) }}
    </Message>

    <DataTable
      :value="filteredEntries"
      data-key="id"
      :loading="loading"
      responsive-layout="scroll"
      class="history__table"
    >
      <template #empty>
        <div class="history__empty">
          <i class="pi pi-inbox" aria-hidden="true" />
          <p>{{ t('distribution.history.tableEmpty') }}</p>
        </div>
      </template>
      <Column field="humanCode" :header="t('distribution.history.tableId')" />
      <Column field="dateIso" :header="t('distribution.history.tableDate')">
        <template #body="{ data }">
          {{ formatIsoDate(data.dateIso as string) }}
        </template>
      </Column>
      <Column :header="t('distribution.history.tableDriverVehicle')">
        <template #body="{ data }">
          <div class="cell-driver">
            <div class="cell-driver__avatar" aria-hidden="true">{{ data.driverInitials }}</div>
            <div>
              <div class="cell-driver__name">
                {{ t(data.driverDisplayKey, data.driverDisplayParams ?? {}) }}
                <Tag v-if="data.isOwnerOperator" severity="secondary" class="cell-driver__tag" rounded>
                  {{ t('common.ownerTag') }}
                </Tag>
              </div>
              <div class="cell-driver__sub">
                <i :class="['pi', vehicleIcon(data.vehicleType)]" aria-hidden="true" />
                {{ data.vehiclePlate }}
              </div>
            </div>
          </div>
        </template>
      </Column>
      <Column :header="t('distribution.history.tableLoad')">
        <template #body="{ data }">
          <span class="cell-load">
            <i class="pi pi-database" aria-hidden="true" />
            {{ t(data.loadDescriptionKey, data.loadDescriptionParams ?? {}) }}
          </span>
        </template>
      </Column>
      <Column :header="t('distribution.history.tableDestinationStatus')">
        <template #body="{ data }">
          <div class="cell-dest">
            <div>{{ t(data.destinationLineKey, data.destinationLineParams ?? {}) }}</div>
            <Tag :severity="outcomeSeverity(data.outcome)" rounded>
              {{ t(outcomeLabelKey(data.outcome)) }}
            </Tag>
          </div>
        </template>
      </Column>
      <Column field="etaLocalTime" :header="t('distribution.history.tableEta')" />
      <Column :header="t('distribution.history.tableActual')">
        <template #body="{ data }">
          <span
            :class="{
              'cell-time--early': data.deltaMinutes < 0,
              'cell-time--late': data.deltaMinutes > 0,
            }"
          >
            {{ data.actualLocalTime }}
            {{
              t('distribution.history.deltaMinutes', {
                sign: deltaSign(data.deltaMinutes),
                minutes: Math.abs(data.deltaMinutes),
              })
            }}
          </span>
        </template>
      </Column>
      <Column :header="t('common.actions')">
        <template #body="{ data }">
          <Button
            icon="pi pi-arrow-right"
            rounded
            text
            type="button"
            :aria-label="t('common.openDetails')"
            @click="store.openDetail(data)"
          />
        </template>
      </Column>
    </DataTable>

    <DeliveryHistoryDetailDrawer v-model:visible="detailVisible" :entry="detailEntry" />
  </div>
</template>

<style scoped>
.history {
  display: flex;
  flex-direction: column;
  gap: var(--regula-space-6);
}

.history__toolbar {
  display: flex;
  flex-direction: column;
  gap: var(--regula-space-3);
}

@media (min-width: 40rem) {
  .history__toolbar {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }
}

.history__filters {
  display: flex;
  flex-direction: column;
  gap: var(--regula-space-3);
  flex: 1;
}

@media (min-width: 40rem) {
  .history__filters {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-end;
  }
}

.history__dropdown {
  min-width: 12rem;
}

.history__search {
  min-width: 12rem;
}

.history__export {
  align-self: flex-start;
}

@media (min-width: 40rem) {
  .history__export {
    align-self: center;
  }
}

.history__badges {
  display: flex;
  flex-wrap: wrap;
  gap: var(--regula-space-2);
}

.history__msg {
  width: 100%;
}

.history__table {
  background: var(--regula-app-card);
  border-radius: var(--regula-radius-lg);
  overflow: hidden;
}

.history__empty {
  text-align: center;
  padding: var(--regula-space-6);
  color: var(--regula-app-text-muted);
}

.history__empty .pi {
  font-size: 2rem;
  margin-bottom: var(--regula-space-2);
}

.cell-driver {
  display: flex;
  align-items: center;
  gap: var(--regula-space-3);
}

.cell-driver__avatar {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 999px;
  background: var(--regula-color-bg-ice);
  color: var(--regula-color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--regula-font-size-xs);
  font-weight: 700;
}

.cell-driver__name {
  font-weight: 600;
  font-size: var(--regula-font-size-sm);
  display: flex;
  align-items: center;
  gap: var(--regula-space-2);
  flex-wrap: wrap;
}

.cell-driver__tag {
  font-size: 0.65rem;
}

.cell-driver__sub {
  font-size: var(--regula-font-size-xs);
  color: var(--regula-app-text-muted);
  display: flex;
  align-items: center;
  gap: var(--regula-space-2);
}

.cell-load {
  display: inline-flex;
  align-items: center;
  gap: var(--regula-space-2);
  font-size: var(--regula-font-size-sm);
}

.cell-dest {
  display: flex;
  flex-direction: column;
  gap: var(--regula-space-2);
  font-size: var(--regula-font-size-sm);
}

.cell-time--early {
  color: var(--regula-color-success);
  font-weight: 600;
}

.cell-time--late {
  color: var(--regula-color-warning);
  font-weight: 600;
}
</style>
