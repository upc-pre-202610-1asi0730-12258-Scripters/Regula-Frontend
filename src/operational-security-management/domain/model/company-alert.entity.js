export class CompanyAlert{
    constructor(id,
    zone,
    type,
    criticality,
    dateTime,
    status,
    operator,
    attentionTime,
    hasViewAction,
    hasAttendAction){
        this.id = id;
        this.zone = zone;
        this.type = type;
        this.criticality = criticality;
        this.dateTime = dateTime;
        this.status = status;
        this.operator = operator;
        this.attentionTime = attentionTime;
        this.hasViewAction = hasViewAction;
        this.hasAttendAction = hasAttendAction;
    }
}