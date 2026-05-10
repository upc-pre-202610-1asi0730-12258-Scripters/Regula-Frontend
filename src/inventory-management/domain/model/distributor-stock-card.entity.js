/**
 * Distributor-facing stock card for a single product SKU.
 */
export class DistributorStockCard {
    /**
     * @param {Object} card
     * @param {number|string} card.id
     * @param {string} card.title
     * @param {string} card.subtitle
     * @param {number} card.unidades
     * @param {string} card.statusKey
     * @param {string} card.statusLabel
     * @param {'danger'|'warning'|'success'} card.accent
     * @param {string|null} [card.footerHint]
     * @param {boolean} [card.showRegistrarEntrada]
     */
    constructor({
                    id,
                    title,
                    subtitle,
                    unidades,
                    statusKey,
                    statusLabel,
                    accent,
                    footerHint = null,
                    showRegistrarEntrada = false,
                }) {
        this.id = id
        this.title = title
        this.subtitle = subtitle
        this.unidades = unidades
        this.statusKey = statusKey
        this.statusLabel = statusLabel
        this.accent = accent
        this.footerHint = footerHint
        this.showRegistrarEntrada = showRegistrarEntrada
    }
}
