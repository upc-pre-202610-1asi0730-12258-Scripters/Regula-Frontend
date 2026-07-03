import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { DistributionApi } from '../infrastructure/distribution-api.js'
import { Delivery } from '../domain/model/delivery.entity.js'
import { Deliverer } from '../domain/model/deliverer.entity.js'

const distributionApi = new DistributionApi()

// ── Fallback mock data (used when API is unavailable) ──────────────────────
const MOCK_DELIVERIES = [
  new Delivery('#001', '24/10/2023', '14:25', 'Juan López', 'JL', 'Moto', 'A38-210', '3 balones', 'Entrega Centro', 'En Ruta', '14:30', null),
  new Delivery('#004', '24/10/2023', '14:50', 'Carlos Ruiz', 'CR', 'Camión', 'XYZ-787', '10 balones de 45 kg', 'Restaurante El Mar', 'En Ruta', '15:15', null),
  new Delivery('#002', '24/10/2023', '13:45', 'Pedro Salas', 'PS', 'Camioneta', 'C5R-982', '2 balones', 'Av. Los Pinos 456', 'Completado', '14:00', '13:45'),
  new Delivery('#003', '24/10/2023', '12:05', 'Ana Gómez', 'AG', 'Moto', 'B12-400', '1 balón', 'Jr. Las Flores 123', 'Completado', '12:15', '12:05'),
  new Delivery('#005', '24/10/2023', '11:15', 'Luis Torres', 'LT', 'Moto', 'D45-001', '5 balones', 'Calle Lima 88', 'Completado', '11:30', '11:15'),
  new Delivery('#006', '24/10/2023', '16:00', 'Raúl Méndez', 'RM', 'Moto', 'X1W-445', '1 balón', 'Av. Grau 200', 'No entregado', '16:00', null),
]

const MOCK_DELIVERERS = [
  new Deliverer('JL', 'Juan López', 'A38-210', 'Moto', 'En ruta', -12.0464, -77.0428),
  new Deliverer('PS', 'Pedro Salas', 'C5R-982', 'Camioneta', 'Completado', -12.0600, -77.0375),
  new Deliverer('RM', 'Raúl Méndez', 'X1W-445', 'Moto', 'Sin señal', null, null),
]

export const useDistributionStore = defineStore('distribution', () => {
  // ── State ──────────────────────────────────────────────────────────────
  const deliveries = ref([])        // Array<Delivery>
  const deliverers = ref([])        // Array<Deliverer>
  const loaded = ref(false)
  const errors = ref([])

  // History filters
  const historyDateFilter = ref('24/10/2023')
  const historyDelivererFilter = ref('Todos los repartidores')
  const historyStatusFilter = ref('Todos los estados')
  const historySearchQuery = ref('')

  // Selected delivery for detail panel
  const selectedDeliveryId = ref(null)

  // ── Computed ───────────────────────────────────────────────────────────
  const todayDeliveries = computed(() =>
    deliveries.value.filter(d => d.status === 'En Ruta' || d.status === 'Completado' || d.status === 'No entregado')
  )

  const enRouteDeliveries = computed(() =>
    deliveries.value.filter(d => d.status === 'En Ruta')
  )

  const completedDeliveries = computed(() =>
    deliveries.value.filter(d => d.status === 'Completado')
  )

  const failedDeliveries = computed(() =>
    deliveries.value.filter(d => d.status === 'No entregado')
  )

  const activeDeliverers = computed(() =>
    deliverers.value
  )

  const filteredHistoryDeliveries = computed(() => {
    let result = [...deliveries.value]

    if (historyDelivererFilter.value !== 'Todos los repartidores') {
      result = result.filter(d => d.delivererName === historyDelivererFilter.value)
    }

    if (historyStatusFilter.value !== 'Todos los estados') {
      result = result.filter(d => d.status === historyStatusFilter.value)
    }

    const search = historySearchQuery.value.trim().toLowerCase()
    if (search.length > 0) {
      result = result.filter(d =>
        d.vehiclePlate?.toLowerCase().includes(search) ||
        d.delivererName?.toLowerCase().includes(search) ||
        d.id?.toLowerCase().includes(search)
      )
    }

    return result
  })

  const selectedDelivery = computed(() =>
    deliveries.value.find(d => d.id === selectedDeliveryId.value) ?? null
  )

  const completedSummary = computed(() => ({
    completed: completedDeliveries.value.length,
    notDelivered: failedDeliveries.value.length,
  }))

  // ── Actions ────────────────────────────────────────────────────────────
  async function fetchDistributionData() {
    try {
      const [deliveriesRes, deliverersRes] = await Promise.all([
        distributionApi.getDistributorDeliveries(),
        distributionApi.getDistributorDeliverers(),
      ])
      deliveries.value = deliveriesRes.data
      deliverers.value = deliverersRes.data
    } catch {
      // API not available — use mock data
      deliveries.value = MOCK_DELIVERIES
      deliverers.value = MOCK_DELIVERERS
    } finally {
      loaded.value = true
    }
  }

  function selectDelivery(id) {
    selectedDeliveryId.value = id
  }

  function clearSelectedDelivery() {
    selectedDeliveryId.value = null
  }

  return {
    // State
    deliveries,
    deliverers,
    loaded,
    errors,
    historyDateFilter,
    historyDelivererFilter,
    historyStatusFilter,
    historySearchQuery,
    selectedDeliveryId,
    // Computed
    todayDeliveries,
    enRouteDeliveries,
    completedDeliveries,
    failedDeliveries,
    activeDeliverers,
    filteredHistoryDeliveries,
    selectedDelivery,
    completedSummary,
    // Actions
    fetchDistributionData,
    selectDelivery,
    clearSelectedDelivery,
  }
})
