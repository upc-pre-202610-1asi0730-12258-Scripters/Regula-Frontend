import { BaseApi } from '@/shared/infrastructure/base-api.js'
import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js'

// NOTE: this dashboard is still backed by mock endpoints end-to-end (its own
// copies of stock/sales/clients/debts/deliveries data, independent from the
// real backend integrations done in Iam / Delivery Tracking / Commercial
// Management / Inventory Management). Migrating it is a separate task.

const distributorStockCardsPath =
    import.meta.env.VITE_DISTRIBUTOR_STOCK_ENDPOINT || '/distributorStockCards'

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

const distributorDeliveriesPath =
    import.meta.env.VITE_DISTRIBUTOR_DELIVERIES_ENDPOINT || '/distributorDeliveries'

export class DashboardApi extends BaseApi {
    #distributorStockCards
    #distributorMovements
    #commercialCylinderTypes
    #distributorSales
    #commercialClients
    #commercialDebtMovements
    #distributorDeliveries

    constructor() {
        super()

        this.#distributorStockCards = new BaseEndpoint(this, distributorStockCardsPath)
        this.#distributorMovements = new BaseEndpoint(this, distributorMovementsPath)
        this.#commercialCylinderTypes = new BaseEndpoint(this, commercialCylinderTypesPath)
        this.#distributorSales = new BaseEndpoint(this, distributorSalesPath)
        this.#commercialClients = new BaseEndpoint(this, commercialClientsPath)
        this.#commercialDebtMovements = new BaseEndpoint(this, commercialDebtMovementsPath)
        this.#distributorDeliveries = new BaseEndpoint(this, distributorDeliveriesPath)
    }

    getDistributorStockCards() {
        return this.#distributorStockCards.getAll()
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

    getDistributorDeliveries() {
        return this.#distributorDeliveries.getAll()
    }
}
