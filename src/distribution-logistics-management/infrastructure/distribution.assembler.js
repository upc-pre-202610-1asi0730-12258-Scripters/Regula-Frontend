import { Delivery } from '../domain/model/delivery.entity.js'
import { Deliverer } from '../domain/model/deliverer.entity.js'

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

  static toDeliveryDTO(domain) {
    return {
      id: domain.id,
      date: domain.date,
      time: domain.time,
      delivererName: domain.delivererName,
      delivererId: domain.delivererId,
      vehicleType: domain.vehicleType,
      vehiclePlate: domain.vehiclePlate,
      cargo: domain.cargo,
      destination: domain.destination,
      status: domain.status,
      eta: domain.eta,
      realTime: domain.realTime,
    }
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
