import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { SecurityTrendsApi } from '@/operational-analytics/infrastructure/security-trends-api.js'

const api = new SecurityTrendsApi()

const MONTH_ORDER = ['2024-11', '2024-12', '2025-01', '2025-02', '2025-03', '2025-04']

export const useSecurityTrendsStore = defineStore('securityTrends', () => {

    const allAlerts = ref([])
    const allZones  = ref([])
    const isLoading = ref(false)
    const error     = ref(null)

    const selectedPeriod    = ref('last6months')
    const selectedZone      = ref('all')
    const selectedEventType = ref('all')

    const filteredAlerts = computed(() => {
        let rows = allAlerts.value
        if (selectedZone.value !== 'all') {
            rows = rows.filter((r) => r.zone === selectedZone.value)
        }
        if (selectedPeriod.value === 'last3months') {
            const last3 = MONTH_ORDER.slice(-3)
            rows = rows.filter((r) => last3.includes(r.monthKey))
        }
        return rows
    })

    const chartData = computed(() => {
        const byMonth = {}
        for (const row of filteredAlerts.value) {
            if (!byMonth[row.monthKey]) {
                byMonth[row.monthKey] = { label: row.monthLabel, high: 0, medium: 0, low: 0 }
            }
            byMonth[row.monthKey].high   += row.high
            byMonth[row.monthKey].medium += row.medium
            byMonth[row.monthKey].low    += row.low
        }
        const months = selectedPeriod.value === 'last3months'
            ? MONTH_ORDER.slice(-3)
            : MONTH_ORDER
        return months
            .filter((m) => byMonth[m])
            .map((m) => ({ ...byMonth[m], total: byMonth[m].high + byMonth[m].medium + byMonth[m].low }))
    })


    const totalAlerts = computed(() => chartData.value.reduce((s, r) => s + r.total,  0))
    const totalHigh   = computed(() => chartData.value.reduce((s, r) => s + r.high,   0))
    const totalMedium = computed(() => chartData.value.reduce((s, r) => s + r.medium, 0))
    const totalLow    = computed(() => chartData.value.reduce((s, r) => s + r.low,    0))
    const highPct     = computed(() => totalAlerts.value ? Math.round(totalHigh.value   / totalAlerts.value * 100) : 0)
    const mediumPct   = computed(() => totalAlerts.value ? Math.round(totalMedium.value / totalAlerts.value * 100) : 0)
    const lowPct      = computed(() => totalAlerts.value ? Math.round(totalLow.value    / totalAlerts.value * 100) : 0)

    const problematicZone = computed(() => {
        if (!allAlerts.value.length) return null
        const byZone = {}
        for (const row of filteredAlerts.value) {
            if (!byZone[row.zone]) {
                byZone[row.zone] = { zone: row.zone, label: row.zoneLabel, high: 0, medium: 0, low: 0, total: 0 }
            }
            byZone[row.zone].high   += row.high
            byZone[row.zone].medium += row.medium
            byZone[row.zone].low    += row.low
            byZone[row.zone].total  += row.total
        }
        const sorted = Object.values(byZone).sort((a, b) => b.total - a.total)
        const top = sorted[0]
        if (!top) return null
        const meta = allZones.value.find((z) => z.id === top.zone) ?? {}
        return {
            ...top,
            type:             meta.type ?? '',
            criticality:      meta.criticality ?? '',
            criticalityColor: meta.criticalityColor ?? 'warning',
            percentage: totalAlerts.value
                ? Math.round(top.total / totalAlerts.value * 100 * 10) / 10
                : 0,
        }
    })

    const peakMonth = computed(() => {
        if (!chartData.value.length) return null
        return [...chartData.value].sort((a, b) => b.total - a.total)[0]
    })

    async function fetchAll() {
        isLoading.value = true
        error.value     = null
        try {
            const [alertsRes, zonesRes] = await Promise.all([
                api.getSecurityAlerts(),
                api.getSecurityZones(),
            ])
            allAlerts.value = alertsRes.data ?? []
            allZones.value  = zonesRes.data  ?? []
        } catch (e) {
            error.value = e.message ?? 'Error al cargar datos de seguridad'
        } finally {
            isLoading.value = false
        }
    }

    function applyFilters() {
        // Filters are reactive — recomputed automatically. Re-fetch only if needed.
    }

    return {
        allAlerts, allZones, isLoading, error,
        selectedPeriod, selectedZone, selectedEventType,
        filteredAlerts, chartData,
        totalAlerts, totalHigh, totalMedium, totalLow,
        highPct, mediumPct, lowPct,
        problematicZone, peakMonth,
        fetchAll, applyFilters,
    }
})