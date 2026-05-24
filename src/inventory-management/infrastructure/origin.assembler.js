/**
 * @summary Assembler class responsible for transforming API resources
 * into domain entities and collections.
 *
 * @author Kevin Lopez
 */

import { Origin } from '../domain/model/origin.entity.js'

export class OriginAssembler {
    static toEntityFromResource(resource) {
        return new Origin({ ...resource })
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status} ${response.statusText}`)
            return []
        }
        let resources = response.data instanceof Array
            ? response.data
            : response.data['origins']
        return resources.map((resource) => this.toEntityFromResource(resource))
    }
}
