import { Sale } from '../domain/model/sale.entity.js'

// El backend serializa los enums en inglés y en mayúsculas
// (PaymentType.ToString().ToUpperInvariant(), Status.ToString().ToUpperInvariant()).
const PAYMENT_TYPE_FROM_BACKEND = {
    CASH: 'Efectivo',
    YAPEPLIN: 'Yape/Plin',
    TRANSFER: 'Transferencia',
    DEBT: 'Deuda',
}

const PAYMENT_TYPE_TO_BACKEND = {
    Efectivo: 'CASH',
    'Yape/Plin': 'YAPEPLIN',
    Transferencia: 'TRANSFER',
    Deuda: 'DEBT',
}

const STATUS_FROM_BACKEND = {
    ACTIVE: 'Activa',
    CANCELLED: 'Anulada',
}

export class SaleAssembler {
    static toEntityFromResource(raw) {
        return new Sale(
            raw.id,
            raw.transactionCode,
            new Date(raw.createdAt).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
            raw.cylinderType,
            raw.cylinderTypeId,
            raw.quantity,
            raw.unitPrice,
            raw.totalAmount,
            PAYMENT_TYPE_FROM_BACKEND[raw.paymentType] ?? raw.paymentType,
            raw.customerName || 'Cliente no registrado',
            raw.distributorName,
            false,
            STATUS_FROM_BACKEND[raw.status] ?? raw.status,
        )
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status} ${response.statusText}`)
            return []
        }

        return (response.data ?? []).map((item) => this.toEntityFromResource(item))
    }

    /**
     * Payload para POST /api/v1/daily-sales (CreateDailySaleResource).
     * El backend no soporta actualizar ni anular una venta, así que este
     * assembler solo produce el payload de creación.
     */
    static toCreateResource({ cylinderTypeId, cylinderType, quantity, unitPrice, paymentType, customerName, distributorName }) {
        return {
            cylinderTypeId,
            cylinderType,
            quantity,
            unitPrice,
            paymentType: PAYMENT_TYPE_TO_BACKEND[paymentType] ?? paymentType,
            customerId: null,
            customerName: customerName || null,
            distributorName: distributorName || null,
        }
    }
}