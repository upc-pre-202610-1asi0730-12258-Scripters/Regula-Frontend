export class Sale {
  constructor(
      id,
      transactionCode,
      time,
      cylinderType,
      cylinderTypeId,
      quantity,
      unitPrice,
      totalAmount,
      paymentType,
      client,
      distributor,
      isNew,
      status = 'Activa'
  ) {
    this.id = id
    this.transactionCode = transactionCode
    this.time = time
    this.cylinderType = cylinderType
    this.cylinderTypeId = cylinderTypeId
    this.quantity = Number(quantity) || 0
    this.unitPrice = Number(unitPrice) || 0
    this.totalAmount = Number(totalAmount) || 0
    this.paymentType = paymentType
    this.client = client
    this.distributor = distributor
    this.isNew = Boolean(isNew)
    this.status = status || 'Activa'
  }
}