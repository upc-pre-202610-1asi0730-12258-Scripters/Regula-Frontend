import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { DeliveryHistoryOutcome } from '@/domain/distribution/delivery-history-outcome'
import type { DeliveryHistoryEntry } from '@/domain/distribution/delivery-history-entry'
import { getDeliveryHistoryUseCase } from '@/infrastructure/composition-root/distribution-wiring'
import { queueDeliveryHistoryExport } from '@/infrastructure/distribution/history-export-adapter'
import { getMockBoardReferenceDay } from '@/infrastructure/distribution/mock-delivery-repository'

export type HistoryOutcomeFilter = 'ALL' | typeof DeliveryHistoryOutcome.Completed | typeof DeliveryHistoryOutcome.NotDelivered

export const useDistributionHistoryStore = defineStore('distribution-history', () => {
  const selectedDay = ref<Date>(new Date(`${getMockBoardReferenceDay()}T12:00:00`))
  const driverRecordId = ref('')
  const outcomeFilter = ref<HistoryOutcomeFilter>('ALL')
  const plateSearch = ref('')
  const entries = ref<readonly DeliveryHistoryEntry[]>([])
  const loading = ref(false)
  const errorKey = ref<string | null>(null)
  const detailEntry = ref<DeliveryHistoryEntry | null>(null)
  const detailVisible = ref(false)

  function toDayIso(d: Date): string {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  const filteredEntries = computed(() => {
    let list = [...entries.value]
    if (outcomeFilter.value === DeliveryHistoryOutcome.Completed) {
      list = list.filter((e) => e.outcome === DeliveryHistoryOutcome.Completed)
    } else if (outcomeFilter.value === DeliveryHistoryOutcome.NotDelivered) {
      list = list.filter((e) => e.outcome === DeliveryHistoryOutcome.NotDelivered)
    }
    return list
  })

  const summaryCompleted = computed(
    () => entries.value.filter((e) => e.outcome === DeliveryHistoryOutcome.Completed).length,
  )
  const summaryNotDelivered = computed(
    () => entries.value.filter((e) => e.outcome === DeliveryHistoryOutcome.NotDelivered).length,
  )

  async function loadHistory() {
    loading.value = true
    errorKey.value = null
    try {
      const result = await getDeliveryHistoryUseCase.execute({
        dayIso: toDayIso(selectedDay.value),
        driverRecordId: driverRecordId.value ? driverRecordId.value : undefined,
        plateSearch: plateSearch.value.trim() || undefined,
      })
      entries.value = result.entries
    } catch {
      errorKey.value = 'common.errorGeneric'
      entries.value = []
    } finally {
      loading.value = false
    }
  }

  async function requestExport(): Promise<void> {
    await queueDeliveryHistoryExport()
  }

  function openDetail(entry: DeliveryHistoryEntry) {
    detailEntry.value = entry
    detailVisible.value = true
  }

  function closeDetail() {
    detailVisible.value = false
  }

  return {
    selectedDay,
    driverRecordId,
    outcomeFilter,
    plateSearch,
    entries,
    filteredEntries,
    summaryCompleted,
    summaryNotDelivered,
    loading,
    errorKey,
    detailEntry,
    detailVisible,
    loadHistory,
    requestExport,
    openDetail,
    closeDetail,
    toDayIso,
  }
})
