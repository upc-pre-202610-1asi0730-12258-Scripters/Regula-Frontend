/**
 * @summary entity class representing a domain model within the application.
 * Stores and manages the main attributes of a business object.
 * @class StockKgMap
 * @author Kevin Lopez
 */

export class StockKgMap {
    constructor({ id = null, weights = {} }) {
        this.id = id
        this.weights = weights
    }
}
