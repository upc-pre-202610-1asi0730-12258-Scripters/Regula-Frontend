import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { DistributionApi } from '../infrastructure/distribution-api.js'
import { DistributionAssembler } from '../infrastructure/distribution.assembler.js'

const distributionApi = new DistributionApi()

/** Convierte "dd/MM/yyyy" (formato del backend) a "yyyy-MM-dd" (formato de <input type="date">). */
function toIsoDate(ddMMyyyy) {
  const [day, month, year] = (ddMMyyyy || '').split('/')
  if (!day || !month || !year) return null
  return `${year}-${month}-${day}`
}

/** Formatea a "HH:mm" (24h, siempre 5 caracteres) — es lo que espera la columna delivered_at (varchar(5)). */
function formatTime24(date) {
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}

export const useDistributionStore = defineStore('distribution', () => {
  // ── State ──────────────────────────────────────────────────────────────
  const deliveries = ref([])        // Array<Delivery>
  const deliverers = ref([])        // Array<Deliverer>
  const loaded = ref(false)
  const errors = ref([])

  const responsibles = ref([])      // [{ id, name }]
  const vehicles = ref([])          // [{ id, plate, type, brand }]
  const catalogsLoaded = ref(false)

  const creating = ref(false)
  const updatingStatusId = ref(null)

  // History filters
  const historyDateFilter = ref('')
  const historyDelivererFilter = ref('Todos los repartidores')
  const historyStatusFilter = ref('Todos los estados')
  const historySearchQuery = ref('')

  // Selected delivery for detail panel
  const selectedDeliveryId = ref(null)

  // ── Computed ───────────────────────────────────────────────────────────
  const hasError = computed(() => errors.value.length > 0)

  const pendingDeliveries = computed(() =>
    deliveries.value.filter(d => d.status === 'Pendiente')
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

  const delivererNameOptions = computed(() => {
    const names = new Set(deliveries.value.map(d => d.delivererName).filter(Boolean))
    return ['Todos los repartidores', ...names]
  })

  const statusOptions = ['Todos los estados', 'Pendiente', 'En Ruta', 'Completado', 'No entregado']

  const filteredHistoryDeliveries = computed(() => {
    let result = [...deliveries.value]

    if (historyDelivererFilter.value !== 'Todos los repartidores') {
      result = result.filter(d => d.delivererName === historyDelivererFilter.value)
    }

    if (historyStatusFilter.value !== 'Todos los estados') {
      result = result.filter(d => d.status === historyStatusFilter.value)
    }

    if (historyDateFilter.value) {
      result = result.filter(d => toIsoDate(d.date) === historyDateFilter.value)
    }

    const search = historySearchQuery.value.trim().toLowerCase()
    if (search.length > 0) {
      result = result.filter(d =>
        d.vehiclePlate?.toLowerCase().includes(search) ||
        d.delivererName?.toLowerCase().includes(search) ||
        String(d.id).toLowerCase().includes(search)
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
    errors.value = []
    try {
      const [deliveriesRes, deliverersRes] = await Promise.all([
        distributionApi.getDistributorDeliveries(),
        distributionApi.getDistributorDeliverers(),
      ])
      deliveries.value = deliveriesRes.data
      deliverers.value = deliverersRes.data
    } catch (error) {
      errors.value.push(error)
      deliveries.value = []
      deliverers.value = []
    } finally {
      loaded.value = true
    }
  }

  async function fetchCatalogs() {
    if (catalogsLoaded.value) return
    try {
      const [responsiblesRes, vehiclesRes] = await Promise.all([
        distributionApi.getResponsibles(),
        distributionApi.getVehicles(),
      ])
      responsibles.value = responsiblesRes.data
      vehicles.value = vehiclesRes.data
      catalogsLoaded.value = true
    } catch (error) {
      errors.value.push(error)
    }
  }

  /**
   * @param {{ responsibleId: number, vehicleId: number, itemCount: number, cargo: string, destination: string, scheduledTime: string }} form
   */
  function createDelivery(form) {
    creating.value = true
    const resource = DistributionAssembler.toCreateResource(form)

    return distributionApi.createDelivery(resource)
      .then((response) => {
        deliveries.value.unshift(response.data)
        return response.data
      })
      .catch((error) => {
        errors.value.push(error)
        throw error
      })
      .finally(() => {
        creating.value = false
      })
  }

  /**
   * @param {number} id
   * @param {'Pendiente'|'En Ruta'|'Completado'|'No entregado'} statusLabel
   */
  function updateStatus(id, statusLabel) {
    updatingStatusId.value = id
    const backendStatus = DistributionAssembler.statusLabelToBackend(statusLabel)
    const deliveredAt = statusLabel === 'Completado'
      ? formatTime24(new Date())
      : null

    return distributionApi.updateDeliveryStatus(id, backendStatus, deliveredAt)
      .then((response) => {
        const index = deliveries.value.findIndex(d => d.id === id)
        if (index !== -1) {
          deliveries.value[index] = response.data
        }
        return response.data
      })
      .catch((error) => {
        errors.value.push(error)
        throw error
      })
      .finally(() => {
        updatingStatusId.value = null
      })
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
    hasError,
    responsibles,
    vehicles,
    catalogsLoaded,
    creating,
    updatingStatusId,
    historyDateFilter,
    historyDelivererFilter,
    historyStatusFilter,
    historySearchQuery,
    selectedDeliveryId,
    // Computed
    pendingDeliveries,
    enRouteDeliveries,
    completedDeliveries,
    failedDeliveries,
    activeDeliverers,
    delivererNameOptions,
    statusOptions,
    filteredHistoryDeliveries,
    selectedDelivery,
    completedSummary,
    // Actions
    fetchDistributionData,
    fetchCatalogs,
    createDelivery,
    updateStatus,
    selectDelivery,
    clearSelectedDelivery,
  }
})
