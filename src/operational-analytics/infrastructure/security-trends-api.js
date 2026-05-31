import { BaseApi } from '@/shared/infrastructure/base-api.js'
import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js'

export class SecurityTrendsApi extends BaseApi {
    #securityAlerts
    #securityZones

    constructor() {
        super()
        this.#securityAlerts = new BaseEndpoint(this, '/securityAlerts')
        this.#securityZones  = new BaseEndpoint(this, '/securityZones')
    }

    getSecurityAlerts() {
        return this.#securityAlerts.getAll()
    }

    getSecurityZones() {
        return this.#securityZones.getAll()
    }
}