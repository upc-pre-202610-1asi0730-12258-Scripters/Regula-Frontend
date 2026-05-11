import { ZoneAnalysis } from '../domain/model/zone-analysis.entity.js';

export class ZoneAnalysisAssembler {
  /**
   * Transforms raw API data into a ZoneAnalysis entity.
   * @param {Object} rawData - The raw JSON data from the API.
   * @returns {ZoneAnalysis} The assembled ZoneAnalysis entity.
   */
  static toDomain(rawData) {
    return new ZoneAnalysis(
      rawData.id,
      rawData.name,
      rawData.status,
      rawData.metrics
    );
  }

  /**
   * Transforms an array of raw API data into ZoneAnalysis entities.
   * @param {Array} rawDataArray - The array of raw JSON data.
   * @returns {Array<ZoneAnalysis>} An array of ZoneAnalysis entities.
   */
  static toDomainList(rawDataArray) {
    if (!Array.isArray(rawDataArray)) {
      return [];
    }
    return rawDataArray.map((rawData) => this.toDomain(rawData));
  }
}
