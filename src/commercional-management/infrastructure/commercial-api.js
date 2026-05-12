import axios from 'axios'
import { CommercialAssembler } from './commercial.assembler.js'

const API_BASE_URL = 'http://localhost:3001'

export class CommercialApi {
    getCommercialCylinderTypes() {
        return axios.get(`${API_BASE_URL}/commercialCylinderTypes`)
            .then(res => ({ data: CommercialAssembler.toCylinderTypeDomainList(res.data) }))
    }

    getDistributorSales() {
        return axios.get(`${API_BASE_URL}/distributorSales`)
            .then(res => ({ data: CommercialAssembler.toSaleDomainList(res.data) }))
    }

    createDistributorSale(sale) {
        // Al enviar, transformamos al DTO por si json-server espera el formato antiguo
        const dto = CommercialAssembler.toSaleDTO(sale)
        return axios.post(`${API_BASE_URL}/distributorSales`, dto)
    }

    updateCommercialCylinderType(id, cylinderType) {
        return axios.put(`${API_BASE_URL}/commercialCylinderTypes/${id}`, cylinderType)
    }

    getCommercialClients() {
        return axios.get(`${API_BASE_URL}/commercialClients`)
            .then(res => ({ data: CommercialAssembler.toClientDomainList(res.data) }))
    }

    getCommercialDebtMovements() {
        return axios.get(`${API_BASE_URL}/commercialDebtMovements`)
            .then(res => ({ data: CommercialAssembler.toDebtMovementDomainList(res.data) }))
    }

    createCommercialDebtMovement(movement) {
        const dto = CommercialAssembler.toDebtMovementDTO(movement)
        return axios.post(`${API_BASE_URL}/commercialDebtMovements`, dto)
    }

    updateCommercialClient(id, client) {
        return axios.put(`${API_BASE_URL}/commercialClients/${id}`, client)
    }
}