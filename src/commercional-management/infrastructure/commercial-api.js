import { BaseApi } from '@/shared/infrastructure/base-api.js'
import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js'

const dailySalesPath = '/api/v1/daily-sales'

/**
 * Infrastructure API service for Commercial Management.
 *
 * NOTE: the backend only exposes GET/POST on /api/v1/daily-sales and a
 * write-only POST on /api/v1/customer-debts (which requires an existing
 * CustomerId — there is no endpoint to list/create customers). Because of
 * that, everything related to a cylinder-type catalog with stock, a client
 * directory, and debt movements (list/pay/cancel) has no real backend
 * support and was removed rather than left calling endpoints that don't
 * exist.
 */
export class CommercialApi extends BaseApi {
    #dailySalesEndpoint

    constructor() {
        super()
        this.#dailySalesEndpoint = new BaseEndpoint(this, dailySalesPath)
    }

    getDistributorSales() {
        return this.#dailySalesEndpoint.getAll()
    }

    createDistributorSale(resource) {
        return this.#dailySalesEndpoint.create(resource)
    }
}