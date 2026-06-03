import { Sale } from '../domain/model/sale.entity.js'

export class SaleAssembler {
    static toEntityFromResource(raw) {
        return new Sale(
            raw.id,
            raw.time,
            raw.cylinderType,
            raw.cylinderTypeId,
            raw.quantity,
            raw.paymentType,
            raw.client,
            raw.distributor,
            raw.isNew,
            raw.status
        )
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status} ${response.statusText}`)
            return []
        }

        const resources = response.data instanceof Array
            ? response.data
            : response.data['distributorSales']

        return resources.map((item) => this.toEntityFromResource(item))
    }

    static toResourceFromEntity(domain) {
        return {
            id: domain.id,
            time: domain.time,
            cylinderType: domain.cylinderType,
            cylinderTypeId: domain.cylinderTypeId,
            quantity: domain.quantity,
            paymentType: domain.paymentType,
            client: domain.client,
            distributor: domain.distributor,
            isNew: domain.isNew,
            status: domain.status,
        }
    }
}