import { Sale } from '../domain/model/sale.entity.js';
import { Client } from '../domain/model/client.entity.js';
import { DebtMovement } from '../domain/model/debt-movement.entity.js';
import { CylinderType } from '../domain/model/cylinder-type.entity.js';

export class CommercialAssembler {
  
  // ==========================================
  // SALE (Venta)
  // ==========================================
  static toSaleDomain(raw) {
    return new Sale(
      raw.id,
      raw.time,
      raw.cylinderType,
      raw.cylinderTypeId,
      raw.quantity,
      raw.paymentType === 'Fiado' ? 'Deuda' : raw.paymentType, // Transformamos Fiado -> Deuda al recibir
      raw.client,
      raw.distributor,
      raw.isNew
    );
  }
  static toSaleDomainList(rawArray) {
    if (!Array.isArray(rawArray)) return [];
    return rawArray.map(this.toSaleDomain);
  }
  static toSaleDTO(domain) {
    return {
      id: domain.id,
      time: domain.time,
      cylinderType: domain.cylinderType,
      cylinderTypeId: domain.cylinderTypeId,
      quantity: domain.quantity,
      paymentType: domain.paymentType === 'Deuda' ? 'Fiado' : domain.paymentType, // Transformamos de vuelta para retrocompatibilidad JSON si fuera necesario (opcional)
      client: domain.client,
      distributor: domain.distributor,
      isNew: domain.isNew
    };
  }

  // ==========================================
  // CLIENT (Cliente)
  // ==========================================
  static toClientDomain(raw) {
    return new Client(
      raw.id,
      raw.name,
      raw.activeDebt,
      raw.debtCount
    );
  }
  static toClientDomainList(rawArray) {
    if (!Array.isArray(rawArray)) return [];
    return rawArray.map(this.toClientDomain);
  }

  // ==========================================
  // DEBT MOVEMENT (Movimiento de Deuda)
  // ==========================================
  static toDebtMovementDomain(raw) {
    return new DebtMovement(
      raw.id,
      raw.date,
      raw.time,
      raw.type === 'Fiado' ? 'Deuda' : raw.type, // Fiado -> Deuda
      raw.client,
      raw.description,
      raw.amount,
      raw.balance,
      raw.user
    );
  }
  static toDebtMovementDomainList(rawArray) {
    if (!Array.isArray(rawArray)) return [];
    return rawArray.map(this.toDebtMovementDomain);
  }
  static toDebtMovementDTO(domain) {
      return {
          id: domain.id,
          date: domain.date,
          time: domain.time,
          type: domain.type === 'Deuda' ? 'Fiado' : domain.type,
          client: domain.client,
          description: domain.description,
          amount: domain.amount,
          balance: domain.balance,
          user: domain.user
      }
  }

  // ==========================================
  // CYLINDER TYPE (Tipo de Balón)
  // ==========================================
  static toCylinderTypeDomain(raw) {
    return new CylinderType(
      raw.id,
      raw.label,
      raw.price,
      raw.stock
    );
  }
  static toCylinderTypeDomainList(rawArray) {
    if (!Array.isArray(rawArray)) return [];
    return rawArray.map(this.toCylinderTypeDomain);
  }
}
