import { BaseApi } from '@/shared/infrastructure/base-api.js'
import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js'
import { DistributionAssembler } from './distribution.assembler.js'

const distributorDeliveriesPath = '/api/v1/delivery-tracking/distributor-deliveries'
const distributorDeliverersPath = '/api/v1/delivery-tracking/distributor-deliverers'
const deliveryResponsiblesPath = '/api/v1/delivery-tracking/delivery-responsibles'
const deliveryVehiclesPath = '/api/v1/delivery-tracking/delivery-vehicles'

export class DistributionApi extends BaseApi {
  #deliveries
  #deliverers
  #responsibles
  #vehicles

  constructor() {
    super()
    this.#deliveries = new BaseEndpoint(this, distributorDeliveriesPath)
    this.#deliverers = new BaseEndpoint(this, distributorDeliverersPath)
    this.#responsibles = new BaseEndpoint(this, deliveryResponsiblesPath)
    this.#vehicles = new BaseEndpoint(this, deliveryVehiclesPath)
  }

  getDistributorDeliveries() {
    return this.#deliveries.getAll()
      .then(res => ({ data: DistributionAssembler.toDeliveryDomainList(res.data) }))
  }

  getDistributorDeliverers() {
    return this.#deliverers.getAll()
      .then(res => ({ data: DistributionAssembler.toDelivererDomainList(res.data) }))
  }

  /** GET /api/v1/delivery-tracking/delivery-responsibles — catálogo real (con datos semilla). */
  getResponsibles() {
    return this.#responsibles.getAll()
      .then(res => ({ data: res.data }))
  }

  /** GET /api/v1/delivery-tracking/delivery-vehicles — catálogo real (con datos semilla). */
  getVehicles() {
    return this.#vehicles.getAll()
      .then(res => ({ data: res.data }))
  }

  /**
   * POST /api/v1/delivery-tracking/distributor-deliveries
   * resource: { driverId, responsibleId, vehicleId, itemCount, cargo, destination, scheduledTime }
   */
  createDelivery(resource) {
    return this.#deliveries.create(resource)
      .then(res => ({ data: DistributionAssembler.toDeliveryDomain(res.data) }))
  }

  /**
   * PATCH /api/v1/delivery-tracking/distributor-deliveries/{id}/status
   * status debe ser uno de: Pending, OnRoute, Delivered, NotDelivered
   * (el backend valida el enum server-side; ver EDeliveryStatus).
   */
  updateDeliveryStatus(id, status, deliveredAt = null) {
    return this.http
      .patch(`${distributorDeliveriesPath}/${id}/status`, { status, deliveredAt })
      .then(res => ({ data: DistributionAssembler.toDeliveryDomain(res.data) }))
  }
}
