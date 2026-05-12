<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onBeforeUnmount, onMounted } from 'vue'

import { DriverLiveStatus } from '@/domain/distribution/live-driver-location'
import LiveDriversPanel from '@/distribution-logistics-management/presentation/components/distribution/live-map/LiveDriversPanel.vue'
import LiveOsMapPanel from '@/distribution-logistics-management/presentation/components/distribution/live-map/LiveOsMapPanel.vue'
import { useDistributionLiveMapStore } from '@/distribution-logistics-management/presentation/stores/use-distribution-live-map-store'

const store = useDistributionLiveMapStore()
const { drivers, selectedDriverId, secondsUntilRefresh } = storeToRefs(store)

const selectedDriver = computed(() => drivers.value.find((d) => d.driverId === selectedDriverId.value))

onMounted(() => {
  void store.startLiveSession()
})

onBeforeUnmount(() => {
  store.stopLiveSession()
})

function selectDriver(id: string) {
  store.selectedDriverId = id
}

const selectedIsNoSignal = computed(
  () => selectedDriver.value?.status === DriverLiveStatus.NoSignal,
)
</script>

<template>
  <div class="map-page">
    <LiveDriversPanel
      :drivers="drivers"
      :selected-driver-id="selectedDriverId"
      @select="selectDriver"
    />
    <LiveOsMapPanel
      :selected-driver="selectedDriver"
      :show-no-signal-card="selectedIsNoSignal"
      :seconds-refresh="secondsUntilRefresh"
    />
  </div>
</template>

<style scoped>
.map-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

@media (min-width: 64rem) {
  .map-page {
    flex-direction: row;
    align-items: stretch;
  }
}
</style>
