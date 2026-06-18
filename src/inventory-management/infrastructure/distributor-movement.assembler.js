/**
 * @summary Assembler class responsible for transforming API resources
 * into domain entities and collections.
 *
 * @author Kevin Lopez
 */

import { DistributorMovement } from '../domain/model/distributor-movement.entity.js'

export class DistributorMovementAssembler {
    static toEntityFromResource(resource) {
        return new DistributorMovement({ ...resource })
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status} ${response.statusText}`)
            return []
        }
        let resources = response.data instanceof Array
            ? response.data
            : response.data['distributorMovements']
        return resources.map((resource) => this.toEntityFromResource(resource))
    }
}
