/**
 * @summary Company movement aligned with InventoryCompanyMovementItem from the backend.
 * @class InventoryMovement
 */

export class InventoryMovement {
    constructor({
                    id = null,
                    timestamp = null,
                    movementType = '',
                    cylinderType = '',
                    quantity = 0,
                    profileId = null,
                    providerName = '',
                    destination = '',
                    movementReason = '',
                    observation = '',
                }) {
        this.id = id
        this.timestamp = timestamp
        this.movementType = movementType
        this.cylinderType = cylinderType
        this.quantity = quantity
        this.profileId = profileId
        this.providerName = providerName
        this.destination = destination
        this.movementReason = movementReason
        this.observation = observation
    }
}
