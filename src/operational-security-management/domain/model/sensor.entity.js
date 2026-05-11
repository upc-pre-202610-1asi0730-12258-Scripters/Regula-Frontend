export class Sensor {
  constructor(ppm, signalStrength, battery, status) {
    this.ppm = ppm;
    this.signalStrength = signalStrength;
    this.battery = battery;
    this.status = status;
  }
}
