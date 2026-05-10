import { DistributorStockCard } from '../domain/model/distributor-stock-card.entity.js'
import { GasCylinderStockRow } from '../domain/model/gas-cylinder-stock-row.entity.js'

export class InventoryStockAssembler {
    /**
     * @param {Object[]} rows
     * @returns {GasCylinderStockRow[]}
     */
    static toEnterpriseEntitiesFromResponse(rows) {
        return (rows || []).map(
            (row) =>
                new GasCylinderStockRow({
                    id: row.id,
                    badgeLabel: row.badgeLabel,
                    tipoNombre: row.tipoNombre,
                    disponible: row.disponible,
                    enTransito: row.enTransito,
                    observado: row.observado,
                    fueraServicio: row.fueraServicio,
                    total: row.total,
                    warnDisponible: Boolean(row.warnDisponible),
                    warnObservado: Boolean(row.warnObservado),
                    highlightDisponible: Boolean(row.highlightDisponible),
                    highlightObservado: Boolean(row.highlightObservado),
                }),
        )
    }

    /**
     * @param {Object[]} cards
     * @returns {DistributorStockCard[]}
     */
    static toDistributorEntitiesFromResponse(cards) {
        return (cards || []).map(
            (card) =>
                new DistributorStockCard({
                    id: card.id,
                    title: card.title,
                    subtitle: card.subtitle,
                    unidades: card.unidades,
                    statusKey: card.statusKey,
                    statusLabel: card.statusLabel,
                    accent: card.accent,
                    footerHint: card.footerHint,
                    showRegistrarEntrada: Boolean(card.showRegistrarEntrada),
                }),
        )
    }
}
