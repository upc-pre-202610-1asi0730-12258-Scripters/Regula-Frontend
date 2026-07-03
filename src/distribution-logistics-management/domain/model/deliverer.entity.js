export class Deliverer {
  constructor(id, name, vehiclePlate, vehicleType, status, lat, lng) {
    this.id = id
    this.name = name
    this.vehiclePlate = vehiclePlate
    this.vehicleType = vehicleType  // 'Moto' | 'Camión' | 'Camioneta'
    this.status = status            // 'En ruta' | 'Completado' | 'Sin señal'
    this.lat = lat
    this.lng = lng
  }

  get initials() {
    return this.name
      .split(' ')
      .slice(0, 2)
      .map(w => w[0].toUpperCase())
      .join('')
  }
}
