import { BaseApi } from '@/shared/infrastructure/base-api.js'
import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js'

const commercialCylinderTypesPath = '/commercialCylinderTypes'
const distributorSalesPath = '/distributorSales'
const commercialClientsPath = '/commercialClients'
const commercialDebtMovementsPath = '/commercialDebtMovements'

export class CommercialApi extends BaseApi {
    #commercialCylinderTypesEndpoint
    #distributorSalesEndpoint
    #commercialClientsEndpoint
    #commercialDebtMovementsEndpoint

    constructor() {
        super()
        this.#commercialCylinderTypesEndpoint = new BaseEndpoint(this, commercialCylinderTypesPath)
        this.#distributorSalesEndpoint = new BaseEndpoint(this, distributorSalesPath)
        this.#commercialClientsEndpoint = new BaseEndpoint(this, commercialClientsPath)
        this.#commercialDebtMovementsEndpoint = new BaseEndpoint(this, commercialDebtMovementsPath)
    }

    getCommercialCylinderTypes() {
        return this.#commercialCylinderTypesEndpoint.getAll()
    }

    updateCommercialCylinderType(id, resource) {
        return this.#commercialCylinderTypesEndpoint.update(id, resource)
    }

    getDistributorSales() {
        return this.#distributorSalesEndpoint.getAll()
    }

    createDistributorSale(resource) {
        return this.#distributorSalesEndpoint.create(resource)
    }

    updateDistributorSale(id, resource) {
        return this.#distributorSalesEndpoint.update(encodeURIComponent(id), resource)
    }

    getCommercialClients() {
        return this.#commercialClientsEndpoint.getAll()
    }

    createCommercialClient(resource) {
        return this.#commercialClientsEndpoint.create(resource)
    }

    updateCommercialClient(id, resource) {
        return this.#commercialClientsEndpoint.update(id, resource)
    }

    getCommercialDebtMovements() {
        return this.#commercialDebtMovementsEndpoint.getAll()
    }

    createCommercialDebtMovement(resource) {
        return this.#commercialDebtMovementsEndpoint.create(resource)
    }

    updateCommercialDebtMovement(id, resource) {
        return this.#commercialDebtMovementsEndpoint.update(encodeURIComponent(id), resource)
    }
}