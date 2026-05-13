import { ReportConfig } from '../domain/model/report-config.entity.js'
import { ReportModule }  from '../domain/model/report-module.entity.js'

export class ReportConfigAssembler {
    
    static toEntityFromSelection(raw) {
        return new ReportConfig({
            module: raw.module,
            period: raw.period,
            format: raw.format,
        })
    }

    static toModuleEntitiesFromRaw(rawModules) {
        return (rawModules || []).map(
            (m) =>
                new ReportModule({
                    key:         m.key,
                    icon:        m.icon,
                    label:       m.label,
                    description: m.description,
                }),
        )
    }

    static filterEnterpriseMovementsByPeriod(movements, config) {
        return ReportConfigAssembler.#filterByPeriod(movements, config.period, 'timestamp')
    }


    static filterDistributorMovementsByPeriod(movements, config) {
        return ReportConfigAssembler.#filterByPeriod(movements, config.period, 'timestamp')
    }


    static filterAuditLogsByPeriod(logs, config) {
        return ReportConfigAssembler.#filterByPeriod(logs, config.period, 'fechaHora')
    }


    static #filterByPeriod(items, period, dateField) {
        if (!items?.length) return []

        const now   = new Date()
        const start = ReportConfigAssembler.#periodStart(period, now)
        const end   = new Date(now)
        end.setHours(23, 59, 59, 999)

        return items.filter((item) => {
            const d = new Date(item[dateField])
            return d >= start && d <= end
        })
    }

    static #periodStart(period, now) {
        const d = new Date(now)
        if (period === 'today') {
            d.setHours(0, 0, 0, 0)
            return d
        }
        if (period === 'lastWeek') {
            d.setDate(d.getDate() - 7)
            d.setHours(0, 0, 0, 0)
            return d
        }
        if (period === 'lastMonth') {
            d.setMonth(d.getMonth() - 1)
            d.setHours(0, 0, 0, 0)
            return d
        }

        d.setMonth(d.getMonth() - 1)
        d.setHours(0, 0, 0, 0)
        return d
    }
}