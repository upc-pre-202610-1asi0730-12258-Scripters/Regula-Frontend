/**
 * Domain command executing the authentication use case.
 *
 * @class SignInCommand
 */
export class SignInCommand {
    /**
     * @param {string}username - Unique username or corporate email entered by the user.
     * @param {string}password - Secure password entered by the user.
     */
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
}