export class Sale {
  constructor(
      id,
      time,
      cylinderType,
      cylinderTypeId,
      quantity,
      paymentType,
      client,
      distributor,
      isNew,
      status = 'Activa'
  ) {
    this.id = id
    this.time = time
    this.cylinderType = cylinderType
    this.cylinderTypeId = cylinderTypeId
    this.quantity = Number(quantity) || 0
    this.paymentType = paymentType
    this.client = client
    this.distributor = distributor
    this.isNew = Boolean(isNew)
    this.status = status || 'Activa'
  }
}