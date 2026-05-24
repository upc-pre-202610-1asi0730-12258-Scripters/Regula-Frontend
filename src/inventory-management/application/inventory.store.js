/**
 * @summary Application state management store for a bounded context.
 * Handles data loading, persistence operations, and reactive state management.
 *
 * @author Kevin Lopez
 */

import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { InventoryApi } from '../infrastructure/inventory-api.js'
import { GasCylinderStockRowAssembler } from '../infrastructure/gas-cylinder-stock-row.assembler.js'
import { DistributorStockCardAssembler } from '../infrastructure/distributor-stock-card.assembler.js'
import { OriginAssembler } from '../infrastructure/origin.assembler.js'
import { ProviderAssembler } from '../infrastructure/provider.assembler.js'
import { StockKgMapAssembler } from '../infrastructure/stock-kg-map.assembler.js'
import { InventoryMovementAssembler } from '../infrastructure/inventory-movement.assembler.js'
import { DistributorMovementAssembler } from '../infrastructure/distributor-movement.assembler.js'
import { AuditLogAssembler } from '../infrastructure/audit-log.assembler.js'

const inventoryApi = new InventoryApi()
const DEFAULT_SECTION_KEY = 'stock'

const useInventoryStore = defineStore('inventory', () => {
    const sectionKey = ref(DEFAULT_SECTION_KEY)

    const enterpriseRows = ref([])
    const distributorCards = ref([])
    const origins = ref([])
    const providers = ref([])
    const stockKgMaps = ref([])
    const enterpriseMovements = ref([])
    const distributorMovements = ref([])
    const auditLogs = ref([])

    const errors = ref([])

    const enterpriseLoaded = ref(false)
    const distributorLoaded = ref(false)
    const originsLoaded = ref(false)
    const providersLoaded = ref(false)
    const stockKgMapsLoaded = ref(false)
    const enterpriseMovementsLoaded = ref(false)
    const distributorMovementsLoaded = ref(false)
    const auditLogsLoaded = ref(false)

    const enterpriseRowCount = computed(() => {
        return enterpriseLoaded.value ? enterpriseRows.value.length : 0
    })

    const distributorCardCount = computed(() => {
        return distributorLoaded.value ? distributorCards.value.length : 0
    })

    const enterpriseTotals = computed(() => {
        if (!enterpriseLoaded.value) {
            return {
                disponible: 0,
                enTransito: 0,
                observado: 0,
                fueraServicio: 0,
                total: 0,
            }
        }
        return enterpriseRows.value.reduce(
            (acc, row) => {
                acc.disponible += row.disponible
                acc.enTransito += row.enTransito
                acc.observado += row.observado
                acc.fueraServicio += row.fueraServicio
                acc.total += row.total
                return acc
            },
            {
                disponible: 0,
                enTransito: 0,
                observado: 0,
                fueraServicio: 0,
                total: 0,
            },
        )
    })

    function setInventorySectionKey(key) {
        sectionKey.value = key || DEFAULT_SECTION_KEY
    }

    function resetInventorySection() {
        sectionKey.value = DEFAULT_SECTION_KEY
    }

    function fetchEnterpriseStock() {
        inventoryApi
            .getEnterpriseStockRows()
            .then((response) => {
                enterpriseRows.value = GasCylinderStockRowAssembler.toEntitiesFromResponse(response)
                enterpriseLoaded.value = true
            })
            .catch((error) => {
                errors.value.push(error)
            })
    }

    function fetchDistributorStock() {
        inventoryApi
            .getDistributorStockCards()
            .then((response) => {
                distributorCards.value = DistributorStockCardAssembler.toEntitiesFromResponse(response)
                distributorLoaded.value = true
            })
            .catch((error) => {
                errors.value.push(error)
            })
    }

    function fetchOrigins() {
        inventoryApi
            .getOrigins()
            .then((response) => {
                origins.value = OriginAssembler.toEntitiesFromResponse(response)
                originsLoaded.value = true
            })
            .catch((error) => {
                errors.value.push(error)
            })
    }

    function fetchProviders() {
        inventoryApi
            .getProviders()
            .then((response) => {
                providers.value = ProviderAssembler.toEntitiesFromResponse(response)
                providersLoaded.value = true
            })
            .catch((error) => {
                errors.value.push(error)
            })
    }

    function fetchStockKgMaps() {
        inventoryApi
            .getStockKgMaps()
            .then((response) => {
                stockKgMaps.value = StockKgMapAssembler.toEntitiesFromResponse(response)
                stockKgMapsLoaded.value = true
            })
            .catch((error) => {
                errors.value.push(error)
            })
    }

    function fetchEnterpriseMovements() {
        inventoryApi
            .getEnterpriseMovements()
            .then((response) => {
                enterpriseMovements.value = InventoryMovementAssembler.toEntitiesFromResponse(response)
                enterpriseMovementsLoaded.value = true
            })
            .catch((error) => {
                errors.value.push(error)
            })
    }

    function fetchDistributorMovements() {
        inventoryApi
            .getDistributorMovements()
            .then((response) => {
                distributorMovements.value = DistributorMovementAssembler.toEntitiesFromResponse(response)
                distributorMovementsLoaded.value = true
            })
            .catch((error) => {
                errors.value.push(error)
            })
    }

    function fetchAuditLogs() {
        inventoryApi
            .getAuditLogs()
            .then((response) => {
                auditLogs.value = AuditLogAssembler.toEntitiesFromResponse(response)
                auditLogsLoaded.value = true
            })
            .catch((error) => {
                errors.value.push(error)
            })
    }

    return {
        sectionKey,
        enterpriseRows,
        distributorCards,
        origins,
        providers,
        stockKgMaps,
        enterpriseMovements,
        distributorMovements,
        auditLogs,
        errors,
        enterpriseLoaded,
        distributorLoaded,
        originsLoaded,
        providersLoaded,
        stockKgMapsLoaded,
        enterpriseMovementsLoaded,
        distributorMovementsLoaded,
        auditLogsLoaded,
        enterpriseRowCount,
        distributorCardCount,
        enterpriseTotals,
        setInventorySectionKey,
        resetInventorySection,
        fetchEnterpriseStock,
        fetchDistributorStock,
        fetchOrigins,
        fetchProviders,
        fetchStockKgMaps,
        fetchEnterpriseMovements,
        fetchDistributorMovements,
        fetchAuditLogs,
    }
})

export default useInventoryStore
