import {SignInResource} from "@/iam/infrastructure/sign-in.resource.js";

/**
 * Infrastructure assembler to map authentication responses.
 *
 * @class SignInAssembler
 */
export class SignInAssembler {
    /**
     * Maps an HTTP response payload into a SignInResource instance.
     * @param {import('axios').AxiosResponse} response - HTTP response client.
     * @returns {SignInResource}
     */
    static toResourceFromResponse(response) {
        if(!response || !response.data) return null;
        const { id, username, token, roles } = response.data;
        return new SignInResource({ id, username, token, roles });
    }
}