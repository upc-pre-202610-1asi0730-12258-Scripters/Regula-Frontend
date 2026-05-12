import { CommercialApi } from '@/commercional-management/infrastructure/commercial-api.js'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const commercialApi = new CommercialApi()

export const useCommercialStore = defineStore('commercial', () => {
    const cylinderTypes = ref([])
    const sales = ref([])
    const selectedPaymentFilter = ref('Todos')
    const searchQuery = ref('')
    const loaded = ref(false)
    const errors = ref([])

    const clients = ref([])
    const debtMovements = ref([])
    const debtLoaded = ref(false)

    const clientsWithDebt = computed(() =>
        clients.value.filter((client) => Number(client.activeDebt) > 0)
    )

    const totalPendingDebt = computed(() =>
        clientsWithDebt.value.reduce((total, client) => total + Number(client.activeDebt), 0)
    )

    const paymentFilters = computed(() => [
        'Todos',
        'Efectivo',
        'Yape/Plin',
        'Transferencia',
        'Fiado',
    ])

    const salesSummary = computed(() => {
        const summary = {
            '5 kg': 0,
            '10 kg': 0,
            '15 kg': 0,
            '45 kg': 0,
        }

        sales.value.forEach((sale) => {
            if (summary[sale.cylinderType] !== undefined) {
                summary[sale.cylinderType] += Number(sale.quantity)
            }
        })

        return {
            fiveKg: summary['5 kg'],
            tenKg: summary['10 kg'],
            fifteenKg: summary['15 kg'],
            fortyFiveKg: summary['45 kg'],
            totalOperations: sales.value.length,
        }
    })

    const filteredSales = computed(() => {
        let result = [...sales.value]

        if (selectedPaymentFilter.value !== 'Todos') {
            result = result.filter((sale) => sale.paymentType === selectedPaymentFilter.value)
        }

        const search = searchQuery.value.trim().toLowerCase()

        if (search.length > 0) {
            result = result.filter((sale) => {
                return (
                    sale.id.toLowerCase().includes(search) ||
                    sale.client.toLowerCase().includes(search) ||
                    sale.distributor.toLowerCase().includes(search)
                )
            })
        }

        return result
    })
    function fetchDebtData() {
        return Promise.all([
            commercialApi.getCommercialClients(),
            commercialApi.getCommercialDebtMovements(),
        ])
            .then(([clientsResponse, movementsResponse]) => {
                clients.value = clientsResponse.data ?? []
                debtMovements.value = movementsResponse.data ?? []
                debtLoaded.value = true
            })
            .catch((error) => {
                errors.value.push(error)
            })
    }

    function registerDebt(data) {
        const client = clients.value.find((item) => item.id === data.clientId)
        const cylinder = getCylinderById(data.cylinderTypeId)

        if (!client || !cylinder) return

        const updatedClient = {
            ...client,
            activeDebt: Number(client.activeDebt) + Number(data.amount),
            debtCount: Number(client.debtCount) + 1,
        }

        const movement = {
            id: `ID${String(debtMovements.value.length + 1).padStart(3, '0')}`,
            date: new Date().toLocaleDateString('es-PE'),
            time: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
            type: 'Fiado',
            client: client.name,
            description: `${data.quantity} balón(es) ${cylinder.label}`,
            amount: Number(data.amount),
            balance: updatedClient.activeDebt,
            user: 'Admin',
        }

        return commercialApi
            .updateCommercialClient(client.id, updatedClient)
            .then(() => commercialApi.createCommercialDebtMovement(movement))
            .then(() => {
                const index = clients.value.findIndex((item) => item.id === client.id)
                clients.value[index] = updatedClient
                debtMovements.value.unshift(movement)
            })
    }

    function registerPayment(data) {
        const client = clients.value.find((item) => item.id === data.clientId)

        if (!client) return

        const newBalance = Math.max(Number(client.activeDebt) - Number(data.amount), 0)

        const updatedClient = {
            ...client,
            activeDebt: newBalance,
            debtCount: newBalance === 0 ? 0 : client.debtCount,
        }

        const movement = {
            id: `ID${String(debtMovements.value.length + 1).padStart(3, '0')}`,
            date: new Date().toLocaleDateString('es-PE'),
            time: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
            type: 'Pago',
            client: client.name,
            description: newBalance === 0 ? 'Pago total' : 'Pago parcial',
            amount: Number(data.amount),
            balance: newBalance,
            user: 'Admin',
        }

        return commercialApi
            .updateCommercialClient(client.id, updatedClient)
            .then(() => commercialApi.createCommercialDebtMovement(movement))
            .then(() => {
                const index = clients.value.findIndex((item) => item.id === client.id)
                clients.value[index] = updatedClient
                debtMovements.value.unshift(movement)
            })
    }
    function setPaymentFilter(paymentType) {
        selectedPaymentFilter.value = paymentType
    }

    function setSearchQuery(value) {
        searchQuery.value = value
    }

    function getCylinderById(id) {
        return cylinderTypes.value.find((type) => type.id === id)
    }

    function fetchCommercialData() {
        return Promise.all([
            commercialApi.getCommercialCylinderTypes(),
            commercialApi.getDistributorSales(),
        ])
            .then(([cylinderResponse, salesResponse]) => {
                cylinderTypes.value = cylinderResponse.data ?? []
                sales.value = salesResponse.data ?? []
                loaded.value = true
            })
            .catch((error) => {
                errors.value.push(error)
            })
    }

    function registerSale(newSale) {
        const cylinder = getCylinderById(newSale.cylinderTypeId)

        if (!cylinder) {
            return Promise.reject(new Error('No se encontró el tipo de balón seleccionado.'))
        }

        if (Number(newSale.quantity) <= 0) {
            return Promise.reject(new Error('La cantidad debe ser mayor a cero.'))
        }

        if (cylinder.stock < Number(newSale.quantity)) {
            return Promise.reject(new Error('No hay stock suficiente para registrar la venta.'))
        }

        const now = new Date()

        const time = now.toLocaleTimeString('es-PE', {
            hour: '2-digit',
            minute: '2-digit',
        })

        const nextNumber = 921 + sales.value.length

        const sale = {
            id: `#VT-${String(nextNumber).padStart(4, '0')}`,
            time,
            cylinderType: cylinder.label,
            cylinderTypeId: cylinder.id,
            quantity: Number(newSale.quantity),
            paymentType: newSale.paymentType,
            client: newSale.client || '—',
            distributor: newSale.distributor || 'Carlos M.',
            isNew: true,
        }

        const updatedCylinder = {
            ...cylinder,
            stock: cylinder.stock - Number(newSale.quantity),
        }

        return commercialApi
            .createDistributorSale(sale)
            .then(() => commercialApi.updateCommercialCylinderType(cylinder.id, updatedCylinder))
            .then(() => {
                sales.value.unshift(sale)

                const index = cylinderTypes.value.findIndex((type) => type.id === cylinder.id)

                if (index !== -1) {
                    cylinderTypes.value[index] = updatedCylinder
                }

                return {
                    sale,
                    cylinder: updatedCylinder,
                }
            })
            .catch((error) => {
                errors.value.push(error)
                throw error
            })
    }

    return {
        cylinderTypes,
        sales,
        selectedPaymentFilter,
        searchQuery,
        loaded,
        errors,
        paymentFilters,
        salesSummary,
        filteredSales,
        setPaymentFilter,
        setSearchQuery,
        getCylinderById,
        fetchCommercialData,
        registerSale,
        clients,
        debtMovements,
        debtLoaded,
        clientsWithDebt,
        totalPendingDebt,
        fetchDebtData,
        registerDebt,
        registerPayment,
    }
})