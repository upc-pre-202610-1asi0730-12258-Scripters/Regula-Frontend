/**
 * @summary entity class representing a domain model within the application.
 * Stores and manages the main attributes of a business object.
 * @class Origin
 * @author Kevin Lopez
 */

export class Origin {
    constructor({ id = null, name = '' }) {
        this.id = id
        this.name = name
    }
}
