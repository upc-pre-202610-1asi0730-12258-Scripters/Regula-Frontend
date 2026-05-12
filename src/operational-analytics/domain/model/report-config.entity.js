export class ReportConfig {

    constructor({ module, period, format }) {
        this.module = module
        this.period = period
        this.format = format
    }


    static PERIOD_LABELS = {
        today:     'Hoy',
        lastWeek:  'Última semana',
        lastMonth: 'Último mes',
        custom:    'Personalizado',
    }


    static ESTIMATED_ROWS = {
        inventory:    '~1,240',
        alerts:       '~87',
        distribution: '~342',
        all:          '~1,669',
    }

    get estimatedRows() {
        return ReportConfig.ESTIMATED_ROWS[this.module] ?? '—'
    }

    get periodLabel() {
        return ReportConfig.PERIOD_LABELS[this.period] ?? '—'
    }
}