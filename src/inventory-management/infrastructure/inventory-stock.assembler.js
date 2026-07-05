import { DistributorStockCard } from '../domain/model/distributor-stock-card.entity.js'
import { backendCylinderTypeToLabel, backendCylinderTypeToKgKey } from './cylinder-type.helper.js'

const LOW_STOCK_THRESHOLD = 10

export class InventoryStockAssembler {
    /**
     * @param {import('axios').AxiosResponse} response - array of InventoryStockItem
     * @returns {DistributorStockCard[]}
     */
    static toStockCardsFromResponse(response) {
        const items = Array.isArray(response?.data) ? response.data : []
        return items.map((item) => {
            const isLow = item.available < LOW_STOCK_THRESHOLD
            return new DistributorStockCard({
                id: item.id,
                title: backendCylinderTypeToLabel(item.cylinderType),
                subtitle: 'Disponible en tu local',
                unidades: item.available,
                statusKey: isLow ? 'low' : 'ok',
                statusLabel: isLow ? 'Stock bajo' : 'Disponible',
                accent: isLow ? 'danger' : 'success',
                footerHint: isLow ? 'Este tipo de balón está por agotarse.' : null,
                showRegistrarEntrada: isLow,
            })
        })
    }

    /**
     * Raw availability keyed by frontend weight key ('5' | '10' | '15' | '45'),
     * used by the entry/exit forms to show a live "current stock" preview.
     * @param {import('axios').AxiosResponse} response
     * @returns {Record<string, number>}
     */
    static toAvailableByKgKey(response) {
        const items = Array.isArray(response?.data) ? response.data : []
        const map = {}
        for (const item of items) {
            const kgKey = backendCylinderTypeToKgKey(item.cylinderType)
            if (kgKey) map[kgKey] = item.available
        }
        return map
    }
}
