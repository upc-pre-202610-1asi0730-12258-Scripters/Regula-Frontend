import {BaseApi} from "@/shared/infrastructure/base-api.js";
import {BaseEndpoint} from "@/shared/infrastructure/base-endpoint.js";

const signInEndpointPath = import.meta.env.VITE_SIGNIN_ENDPOINT_PATH;
const signUpEndpointPath = import.meta.env.VITE_SIGNUP_ENDPOINT_PATH;

/**
 * @summary Infrastructure API service for the Iam bounded context.
 * Talks to the real AuthenticationController (POST /api/v1/authentication/sign-in|sign-up).
 * NOTE: the backend does not currently expose a "list users" endpoint, so that
 * capability was removed here until it exists server-side.
 */
export class IamApi extends BaseApi {
    #signInEndpoint
    #signUpEndpoint

    constructor() {
        super();
        this.#signInEndpoint = new BaseEndpoint(this, signInEndpointPath);
        this.#signUpEndpoint = new BaseEndpoint(this, signUpEndpointPath);
    }

    signIn(signInRequest) {
        return this.#signInEndpoint.create(signInRequest);
    }

    signUp(signUpRequest) {
        return this.#signUpEndpoint.create(signUpRequest);
    }
}