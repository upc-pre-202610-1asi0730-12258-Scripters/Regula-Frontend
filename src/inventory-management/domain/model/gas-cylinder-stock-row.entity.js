/**
 * @summary Stock row aligned with InventoryStockItem from the backend.
 * @class GasCylinderStockRow
 */

export class GasCylinderStockRow {
    constructor({
                    id = null,
                    cylinderType = '',
                    available = 0,
                    inTransit = 0,
                    observed = 0,
                    outOfService = 0,
                }) {
        this.id = id
        this.cylinderType = cylinderType
        this.available = available
        this.inTransit = inTransit
        this.observed = observed
        this.outOfService = outOfService
        this.total = available + inTransit + observed + outOfService
    }
}
