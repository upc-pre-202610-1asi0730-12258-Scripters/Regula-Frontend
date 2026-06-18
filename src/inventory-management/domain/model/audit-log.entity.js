/**
 * @summary entity class representing a domain model within the application.
 * Stores and manages the main attributes of a business object.
 * @class AuditLog
 * @author Kevin Lopez
 */

export class AuditLog {
    constructor({
                    id = null,
                    modulo = '',
                    tipoOperacion = '',
                    datosIngresados = '',
                    usuarioNombre = '',
                    fechaHora = '',
                    valorAnterior = '',
                    valorNuevo = '',
                    accionEstado = '',
                }) {
        this.id = id
        this.modulo = modulo
        this.tipoOperacion = tipoOperacion
        this.datosIngresados = datosIngresados
        this.usuarioNombre = usuarioNombre
        this.fechaHora = fechaHora
        this.valorAnterior = valorAnterior
        this.valorNuevo = valorNuevo
        this.accionEstado = accionEstado
    }
}
