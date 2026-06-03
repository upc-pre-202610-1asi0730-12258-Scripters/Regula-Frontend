export class Sensor {
  constructor({
                id = '',
                name = '',
                status = '',
                ppm = 0,
                lastConnection = '',
                hardware = {
                  signal: '',
                  battery: 0,
                  online: false
                }
              }) {
    this.id = id;
    this.name = name;
    this.status = status;
    this.ppm = ppm;
    this.lastConnection = lastConnection;
    this.hardware = hardware;
  }
}