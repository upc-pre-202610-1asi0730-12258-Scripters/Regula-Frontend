/**
 * @summary Assembler for InventoryDistributorMovementItem → DistributorMovement.
 */

import { DistributorMovement } from '../domain/model/distributor-movement.entity.js'

export class DistributorMovementAssembler {
    static toEntityFromResource(resource) {
        return new DistributorMovement({
            id: resource.id,
            timestamp: resource.timestamp,
            movementType: resource.movementType,
            cylinderType: resource.cylinderType,
            quantity: resource.quantity,
            profileId: resource.profileId,
            providerName: resource.providerName ?? '',
            outboundType: resource.outboundType ?? null,
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
