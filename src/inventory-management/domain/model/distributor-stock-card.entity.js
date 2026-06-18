/**
 * @summary Distributor stock card aligned with InventoryStockItem from the backend.
 * @class DistributorStockCard
 */

export class DistributorStockCard {
    constructor({
                    id = null,
                    cylinderType = '',
                    available = 0,
                }) {
        this.id = id
        this.cylinderType = cylinderType
        this.available = available
    }
}
