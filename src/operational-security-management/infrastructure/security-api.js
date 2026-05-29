import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { AlertAssembler } from './alert.assembler.js';
import { RouteDeviationAssembler } from './route-deviation.assembler.js';
import { ZoneAnalysisAssembler } from './zone-analysis.assembler.js';
import {WarehouseAssembler} from "@/operational-security-management/infrastructure/warehouse.assembler.js";
import {CompanyAlertAssembler} from "@/operational-security-management/infrastructure/company-alert.assembler.js";

export class SecurityApi extends BaseApi {
  constructor() {
    super();
    this.endpoint = ''; 
  }

  async getAlerts() {
    try {
      const response = await this.http.get(`${this.endpoint}/alerts`);
      return AlertAssembler.toDomainList(response.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      throw error;
    }
  }

  // Sensores y su metadata (Crudos para adaptarlos en la UI)
  async getSensors() {
    try {
      const response = await this.http.get(`${this.endpoint}/sensors`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sensors:', error);
      throw error;
    }
  }
  
  async getSensorsMetadata() {
    try {
      const response = await this.http.get(`${this.endpoint}/sensors_metadata`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sensors metadata:', error);
      throw error;
    }
  }

  // Desvíos de Ruta
  async getRouteDeviations() {
    try {
      const response = await this.http.get(`${this.endpoint}/routeDeviations`);
      return RouteDeviationAssembler.toDomainList(response.data);
    } catch (error) {
      console.error('Error fetching route deviations:', error);
      throw error;
    }
  }

  // Análisis de Zona
  async getZoneAnalysis() {
    try {
      const response = await this.http.get(`${this.endpoint}/zoneAnalysis`);
      return ZoneAnalysisAssembler.toDomainList(response.data);
    } catch (error) {
      console.error('Error fetching zone analysis:', error);
      throw error;
    }
  }

  // Almacenes
  async getWarehouses() {
    try {
      const response = await this.http.get(`${this.endpoint}/warehouses`);
      return WarehouseAssembler.toDomainList(response.data);
    } catch (error) {
      console.error('Error fetching Warehouses :', error);
      throw error;
    }
  }

  async getCompanyAlerts(){
    try{
      const response = await this.http.get(`${this.endpoint}/companyAlerts`);
      return CompanyAlertAssembler.toDomainList(response.data);
    }catch (error) {
      console.error('Error fetching CompanyAlerts:', error);
      throw error;
    }
  }
}

export const securityApi = new SecurityApi();
