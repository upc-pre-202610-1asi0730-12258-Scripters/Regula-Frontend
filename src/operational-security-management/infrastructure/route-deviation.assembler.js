import { RouteDeviation } from '../domain/model/route-deviation.entity.js';

export class RouteDeviationAssembler {
  /**
   * Transforms raw API data into a RouteDeviation entity.
   * @param {Object} rawData - The raw JSON data from the API.
   * @returns {RouteDeviation} The assembled RouteDeviation entity.
   */
  static toDomain(rawData) {
    return new RouteDeviation(
      rawData.id,
      rawData.unit,
      rawData.location,
      rawData.distance,
      rawData.time,
      rawData.status
    );
  }

  /**
   * Transforms an array of raw API data into RouteDeviation entities.
   * @param {Array} rawDataArray - The array of raw JSON data.
   * @returns {Array<RouteDeviation>} An array of RouteDeviation entities.
   */
  static toDomainList(rawDataArray) {
    if (!Array.isArray(rawDataArray)) {
      return [];
    }
    return rawDataArray.map((rawData) => this.toDomain(rawData));
  }
}
