import { Delivery } from '../domain/model/delivery.entity.js'
import { Deliverer } from '../domain/model/deliverer.entity.js'

// EDeliveryStatus (backend) -> label en español que ya usa el front.
const STATUS_TO_BACKEND = {
  'Pendiente': 'Pending',
  'En Ruta': 'OnRoute',
  'Completado': 'Delivered',
  'No entregado': 'NotDelivered',
}

export class DistributionAssembler {
  // ==========================================
  // DELIVERY
  // ==========================================
  static toDeliveryDomain(raw) {
    return new Delivery(
      raw.id,
      raw.date,
      raw.time,
      raw.delivererName,
      raw.delivererId,
      raw.vehicleType,
      raw.vehiclePlate,
      raw.cargo,
      raw.destination,
      raw.status,
      raw.eta,
      raw.realTime ?? null
    )
  }

  static toDeliveryDomainList(rawArray) {
    if (!Array.isArray(rawArray)) return []
    return rawArray.map(this.toDeliveryDomain)
  }

  /**
   * Payload para POST /api/v1/distributor-deliveries (CreateDistributorDeliveryResource).
   * driverId = responsibleId: no existe un catálogo de "conductores" separado en el
   * backend, así que se reutiliza el responsable también como conductor.
   */
  static toCreateResource({ responsibleId, vehicleId, itemCount, cargo, destination, scheduledTime }) {
    return {
      driverId: responsibleId,
      responsibleId,
      vehicleId,
      itemCount: Number(itemCount),
      cargo,
      destination,
      scheduledTime,
    }
  }

  static statusLabelToBackend(label) {
    return STATUS_TO_BACKEND[label] ?? label
  }

  // ==========================================
  // DELIVERER
  // ==========================================
  static toDelivererDomain(raw) {
    return new Deliverer(
      raw.id,
      raw.name,
      raw.vehiclePlate,
      raw.vehicleType,
      raw.status,
      raw.lat ?? null,
      raw.lng ?? null
    )
  }

  static toDelivererDomainList(rawArray) {
    if (!Array.isArray(rawArray)) return []
    return rawArray.map(this.toDelivererDomain)
  }
}
