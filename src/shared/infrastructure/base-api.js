import axios from 'axios'

const platformApi = import.meta.env.VITE_API_BASE_URL

/**
 * Base HTTP client for Regula platform APIs.
 * Attaches the JWT issued by the Iam module (if present) to every request,
 * and reacts to 401 responses by clearing the stale session.
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

        this.#http.interceptors.request.use((config) => {
            const token = localStorage.getItem('token')
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
            return config
        })

        this.#http.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    localStorage.removeItem('token')
                    localStorage.removeItem('regula_username')
                    localStorage.removeItem('regula_user_id')
                }
                return Promise.reject(error)
            },
        )
    }

    get http() {
        return this.#http
    }
}
