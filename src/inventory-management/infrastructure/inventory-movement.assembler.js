/**
 * @summary Assembler class responsible for transforming API resources
 * into domain entities and collections.
 *
 * @author Kevin Lopez
 */

import { InventoryMovement } from '../domain/model/inventory-movement.entity.js'

export class InventoryMovementAssembler {
    static toEntityFromResource(resource) {
        return new InventoryMovement({ ...resource })
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status} ${response.statusText}`)
            return []
        }
        let resources = response.data instanceof Array
            ? response.data
            : response.data['enterpriseMovements']
        return resources.map((resource) => this.toEntityFromResource(resource))
    }
}
