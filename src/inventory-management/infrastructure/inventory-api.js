import { BaseApi } from '@/shared/infrastructure/base-api.js'
import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js'

const enterprisePath = import.meta.env.VITE_ENTERPRISE_STOCK_ENDPOINT
const distributorPath = import.meta.env.VITE_DISTRIBUTOR_STOCK_ENDPOINT
const originsPath = import.meta.env.VITE_ORIGINS_ENDPOINT
const providersPath = import.meta.env.VITE_PROVIDERS_ENDPOINT
const stockKgMapsPath = import.meta.env.VITE_STOCK_KG_MAPS_ENDPOINT
const enterpriseMovementsPath = import.meta.env.VITE_ENTERPRISE_MOVEMENTS_ENDPOINT
const distributorMovementsPath = import.meta.env.VITE_DISTRIBUTOR_MOVEMENTS_ENDPOINT
const auditLogsPath = import.meta.env.VITE_AUDIT_LOGS_ENDPOINT

export class InventoryApi extends BaseApi {
    #enterprise
    #distributor
    #origins
    #providers
    #stockKgMaps
    #enterpriseMovements
    #distributorMovements
    #auditLogs

    constructor() {
        super()
        this.#enterprise = new BaseEndpoint(this, enterprisePath)
        this.#distributor = new BaseEndpoint(this, distributorPath)
        this.#origins = new BaseEndpoint(this, originsPath)
        this.#providers = new BaseEndpoint(this, providersPath)
        this.#stockKgMaps = new BaseEndpoint(this, stockKgMapsPath)
        this.#enterpriseMovements = new BaseEndpoint(this, enterpriseMovementsPath)
        this.#distributorMovements = new BaseEndpoint(this, distributorMovementsPath)
        this.#auditLogs = new BaseEndpoint(this, auditLogsPath)
    }

    getEnterpriseStockRows() {
        return this.#enterprise.getAll()
    }

    getDistributorStockCards() {
        return this.#distributor.getAll()
    }

    getOrigins() {
        return this.#origins.getAll()
    }

    getProviders() {
        return this.#providers.getAll()
    }

    getStockKgMaps() {
        return this.#stockKgMaps.getAll()
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
}
