import db from './fixtures/db.json'

function ok(data) {
    return Promise.resolve({ data })
}

export class InventoryApi {
    getEnterpriseStockRows() {
        return ok(db.enterpriseStockRows ?? [])
    }

    getDistributorStockCards() {
        return ok(db.distributorStockCards ?? [])
    }

    getOrigins() {
        return ok(db.origins ?? [])
    }

    getProviders() {
        return ok(db.providers ?? [])
    }

    getStockKgMaps() {
        return ok(db.stockKgMaps ?? [])
    }

    getEnterpriseMovements() {
        return ok(db.enterpriseMovements ?? [])
    }

    getDistributorMovements() {
        return ok(db.distributorMovements ?? [])
    }

    getAuditLogs() {
        return ok(db.auditLogs ?? [])
    }
}
