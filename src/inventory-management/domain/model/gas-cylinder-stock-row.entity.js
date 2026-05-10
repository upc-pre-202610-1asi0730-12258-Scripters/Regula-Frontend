/**
 * Enterprise centralized inventory row for gas cylinders.
 */
export class GasCylinderStockRow {
    /**
     * @param {Object} row
     * @param {number|string} row.id
     * @param {string} row.badgeLabel
     * @param {string} row.tipoNombre
     * @param {number} row.disponible
     * @param {number} row.enTransito
     * @param {number} row.observado
     * @param {number} row.fueraServicio
     * @param {number} row.total
     * @param {boolean} [row.warnDisponible]
     * @param {boolean} [row.warnObservado]
     * @param {boolean} [row.highlightDisponible]
     * @param {boolean} [row.highlightObservado]
     */
    constructor({
                    id,
                    badgeLabel,
                    tipoNombre,
                    disponible,
                    enTransito,
                    observado,
                    fueraServicio,
                    total,
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
