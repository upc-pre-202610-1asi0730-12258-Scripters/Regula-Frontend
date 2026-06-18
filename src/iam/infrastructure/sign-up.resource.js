/**
 * Infrastructure resource returned after user registration.
 *
 * @class SignUpResource
 */
export class SignUpResource {
    /**
     * @param {Object} params - Resource payload.
     * @param {String} params.message - Outcome message from the registration endpoint.
     */
    constructor({message}) {
        this.message = message;
    }
}