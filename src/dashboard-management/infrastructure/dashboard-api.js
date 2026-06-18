import { BaseApi } from '@/shared/infrastructure/base-api.js'
import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js'

const enterpriseStockRowsPath =
    import.meta.env.VITE_ENTERPRISE_STOCK_ENDPOINT || '/enterpriseStockRows'

const distributorStockCardsPath =
    import.meta.env.VITE_DISTRIBUTOR_STOCK_ENDPOINT || '/distributorStockCards'

const enterpriseMovementsPath =
    import.meta.env.VITE_ENTERPRISE_MOVEMENTS_ENDPOINT || '/enterpriseMovements'

const distributorMovementsPath =
    import.meta.env.VITE_DISTRIBUTOR_MOVEMENTS_ENDPOINT || '/distributorMovements'

const commercialCylinderTypesPath =
    import.meta.env.VITE_COMMERCIAL_CYLINDER_TYPES_ENDPOINT || '/commercialCylinderTypes'

const distributorSalesPath =
    import.meta.env.VITE_DISTRIBUTOR_SALES_ENDPOINT || '/distributorSales'

const commercialClientsPath =
    import.meta.env.VITE_COMMERCIAL_CLIENTS_ENDPOINT || '/commercialClients'

const commercialDebtMovementsPath =
    import.meta.env.VITE_COMMERCIAL_DEBT_MOVEMENTS_ENDPOINT || '/commercialDebtMovements'

const alertsPath =
    import.meta.env.VITE_ALERTS_ENDPOINT || '/alerts'

const warehousesPath =
    import.meta.env.VITE_WAREHOUSES_ENDPOINT || '/warehouses'

const companyAlertsPath =
    import.meta.env.VITE_COMPANY_ALERTS_ENDPOINT || '/companyAlerts'

const distributorDeliveriesPath =
    import.meta.env.VITE_DISTRIBUTOR_DELIVERIES_ENDPOINT || '/distributorDeliveries'

export class DashboardApi extends BaseApi {
    #enterpriseStockRows
    #distributorStockCards
    #enterpriseMovements
    #distributorMovements
    #commercialCylinderTypes
    #distributorSales
    #commercialClients
    #commercialDebtMovements
    #alerts
    #warehouses
    #companyAlerts
    #distributorDeliveries

    constructor() {
        super()

        this.#enterpriseStockRows = new BaseEndpoint(this, enterpriseStockRowsPath)
        this.#distributorStockCards = new BaseEndpoint(this, distributorStockCardsPath)
        this.#enterpriseMovements = new BaseEndpoint(this, enterpriseMovementsPath)
        this.#distributorMovements = new BaseEndpoint(this, distributorMovementsPath)
        this.#commercialCylinderTypes = new BaseEndpoint(this, commercialCylinderTypesPath)
        this.#distributorSales = new BaseEndpoint(this, distributorSalesPath)
        this.#commercialClients = new BaseEndpoint(this, commercialClientsPath)
        this.#commercialDebtMovements = new BaseEndpoint(this, commercialDebtMovementsPath)
        this.#alerts = new BaseEndpoint(this, alertsPath)
        this.#warehouses = new BaseEndpoint(this, warehousesPath)
        this.#companyAlerts = new BaseEndpoint(this, companyAlertsPath)
        this.#distributorDeliveries = new BaseEndpoint(this, distributorDeliveriesPath)
    }

    getEnterpriseStockRows() {
        return this.#enterpriseStockRows.getAll()
    }

    getDistributorStockCards() {
        return this.#distributorStockCards.getAll()
    }

    getEnterpriseMovements() {
        return this.#enterpriseMovements.getAll()
    }

    getDistributorMovements() {
        return this.#distributorMovements.getAll()
    }

    getCommercialCylinderTypes() {
        return this.#commercialCylinderTypes.getAll()
    }

    getDistributorSales() {
        return this.#distributorSales.getAll()
    }

    getCommercialClients() {
        return this.#commercialClients.getAll()
    }

    getCommercialDebtMovements() {
        return this.#commercialDebtMovements.getAll()
    }

    getAlerts() {
        return this.#alerts.getAll()
    }

    getWarehouses() {
        return this.#warehouses.getAll()
    }

    getCompanyAlerts() {
        return this.#companyAlerts.getAll()
    }

    getDistributorDeliveries() {
        return this.#distributorDeliveries.getAll()
    }
}