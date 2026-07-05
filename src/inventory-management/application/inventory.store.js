/**
 * @summary Application state management store for Inventory Management
 * (Distribuidor role — the only role this app is scoped to).
 */

import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { InventoryApi } from '../infrastructure/inventory-api.js'
import { InventoryStockAssembler } from '../infrastructure/inventory-stock.assembler.js'
import { DistributorMovementAssembler } from '../infrastructure/distributor-movement.assembler.js'
import { kgKeyToBackendCylinderType, exitKindToOutboundType } from '../infrastructure/cylinder-type.helper.js'
import { useIamStore } from '@/iam/application/iam.store.js'

const inventoryApi = new InventoryApi()
const DEFAULT_SECTION_KEY = 'stock'

const useInventoryStore = defineStore('inventory', () => {
    const sectionKey = ref(DEFAULT_SECTION_KEY)
    const errors = ref([])

    const inventoryId = ref(null)
    const myInventoryLoaded = ref(false)

    const distributorCards = ref([])          // for the stock cards grid
    const distributorAvailableByKg = ref({})  // { '5': 12, '10': 3, ... } for live form previews
    const distributorLoaded = ref(false)

    const distributorMovements = ref([])
    const distributorMovementsLoaded = ref(false)

    const distributorCardCount = computed(() => {
        return distributorLoaded.value ? distributorCards.value.length : 0
    })

    /** Resolves "my inventory" once per session; subsequent calls are no-ops. */
    function ensureMyInventory() {
        if (myInventoryLoaded.value) return Promise.resolve(inventoryId.value)

        return inventoryApi.getMyInventory()
            .then((response) => {
                inventoryId.value = response.data.id
                myInventoryLoaded.value = true
                return inventoryId.value
            })
            .catch((error) => {
                errors.value.push(error)
                throw error
            })
    }

    function fetchDistributorStock() {
        return ensureMyInventory()
            .then((id) => inventoryApi.getStock(id))
            .then((response) => {
                distributorCards.value = InventoryStockAssembler.toStockCardsFromResponse(response)
                distributorAvailableByKg.value = InventoryStockAssembler.toAvailableByKgKey(response)
                distributorLoaded.value = true
            })
            .catch((error) => {
                errors.value.push(error)
                distributorLoaded.value = true
            })
    }

    function fetchDistributorMovements() {
        const iamStore = useIamStore()
        return ensureMyInventory()
            .then((id) => inventoryApi.getDistributorMovements(id))
            .then((response) => {
                distributorMovements.value = DistributorMovementAssembler.toEntitiesFromResponse(
                    response, iamStore.currentUsername)
                distributorMovementsLoaded.value = true
            })
            .catch((error) => {
                errors.value.push(error)
                distributorMovementsLoaded.value = true
            })
    }

    /**
     * @param {{ kgKey: string, quantity: number, providerName?: string }} data
     * Registers an Entry movement (backend requires ProviderName for Entry).
     */
    function registerDistributorEntry({ kgKey, quantity, providerName }) {
        const iamStore = useIamStore()
        const cylinderType = kgKeyToBackendCylinderType(kgKey)
        if (!cylinderType) return Promise.reject(new Error('Tipo de balón inválido.'))
        if (!providerName || !providerName.trim()) {
            return Promise.reject(new Error('El proveedor es obligatorio para una entrada.'))
        }

        return ensureMyInventory()
            .then((id) => inventoryApi.createDistributorMovement(id, {
                movementType: 'Entry',
                cylinderType,
                quantity: Number(quantity),
                profileId: iamStore.currentUserId,
                providerName: providerName.trim(),
                outboundType: null,
            }))
            .then(() => Promise.all([fetchDistributorStock(), fetchDistributorMovements()]))
            .catch((error) => {
                errors.value.push(error)
                throw error
            })
    }

    /**
     * @param {{ kgKey: string, quantity: number, exitKind: string }} data
     * Registers an Exit movement (backend requires OutboundType for Exit).
     */
    function registerDistributorExit({ kgKey, quantity, exitKind }) {
        const iamStore = useIamStore()
        const cylinderType = kgKeyToBackendCylinderType(kgKey)
        const outboundType = exitKindToOutboundType(exitKind)
        if (!cylinderType) return Promise.reject(new Error('Tipo de balón inválido.'))
        if (!outboundType) return Promise.reject(new Error('Selecciona el tipo de salida.'))

        return ensureMyInventory()
            .then((id) => inventoryApi.createDistributorMovement(id, {
                movementType: 'Exit',
                cylinderType,
                quantity: Number(quantity),
                profileId: iamStore.currentUserId,
                providerName: null,
                outboundType,
            }))
            .then(() => Promise.all([fetchDistributorStock(), fetchDistributorMovements()]))
            .catch((error) => {
                errors.value.push(error)
                throw error
            })
    }

    function setInventorySectionKey(key) {
        sectionKey.value = key || DEFAULT_SECTION_KEY
    }

    function resetInventorySection() {
        sectionKey.value = DEFAULT_SECTION_KEY
    }

    return {
        sectionKey,
        errors,
        inventoryId,
        distributorCards,
        distributorAvailableByKg,
        distributorLoaded,
        distributorMovements,
        distributorMovementsLoaded,
        distributorCardCount,
        fetchDistributorStock,
        fetchDistributorMovements,
        registerDistributorEntry,
        registerDistributorExit,
        setInventorySectionKey,
        resetInventorySection,
    }
})

export default useInventoryStore
