export class User{
    constructor({id, username, roles = []}) {
        this.id = id;
        this.username = username;
        this.roles = roles;
    }

    /**
     * Validates if the user belongs to the Retail Gas Company segment.
     * @returns {boolean} True if the user has company permissions.
     */
    isCompany() {
        return this.roles.includes('ROLE_COMPANY');
    }


    /**
     * Validates if the user belongs to the Retail Gas Distributor segment.
     * @returns {boolean} True if the user has distributor permissions.
     */
    isDistributor() {
        return this.roles.includes('ROLE_DISTRIBUTOR');
    }
}