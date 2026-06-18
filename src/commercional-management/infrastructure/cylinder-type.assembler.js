import { CylinderType } from '../domain/model/cylinder-type.entity.js'

export class CylinderTypeAssembler {
    static toEntityFromResource(raw) {
        return new CylinderType(
            raw.id,
            raw.label,
            raw.price,
            raw.stock
        )
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status} ${response.statusText}`)
            return []
        }

        const resources = response.data instanceof Array
            ? response.data
            : response.data['commercialCylinderTypes']

        return resources.map((item) => this.toEntityFromResource(item))
    }

    static toResourceFromEntity(domain) {
        return {
            id: domain.id,
            label: domain.label,
            price: domain.price,
            stock: domain.stock,
        }
    }
}