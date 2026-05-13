import axios from 'axios'

const platformApi = import.meta.env.VITE_API_BASE_URL

/**
 * Base HTTP client for Regula platform APIs.
 */
export class BaseApi {
    #http

    constructor() {
        this.#http = axios.create({
            baseURL: platformApi,
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }

    get http() {
        return this.#http
    }
}
