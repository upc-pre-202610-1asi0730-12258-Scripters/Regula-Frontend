import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { CommercialApi } from '@/commercional-management/infrastructure/commercial-api.js'
import { SaleAssembler } from '../infrastructure/sale.assembler.js'

const commercialApi = new CommercialApi()

// Catálogo de referencia local (id/etiqueta/precio) para el formulario de venta.
// No hay endpoint de backend para esto (el stock de balones pertenece a
// InventoryManagement y DailySalesController no lo toca), así que esto es
// solo data de referencia para armar el formulario, no una sincronización
// con el servidor.
const CYLINDER_CATALOG = [
    { id: '5kg', label: '5 kg', price: 28 },
    { id: '10kg', label: '10 kg', price: 50 },
    { id: '15kg', label: '15 kg', price: 72 },
    { id: '45kg', label: '45 kg', price: 195 },
]

export const useCommercialStore = defineStore('commercial', () => {
    const sales = ref([])
    const selectedPaymentFilter = ref('Todos')
    const searchQuery = ref('')
    const loaded = ref(false)
    const errors = ref([])

    // 'Deuda' se deja como filtro de lectura por si el backend trae ventas
    // a crédito registradas por otro medio, pero no se puede crear una
    // venta nueva en Deuda desde este formulario (ver registerSale).
    const paymentFilters = computed(() => [
        'Todos',
        'Efectivo',
        'Yape/Plin',
        'Transferencia',
        'Deuda',
    ])

    const salesSummary = computed(() => {
        const summary = { '5 kg': 0, '10 kg': 0, '15 kg': 0, '45 kg': 0 }

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
                String(sale.transactionCode ?? sale.id).toLowerCase().includes(search) ||
                sale.client?.toLowerCase().includes(search) ||
                sale.distributor?.toLowerCase().includes(search)
            )
        }

        return result
    })

    function setPaymentFilter(paymentType) {
        selectedPaymentFilter.value = paymentType
    }

    function setSearchQuery(value) {
        searchQuery.value = value
    }

    function getCylinderById(id) {
        return CYLINDER_CATALOG.find((type) => type.id === id)
    }

    function fetchCommercialData() {
        return commercialApi.getDistributorSales()
            .then((response) => {
                sales.value = SaleAssembler.toEntitiesFromResponse(response)
                loaded.value = true
            })
            .catch((error) => {
                console.error('Error cargando ventas:', error)
                sales.value = []
                loaded.value = true
                errors.value.push(error)
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

        const resource = SaleAssembler.toCreateResource({
            cylinderTypeId: cylinder.id,
            cylinderType: cylinder.label,
            quantity: Number(data.quantity),
            unitPrice: cylinder.price,
            paymentType: data.paymentType,
            customerName: data.client || null,
            distributorName: data.distributor || null,
        })

        return commercialApi.createDistributorSale(resource)
            .then((response) => {
                const sale = SaleAssembler.toEntityFromResource(response.data)
                sale.isNew = true
                sales.value.unshift(sale)
                return { sale }
            })
            .catch((error) => {
                console.error('Error al registrar venta:', error.response?.data || error.message)
                errors.value.push(error)
                throw error
            })
    }

    return {
        sales,
        selectedPaymentFilter,
        searchQuery,
        loaded,
        errors,
        paymentFilters,
        salesSummary,
        filteredSales,
        cylinderCatalog: CYLINDER_CATALOG,
        setPaymentFilter,
        setSearchQuery,
        getCylinderById,
        fetchCommercialData,
        registerSale,
    }
})
