import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { AnalyticsApi }           from '../infrastructure/analytics-api.js'
import { ReportConfigAssembler }  from '../infrastructure/report-config.assembler.js'

const analyticsApi = new AnalyticsApi()

export const useAnalyticsStore = defineStore('analytics', () => {

    const enterpriseMovements  = ref([])
    const distributorMovements = ref([])
    const auditLogs            = ref([])
    const enterpriseStock      = ref([])

    const errors  = ref([])
    const loaded  = ref({
        enterpriseMovements:  false,
        distributorMovements: false,
        auditLogs:            false,
        enterpriseStock:      false,
    })

    const currentConfig  = ref(null)
    const isGenerating   = ref(false)
    const showSuccess    = ref(false)

    const filteredEnterpriseMovements = computed(() => {
        if (!currentConfig.value) return []
        return ReportConfigAssembler.filterEnterpriseMovementsByPeriod(
            enterpriseMovements.value,
            currentConfig.value,
        )
    })

    const filteredDistributorMovements = computed(() => {
        if (!currentConfig.value) return []
        return ReportConfigAssembler.filterDistributorMovementsByPeriod(
            distributorMovements.value,
            currentConfig.value,
        )
    })

    const filteredAuditLogs = computed(() => {
        if (!currentConfig.value) return []
        return ReportConfigAssembler.filterAuditLogsByPeriod(
            auditLogs.value,
            currentConfig.value,
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


    function fetchEnterpriseMovements() {
        return analyticsApi
            .getEnterpriseMovements()
            .then((res) => {
                enterpriseMovements.value        = res.data ?? []
                loaded.value.enterpriseMovements = true
            })
            .catch((err) => errors.value.push(err))
    }

    function fetchDistributorMovements() {
        return analyticsApi
            .getDistributorMovements()
            .then((res) => {
                distributorMovements.value        = res.data ?? []
                loaded.value.distributorMovements = true
            })
            .catch((err) => errors.value.push(err))
    }

    function fetchAuditLogs() {
        return analyticsApi
            .getAuditLogs()
            .then((res) => {
                auditLogs.value        = res.data ?? []
                loaded.value.auditLogs = true
            })
            .catch((err) => errors.value.push(err))
    }

    function fetchEnterpriseStock() {
        return analyticsApi
            .getEnterpriseStock()
            .then((res) => {
                enterpriseStock.value        = res.data ?? []
                loaded.value.enterpriseStock = true
            })
            .catch((err) => errors.value.push(err))
    }

    function fetchAll() {
        return Promise.all([
            fetchEnterpriseMovements(),
            fetchDistributorMovements(),
            fetchAuditLogs(),
            fetchEnterpriseStock(),
        ])
    }


    function setConfig(config) {
        currentConfig.value = config
    }

    async function generateReport() {
        if (!currentConfig.value) return
        isGenerating.value = true
        await new Promise((r) => setTimeout(r, 1400))
        isGenerating.value  = false
        showSuccess.value   = true
        setTimeout(() => (showSuccess.value = false), 4000)
    }

    function dismissSuccess() {
        showSuccess.value = false
    }

    return {

        enterpriseMovements,
        distributorMovements,
        auditLogs,
        enterpriseStock,
        errors,
        loaded,
        currentConfig,
        isGenerating,
        showSuccess,

        filteredEnterpriseMovements,
        filteredDistributorMovements,
        filteredAuditLogs,
        actualRowCount,

        fetchAll,
        fetchEnterpriseMovements,
        fetchDistributorMovements,
        fetchAuditLogs,
        fetchEnterpriseStock,
        setConfig,
        generateReport,
        dismissSuccess,
    }
})