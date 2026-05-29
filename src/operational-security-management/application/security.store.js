import { defineStore } from 'pinia';
import { securityApi } from '../infrastructure/security-api.js';

export const useSecurityStore = defineStore('security', {
  state: () => ({
    alerts: [],
    sensors: [],
    sensorsMetadata: null,
    routeDeviations: [],
    zones: [],
    warehouses: [],
    companyAlerts: [],
    isLoading: false,
    error: null,
  }),
  
  getters: {
    activeAlerts: (state) => state.alerts.filter(a => a.status === 'ACTIVE' || a.status === 'active' || a.status === 'Activa'),
    alertHistory: (state) => state.alerts.filter(a => a.status !== 'ACTIVE' && a.status !== 'active' && a.status !== 'Activa'),
    
    // Contadores para desviaciones
    totalDeviations: (state) => state.routeDeviations.length,
    pendingDeviations: (state) => state.routeDeviations.filter(d => d.status === 'Pendiente').length,
    attendedDeviations: (state) => state.routeDeviations.filter(d => d.status === 'Atendida').length,
  },
  
  actions: {
    async fetchAlerts() {
      this.isLoading = true;
      try {
        this.alerts = await securityApi.getAlerts();
      } catch (e) {
        this.error = 'Error al cargar las alertas';
      } finally {
        this.isLoading = false;
      }
    },

    async fetchSensorsData() {
      this.isLoading = true;
      try {
        // Carga en paralelo para mayor velocidad
        const [sensorsRes, metadataRes] = await Promise.all([
            securityApi.getSensors(),
            securityApi.getSensorsMetadata()
        ]);
        this.sensors = sensorsRes;
        this.sensorsMetadata = metadataRes;
      } catch (e) {
        this.error = 'Error al cargar estado de sensores';
      } finally {
        this.isLoading = false;
      }
    },

    async fetchRouteDeviations() {
      this.isLoading = true;
      try {
        this.routeDeviations = await securityApi.getRouteDeviations();
      } catch (e) {
        this.error = 'Error al cargar desvíos de ruta';
      } finally {
        this.isLoading = false;
      }
    },

    async fetchZoneAnalysis() {
      this.isLoading = true;
      try {
        this.zones = await securityApi.getZoneAnalysis();
      } catch (e) {
        this.error = 'Error al cargar análisis de zonas';
      } finally {
        this.isLoading = false;
      }
    },
//alamcenes
    async fetchWarehouses() {
      this.isLoading = true;
      try {
        this.warehouses = await securityApi.getWarehouses();
      } catch (e) {
        this.error = 'Error al cargar almacenes';
      } finally {
        this.isLoading = false;
      }
    },

    //alerta de empresas
    async fetchCompanyAlerts(){
      this.isLoading = true;
      try{
        this.companyAlerts= await securityApi.getCompanyAlerts();
      } catch (e){
        this.error = 'Error al cargar alerta de empresas';
      } finally {
        this.isLoading = false;
      }
    }

  }
});
