import { DebtMovement } from '../domain/model/debt-movement.entity.js'

export class DebtMovementAssembler {
    static toEntityFromResource(raw) {
        return new DebtMovement(
            raw.id,
            raw.date,
            raw.time,
            raw.type,
            raw.client,
            raw.description,
            raw.amount,
            raw.balance,
            raw.user,
            raw.status,
            raw.relatedDebtId,
            raw.relatedSaleId
        )
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status} ${response.statusText}`)
            return []
        }

        const resources = response.data instanceof Array
            ? response.data
            : response.data['commercialDebtMovements']

        return resources.map((item) => this.toEntityFromResource(item))
    }

    static toResourceFromEntity(domain) {
        return {
            id: domain.id,
            date: domain.date,
            time: domain.time,
            type: domain.type,
            client: domain.client,
            description: domain.description,
            amount: domain.amount,
            balance: domain.balance,
            user: domain.user,
            status: domain.status,
            relatedDebtId: domain.relatedDebtId,
            relatedSaleId: domain.relatedSaleId,
        }
    }
}