import {CompanyAlert} from "@/operational-security-management/domain/model/company-alert.entity.js";

export class CompanyAlertAssembler{
    static toDomain(rawData){
        return new CompanyAlert(
            rawData.id,
            rawData.zone,
            rawData.type,
            rawData.criticality,
            rawData.dateTime,
            rawData.status,
            rawData.operator,
            rawData.attentionTime,
            rawData.hasViewAction,
            rawData.hasAttendAction
        )
    }
    static toDomainList(rawDataArray) {
        if (!Array.isArray(rawDataArray)) {
            return [];
        }
        return rawDataArray.map((rawData) => this.toDomain(rawData));
    }
}