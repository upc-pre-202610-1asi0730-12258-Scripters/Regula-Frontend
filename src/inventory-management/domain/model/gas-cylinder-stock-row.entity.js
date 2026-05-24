/**
 * @summary entity class representing a domain model within the application.
 * Stores and manages the main attributes of a business object.
 * @class GasCylinderStockRow
 * @author Kevin Lopez
 */

export class GasCylinderStockRow {
    constructor({
                    id = null,
                    badgeLabel = '',
                    tipoNombre = '',
                    disponible = 0,
                    enTransito = 0,
                    observado = 0,
                    fueraServicio = 0,
                    total = 0,
                    warnDisponible = false,
                    warnObservado = false,
                    highlightDisponible = false,
                    highlightObservado = false,
                }) {
        this.id = id
        this.badgeLabel = badgeLabel
        this.tipoNombre = tipoNombre
        this.disponible = disponible
        this.enTransito = enTransito
        this.observado = observado
        this.fueraServicio = fueraServicio
        this.total = total
        this.warnDisponible = warnDisponible
        this.warnObservado = warnObservado
        this.highlightDisponible = highlightDisponible
        this.highlightObservado = highlightObservado
    }
}
