import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { Delivery } from '@/domain/distribution/delivery'
import { getDayDeliveriesBoardUseCase } from '@/infrastructure/composition-root/distribution-wiring'
import { getMockBoardReferenceDay } from '@/infrastructure/distribution/mock-delivery-repository'

export const useDistributionDayBoardStore = defineStore('distribution-day-board', () => {
  const deliveries = ref<readonly Delivery[]>([])
  const loading = ref(false)
  const errorKey = ref<string | null>(null)

  async function loadBoard(dayIso: string = getMockBoardReferenceDay()) {
    loading.value = true
    errorKey.value = null
    try {
      const result = await getDayDeliveriesBoardUseCase.execute(dayIso)
      deliveries.value = result.deliveries
    } catch {
      errorKey.value = 'common.errorGeneric'
      deliveries.value = []
    } finally {
      loading.value = false
    }
  }

  return {
    deliveries,
    loading,
    errorKey,
    loadBoard,
  }
})
