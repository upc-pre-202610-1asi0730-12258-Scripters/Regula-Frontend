import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { LiveDriverLocation } from '@/domain/distribution/live-driver-location'
import { getLiveDriversUseCase } from '@/infrastructure/composition-root/distribution-wiring'

const REFRESH_SECONDS = 30

export const useDistributionLiveMapStore = defineStore('distribution-live-map', () => {
  const drivers = ref<readonly LiveDriverLocation[]>([])
  const loading = ref(false)
  const errorKey = ref<string | null>(null)
  const secondsUntilRefresh = ref(REFRESH_SECONDS)
  const selectedDriverId = ref<string | null>(null)

  let timer: ReturnType<typeof setInterval> | null = null

  function stopTicker() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  function startTicker() {
    stopTicker()
    secondsUntilRefresh.value = REFRESH_SECONDS
    timer = setInterval(() => {
      if (secondsUntilRefresh.value <= 1) {
        void loadDrivers()
        secondsUntilRefresh.value = REFRESH_SECONDS
      } else {
        secondsUntilRefresh.value -= 1
      }
    }, 1000)
  }

  async function loadDrivers() {
    loading.value = true
    errorKey.value = null
    try {
      const result = await getLiveDriversUseCase.execute()
      drivers.value = result.drivers
      if (!selectedDriverId.value && result.drivers[0]) {
        selectedDriverId.value = result.drivers[0].driverId
      }
    } catch {
      errorKey.value = 'common.errorGeneric'
      drivers.value = []
    } finally {
      loading.value = false
    }
  }

  async function startLiveSession() {
    await loadDrivers()
    startTicker()
  }

  function stopLiveSession() {
    stopTicker()
  }

  return {
    drivers,
    loading,
    errorKey,
    secondsUntilRefresh,
    selectedDriverId,
    loadDrivers,
    startLiveSession,
    stopLiveSession,
  }
})
