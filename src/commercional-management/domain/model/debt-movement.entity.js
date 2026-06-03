export class DebtMovement {
  constructor(
      id,
      date,
      time,
      type,
      client,
      description,
      amount,
      balance,
      user,
      status = null,
      relatedDebtId = null,
      relatedSaleId = null
  ) {
    this.id = id
    this.date = date
    this.time = time
    this.type = type
    this.client = client
    this.description = description
    this.amount = Number(amount) || 0
    this.balance = Number(balance) || 0
    this.user = user
    this.status = status || (type === 'Deuda' ? 'Pendiente' : 'Registrado')
    this.relatedDebtId = relatedDebtId
    this.relatedSaleId = relatedSaleId
  }
}