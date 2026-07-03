export class CylinderType {
  constructor(id, label, price, stock) {
    this.id = id;
    this.label = label;
    this.price = Number(price) || 0;
    this.stock = Number(stock) || 0;
  }
}
