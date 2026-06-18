/**
 * Infrastructure resource returned by the authentication endpoint.
 *
 * @class SignInResource
 */
export class SignInResource {
    /**
     * @param {Object} params - Resource payload.
     * @param {string|number} params.id - Authenticated user identifier.
     * @param {string} params.username - Authenticated username.
     * @param {string} params.token - Bearer token.
     * @param {Array<string>} [params.roles=[]] - Roles associated with the user identity.
     */
    constructor({id, username, token, roles = []}) {
        this.id = id;
        this.username = username;
        this.token = token;
        this.roles = roles;
    }
}