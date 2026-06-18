/**
 * @summary Assembler for InventoryStockItem → DistributorStockCard.
 */

import { DistributorStockCard } from '../domain/model/distributor-stock-card.entity.js'

export class DistributorStockCardAssembler {
    static toEntityFromResource(resource) {
        return new DistributorStockCard({
            id: resource.id,
            cylinderType: resource.cylinderType,
            available: resource.available ?? 0,
        })
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status} ${response.statusText}`)
            return []
        }
        const resources = response.data instanceof Array ? response.data : []
        return resources.map((resource) => this.toEntityFromResource(resource))
    }
}
