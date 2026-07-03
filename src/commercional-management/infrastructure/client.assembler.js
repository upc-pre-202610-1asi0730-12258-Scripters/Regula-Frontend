import { Client } from '../domain/model/client.entity.js'

export class ClientAssembler {
    static toEntityFromResource(raw) {
        return new Client(
            raw.id,
            raw.name,
            raw.activeDebt,
            raw.debtCount
        )
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status} ${response.statusText}`)
            return []
        }

        const resources = response.data instanceof Array
            ? response.data
            : response.data['commercialClients']

        return resources.map((item) => this.toEntityFromResource(item))
    }

    static toResourceFromEntity(domain) {
        return {
            id: domain.id,
            name: domain.name,
            activeDebt: domain.activeDebt,
            debtCount: domain.debtCount,
        }
    }
}