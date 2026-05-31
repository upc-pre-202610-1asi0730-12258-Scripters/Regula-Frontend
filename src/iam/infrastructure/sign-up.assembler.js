import {SignUpResource} from "@/iam/infrastructure/sign-up.resource.js";
/**
 * Infrastructure assembler to map registration responses.
 *
 * @class SignUpAssembler
 */
export class SignUpAssembler {
    /**
     * Maps an HTTP response payload into a SignUpResource instance.
     * @param {import('axios').AxiosResponse} response - HTTP response client.
     * @returns {SignUpResource}
     */
    static toResourceFromResponse(response) {
        if (!response || !response.data) return null;
        const { message } = response.data;
        return new SignUpResource({ message });
    }
}