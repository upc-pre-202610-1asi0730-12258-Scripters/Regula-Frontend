import { Sensor } from '../domain/model/sensor.entity.js';

export class SensorAssembler {
  /**
   * Transforms raw API data into a Sensor entity.
   * @param {Object} rawData - The raw JSON data from the API.
   * @returns {Sensor} The assembled Sensor entity.
   */
  static toDomain(rawData) {
    return new Sensor(
      rawData.ppm,
      rawData.signalStrength,
      rawData.battery,
      rawData.status
    );
  }

  /**
   * Transforms an array of raw API data into Sensor entities.
   * @param {Array} rawDataArray - The array of raw JSON data.
   * @returns {Array<Sensor>} An array of Sensor entities.
   */
  static toDomainList(rawDataArray) {
    if (!Array.isArray(rawDataArray)) {
      return [];
    }
    return rawDataArray.map((rawData) => this.toDomain(rawData));
  }
}
