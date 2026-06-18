/**
 * @summary Assembler for InventoryCompanyMovementItem → InventoryMovement.
 */

import { InventoryMovement } from '../domain/model/inventory-movement.entity.js'

export class InventoryMovementAssembler {
    static toEntityFromResource(resource) {
        return new InventoryMovement({
            id: resource.id,
            timestamp: resource.timestamp,
            movementType: resource.movementType,
            cylinderType: resource.cylinderType,
            quantity: resource.quantity,
            profileId: resource.profileId,
            providerName: resource.providerName ?? '',
            destination: resource.destination ?? '',
            movementReason: resource.movementReason ?? '',
            observation: resource.observation ?? '',
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
