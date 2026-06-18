/**
 * @summary Infrastructure API service for inventory management.
 * Communicates with the six backend REST endpoints under /api/v1/inventories.
 *
 * @author Kevin Lopez
 */

import { BaseApi } from '@/shared/infrastructure/base-api.js'

const inventoriesPath = import.meta.env.VITE_INVENTORIES_ENDPOINT
const companyInventoryId = import.meta.env.VITE_COMPANY_INVENTORY_ID
const distributorInventoryId = import.meta.env.VITE_DISTRIBUTOR_INVENTORY_ID

export class InventoryApi extends BaseApi {
    getInventoryById(inventoryId) {
        return this.http.get(`${inventoriesPath}/${inventoryId}`)
    }

    getCompanyStock() {
        return this.http.get(`${inventoriesPath}/${companyInventoryId}/stock`)
    }

    getDistributorStock() {
        return this.http.get(`${inventoriesPath}/${distributorInventoryId}/stock`)
    }

    getCompanyMovements(movementType) {
        const params = movementType ? { movementType } : undefined
        return this.http.get(`${inventoriesPath}/${companyInventoryId}/company-movements`, { params })
    }

    createCompanyMovement(resource) {
        return this.http.post(`${inventoriesPath}/${companyInventoryId}/company-movements`, resource)
    }

    getDistributorMovements(movementType) {
        const params = movementType ? { movementType } : undefined
        return this.http.get(`${inventoriesPath}/${distributorInventoryId}/distributor-movements`, { params })
    }

    createDistributorMovement(resource) {
        return this.http.post(`${inventoriesPath}/${distributorInventoryId}/distributor-movements`, resource)
    }
}
