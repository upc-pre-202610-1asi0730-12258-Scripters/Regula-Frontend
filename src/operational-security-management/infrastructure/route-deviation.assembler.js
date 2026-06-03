import { RouteDeviation } from '../domain/model/route-deviation.entity.js';

export class RouteDeviationAssembler {
    static toEntityFromResource(resource) {
      return new RouteDeviation({...resource});
    }
    static toEntitiesFromResponse(response) {
      if (response.status !== 200) {
        console.error(`${response.status} ${response.statusText}`);
        return [];
      }
      let resources = response.data instanceof Array
          ? response.data
          : response.data['routeDeviations'];

      return resources.map(resource =>
          this.toEntityFromResource(resource)
      );
    }
}
