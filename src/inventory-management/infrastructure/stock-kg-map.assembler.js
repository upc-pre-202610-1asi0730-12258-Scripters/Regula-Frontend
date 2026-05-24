/**
 * @summary Assembler class responsible for transforming API resources
 * into domain entities and collections.
 *
 * @author Kevin Lopez
 */

import { StockKgMap } from '../domain/model/stock-kg-map.entity.js'

export class StockKgMapAssembler {
    static toEntityFromResource(resource) {
        return new StockKgMap({ ...resource })
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status} ${response.statusText}`)
            return []
        }
        let resources = response.data instanceof Array
            ? response.data
            : response.data['stockKgMaps']
        return resources.map((resource) => this.toEntityFromResource(resource))
    }
}
