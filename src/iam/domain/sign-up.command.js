/**
 * Domain command executing the registration use case.
 *
 * @class SignUpCommand
 */
export class SignUpCommand {
    /**
     * @param username - Unique username or corporate email.
     * @param password - Secure selected password.
     */
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
}
