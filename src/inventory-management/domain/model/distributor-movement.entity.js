/**
 * @summary Distributor movement aligned with InventoryDistributorMovementItem from the backend.
 * @class DistributorMovement
 */

export class DistributorMovement {
    constructor({
                    id = null,
                    timestamp = null,
                    movementType = '',
                    cylinderType = '',
                    quantity = 0,
                    profileId = null,
                    providerName = '',
                    outboundType = null,
                }) {
        this.id = id
        this.timestamp = timestamp
        this.movementType = movementType
        this.cylinderType = cylinderType
        this.quantity = quantity
        this.profileId = profileId
        this.providerName = providerName
        this.outboundType = outboundType
    }
}
