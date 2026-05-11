export class Alert {
  constructor(id, type, criticality, location, timestamp, status) {
    this.id = id;
    this.type = type;
    this.criticality = criticality;
    this.location = location;
    this.timestamp = timestamp;
    this.status = status;
  }
}
