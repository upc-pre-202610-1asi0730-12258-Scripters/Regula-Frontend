import { BaseApi } from "../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared/infrastructure/base-endpoint.js";

const alertsEndpointPath = import.meta.env.VITE_ALERTS_ENDPOINT;
const sensorsEndpointPath = import.meta.env.VITE_SENSORS_ENDPOINT;
const sensorsMetadataEndpointPath = import.meta.env.VITE_SENSORS_METADATA_ENDPOINT;
const routeDeviationsEndpointPath = import.meta.env.VITE_ROUTE_DEVIATIONS_ENDPOINT;
const zoneAnalysisEndpointPath = import.meta.env.VITE_ZONE_ANALYSIS_ENDPOINT;
const warehousesEndpointPath = import.meta.env.VITE_WAREHOUSES_ENDPOINT;
const companyAlertsEndpointPath = import.meta.env.VITE_COMPANY_ALERTS_ENDPOINT;

export class SecurityApi extends BaseApi {

  #alertsEndpoint;
  #sensorsEndpoint;
  #sensorsMetadataEndpoint;
  #routeDeviationsEndpoint;
  #zoneAnalysisEndpoint;
  #warehousesEndpoint;
  #companyAlertsEndpoint;

  constructor() {
    super();

    this.#alertsEndpoint = new BaseEndpoint(this, alertsEndpointPath);
    this.#sensorsEndpoint = new BaseEndpoint(this, sensorsEndpointPath);
    this.#sensorsMetadataEndpoint = new BaseEndpoint(this, sensorsMetadataEndpointPath);
    this.#routeDeviationsEndpoint = new BaseEndpoint(this, routeDeviationsEndpointPath);
    this.#zoneAnalysisEndpoint = new BaseEndpoint(this, zoneAnalysisEndpointPath);
    this.#warehousesEndpoint = new BaseEndpoint(this, warehousesEndpointPath);
    this.#companyAlertsEndpoint = new BaseEndpoint(this, companyAlertsEndpointPath);
  }

  getAlerts() {
    return this.#alertsEndpoint.getAll();
  }

  getSensors() {
    return this.#sensorsEndpoint.getAll();
  }

  getSensorsMetadata() {
    return this.#sensorsMetadataEndpoint.getAll();
  }

  getRouteDeviations() {
    return this.#routeDeviationsEndpoint.getAll();
  }

  getZoneAnalysis() {
    return this.#zoneAnalysisEndpoint.getAll();
  }

  getWarehouses() {
    return this.#warehousesEndpoint.getAll();
  }

  getCompanyAlerts() {
    return this.#companyAlertsEndpoint.getAll();
  }
}