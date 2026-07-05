import { BaseApi } from "../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared/infrastructure/base-endpoint.js";

const alertsEndpointPath = import.meta.env.VITE_ALERTS_ENDPOINT;
const sensorsEndpointPath = import.meta.env.VITE_SENSORS_ENDPOINT;
const sensorsMetadataEndpointPath = import.meta.env.VITE_SENSORS_METADATA_ENDPOINT;
const routeDeviationsEndpointPath = import.meta.env.VITE_ROUTE_DEVIATIONS_ENDPOINT;

export class SecurityApi extends BaseApi {

  #alertsEndpoint;
  #sensorsEndpoint;
  #sensorsMetadataEndpoint;
  #routeDeviationsEndpoint;

  constructor() {
    super();

    this.#alertsEndpoint = new BaseEndpoint(this, alertsEndpointPath);
    this.#sensorsEndpoint = new BaseEndpoint(this, sensorsEndpointPath);
    this.#sensorsMetadataEndpoint = new BaseEndpoint(this, sensorsMetadataEndpointPath);
    this.#routeDeviationsEndpoint = new BaseEndpoint(this, routeDeviationsEndpointPath);
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
}
