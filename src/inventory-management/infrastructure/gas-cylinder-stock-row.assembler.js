/**
 * @summary Assembler class responsible for transforming API resources
 * into domain entities and collections.
 *
 * @author Kevin Lopez
 */

import { GasCylinderStockRow } from '../domain/model/gas-cylinder-stock-row.entity.js'

export class GasCylinderStockRowAssembler {
    static toEntityFromResource(resource) {
        return new GasCylinderStockRow({ ...resource })
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status} ${response.statusText}`)
            return []
        }
        let resources = response.data instanceof Array
            ? response.data
            : response.data['enterpriseStockRows']
        return resources.map((resource) => this.toEntityFromResource(resource))
    }
}
