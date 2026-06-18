import { Sensor } from "@/operational-security-management/domain/model/sensor.entity.js";

export class SensorAssembler {

  static toEntityFromResource(resource) {

    return new Sensor({
      id: resource.id,
      name: resource.name,
      status: resource.status,
      ppm: resource.ppm,
      lastConnection: resource.last_connection,
      hardware: resource.hardware
    });

  }

  static toEntitiesFromResponse(response) {

    if (response.status !== 200) {
      console.error(`${response.status} ${response.statusText}`);
      return [];

    }

    let resources =
        response.data instanceof Array
            ? response.data
            : response.data['sensors'];

    return resources.map(resource =>
        this.toEntityFromResource(resource)
    );
  }
}