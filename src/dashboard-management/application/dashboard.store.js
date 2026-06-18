import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { DashboardApi } from '@/dashboard-management/infrastructure/dashboard-api.js'

const dashboardApi = new DashboardApi()

const fallbackCylinderPrices = {
    '5kg': 28,
    '10kg': 50,
    '15kg': 72,
    '45kg': 195,
}

export const useDashboardStore = defineStore('dashboard', () => {
    const enterpriseStockRows = ref([])
    const distributorStockCards = ref([])
    const enterpriseMovements = ref([])
    const distributorMovements = ref([])
    const commercialCylinderTypes = ref([])
    const distributorSales = ref([])
    const commercialClients = ref([])
    const commercialDebtMovements = ref([])
    const alerts = ref([])
    const warehouses = ref([])
    const companyAlerts = ref([])
    const distributorDeliveries = ref([])

    const enterpriseLoaded = ref(false)
    const distributorLoaded = ref(false)
    const enterpriseLoading = ref(false)
    const distributorLoading = ref(false)
    const errors = ref([])

    const activeAlerts = computed(() =>
        alerts.value.filter((alert) => isActiveStatus(alert.status)),
    )

    const enterpriseHighAlerts = computed(() =>
        activeAlerts.value.filter((alert) => normalizeText(alert.criticality) === 'alta').length,
    )

    const enterpriseMediumAlerts = computed(() =>
        activeAlerts.value.filter((alert) => normalizeText(alert.criticality) === 'media').length,
    )

    const enterpriseEntriesToday = computed(() =>
        sumLatestMovementsByType(enterpriseMovements.value, 'entrada'),
    )

    const enterpriseExitsToday = computed(() =>
        sumLatestMovementsByType(enterpriseMovements.value, 'salida'),
    )

    const enterpriseTotalAvailableStock = computed(() =>
        enterpriseStockRows.value.reduce((total, row) => total + Number(row.disponible ?? 0), 0),
    )

    const enterpriseInventoryRows = computed(() =>
        enterpriseStockRows.value.map((row) => ({
            id: row.id,
            type: row.badgeLabel || row.tipoNombre || 'Sin tipo',
            name: row.tipoNombre || row.badgeLabel || 'Sin nombre',
            available: Number(row.disponible ?? 0),
            inTransit: Number(row.enTransito ?? 0),
            observed: Number(row.observado ?? 0),
            outOfService: Number(row.fueraServicio ?? 0),
            total: Number(row.total ?? 0),
        })),
    )

    const enterpriseActiveDeliveries = computed(() =>
        distributorDeliveries.value.filter((delivery) =>
            ['en ruta', 'en progreso', 'activo'].includes(normalizeText(delivery.status)),
        ).length,
    )

    const enterpriseCompletedDeliveries = computed(() =>
        distributorDeliveries.value.filter((delivery) =>
            ['completado', 'completada'].includes(normalizeText(delivery.status)),
        ).length,
    )

    const enterpriseAttendedAlerts = computed(() => {
        const attendedFromAlerts = alerts.value.filter((alert) =>
            ['attended', 'atendida', 'atendido'].includes(normalizeText(alert.status)),
        ).length

        const attendedFromCompanyAlerts = companyAlerts.value.filter((alert) =>
            ['atendida', 'atendido', 'attended'].includes(normalizeText(alert.status)),
        ).length

        return attendedFromAlerts + attendedFromCompanyAlerts
    })

    const enterpriseWarehouseCards = computed(() =>
        warehouses.value.slice(0, 3).map((warehouse) => {
            const concentration = Number(warehouse.gasConcentration ?? 0)
            const status = normalizeText(warehouse.status)
            const alertLevel = normalizeText(warehouse.alertLevel)

            const withoutSignal =
                status.includes('sin señal') ||
                status.includes('sin senal') ||
                status.includes('offline') ||
                concentration < 0

            const withAlert =
                alertLevel.includes('alerta') ||
                alertLevel.includes('critica') ||
                alertLevel.includes('crítica') ||
                concentration >= 300

            return {
                id: warehouse.id,
                name: warehouse.name,
                concentration,
                lastReading: warehouse.lastReading || 'sin datos',
                tone: withoutSignal ? 'muted' : withAlert ? 'danger' : 'success',
                label: withoutSignal ? 'Sin señal' : withAlert ? 'Alerta activa' : 'Normal',
            }
        }),
    )

    const distributorActiveAlerts = computed(() => activeAlerts.value)

    const distributorHighAlerts = computed(() =>
        distributorActiveAlerts.value.filter((alert) => normalizeText(alert.criticality) === 'alta').length,
    )

    const distributorMediumAlerts = computed(() =>
        distributorActiveAlerts.value.filter((alert) => normalizeText(alert.criticality) === 'media').length,
    )

    const distributorStockRows = computed(() =>
        distributorStockCards.value.map((card) => {
            const units = Number(card.unidades ?? 0)
            const label = String(card.title || card.tipoNombre || 'Sin tipo')
                .replace('Balón ', '')
                .replace('Cilindro ', '')
                .trim()

            return {
                id: card.id,
                label,
                units,
                status: units === 0 ? 'SIN STOCK' : units <= 5 ? 'STOCK BAJO' : 'NORMAL',
                tone: units === 0 ? 'danger' : units <= 5 ? 'warning' : 'success',
            }
        }),
    )

    const distributorDeliverySummary = computed(() => ({
        inRoute: distributorDeliveries.value.filter((delivery) =>
            ['en ruta', 'en progreso'].includes(normalizeText(delivery.status)),
        ).length,
        completed: distributorDeliveries.value.filter((delivery) =>
            ['completado', 'completada'].includes(normalizeText(delivery.status)),
        ).length,
        notDelivered: distributorDeliveries.value.filter((delivery) =>
            ['no entregado', 'no entregada'].includes(normalizeText(delivery.status)),
        ).length,
    }))

    const clientsWithDebt = computed(() =>
        commercialClients.value.filter((client) => Number(client.activeDebt ?? 0) > 0),
    )

    const totalPendingDebt = computed(() =>
        clientsWithDebt.value.reduce((total, client) => total + Number(client.activeDebt ?? 0), 0),
    )

    const salesByCylinderType = computed(() => {
        const map = new Map()

        distributorSales.value
            .filter((sale) => normalizeText(sale.status) !== 'anulada')
            .forEach((sale) => {
                const label = sale.cylinderType || sale.cylinderTypeId || 'Sin tipo'
                const key = normalizeCylinderKey(sale.cylinderTypeId || label)
                const quantity = Number(sale.quantity ?? 0)
                const current = map.get(key) ?? {
                    key,
                    label,
                    quantity: 0,
                    income: 0,
                    returns: 0,
                }

                current.quantity += quantity
                current.income += quantity * getCylinderPrice(sale.cylinderTypeId, sale.cylinderType)
                map.set(key, current)
            })

        return Array.from(map.values()).slice(0, 3)
    })

    const distributorTotalSalesAmount = computed(() =>
        salesByCylinderType.value.reduce((total, item) => total + item.income, 0),
    )

    const cashSalesAmount = computed(() =>
        sumSalesByPaymentType('efectivo'),
    )

    const digitalSalesAmount = computed(() =>
        sumSalesByPaymentType('yape') + sumSalesByPaymentType('plin'),
    )

    const creditSalesAmount = computed(() =>
        commercialDebtMovements.value
            .filter((movement) => {
                const isDebt = normalizeText(movement.type) === 'deuda'
                const isPending = !['pagada', 'pagado'].includes(normalizeText(movement.status))
                return isDebt && isPending
            })
            .reduce((total, movement) => total + Number(movement.balance ?? movement.amount ?? 0), 0),
    )

    const estimatedClosingStock = computed(() =>
        distributorStockRows.value.map((row) => ({
            label: row.label,
            units: row.units,
        })),
    )

    async function loadEnterpriseDashboard() {
        enterpriseLoading.value = true
        removeEnterpriseErrors()

        const results = await Promise.allSettled([
            dashboardApi.getEnterpriseStockRows(),
            dashboardApi.getEnterpriseMovements(),
            dashboardApi.getAlerts(),
            dashboardApi.getWarehouses(),
            dashboardApi.getCompanyAlerts(),
            dashboardApi.getDistributorDeliveries(),
        ])

        enterpriseStockRows.value = getResultData(results[0], [])
        enterpriseMovements.value = getResultData(results[1], [])
        alerts.value = getResultData(results[2], alerts.value)
        warehouses.value = getResultData(results[3], [])
        companyAlerts.value = getResultData(results[4], [])
        distributorDeliveries.value = getResultData(results[5], distributorDeliveries.value)

        registerRejectedResults(results, 'enterprise-dashboard')

        enterpriseLoaded.value = true
        enterpriseLoading.value = false
    }

    async function loadDistributorDashboard() {
        distributorLoading.value = true
        removeDistributorErrors()

        const results = await Promise.allSettled([
            dashboardApi.getDistributorStockCards(),
            dashboardApi.getDistributorMovements(),
            dashboardApi.getCommercialCylinderTypes(),
            dashboardApi.getDistributorSales(),
            dashboardApi.getCommercialClients(),
            dashboardApi.getCommercialDebtMovements(),
            dashboardApi.getAlerts(),
            dashboardApi.getDistributorDeliveries(),
        ])

        distributorStockCards.value = getResultData(results[0], [])
        distributorMovements.value = getResultData(results[1], [])
        commercialCylinderTypes.value = getResultData(results[2], [])
        distributorSales.value = getResultData(results[3], [])
        commercialClients.value = getResultData(results[4], [])
        commercialDebtMovements.value = getResultData(results[5], [])
        alerts.value = getResultData(results[6], alerts.value)
        distributorDeliveries.value = getResultData(results[7], distributorDeliveries.value)

        registerRejectedResults(results, 'distributor-dashboard')

        distributorLoaded.value = true
        distributorLoading.value = false
    }

    function getResultData(result, fallback) {
        if (result.status !== 'fulfilled') {
            return fallback
        }

        return Array.isArray(result.value?.data) ? result.value.data : fallback
    }

    function registerRejectedResults(results, context) {
        results.forEach((result) => {
            if (result.status === 'rejected') {
                errors.value.push({
                    context,
                    message: result.reason?.message || 'No se pudo cargar un recurso del dashboard.',
                })
            }
        })
    }

    function removeEnterpriseErrors() {
        errors.value = errors.value.filter((error) => error.context !== 'enterprise-dashboard')
    }

    function removeDistributorErrors() {
        errors.value = errors.value.filter((error) => error.context !== 'distributor-dashboard')
    }

    function sumLatestMovementsByType(movements, type) {
        const filtered = movements.filter((movement) => normalizeText(movement.tipo) === type)

        if (filtered.length === 0) {
            return 0
        }

        const latestDate = filtered
            .map((movement) => String(movement.timestamp || '').slice(0, 10))
            .sort()
            .at(-1)

        return filtered
            .filter((movement) => String(movement.timestamp || '').startsWith(latestDate))
            .reduce((total, movement) => total + Number(movement.cantidad ?? 0), 0)
    }

    function sumSalesByPaymentType(paymentType) {
        return distributorSales.value
            .filter((sale) => normalizeText(sale.paymentType).includes(paymentType))
            .reduce((total, sale) => {
                return total + Number(sale.quantity ?? 0) * getCylinderPrice(sale.cylinderTypeId, sale.cylinderType)
            }, 0)
    }

    function getCylinderPrice(typeId, typeLabel) {
        const key = normalizeCylinderKey(typeId || typeLabel)

        const found = commercialCylinderTypes.value.find((type) => {
            return (
                normalizeCylinderKey(type.id) === key ||
                normalizeCylinderKey(type.label) === key
            )
        })

        return Number(found?.price ?? fallbackCylinderPrices[key] ?? 50)
    }

    function normalizeCylinderKey(value) {
        return String(value ?? '')
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '')
    }

    function normalizeText(value) {
        return String(value ?? '').trim().toLowerCase()
    }

    function isActiveStatus(status) {
        return ['active', 'activa', 'activo', 'pending', 'pendiente'].includes(normalizeText(status))
    }

    return {
        enterpriseStockRows,
        distributorStockCards,
        enterpriseMovements,
        distributorMovements,
        commercialCylinderTypes,
        distributorSales,
        commercialClients,
        commercialDebtMovements,
        alerts,
        warehouses,
        companyAlerts,
        distributorDeliveries,

        enterpriseLoaded,
        distributorLoaded,
        enterpriseLoading,
        distributorLoading,
        errors,

        activeAlerts,

        enterpriseHighAlerts,
        enterpriseMediumAlerts,
        enterpriseEntriesToday,
        enterpriseExitsToday,
        enterpriseTotalAvailableStock,
        enterpriseInventoryRows,
        enterpriseActiveDeliveries,
        enterpriseCompletedDeliveries,
        enterpriseAttendedAlerts,
        enterpriseWarehouseCards,

        distributorActiveAlerts,
        distributorHighAlerts,
        distributorMediumAlerts,
        distributorStockRows,
        distributorDeliverySummary,
        clientsWithDebt,
        totalPendingDebt,
        salesByCylinderType,
        distributorTotalSalesAmount,
        cashSalesAmount,
        digitalSalesAmount,
        creditSalesAmount,
        estimatedClosingStock,

        loadEnterpriseDashboard,
        loadDistributorDashboard,
    }
})