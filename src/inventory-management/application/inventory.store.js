import { InventoryApi } from '../infrastructure/inventory-api.js'
import { InventoryStockAssembler } from '../infrastructure/inventory-stock.assembler.js'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const inventoryApi = new InventoryApi()

export const useInventoryStore = defineStore('inventory', () => {
    const enterpriseRows = ref([])
    const distributorCards = ref([])
    const enterpriseMovements = ref([])
    const distributorMovements = ref([])
    const auditLogs = ref([])
    const errors = ref([])
    const enterpriseLoaded = ref(false)
    const distributorLoaded = ref(false)
    const enterpriseMovementsLoaded = ref(false)
    const distributorMovementsLoaded = ref(false)
    const auditLogsLoaded = ref(false)

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

    function fetchEnterpriseStock() {
        return inventoryApi
            .getEnterpriseStockRows()
            .then((response) => {
                enterpriseRows.value =
                    InventoryStockAssembler.toEnterpriseEntitiesFromResponse(response.data)
                enterpriseLoaded.value = true
            })
            .catch((error) => {
                errors.value.push(error)
            })
    }

    function fetchDistributorStock() {
        return inventoryApi
            .getDistributorStockCards()
            .then((response) => {
                distributorCards.value =
                    InventoryStockAssembler.toDistributorEntitiesFromResponse(response.data)
                distributorLoaded.value = true
            })
            .catch((error) => {
                errors.value.push(error)
            })
    }

    function fetchEnterpriseMovements() {
        return inventoryApi
            .getEnterpriseMovements()
            .then((response) => {
                enterpriseMovements.value = response.data ?? []
                enterpriseMovementsLoaded.value = true
            })
            .catch((error) => {
                errors.value.push(error)
            })
    }

    function fetchDistributorMovements() {
        return inventoryApi
            .getDistributorMovements()
            .then((response) => {
                distributorMovements.value = response.data ?? []
                distributorMovementsLoaded.value = true
            })
            .catch((error) => {
                errors.value.push(error)
            })
    }

    function fetchAuditLogs() {
        return inventoryApi
            .getAuditLogs()
            .then((response) => {
                auditLogs.value = response.data ?? []
                auditLogsLoaded.value = true
            })
            .catch((error) => {
                errors.value.push(error)
            })
    }

    return {
        enterpriseRows,
        distributorCards,
        enterpriseMovements,
        distributorMovements,
        auditLogs,
        errors,
        enterpriseLoaded,
        distributorLoaded,
        enterpriseMovementsLoaded,
        distributorMovementsLoaded,
        auditLogsLoaded,
        enterpriseTotals,
        fetchEnterpriseStock,
        fetchDistributorStock,
        fetchEnterpriseMovements,
        fetchDistributorMovements,
        fetchAuditLogs,
    }
})
