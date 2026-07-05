/**
 * @summary Infrastructure API service for Inventory Management (Distribuidor).
 * Talks to the real .NET backend under api/v1/inventory-management/inventories/...
 */

import { BaseApi } from '@/shared/infrastructure/base-api.js'

const inventoriesPath = '/api/v1/inventory-management/inventories'

export class InventoryApi extends BaseApi {
    /** GET /api/v1/inventory-management/inventories/me — resolves the current user's own inventory. */
    getMyInventory() {
        return this.http.get(`${inventoriesPath}/me`)
    }

    /** GET /api/v1/inventory-management/inventories/{id}/inventory-items (antes "/stock"). */
    getInventoryItems(inventoryId) {
        return this.http.get(`${inventoriesPath}/${inventoryId}/inventory-items`)
    }

    /** GET /api/v1/inventory-management/inventories/{id}/distributor-movements */
    getDistributorMovements(inventoryId) {
        return this.http.get(`${inventoriesPath}/${inventoryId}/distributor-movements`)
    }

    /** POST /api/v1/inventory-management/inventories/{id}/distributor-movements */
    createDistributorMovement(inventoryId, resource) {
        return this.http.post(`${inventoriesPath}/${inventoryId}/distributor-movements`, resource)
    }
}
