import {Warehouse} from "@/operational-security-management/domain/model/warehouse.entity.js";

export class WarehouseAssembler {
    static toDomain(rawData){
        return new Warehouse(
            rawData.id,
            rawData.name,
            rawData.zone,
            rawData.gasConcentration,
            rawData.status,
            rawData.alertLevel,
            rawData.lastReading
        );
    }

    static toDomainList(rawDataArray) {
        if (!Array.isArray(rawDataArray)) {
            return [];
        }
        return rawDataArray.map((rawData) => this.toDomain(rawData));
    }
}