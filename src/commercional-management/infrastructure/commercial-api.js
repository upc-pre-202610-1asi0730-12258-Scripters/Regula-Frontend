import axios from 'axios'

const API_BASE_URL = 'http://localhost:3001'

export class CommercialApi {
    getCommercialCylinderTypes() {
        return axios.get(`${API_BASE_URL}/commercialCylinderTypes`)
    }

    getDistributorSales() {
        return axios.get(`${API_BASE_URL}/distributorSales`)
    }

    createDistributorSale(sale) {
        return axios.post(`${API_BASE_URL}/distributorSales`, sale)
    }

    updateCommercialCylinderType(id, cylinderType) {
        return axios.put(`${API_BASE_URL}/commercialCylinderTypes/${id}`, cylinderType)
    }
    getCommercialClients() {
        return axios.get(`${API_BASE_URL}/commercialClients`)
    }

    getCommercialDebtMovements() {
        return axios.get(`${API_BASE_URL}/commercialDebtMovements`)
    }

    createCommercialDebtMovement(movement) {
        return axios.post(`${API_BASE_URL}/commercialDebtMovements`, movement)
    }

    updateCommercialClient(id, client) {
        return axios.put(`${API_BASE_URL}/commercialClients/${id}`, client)
    }
}