/**
 * @summary entity class representing a domain model within the application.
 * Stores and manages the main attributes of a business object.
 * @class Provider
 * @author Kevin Lopez
 */

export class Provider {
    constructor({ id = null, name = '' }) {
        this.id = id
        this.name = name
    }
}
