import { Alert } from '../domain/model/alert.entity.js';

export class AlertAssembler {
  /**
   * Transforms raw API data into an Alert entity.
   * @param {Object} rawData - The raw JSON data from the API.
   * @returns {Alert} The assembled Alert entity.
   */
  static toDomain(rawData) {
    return new Alert(
      rawData.id,
      rawData.type,
      rawData.criticality,
      rawData.location,
      rawData.timestamp,
      rawData.status
    );
  }

  /**
   * Transforms an array of raw API data into Alert entities.
   * @param {Array} rawDataArray - The array of raw JSON data.
   * @returns {Array<Alert>} An array of Alert entities.
   */
  static toDomainList(rawDataArray) {
    if (!Array.isArray(rawDataArray)) {
      return [];
    }
    return rawDataArray.map((rawData) => this.toDomain(rawData));
  }
}
