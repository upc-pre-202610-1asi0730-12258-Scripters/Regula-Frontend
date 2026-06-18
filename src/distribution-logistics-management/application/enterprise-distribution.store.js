import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// ─────────────────────────────────────────────────────────────────────────────
// Store de Distribución (vista Empresa).
// Contiene únicamente datos de demostración (mock) para las pantallas:
//   · Repartos del Día
//   · Mapa en Tiempo Real
//   · Supervisión de Rutas
//   · Historial de Repartos
// No reemplaza ni modifica el store del perfil Distribuidor.
// ─────────────────────────────────────────────────────────────────────────────

const PENDING_DELIVERIES = [
  {
    id: '#0045',
    status: 'En ruta',
    delayMinutes: 30,
    eta: '14:30',
    deliverer: 'Carlos Ríos Vega',
    dni: '45678912',
    vehicle: 'Toyota Hilux',
    plate: 'XYZ-456',
    cargo: '20 balones',
    zone: 'Zona Sur',
    address: 'Av. Principal 123',
  },
  {
    id: '#0046',
    status: 'En ruta',
    delayMinutes: 0,
    eta: '15:15',
    deliverer: 'Miguel Torres',
    dni: '78945612',
    vehicle: 'Nissan Frontier',
    plate: 'ABC-123',
    cargo: '15 balones',
    zone: 'Zona Norte',
    address: 'Calle 8 Nro 45',
  },
  {
    id: '#0047',
    status: 'En ruta',
    delayMinutes: 0,
    eta: '15:40',
    deliverer: 'Luis Gómez',
    dni: '50213489',
    vehicle: 'Hyundai H100',
    plate: 'LMN-789',
    cargo: '12 balones',
    zone: 'Zona Este',
    address: 'Jr. Comercio 980',
  },
]

const COMPLETED_TODAY = [
  { id: '#0031', deliverer: 'Juan Pérez', zone: 'Zona Centro', deliveredAt: '13:45' },
  { id: '#0030', deliverer: 'Luis Gómez', zone: 'Zona Este', deliveredAt: '12:30' },
  { id: '#0029', deliverer: 'Carlos Ríos Vega', zone: 'Zona Sur', deliveredAt: '11:15' },
]

const ACTIVE_VEHICLES = [
  {
    id: 'V1',
    deliverer: 'Carlos Ríos Vega',
    plate: 'XYZ-456',
    state: 'En ruta',
    zone: 'Zona Sur',
    eta: '14:30',
  },
  {
    id: 'V2',
    deliverer: 'Miguel Torres',
    plate: 'ABC-123',
    state: 'Activo',
    zone: 'Zona Norte',
    eta: '15:15',
  },
  {
    id: 'V3',
    deliverer: 'Luis Gómez',
    plate: 'LMN-789',
    state: 'Activo',
    zone: 'Zona Este',
    eta: '16:00',
  },
]

const SUPERVISION_DELIVERIES = [
  {
    id: '#0045',
    label: 'Reparto #0045 — ABC-123 — En curso',
    deliverer: 'Miguel Torres',
    plate: 'ABC-123',
    zone: 'Zona Norte',
    state: 'En curso',
    activeDeviations: 1,
    points: [
      {
        order: 1,
        name: 'Av. Larco 452',
        status: 'Entregado',
        eta: '13:45',
        real: '13:48',
      },
      {
        order: 2,
        name: 'Jr. Unión 118',
        status: 'Desvío',
        eta: '14:15',
        real: null,
        detail: '800m fuera de ruta',
        ago: 'Hace 4 min',
      },
      {
        order: 3,
        name: 'Calle Lima 90',
        status: 'Pendiente',
        eta: '14:50',
        real: null,
      },
      {
        order: 4,
        name: 'Av. Brasil 340',
        status: 'Pendiente',
        eta: '15:20',
        real: null,
      },
    ],
    alerts: [
      {
        type: 'active',
        title: 'Desvío activo — Punto 2',
        time: '14:22',
        detail: '800m fuera de ruta planificada · Criticidad Media',
      },
      {
        type: 'resolved',
        title: 'Desvío resuelto — Punto 1',
        time: '13:41',
        detail: '320m · Resuelto automáticamente',
      },
    ],
  },
]

const HISTORY_DELIVERIES = [
  { id: '#0120', date: '22/06/2025', deliverer: 'Carlos Ríos Vega', dni: '45678901', plate: 'XYZ-456', vehicle: 'Camioneta', zone: 'Zona Norte', cargoKg: 1240, status: 'Completado', eta: '15:30', real: '15:27' },
  { id: '#0119', date: '22/06/2025', deliverer: 'Miguel Torres Salas', dni: '32156788', plate: 'ABC-123', vehicle: 'Furgoneta', zone: 'Centro Histórico', cargoKg: 980, status: 'Con desvío', eta: '14:30', real: '14:38' },
  { id: '#0118', date: '21/06/2025', deliverer: 'Lucía Mamani Quispe', dni: '71234567', plate: 'LMN-789', vehicle: 'Camión', zone: 'Zona Sur', cargoKg: 2100, status: 'Completado', eta: '11:00', real: '10:54' },
  { id: '#0117', date: '21/06/2025', deliverer: 'Jorge Paredes Llano', dni: '60923411', plate: 'PQR-001', vehicle: 'Camioneta', zone: 'Miraflores', cargoKg: 640, status: 'Pendiente', eta: '16:45', real: null },
  { id: '#0116', date: '20/06/2025', deliverer: 'Ana Flores Huanca', dni: '48234901', plate: 'DEF-222', vehicle: 'Furgoneta', zone: 'San Isidro', cargoKg: 875, status: 'Completado', eta: '09:30', real: '09:33' },
  { id: '#0115', date: '20/06/2025', deliverer: 'Pedro Sánchez Ruiz', dni: '55310876', plate: 'GHI-334', vehicle: 'Camión', zone: 'Surco', cargoKg: 1560, status: 'Con desvío', eta: '13:15', real: '14:02' },
  { id: '#0114', date: '19/06/2025', deliverer: 'Carlos Ríos Vega', dni: '45678901', plate: 'XYZ-456', vehicle: 'Camioneta', zone: 'Callao', cargoKg: 730, status: 'Completado', eta: '12:00', real: '11:58' },
  { id: '#0113', date: '19/06/2025', deliverer: 'Sofía Valdivia Mora', dni: '61029384', plate: 'JKL-558', vehicle: 'Furgoneta', zone: 'La Victoria', cargoKg: 490, status: 'Pendiente', eta: '17:00', real: null },
  { id: '#0112', date: '18/06/2025', deliverer: 'Raúl Cárdenas Pinto', dni: '39201045', plate: 'MNO-677', vehicle: 'Camión', zone: 'Lince', cargoKg: 1890, status: 'Completado', eta: '10:15', real: '10:11' },
  { id: '#0111', date: '18/06/2025', deliverer: 'Diego Castro Neira', dni: '77654320', plate: 'STU-890', vehicle: 'Camioneta', zone: 'Barranco', cargoKg: 615, status: 'Con desvío', eta: '15:00', real: '15:52' },
]

export const useEnterpriseDistributionStore = defineStore('enterprise-distribution', () => {
  // ── State ──────────────────────────────────────────────────────────────
  const pendingDeliveries = ref([...PENDING_DELIVERIES])
  const completedToday = ref([...COMPLETED_TODAY])
  const activeVehicles = ref([...ACTIVE_VEHICLES])
  const supervisionDeliveries = ref([...SUPERVISION_DELIVERIES])
  const selectedSupervisionId = ref(SUPERVISION_DELIVERIES[0]?.id ?? null)
  const historyDeliveries = ref([...HISTORY_DELIVERIES])
  const historySearchQuery = ref('')
  const historyStatusFilter = ref('Todos los estados')

  // ── Computed ───────────────────────────────────────────────────────────
  const pendingCount = computed(() => pendingDeliveries.value.length)
  const completedCount = computed(() => completedToday.value.length + 9) // total del día (12 en mock)

  const selectedSupervision = computed(
    () =>
      supervisionDeliveries.value.find((d) => d.id === selectedSupervisionId.value) ??
      supervisionDeliveries.value[0] ??
      null,
  )

  const historySummary = computed(() => ({
    total: 120,
    completed: 98,
    pending: 14,
    withDeviation: 8,
    avgEta: '2h 18m',
  }))

  const filteredHistory = computed(() => {
    let result = [...historyDeliveries.value]

    if (historyStatusFilter.value !== 'Todos los estados') {
      result = result.filter((d) => d.status === historyStatusFilter.value)
    }

    const search = historySearchQuery.value.trim().toLowerCase()
    if (search.length > 0) {
      result = result.filter(
        (d) =>
          d.plate?.toLowerCase().includes(search) ||
          d.deliverer?.toLowerCase().includes(search) ||
          d.id?.toLowerCase().includes(search) ||
          d.zone?.toLowerCase().includes(search),
      )
    }

    return result
  })

  // ── Actions ────────────────────────────────────────────────────────────
  function markAsCompleted(id) {
    const index = pendingDeliveries.value.findIndex((d) => d.id === id)
    if (index === -1) return
    const [delivery] = pendingDeliveries.value.splice(index, 1)
    completedToday.value.unshift({
      id: delivery.id,
      deliverer: delivery.deliverer,
      zone: delivery.zone,
      deliveredAt: delivery.eta,
    })
  }

  function selectSupervision(id) {
    selectedSupervisionId.value = id
  }

  return {
    // State
    pendingDeliveries,
    completedToday,
    activeVehicles,
    supervisionDeliveries,
    selectedSupervisionId,
    historyDeliveries,
    historySearchQuery,
    historyStatusFilter,
    // Computed
    pendingCount,
    completedCount,
    selectedSupervision,
    historySummary,
    filteredHistory,
    // Actions
    markAsCompleted,
    selectSupervision,
  }
})
