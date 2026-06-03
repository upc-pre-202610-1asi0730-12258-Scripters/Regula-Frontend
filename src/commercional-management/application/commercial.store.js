import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { CommercialApi } from '@/commercional-management/infrastructure/commercial-api.js'
import { Sale } from '../domain/model/sale.entity.js'
import { Client } from '../domain/model/client.entity.js'
import { DebtMovement } from '../domain/model/debt-movement.entity.js'
import { CylinderType } from '../domain/model/cylinder-type.entity.js'
import { SaleAssembler } from '../infrastructure/sale.assembler.js'
import { ClientAssembler } from '../infrastructure/client.assembler.js'
import { DebtMovementAssembler } from '../infrastructure/debt-movement.assembler.js'
import { CylinderTypeAssembler } from '../infrastructure/cylinder-type.assembler.js'

const commercialApi = new CommercialApi()

const fallbackCylinderTypes = [
    { id: '5kg', label: '5 kg', price: 28, stock: 40 },
    { id: '10kg', label: '10 kg', price: 50, stock: 50 },
    { id: '15kg', label: '15 kg', price: 72, stock: 35 },
    { id: '45kg', label: '45 kg', price: 195, stock: 12 },
]

export const useCommercialStore = defineStore('commercial', () => {
    const cylinderTypes = ref([])
    const sales = ref([])
    const clients = ref([])
    const debtMovements = ref([])

    const selectedPaymentFilter = ref('Todos')
    const searchQuery = ref('')
    const loaded = ref(false)
    const debtLoaded = ref(false)
    const errors = ref([])

    const paymentFilters = computed(() => [
        'Todos',
        'Efectivo',
        'Yape/Plin',
        'Transferencia',
        'Deuda',
    ])

    const salesSummary = computed(() => {
        const summary = {
            '5 kg': 0,
            '10 kg': 0,
            '15 kg': 0,
            '45 kg': 0,
        }

        sales.value
            .filter((sale) => sale.status !== 'Anulada')
            .forEach((sale) => {
                if (summary[sale.cylinderType] !== undefined) {
                    summary[sale.cylinderType] += Number(sale.quantity)
                }
            })

        return {
            fiveKg: summary['5 kg'],
            tenKg: summary['10 kg'],
            fifteenKg: summary['15 kg'],
            fortyFiveKg: summary['45 kg'],
            totalOperations: sales.value.filter((sale) => sale.status !== 'Anulada').length,
        }
    })

    const filteredSales = computed(() => {
        let result = [...sales.value]

        if (selectedPaymentFilter.value !== 'Todos') {
            result = result.filter((sale) => sale.paymentType === selectedPaymentFilter.value)
        }

        const search = searchQuery.value.trim().toLowerCase()

        if (search) {
            result = result.filter((sale) =>
                sale.id.toLowerCase().includes(search) ||
                sale.client.toLowerCase().includes(search) ||
                sale.distributor.toLowerCase().includes(search)
            )
        }

        return result
    })

    const clientsWithDebt = computed(() =>
        clients.value.filter((client) => client.activeDebt > 0)
    )

    const totalPendingDebt = computed(() =>
        clientsWithDebt.value.reduce((total, client) => total + client.activeDebt, 0)
    )

    function setPaymentFilter(paymentType) {
        selectedPaymentFilter.value = paymentType
    }

    function setSearchQuery(value) {
        searchQuery.value = value
    }

    const availableCylinderTypes = computed(() => {
        return cylinderTypes.value.length > 0 ? cylinderTypes.value : fallbackCylinderTypes
    })

    function getCylinderById(id) {
        return availableCylinderTypes.value.find((type) => type.id === id)
    }
    function fetchCommercialData() {
        return Promise.allSettled([
            commercialApi.getCommercialCylinderTypes(),
            commercialApi.getDistributorSales(),
            commercialApi.getCommercialClients(),
            commercialApi.getCommercialDebtMovements(),
        ])
            .then(([cylinderResponse, salesResponse, clientsResponse, movementsResponse]) => {
                if (cylinderResponse.status === 'fulfilled') {
                    cylinderTypes.value = CylinderTypeAssembler.toEntitiesFromResponse(cylinderResponse.value)
                } else {
                    console.error('Error cargando tipos de balón:', cylinderResponse.reason)
                    cylinderTypes.value = fallbackCylinderTypes
                }

                if (salesResponse.status === 'fulfilled') {
                    sales.value = SaleAssembler.toEntitiesFromResponse(salesResponse.value)
                } else {
                    console.error('Error cargando ventas:', salesResponse.reason)
                    sales.value = []
                }

                if (clientsResponse.status === 'fulfilled') {
                    clients.value = ClientAssembler.toEntitiesFromResponse(clientsResponse.value)
                } else {
                    console.error('Error cargando clientes:', clientsResponse.reason)
                    clients.value = []
                }

                if (movementsResponse.status === 'fulfilled') {
                    debtMovements.value = DebtMovementAssembler.toEntitiesFromResponse(movementsResponse.value)
                } else {
                    console.error('Error cargando movimientos de deuda:', movementsResponse.reason)
                    debtMovements.value = []
                }

                loaded.value = true
                debtLoaded.value = true
            })
    }

    function fetchDebtData() {
        return Promise.all([
            commercialApi.getCommercialClients(),
            commercialApi.getCommercialDebtMovements(),
        ])
            .then(([clientsResponse, movementsResponse]) => {
                clients.value = ClientAssembler.toEntitiesFromResponse(clientsResponse)
                debtMovements.value = DebtMovementAssembler.toEntitiesFromResponse(movementsResponse)
                debtLoaded.value = true
            })
            .catch((error) => {
                errors.value.push(error)
                throw error
            })
    }

    function registerSale(data) {
        const cylinder = getCylinderById(data.cylinderTypeId)

        if (!cylinder) {
            return Promise.reject(new Error('No se encontró el tipo de balón seleccionado.'))
        }

        if (Number(data.quantity) <= 0) {
            return Promise.reject(new Error('La cantidad debe ser mayor a cero.'))
        }

        if (cylinder.stock < Number(data.quantity)) {
            return Promise.reject(new Error('No hay stock suficiente.'))
        }

        const now = new Date()

        const time = now.toLocaleTimeString('es-PE', {
            hour: '2-digit',
            minute: '2-digit',
        })

        const saleId = `#VT-${String(Date.now()).slice(-6)}`

        const sale = new Sale(
            saleId,
            time,
            cylinder.label,
            cylinder.id,
            Number(data.quantity),
            data.paymentType,
            data.client || 'Cliente no registrado',
            data.distributor || 'Carlos M.',
            true
        )

        const updatedCylinder = new CylinderType(
            cylinder.id,
            cylinder.label,
            cylinder.price,
            cylinder.stock - Number(data.quantity)
        )

        return commercialApi.createDistributorSale(SaleAssembler.toResourceFromEntity(sale))
            .then(() => commercialApi.updateCommercialCylinderType(cylinder.id, CylinderTypeAssembler.toResourceFromEntity(updatedCylinder)))
            .then(() => {
                if (data.paymentType === 'Deuda') {
                    return registerDebtFromSale(sale, cylinder.price * Number(data.quantity))
                }

                return null
            })
            .then(() => {
                sales.value.unshift(sale)

                const cylinderIndex = cylinderTypes.value.findIndex((item) => item.id === cylinder.id)

                if (cylinderIndex !== -1) {
                    cylinderTypes.value[cylinderIndex] = updatedCylinder
                }

                return { sale, cylinder: updatedCylinder }
            })
            .catch((error) => {
                console.error('Error real al registrar venta:', error.response?.data || error.message)
                errors.value.push(error)
                throw error
            })
    }

    function registerDebtFromSale(sale, amount) {
        let client = clients.value.find((item) =>
            item.name.trim().toLowerCase() === sale.client.trim().toLowerCase()
        )

        const isNewClient = !client

        if (!client) {
            client = new Client(Date.now(), sale.client, 0, 0)
        }

        const today = new Date().toLocaleDateString('es-PE')
        const time = new Date().toLocaleTimeString('es-PE', {
            hour: '2-digit',
            minute: '2-digit',
        })

        const updatedClient = new Client(
            client.id,
            client.name,
            client.activeDebt + amount,
            client.debtCount + 1
        )

        const movement = new DebtMovement(
            `ID${String(Date.now()).slice(-6)}`,
            today,
            time,
            'Deuda',
            sale.client,
            `${sale.quantity} balón(es) ${sale.cylinderType}`,
            amount,
            updatedClient.activeDebt,
            sale.distributor,
            'Pendiente',
            null,
            sale.id
        )

        const clientRequest = isNewClient
            ? commercialApi.createCommercialClient(ClientAssembler.toResourceFromEntity(updatedClient))
            : commercialApi.updateCommercialClient(client.id, ClientAssembler.toResourceFromEntity(updatedClient))

        return clientRequest
            .then(() => commercialApi.createCommercialDebtMovement(DebtMovementAssembler.toResourceFromEntity(movement)))
            .then(() => {
                const clientIndex = clients.value.findIndex((item) => item.id === client.id)

                if (clientIndex !== -1) {
                    clients.value[clientIndex] = updatedClient
                } else {
                    clients.value.push(updatedClient)
                }

                debtMovements.value.unshift(movement)
            })
    }

    function registerDebt(data) {
        const client = clients.value.find((item) => item.id === data.clientId)

        if (!client) {
            return Promise.reject(new Error('Cliente no encontrado.'))
        }

        const cylinder = getCylinderById(data.cylinderTypeId)
        const amount = Number(data.amount)
        const quantity = Number(data.quantity)

        if (!cylinder) {
            return Promise.reject(new Error('No se encontró el tipo de balón seleccionado.'))
        }

        if (quantity <= 0) {
            return Promise.reject(new Error('La cantidad debe ser mayor a cero.'))
        }

        if (amount <= 0) {
            return Promise.reject(new Error('El monto de la deuda debe ser mayor a cero.'))
        }

        const updatedClient = new Client(
            client.id,
            client.name,
            client.activeDebt + amount,
            client.debtCount + 1
        )

        const movement = new DebtMovement(
            `ID${String(Date.now()).slice(-6)}`,
            new Date().toLocaleDateString('es-PE'),
            new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
            'Deuda',
            client.name,
            `${quantity} balón(es) ${cylinder.label}`,
            amount,
            updatedClient.activeDebt,
            'Admin'
        )

        return commercialApi.updateCommercialClient(client.id, ClientAssembler.toResourceFromEntity(updatedClient))
            .then(() => commercialApi.createCommercialDebtMovement(DebtMovementAssembler.toResourceFromEntity(movement)))
            .then(() => {
                const index = clients.value.findIndex((item) => item.id === client.id)

                if (index !== -1) {
                    clients.value[index] = updatedClient
                }

                debtMovements.value.unshift(movement)
            })
            .catch((error) => {
                console.error('Error al registrar deuda:', error.response?.data || error.message)
                errors.value.push(error)
                throw error
            })
    }

    function registerPayment(data) {
        const client = clients.value.find((item) => item.id === data.clientId)

        if (!client) {
            return Promise.reject(new Error('Cliente no encontrado.'))
        }

        const debtToPay = debtMovements.value.find((movement) => {
            return movement.id === data.debtMovementId &&
                movement.client === client.name &&
                movement.type === 'Deuda' &&
                movement.status !== 'Pagada'
        })

        if (!debtToPay) {
            return Promise.reject(new Error('No se encontró una deuda pendiente para pagar.'))
        }

        const amount = Number(debtToPay.amount)

        if (amount <= 0) {
            return Promise.reject(new Error('El monto de la deuda no es válido.'))
        }

        const newBalance = Math.max(Number(client.activeDebt || 0) - amount, 0)

        const updatedClient = new Client(
            client.id,
            client.name,
            newBalance,
            Math.max(Number(client.debtCount || 0) - 1, 0)
        )

        const paidDebtMovement = new DebtMovement(
            debtToPay.id,
            debtToPay.date,
            debtToPay.time,
            debtToPay.type,
            debtToPay.client,
            debtToPay.description,
            debtToPay.amount,
            debtToPay.balance,
            debtToPay.user,
            'Pagada',
            debtToPay.relatedDebtId
        )

        const paymentMovement = new DebtMovement(
            `ID${String(Date.now()).slice(-6)}`,
            new Date().toLocaleDateString('es-PE'),
            new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
            'Pago',
            client.name,
            'Pago total',
            amount,
            newBalance,
            'Admin',
            'Registrado',
            debtToPay.id
        )

        return commercialApi.updateCommercialClient(client.id, ClientAssembler.toResourceFromEntity(updatedClient))
            .then(() => commercialApi.updateCommercialDebtMovement(debtToPay.id, DebtMovementAssembler.toResourceFromEntity(paidDebtMovement)))
            .then(() => commercialApi.createCommercialDebtMovement(DebtMovementAssembler.toResourceFromEntity(paymentMovement)))
            .then(() => {
                const clientIndex = clients.value.findIndex((item) => item.id === client.id)

                if (clientIndex !== -1) {
                    clients.value[clientIndex] = updatedClient
                }

                const debtIndex = debtMovements.value.findIndex((item) => item.id === debtToPay.id)

                if (debtIndex !== -1) {
                    debtMovements.value[debtIndex] = paidDebtMovement
                }

                debtMovements.value.unshift(paymentMovement)

                return {
                    client: updatedClient,
                    paidDebt: paidDebtMovement,
                    payment: paymentMovement,
                }
            })
            .catch((error) => {
                console.error('Error al registrar pago:', error.response?.data || error.message)
                errors.value.push(error)
                throw error
            })
    }

    function cancelSale(saleId) {
        const sale = sales.value.find((item) => item.id === saleId)

        if (!sale) {
            return Promise.reject(new Error('Venta no encontrada.'))
        }

        if (sale.status === 'Anulada') {
            return Promise.reject(new Error('Esta venta ya fue anulada.'))
        }

        const cylinder = getCylinderById(sale.cylinderTypeId)

        if (!cylinder) {
            return Promise.reject(new Error('No se encontró el tipo de balón de la venta.'))
        }

        const restoredCylinder = new CylinderType(
            cylinder.id,
            cylinder.label,
            cylinder.price,
            Number(cylinder.stock || 0) + Number(sale.quantity || 0)
        )

        const canceledSale = new Sale(
            sale.id,
            sale.time,
            sale.cylinderType,
            sale.cylinderTypeId,
            sale.quantity,
            sale.paymentType,
            sale.client,
            sale.distributor,
            false,
            'Anulada'
        )

        if (sale.paymentType !== 'Deuda') {
            return commercialApi.updateCommercialCylinderType(cylinder.id, CylinderTypeAssembler.toResourceFromEntity(restoredCylinder))
                .then(() =>commercialApi.updateDistributorSale(sale.id, SaleAssembler.toResourceFromEntity(canceledSale)))
                .then(() => {
                    const cylinderIndex = cylinderTypes.value.findIndex((item) => item.id === cylinder.id)

                    if (cylinderIndex !== -1) {
                        cylinderTypes.value[cylinderIndex] = restoredCylinder
                    }

                    const saleIndex = sales.value.findIndex((item) => item.id === sale.id)

                    if (saleIndex !== -1) {
                        sales.value[saleIndex] = canceledSale
                    }

                    return { sale: canceledSale, cylinder: restoredCylinder }
                })
                .catch((error) => {
                    console.error('Error al anular venta:', error.response?.data || error.message)
                    errors.value.push(error)
                    throw error
                })
        }

        const expectedAmount = Number(cylinder.price || 0) * Number(sale.quantity || 0)
        const expectedDescription = `${sale.quantity} balón(es) ${sale.cylinderType}`

        const relatedDebt = debtMovements.value.find((movement) => {
            const sameClient = String(movement.client || '').trim().toLowerCase() === String(sale.client || '').trim().toLowerCase()
            const isPendingDebt = movement.type === 'Deuda' && movement.status !== 'Pagada' && movement.status !== 'Anulada'
            const hasDirectRelation = movement.relatedSaleId === sale.id
            const hasFallbackRelation =
                !movement.relatedSaleId &&
                sameClient &&
                String(movement.description || '').trim().toLowerCase() === expectedDescription.trim().toLowerCase() &&
                Number(movement.amount || 0) === expectedAmount

            return isPendingDebt && (hasDirectRelation || hasFallbackRelation)
        })

        if (!relatedDebt) {
            return Promise.reject(new Error('No se encontró una deuda pendiente relacionada con esta venta.'))
        }

        const hasPayments = debtMovements.value.some((movement) => {
            return movement.type === 'Pago' && movement.relatedDebtId === relatedDebt.id
        })

        if (hasPayments) {
            return Promise.reject(new Error('No se puede anular esta venta porque su deuda ya tiene pagos registrados.'))
        }

        const client = clients.value.find((item) => {
            return String(item.name || '').trim().toLowerCase() === String(sale.client || '').trim().toLowerCase()
        })

        if (!client) {
            return Promise.reject(new Error('Cliente relacionado con la deuda no encontrado.'))
        }

        const updatedClient = new Client(
            client.id,
            client.name,
            Math.max(Number(client.activeDebt || 0) - Number(relatedDebt.amount || 0), 0),
            Math.max(Number(client.debtCount || 0) - 1, 0)
        )

        const canceledDebt = new DebtMovement(
            relatedDebt.id,
            relatedDebt.date,
            relatedDebt.time,
            relatedDebt.type,
            relatedDebt.client,
            relatedDebt.description,
            relatedDebt.amount,
            Math.max(Number(relatedDebt.balance || 0) - Number(relatedDebt.amount || 0), 0),
            relatedDebt.user,
            'Anulada',
            relatedDebt.relatedDebtId,
            relatedDebt.relatedSaleId || sale.id
        )

        return commercialApi.updateCommercialCylinderType(cylinder.id, CylinderTypeAssembler.toResourceFromEntity(restoredCylinder))
            .then(() => commercialApi.updateCommercialClient(client.id, ClientAssembler.toResourceFromEntity(updatedClient)))
            .then(() => commercialApi.updateCommercialDebtMovement(relatedDebt.id, DebtMovementAssembler.toResourceFromEntity(canceledDebt)))
            .then(() => commercialApi.updateDistributorSale(sale.id, SaleAssembler.toResourceFromEntity(canceledSale)))
            .then(() => {
                const cylinderIndex = cylinderTypes.value.findIndex((item) => item.id === cylinder.id)

                if (cylinderIndex !== -1) {
                    cylinderTypes.value[cylinderIndex] = restoredCylinder
                }

                const clientIndex = clients.value.findIndex((item) => item.id === client.id)

                if (clientIndex !== -1) {
                    clients.value[clientIndex] = updatedClient
                }

                const debtIndex = debtMovements.value.findIndex((item) => item.id === relatedDebt.id)

                if (debtIndex !== -1) {
                    debtMovements.value[debtIndex] = canceledDebt
                }

                const saleIndex = sales.value.findIndex((item) => item.id === sale.id)

                if (saleIndex !== -1) {
                    sales.value[saleIndex] = canceledSale
                }

                return {
                    sale: canceledSale,
                    cylinder: restoredCylinder,
                    client: updatedClient,
                    debt: canceledDebt,
                }
            })
            .catch((error) => {
                console.error('Error al anular venta:', error.response?.data || error.message)
                errors.value.push(error)
                throw error
            })
    }

    return {
        cylinderTypes,
        availableCylinderTypes,
        sales,
        clients,
        debtMovements,
        selectedPaymentFilter,
        searchQuery,
        loaded,
        debtLoaded,
        errors,
        paymentFilters,
        salesSummary,
        filteredSales,
        clientsWithDebt,
        totalPendingDebt,
        setPaymentFilter,
        setSearchQuery,
        getCylinderById,
        fetchCommercialData,
        fetchDebtData,
        registerSale,
        registerDebt,
        registerPayment,
        cancelSale,
    }
})