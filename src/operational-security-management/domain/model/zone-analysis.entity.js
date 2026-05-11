export class ZoneAnalysis {
  constructor(id, name, status, metrics) {
    this.id = id;
    this.name = name;
    this.status = status;
    this.metrics = {
      alta: metrics?.alta || 0,
      media: metrics?.media || 0,
      baja: metrics?.baja || 0,
      incidentes: metrics?.incidentes || 0
    };
  }
}
