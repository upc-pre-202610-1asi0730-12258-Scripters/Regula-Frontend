/**
 * @summary entity class representing a domain model within the application.
 * Stores and manages the main attributes of a business object.
 * @class DistributorMovement
 * @author Kevin Lopez
 */

export class DistributorMovement {
    constructor({
                    id = null,
                    timestamp = null,
                    tipo = '',
                    tipoBalonLabel = '',
                    cantidad = 0,
                    cantidadSign = null,
                    proveedorTipoSalida = '',
                    responsableNombre = '',
                    responsableIsOwner = false,
                }) {
        this.id = id
        this.timestamp = timestamp
        this.tipo = tipo
        this.tipoBalonLabel = tipoBalonLabel
        this.cantidad = cantidad
        this.cantidadSign = cantidadSign
        this.proveedorTipoSalida = proveedorTipoSalida
        this.responsableNombre = responsableNombre
        this.responsableIsOwner = responsableIsOwner
    }
}
