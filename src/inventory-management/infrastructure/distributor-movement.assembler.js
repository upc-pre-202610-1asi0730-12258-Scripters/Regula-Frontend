/**
 * @summary Maps InventoryDistributorMovementItem (real backend resource) to
 * the DistributorMovement domain entity used by the history panel.
 */

import { DistributorMovement } from '../domain/model/distributor-movement.entity.js'
import { backendCylinderTypeToLabel, outboundTypeToLabel } from './cylinder-type.helper.js'

export class DistributorMovementAssembler {
    /**
     * @param {object} resource - InventoryDistributorMovementItem
     * @param {string} currentUsername - the authenticated distributor's username,
     *   since the backend only returns a numeric ProfileId (no name to join against).
     */
    static toEntityFromResource(resource, currentUsername) {
        const isEntry = resource.movementType === 'Entry'
        return new DistributorMovement({
            id: resource.id,
            timestamp: resource.timestamp,
            tipo: isEntry ? 'Entrada' : 'Salida',
            tipoBalonLabel: backendCylinderTypeToLabel(resource.cylinderType),
            cantidad: resource.quantity,
            cantidadSign: isEntry ? 1 : -1,
            proveedorTipoSalida: isEntry
                ? resource.providerName
                : outboundTypeToLabel(resource.outboundType),
            responsableNombre: currentUsername || 'Tú',
            responsableIsOwner: true,
        })
    }

    static toEntitiesFromResponse(response, currentUsername) {
        if (response.status !== 200) {
            console.error(`${response.status} ${response.statusText}`)
            return []
        }
        const resources = Array.isArray(response.data) ? response.data : []
        return resources.map((item) => this.toEntityFromResource(item, currentUsername))
    }
}
