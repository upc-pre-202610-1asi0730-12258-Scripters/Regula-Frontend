/**
 * @summary entity class representing a domain model within the application.
 * Stores and manages the main attributes of a business object.
 * @class InventoryMovement
 * @author Kevin Lopez
 */

export class InventoryMovement {
    constructor({
                    id = null,
                    timestamp = null,
                    tipo = '',
                    tipoBalonKey = '',
                    tipoBalonLabel = '',
                    cantidad = 0,
                    cantidadSign = null,
                    procedenciaDestino = '',
                    motivo = '',
                    usuarioNombre = '',
                    usuarioAvatar = null,
                    observaciones = '',
                }) {
        this.id = id
        this.timestamp = timestamp
        this.tipo = tipo
        this.tipoBalonKey = tipoBalonKey
        this.tipoBalonLabel = tipoBalonLabel
        this.cantidad = cantidad
        this.cantidadSign = cantidadSign
        this.procedenciaDestino = procedenciaDestino
        this.motivo = motivo
        this.usuarioNombre = usuarioNombre
        this.usuarioAvatar = usuarioAvatar
        this.observaciones = observaciones
    }
}
