import axios from 'axios'
import { DistributionAssembler } from './distribution.assembler.js'

const API_BASE_URL = 'http://localhost:3001'

export class DistributionApi {
  getDistributorDeliveries() {
    return axios.get(`${API_BASE_URL}/distributorDeliveries`)
      .then(res => ({ data: DistributionAssembler.toDeliveryDomainList(res.data) }))
  }

  getDistributorDeliverers() {
    return axios.get(`${API_BASE_URL}/distributorDeliverers`)
      .then(res => ({ data: DistributionAssembler.toDelivererDomainList(res.data) }))
  }
}
