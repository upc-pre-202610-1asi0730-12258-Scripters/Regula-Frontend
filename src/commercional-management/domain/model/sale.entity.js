export class Sale {
  constructor(id, time, cylinderType, cylinderTypeId, quantity, paymentType, client, distributor, isNew) {
    this.id = id;
    this.time = time;
    this.cylinderType = cylinderType;
    this.cylinderTypeId = cylinderTypeId;
    this.quantity = quantity;
    this.paymentType = paymentType; // 'Efectivo', 'Yape/Plin', 'Transferencia', 'Deuda' (antes Fiado)
    this.client = client;
    this.distributor = distributor;
    this.isNew = isNew;
  }
}
