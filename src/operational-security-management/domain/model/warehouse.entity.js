export class Warehouse {
    constructor({
                    id = '',
                    name = '',
                    zone = '',
                    gasConcentration = 0,
                    status = '',
                    alertLevel = '',
                    lastReading = ''
                }) {

        this.id = id;
        this.name = name;
        this.zone = zone;
        this.gasConcentration = gasConcentration;
        this.status = status;
        this.alertLevel = alertLevel;
        this.lastReading = lastReading;

    }
}