/**
 * @summary Assembler class responsible for transforming API resources
 * into domain entities and collections.
 *
 * @author Kevin Lopez
 */

import { DistributorStockCard } from '../domain/model/distributor-stock-card.entity.js'

export class DistributorStockCardAssembler {
    static toEntityFromResource(resource) {
        return new DistributorStockCard({ ...resource })
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status} ${response.statusText}`)
            return []
        }
        let resources = response.data instanceof Array
            ? response.data
            : response.data['distributorStockCards']
        return resources.map((resource) => this.toEntityFromResource(resource))
    }
}
