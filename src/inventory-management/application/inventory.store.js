/**
 * @summary Application store for inventory management.
 * Centralizes API data and inventory business rules.
 */

import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { InventoryApi } from '../infrastructure/inventory-api.js'
import { GasCylinderStockRowAssembler } from '../infrastructure/gas-cylinder-stock-row.assembler.js'
import { DistributorStockCardAssembler } from '../infrastructure/distributor-stock-card.assembler.js'
import { InventoryMovementAssembler } from '../infrastructure/inventory-movement.assembler.js'
import { DistributorMovementAssembler } from '../infrastructure/distributor-movement.assembler.js'

const inventoryApi = new InventoryApi()
const DEFAULT_SECTION_KEY = 'stock'

const CYLINDER_LABELS = {
    Kg5: 'Balón 5 kg',
    Kg10: 'Balón 10 kg',
    Kg15: 'Balón 15 kg',
    Kg45: 'Cilindro 45 kg',
}

const MOVEMENT_TYPE_LABELS = {
    Entry: 'Entrada',
    Exit: 'Salida',
}

const OUTBOUND_TYPE_LABELS = {
    DirectSale: 'Venta directa',
    HomeDelivery: 'Entrega a domicilio',
    ReturnToSupplier: 'Devolución a proveedor',
}

const CYLINDER_TYPE_CATALOG = [
    { key: '5', cylinderType: 'Kg5' },
    { key: '10', cylinderType: 'Kg10' },
    { key: '15', cylinderType: 'Kg15' },
    { key: '45', cylinderType: 'Kg45' },
]

const OUTBOUND_TYPE_CATALOG = [
    { outboundType: 'DirectSale' },
    { outboundType: 'HomeDelivery' },
    { outboundType: 'ReturnToSupplier' },
]

function stockRowsToKeyMap(rows) {
    const map = {}
    for (const row of rows) {
        const key = getCylinderKey(row.cylinderType)
        if (key) {
            map[key] = row.available
        }
    }
    return map
}

function getCylinderKey(cylinderType) {
    return String(cylinderType ?? '').replace(/^Kg/i, '')
}

function getCylinderTypeFromKey(key) {
    return `Kg${key}`
}

function getCylinderLabel(cylinderType) {
    return CYLINDER_LABELS[cylinderType] ?? cylinderType ?? ''
}

function getMovementTypeLabel(movementType) {
    return MOVEMENT_TYPE_LABELS[movementType] ?? movementType ?? ''
}

function getOutboundTypeLabel(outboundType) {
    return OUTBOUND_TYPE_LABELS[outboundType] ?? outboundType ?? ''
}

const useInventoryStore = defineStore('inventory', () => {
    const sectionKey = ref(DEFAULT_SECTION_KEY)

    const enterpriseRows = ref([])
    const distributorCards = ref([])
    const enterpriseMovements = ref([])
    const distributorMovements = ref([])

    const errors = ref([])

    const enterpriseLoaded = ref(false)
    const distributorLoaded = ref(false)
    const enterpriseMovementsLoaded = ref(false)
    const distributorMovementsLoaded = ref(false)

    const companyStockByCylinderKey = computed(() => stockRowsToKeyMap(enterpriseRows.value))
    const distributorStockByCylinderKey = computed(() => stockRowsToKeyMap(distributorCards.value))

    const enterpriseTotals = computed(() => {
        if (!enterpriseLoaded.value) {
            return {
                available: 0,
                inTransit: 0,
                observed: 0,
                outOfService: 0,
                total: 0,
            }
        }
        return enterpriseRows.value.reduce(
            (acc, row) => {
                acc.available += row.available
                acc.inTransit += row.inTransit
                acc.observed += row.observed
                acc.outOfService += row.outOfService
                acc.total += row.total
                return acc
            },
            {
                available: 0,
                inTransit: 0,
                observed: 0,
                outOfService: 0,
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
            .getCompanyStock()
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
            .getDistributorStock()
            .then((response) => {
                distributorCards.value = DistributorStockCardAssembler.toEntitiesFromResponse(response)
                distributorLoaded.value = true
            })
            .catch((error) => {
                errors.value.push(error)
            })
    }

    function fetchEnterpriseMovements(movementType) {
        inventoryApi
            .getCompanyMovements(movementType)
            .then((response) => {
                enterpriseMovements.value = InventoryMovementAssembler.toEntitiesFromResponse(response)
                enterpriseMovementsLoaded.value = true
            })
            .catch((error) => {
                errors.value.push(error)
            })
    }

    function fetchDistributorMovements(movementType) {
        inventoryApi
            .getDistributorMovements(movementType)
            .then((response) => {
                distributorMovements.value = DistributorMovementAssembler.toEntitiesFromResponse(response)
                distributorMovementsLoaded.value = true
            })
            .catch((error) => {
                errors.value.push(error)
            })
    }

    function registerCompanyMovement(resource) {
        return inventoryApi.createCompanyMovement(resource).then((response) => {
            fetchEnterpriseStock()
            fetchEnterpriseMovements()
            return InventoryMovementAssembler.toEntityFromResource(response.data)
        })
    }

    function registerDistributorMovement(resource) {
        return inventoryApi.createDistributorMovement(resource).then((response) => {
            fetchDistributorStock()
            fetchDistributorMovements()
            return DistributorMovementAssembler.toEntityFromResource(response.data)
        })
    }

    return {
        sectionKey,
        enterpriseRows,
        distributorCards,
        enterpriseMovements,
        distributorMovements,
        errors,
        enterpriseLoaded,
        distributorLoaded,
        enterpriseMovementsLoaded,
        distributorMovementsLoaded,
        companyStockByCylinderKey,
        distributorStockByCylinderKey,
        enterpriseTotals,
        cylinderTypeCatalog: CYLINDER_TYPE_CATALOG,
        outboundTypeCatalog: OUTBOUND_TYPE_CATALOG,
        getCylinderKey,
        getCylinderTypeFromKey,
        getCylinderLabel,
        getMovementTypeLabel,
        getOutboundTypeLabel,
        setInventorySectionKey,
        resetInventorySection,
        fetchEnterpriseStock,
        fetchDistributorStock,
        fetchEnterpriseMovements,
        fetchDistributorMovements,
        registerCompanyMovement,
        registerDistributorMovement,
    }
})

export default useInventoryStore
