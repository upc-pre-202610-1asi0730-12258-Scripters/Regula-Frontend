export class DebtMovement {
  constructor(id, date, time, type, client, description, amount, balance, user) {
    this.id = id;
    this.date = date;
    this.time = time;
    this.type = type; // 'Deuda' (antes Fiado) o 'Pago'
    this.client = client;
    this.description = description;
    this.amount = Number(amount) || 0;
    this.balance = Number(balance) || 0;
    this.user = user;
  }
}
