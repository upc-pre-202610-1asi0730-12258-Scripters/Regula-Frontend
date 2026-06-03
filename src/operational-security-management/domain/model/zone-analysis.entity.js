export class ZoneAnalysis {
  constructor({
                id = '',
                name = '',
                status = '',
                metrics = {
                  alta: 0,
                  media: 0,
                  baja: 0,
                  incidentes: 0
                }
              }) {
    this.id = id;
    this.name = name;
    this.status = status;
    this.metrics = metrics;
  }
}