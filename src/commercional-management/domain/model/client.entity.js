export class Client {
  constructor(id, name, activeDebt, debtCount) {
    this.id = id;
    this.name = name;
    this.activeDebt = Number(activeDebt) || 0;
    this.debtCount = Number(debtCount) || 0;
  }
}
