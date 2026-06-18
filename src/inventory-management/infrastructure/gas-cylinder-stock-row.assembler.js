/**
 * @summary Assembler for InventoryStockItem → GasCylinderStockRow.
 */

import { GasCylinderStockRow } from '../domain/model/gas-cylinder-stock-row.entity.js'

export class GasCylinderStockRowAssembler {
    static toEntityFromResource(resource) {
        return new GasCylinderStockRow({
            id: resource.id,
            cylinderType: resource.cylinderType,
            available: resource.available ?? 0,
            inTransit: resource.inTransit ?? 0,
            observed: resource.observed ?? 0,
            outOfService: resource.outOfService ?? 0,
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
