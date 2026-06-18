import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { AnalyticsApi }          from '../infrastructure/analytics-api.js'
import { ReportConfigAssembler } from '../infrastructure/report-config.assembler.js'

const analyticsApi = new AnalyticsApi()

// ── PDF helpers (loaded dynamically so they don't block initial render) ───────
async function buildPdf({ rows, columns, module, period }) {
    // jsPDF is loaded from CDN via dynamic import to keep bundle light
    const { jsPDF } = await import('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/+esm')
    const { default: autoTable } = await import('https://cdn.jsdelivr.net/npm/jspdf-autotable@3.8.2/+esm')

    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })

    doc.setFillColor(17, 24, 39)
    doc.rect(0, 0, 297, 22, 'F')

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('REGULA', 14, 14)

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Reporte Operativo', 45, 14)

    doc.setTextColor(180, 180, 180)
    doc.setFontSize(8)
    const now = new Date().toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    doc.text(`Generado: ${now}`, 297 - 14, 14, { align: 'right' })

    // ── Meta info ─────────────────────────────────────────────────────────────
    doc.setTextColor(50, 50, 50)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text(`Módulo: ${module}`, 14, 30)
    doc.text(`Período: ${period}`, 14, 36)
    doc.text(`Total de registros: ${rows.length}`, 14, 42)

    // ── Table ─────────────────────────────────────────────────────────────────
    const head = [columns.map((c) => c.label)]
    const body = rows.map((row) =>
        columns.map((col) => {
            const val = row[col.key]
            if (val === null || val === undefined) return '—'
            if (typeof val === 'string' && val.match(/^\d{4}-\d{2}-\d{2}T/)) {
                return new Date(val).toLocaleDateString('es-PE')
            }
            return String(val)
        }),
    )

    autoTable(doc, {
        head,
        body,
        startY: 48,
        styles: {
            fontSize: 7.5,
            cellPadding: 2.5,
            overflow: 'ellipsize',
        },
        headStyles: {
            fillColor: [232, 93, 4],   // regula orange
            textColor: 255,
            fontStyle: 'bold',
        },
        alternateRowStyles: {
            fillColor: [249, 250, 251],
        },
        margin: { left: 14, right: 14 },
    })

    // ── Footer ────────────────────────────────────────────────────────────────
    const pageCount = doc.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(7)
        doc.setTextColor(150)
        doc.text(
            `Página ${i} de ${pageCount}  ·  Regula Platform — Confidencial`,
            297 / 2,
            doc.internal.pageSize.height - 6,
            { align: 'center' },
        )
    }

    const safeModule = module.replace(/[^a-zA-Z0-9]/g, '_')
    doc.save(`Regula_${safeModule}_${Date.now()}.pdf`)
}

// ── Excel helper ──────────────────────────────────────────────────────────────
async function buildExcel({ rows, columns, module, period }) {
    const XLSX = await import('https://cdn.jsdelivr.net/npm/xlsx@0.18.5/+esm')

    const header = columns.map((c) => c.label)
    const data   = rows.map((row) =>
        columns.map((col) => {
            const val = row[col.key]
            if (val === null || val === undefined) return ''
            if (typeof val === 'string' && val.match(/^\d{4}-\d{2}-\d{2}T/)) {
                return new Date(val).toLocaleDateString('es-PE')
            }
            return val
        }),
    )

    const ws = XLSX.utils.aoa_to_sheet([
        [`Reporte Operativo — ${module}`],
        [`Período: ${period}`],
        [`Total registros: ${rows.length}`],
        [],
        header,
        ...data,
    ])

    // Column widths
    ws['!cols'] = columns.map(() => ({ wch: 20 }))

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte')

    const safeModule = module.replace(/[^a-zA-Z0-9]/g, '_')
    XLSX.writeFile(wb, `Regula_${safeModule}_${Date.now()}.xlsx`)
}

// ── Store ─────────────────────────────────────────────────────────────────────
export const useAnalyticsStore = defineStore('analytics', () => {

    const enterpriseMovements  = ref([])
    const distributorMovements = ref([])
    const auditLogs            = ref([])
    const enterpriseStock      = ref([])

    const errors = ref([])
    const loaded = ref({
        enterpriseMovements:  false,
        distributorMovements: false,
        auditLogs:            false,
        enterpriseStock:      false,
    })

    const isLoading     = ref(false)
    const currentConfig = ref(null)
    const isGenerating  = ref(false)
    const showSuccess   = ref(false)

    // ── Filtered computed ─────────────────────────────────────────────────────
    const filteredEnterpriseMovements = computed(() => {
        if (!currentConfig.value) return []
        return ReportConfigAssembler.filterEnterpriseMovementsByPeriod(
            enterpriseMovements.value, currentConfig.value,
        )
    })

    const filteredDistributorMovements = computed(() => {
        if (!currentConfig.value) return []
        return ReportConfigAssembler.filterDistributorMovementsByPeriod(
            distributorMovements.value, currentConfig.value,
        )
    })

    const filteredAuditLogs = computed(() => {
        if (!currentConfig.value) return []
        return ReportConfigAssembler.filterAuditLogsByPeriod(
            auditLogs.value, currentConfig.value,
        )
    })

    const actualRowCount = computed(() => {
        if (!currentConfig.value) return 0
        const mod = currentConfig.value.module
        if (mod === 'inventory')    return filteredEnterpriseMovements.value.length
        if (mod === 'alerts')       return filteredAuditLogs.value.length
        if (mod === 'distribution') return filteredDistributorMovements.value.length
        if (mod === 'all') {
            return (
                filteredEnterpriseMovements.value.length +
                filteredAuditLogs.value.length +
                filteredDistributorMovements.value.length
            )
        }
        return 0
    })

    // ── Fetchers ──────────────────────────────────────────────────────────────
    function fetchEnterpriseMovements() {
        return analyticsApi.getEnterpriseMovements()
            .then((res) => { enterpriseMovements.value = res.data ?? []; loaded.value.enterpriseMovements = true })
            .catch((err) => errors.value.push(err))
    }

    function fetchDistributorMovements() {
        return analyticsApi.getDistributorMovements()
            .then((res) => { distributorMovements.value = res.data ?? []; loaded.value.distributorMovements = true })
            .catch((err) => errors.value.push(err))
    }

    function fetchAuditLogs() {
        return analyticsApi.getAuditLogs()
            .then((res) => { auditLogs.value = res.data ?? []; loaded.value.auditLogs = true })
            .catch((err) => errors.value.push(err))
    }

    function fetchEnterpriseStock() {
        return analyticsApi.getEnterpriseStock()
            .then((res) => { enterpriseStock.value = res.data ?? []; loaded.value.enterpriseStock = true })
            .catch((err) => errors.value.push(err))
    }

    async function fetchAll() {
        isLoading.value = true
        await Promise.all([
            fetchEnterpriseMovements(),
            fetchDistributorMovements(),
            fetchAuditLogs(),
            fetchEnterpriseStock(),
        ])
        isLoading.value = false
    }

    // ── Config ────────────────────────────────────────────────────────────────
    function setConfig(config) {
        currentConfig.value = config
    }

    // ── Export (real PDF / Excel) ─────────────────────────────────────────────
    async function generateAndExport({ rows, columns, module, period, format }) {
        if (!rows.length) return
        isGenerating.value = true
        try {
            if (format === 'pdf') {
                await buildPdf({ rows, columns, module, period })
            } else {
                await buildExcel({ rows, columns, module, period })
            }
            showSuccess.value = true
            setTimeout(() => (showSuccess.value = false), 4000)
        } catch (e) {
            console.error('Export error:', e)
            errors.value.push(e)
        } finally {
            isGenerating.value = false
        }
    }

    // Keep old generateReport for backward compat (no-op if called without args)
    async function generateReport() {
        if (!currentConfig.value) return
        isGenerating.value = true
        await new Promise((r) => setTimeout(r, 800))
        isGenerating.value = false
        showSuccess.value  = true
        setTimeout(() => (showSuccess.value = false), 4000)
    }

    function dismissSuccess() {
        showSuccess.value = false
    }

    return {
        // state
        enterpriseMovements, distributorMovements, auditLogs, enterpriseStock,
        errors, loaded, isLoading, currentConfig, isGenerating, showSuccess,
        // computed
        filteredEnterpriseMovements, filteredDistributorMovements,
        filteredAuditLogs, actualRowCount,
        // actions
        fetchAll, fetchEnterpriseMovements, fetchDistributorMovements,
        fetchAuditLogs, fetchEnterpriseStock,
        setConfig, generateAndExport, generateReport, dismissSuccess,
    }
})