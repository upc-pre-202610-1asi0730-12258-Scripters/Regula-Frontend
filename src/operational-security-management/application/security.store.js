import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { SecurityApi } from '../infrastructure/security-api.js'
import { AlertAssembler } from '../infrastructure/alert.assembler.js'
import { SensorAssembler } from '../infrastructure/sensor.assembler.js'
import { RouteDeviationAssembler } from '../infrastructure/route-deviation.assembler.js'
import { ZoneAnalysisAssembler } from '../infrastructure/zone-analysis.assembler.js'
import { WarehouseAssembler } from '../infrastructure/warehouse.assembler.js'
import { CompanyAlertAssembler } from '../infrastructure/company-alert.assembler.js'

const securityApi = new SecurityApi()

export const useSecurityStore = defineStore('security', () => {

    const alerts = ref([])
    const sensors = ref([])
    const sensorsMetadata = ref(null)
    const routeDeviations = ref([])
    const zones = ref([])
    const warehouses = ref([])
    const companyAlerts = ref([])

    const errors = ref([])

    const alertsLoaded = ref(false)
    const sensorsLoaded = ref(false)
    const routeDeviationsLoaded = ref(false)
    const zonesLoaded = ref(false)
    const warehousesLoaded = ref(false)
    const companyAlertsLoaded = ref(false)

    //ALERTAS ACTIVAS
    const activeAlerts = computed(() =>
        alerts.value.filter(a =>
                a.status === 'ACTIVE' ||
                a.status === 'active' ||
                a.status === 'Activa'))

    //HISTORIAL DE ALERTAS
    const alertHistory = computed(() =>
        alerts.value.filter(a =>
                a.status !== 'ACTIVE' &&
                a.status !== 'active' &&
                a.status !== 'Activa'))

    //DESVÍOS
    const totalDeviations = computed(() => routeDeviations.value.length)

    const pendingDeviations = computed(() =>
        routeDeviations.value.filter(d => d.status === 'Pendiente').length)

    const attendedDeviations = computed(() =>
        routeDeviations.value.filter(d => d.status === 'Atendida').length)

    //---ALERTS---

    function fetchAlerts() {
        securityApi.getAlerts()
            .then(response => {
                alerts.value = AlertAssembler.toEntitiesFromResponse(response)
                alertsLoaded.value = true
            }).catch(error => {
                errors.value.push(error)
            })
    }

    //---SENSORS--

    function fetchSensorsData() {

        Promise.all([
            securityApi.getSensors(),
            securityApi.getSensorsMetadata()
        ])
            .then(([sensorsResponse, metadataResponse]) => {
                sensors.value = SensorAssembler.toEntitiesFromResponse(sensorsResponse)
                sensorsMetadata.value = metadataResponse.data
                sensorsLoaded.value = true
            })
            .catch(error => {
                errors.value.push(error)
            })
    }

    //--ROUTE DEVIATIONS---
    function fetchRouteDeviations() {
        securityApi.getRouteDeviations()
            .then(response => {
                routeDeviations.value = RouteDeviationAssembler.toEntitiesFromResponse(response)
                routeDeviationsLoaded.value = true
            })
            .catch(error => {
                errors.value.push(error)
            })
    }

    //--ZONE ANALYSIS----

    function fetchZoneAnalysis() {
        securityApi.getZoneAnalysis()
            .then(response => {
                zones.value = ZoneAnalysisAssembler.toEntitiesFromResponse(response)
                zonesLoaded.value = true
            })
            .catch(error => {
                errors.value.push(error)
            })
    }

    //---WAREHOUSES---

    function fetchWarehouses() {
        securityApi.getWarehouses()
            .then(response => {
                warehouses.value = WarehouseAssembler.toEntitiesFromResponse(response)
                warehousesLoaded.value = true
            })
            .catch(error => {
                errors.value.push(error)
            })
    }

    //COMPANY ALERTS

    function fetchCompanyAlerts() {
        securityApi.getCompanyAlerts()
            .then(response => {
                companyAlerts.value = CompanyAlertAssembler.toEntitiesFromResponse(response)
                companyAlertsLoaded.value = true
            })
            .catch(error => {
                errors.value.push(error)
            })
    }

    return {
        alerts,
        sensors,
        sensorsMetadata,
        routeDeviations,
        zones,
        warehouses,
        companyAlerts,

        errors,

        alertsLoaded,
        sensorsLoaded,
        routeDeviationsLoaded,
        zonesLoaded,
        warehousesLoaded,
        companyAlertsLoaded,

        activeAlerts,
        alertHistory,
        totalDeviations,
        pendingDeviations,
        attendedDeviations,

        fetchAlerts,
        fetchSensorsData,
        fetchRouteDeviations,
        fetchZoneAnalysis,
        fetchWarehouses,
        fetchCompanyAlerts
    }
})