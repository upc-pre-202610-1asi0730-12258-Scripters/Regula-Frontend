/**
 * @summary entity class representing a domain model within the application.
 * Stores and manages the main attributes of a business object.
 * @class DistributorStockCard
 * @author Kevin Lopez
 */

export class DistributorStockCard {
    constructor({
                    id = null,
                    title = '',
                    subtitle = '',
                    unidades = 0,
                    statusKey = '',
                    statusLabel = '',
                    accent = 'success',
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
