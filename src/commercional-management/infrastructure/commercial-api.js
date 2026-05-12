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
}