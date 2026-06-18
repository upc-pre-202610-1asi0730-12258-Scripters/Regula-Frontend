import { ZoneAnalysis } from '../domain/model/zone-analysis.entity.js';

export class ZoneAnalysisAssembler {
  static toEntityFromResource(resource) {
    return new ZoneAnalysis({ ...resource });
  }

  static toEntitiesFromResponse(response) {
    if (response.status !== 200) {
      console.error(`${response.status} ${response.statusText}`);
      return [];

    }
    let resources = response.data instanceof Array
        ? response.data
        : response.data['zoneAnalysis'];

    return resources.map(resource =>
        this.toEntityFromResource(resource)
    );
  }
}
