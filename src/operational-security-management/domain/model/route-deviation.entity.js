export class RouteDeviation {
    constructor({
                    id = '',
                    unit = '',
                    location = '',
                    distance = null,
                    time = '',
                    status = ''
                }) {

        this.id = id;
        this.unit = unit;
        this.location = location;
        this.distance = distance;
        this.time = time;
        this.status = status;

    }
}