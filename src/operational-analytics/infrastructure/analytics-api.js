import { BaseApi } from '@/shared/infrastructure/base-api.js'
import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js'

const enterpriseMovementsPath = import.meta.env.VITE_ENTERPRISE_MOVEMENTS_ENDPOINT
const distributorMovementsPath = import.meta.env.VITE_DISTRIBUTOR_MOVEMENTS_ENDPOINT
const auditLogsPath            = import.meta.env.VITE_AUDIT_LOGS_ENDPOINT
const enterprisePath           = import.meta.env.VITE_ENTERPRISE_STOCK_ENDPOINT

export class AnalyticsApi extends BaseApi {
    #enterpriseMovements
    #distributorMovements
    #auditLogs
    #enterpriseStock

    constructor() {
        super()
        this.#enterpriseMovements  = new BaseEndpoint(this, enterpriseMovementsPath)
        this.#distributorMovements = new BaseEndpoint(this, distributorMovementsPath)
        this.#auditLogs            = new BaseEndpoint(this, auditLogsPath)
        this.#enterpriseStock      = new BaseEndpoint(this, enterprisePath)
    }

    getEnterpriseMovements() {
        return this.#enterpriseMovements.getAll()
    }

    getDistributorMovements() {
        return this.#distributorMovements.getAll()
    }

    getAuditLogs() {
        return this.#auditLogs.getAll()
    }

    getEnterpriseStock() {
        return this.#enterpriseStock.getAll()
    }
}
