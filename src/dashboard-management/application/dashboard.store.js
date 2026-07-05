/**
 * @summary Dashboard store para el rol Distribuidor.
 *
 * A diferencia de su versión anterior, este store NO tiene su propio cliente
 * de API ni sus propios endpoints — reutiliza los stores reales de los otros
 * bounded contexts (Inventory, Commercial, Distribution), que ya hablan con
 * el backend real. El dashboard solo agrega/deriva esos datos para mostrarlos.
 */

import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import useInventoryStore from '@/inventory-management/application/inventory.store.js'
import { useCommercialStore } from '@/commercional-management/application/commercial.store.js'
import { useDistributionStore } from '@/distribution-logistics-management/application/distribution.store.js'

export const useDashboardStore = defineStore('dashboard', () => {
    const inventoryStore = useInventoryStore()
    const commercialStore = useCommercialStore()
    const distributionStore = useDistributionStore()

    const distributorLoaded = ref(false)
    const distributorLoading = ref(false)

    const hasError = computed(() =>
        inventoryStore.errors.length > 0 ||
        commercialStore.errors.length > 0 ||
        distributionStore.errors.length > 0,
    )

    // ── Stock (Inventory Management real) ───────────────────────────────────
    const distributorStockRows = computed(() =>
        inventoryStore.distributorCards.map((card) => {
            const units = Number(card.unidades ?? 0)
            const label = String(card.title || 'Sin tipo').replace('Balón ', '').trim()

            return {
                id: card.id,
                label,
                units,
                status: units === 0 ? 'SIN STOCK' : units <= 5 ? 'STOCK BAJO' : 'NORMAL',
                tone: units === 0 ? 'danger' : units <= 5 ? 'warning' : 'success',
            }
        }),
    )

    const estimatedClosingStock = computed(() =>
        distributorStockRows.value.map((row) => ({ label: row.label, units: row.units })),
    )

    // ── Entregas (Delivery Tracking real) ────────────────────────────────────
    const distributorDeliverySummary = computed(() => ({
        pending: distributionStore.pendingDeliveries.length,
        inRoute: distributionStore.enRouteDeliveries.length,
        completed: distributionStore.completedDeliveries.length,
        notDelivered: distributionStore.failedDeliveries.length,
    }))

    // ── Ventas (Commercial Management real) ─────────────────────────────────
    const salesByCylinderType = computed(() => {
        const map = new Map()

        commercialStore.sales
            .filter((sale) => sale.status !== 'Anulada')
            .forEach((sale) => {
                const key = sale.cylinderTypeId || sale.cylinderType
                const current = map.get(key) ?? {
                    key,
                    label: sale.cylinderType,
                    quantity: 0,
                    income: 0,
                }

                current.quantity += Number(sale.quantity ?? 0)
                current.income += Number(sale.totalAmount ?? 0)
                map.set(key, current)
            })

        return Array.from(map.values())
    })

    const distributorTotalSalesAmount = computed(() =>
        salesByCylinderType.value.reduce((total, item) => total + item.income, 0),
    )

    function sumSalesByPaymentType(paymentType) {
        return commercialStore.sales
            .filter((sale) => sale.status !== 'Anulada' && sale.paymentType === paymentType)
            .reduce((total, sale) => total + Number(sale.totalAmount ?? 0), 0)
    }

    const cashSalesAmount = computed(() => sumSalesByPaymentType('Efectivo'))
    const digitalSalesAmount = computed(() => sumSalesByPaymentType('Yape/Plin'))
    const transferSalesAmount = computed(() => sumSalesByPaymentType('Transferencia'))

    // ── Actions ──────────────────────────────────────────────────────────────
    async function loadDistributorDashboard() {
        distributorLoading.value = true

        await Promise.allSettled([
            inventoryStore.fetchDistributorStock(),
            commercialStore.fetchCommercialData(),
            distributionStore.fetchDistributionData(),
        ])

        distributorLoaded.value = true
        distributorLoading.value = false
    }

    return {
        distributorLoaded,
        distributorLoading,
        hasError,

        distributorStockRows,
        estimatedClosingStock,
        distributorDeliverySummary,
        salesByCylinderType,
        distributorTotalSalesAmount,
        cashSalesAmount,
        digitalSalesAmount,
        transferSalesAmount,

        loadDistributorDashboard,
    }
})
