export class Delivery {
  constructor(id, date, time, delivererName, delivererId, vehicleType, vehiclePlate, cargo, destination, status, eta, realTime) {
    this.id = id                     // numeric id from the backend (Delivery.Id)
    this.date = date
    this.time = time
    this.delivererName = delivererName
    this.delivererId = delivererId   // ResponsibleId
    this.vehicleType = vehicleType   // 'Moto' | 'Camión' | 'Camioneta'
    this.vehiclePlate = vehiclePlate
    this.cargo = cargo               // e.g. '3 balones'
    this.destination = destination
    this.status = status             // 'Pendiente' | 'En Ruta' | 'Completado' | 'No entregado'
    this.eta = eta                   // e.g. '14:30'
    this.realTime = realTime         // e.g. '14:25' or null
  }

  get displayId() {
    return `#${String(this.id).padStart(3, '0')}`
  }

  get timeDiffMinutes() {
    if (!this.eta || !this.realTime) return null
    const [eh, em] = this.eta.split(':').map(Number)
    const [rh, rm] = this.realTime.split(':').map(Number)
    return (rh * 60 + rm) - (eh * 60 + em)
  }

  get isOnTime() {
    const diff = this.timeDiffMinutes
    return diff !== null && diff <= 0
  }
}
