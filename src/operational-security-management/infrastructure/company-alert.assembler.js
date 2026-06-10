import {CompanyAlert} from "@/operational-security-management/domain/model/company-alert.entity.js";

export class CompanyAlertAssembler{
    static toEntityFromResource(resource) {
        return new CompanyAlert({ ...resource });
    }
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status} ${response.statusText}`);
            return [];

        }
        let resources = response.data instanceof Array
            ? response.data
            : response.data['companyAlerts'];

        return resources.map(resource =>
            this.toEntityFromResource(resource));
    }
}