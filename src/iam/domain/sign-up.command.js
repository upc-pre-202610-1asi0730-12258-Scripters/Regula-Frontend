/**
 * Domain command executing the registration use case.
 *
 * @class SignUpCommand
 */
export class SignUpCommand {
    /**
     * @param username - Unique username or corporate email.
     * @param password - Secure selected password.
     * @param role - The assigned business role ('ROLE_COMPANY' or 'ROLE_DISTRIBUTOR').
     */
    constructor(username, password, role) {
        this.username = username;
        this.password = password;
        this.role = role;
    }
}