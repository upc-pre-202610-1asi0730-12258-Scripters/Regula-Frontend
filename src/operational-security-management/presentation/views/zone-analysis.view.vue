<template>
  <div class="zone-analysis">
    <!-- 1. Cabecera y Filtros -->
    <div class="zone-header">
      <h2 class="zone-title">Zonas con mayor frecuencia de alertas</h2>
      <div class="zone-filters">
        <Select v-model="selectedPeriod" :options="periods" optionLabel="label" placeholder="Seleccionar Período" class="w-14rem" />
        <Select v-model="selectedType" :options="types" optionLabel="label" placeholder="Tipo de Alerta" class="w-14rem" />
      </div>
    </div>
    
    <div v-if="securityStore.isLoading" class="flex justify-content-center my-5">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
    </div>
    
    <div v-else-if="securityStore.error" class="p-error mb-4">
      {{ securityStore.error }}
    </div>

    <!-- 2. Grid de Zonas -->
    <div v-else class="zones-grid">
      <div 
        v-for="zone in securityStore.zones" 
        :key="zone.id"
        class="card-panel zone-card"
        :class="getZoneClass(zone.status)"
      >
        <div class="zone-card-header">
          <h3>{{ zone.name }}</h3>
          <Tag :value="zone.status" :severity="getZoneTagSeverity(zone.status)" />
        </div>
        
        <div class="metrics-container">
          <div class="metric-square metric-alta">
            <span class="metric-val mono-text">{{ zone.metrics.alta }}</span>
            <span class="metric-lbl">Alta</span>
          </div>
          <div class="metric-square metric-media">
            <span class="metric-val mono-text">{{ zone.metrics.media }}</span>
            <span class="metric-lbl">Media</span>
          </div>
          <div class="metric-square metric-baja">
            <span class="metric-val mono-text">{{ zone.metrics.baja }}</span>
            <span class="metric-lbl">Baja</span>
          </div>
          <div class="metric-square metric-incidentes">
            <span class="metric-val mono-text">{{ zone.metrics.incidentes }}</span>
            <span class="metric-lbl">Incidentes</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 5. Barra Inferior (Leyenda) -->
    <div class="card-panel bottom-legend">
      <div class="legend-title">Leyenda de Criticidad:</div>
      <div class="legend-items">
        <div class="legend-item">
          <span class="color-box box-alta"></span>
          <span>Alta (Prioridad 1)</span>
        </div>
        <div class="legend-item">
          <span class="color-box box-media"></span>
          <span>Media (Prioridad 2)</span>
        </div>
        <div class="legend-item">
          <span class="color-box box-baja"></span>
          <span>Baja (Preventiva)</span>
        </div>
        <div class="legend-item">
          <span class="color-box box-ok"></span>
          <span>Sin Riesgo / Estable</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useSecurityStore } from '../../application/security.store.js';
import Select from 'primevue/select';
import Tag from 'primevue/tag';

const securityStore = useSecurityStore();

const selectedPeriod = ref(null);
const periods = ref([
  { label: 'Últimos 7 días', value: '7d' },
  { label: 'Último Mes', value: '1m' },
  { label: 'Último Trimestre', value: '3m' }
]);

const selectedType = ref(null);
const types = ref([
  { label: 'Todas las Alertas', value: 'all' },
  { label: 'Fugas de Gas', value: 'fuga' },
  { label: 'Sensores Inactivos', value: 'offline' }
]);

onMounted(() => {
  securityStore.fetchZoneAnalysis();
});

const getZoneClass = (status) => {
  if (status === 'Crítica') return 'zone-a';
  if (status === 'Estable') return 'zone-b';
  return 'zone-c'; // Inactiva
};

const getZoneTagSeverity = (status) => {
  if (status === 'Crítica') return 'danger';
  if (status === 'Estable') return 'success';
  return 'secondary';
};
</script>

<style scoped>
.zone-analysis {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* 1. Header y Filtros */
.zone-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.zone-title {
  font-family: var(--font-primary, 'Inter', sans-serif);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary, #172D40);
  margin: 0;
}

.zone-filters {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

/* 2. Grid de Zonas */
.zones-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 1024px) {
  .zones-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* 3. Tarjetas y Bordes Estrictos */
.zone-card {
  display: flex;
  flex-direction: column;
  background: #FFFFFF;
  border: 1px solid var(--border-light, #E8ECF0);
  border-radius: var(--radius-lg, 12px);
  box-shadow: var(--shadow-md, 0px 4px 6px -1px rgba(0, 0, 0, 0.05));
  padding: 1.5rem;
  gap: 1.5rem;
}

.zone-a {
  border-top: 4px solid var(--status-alta-text, #EF4444);
  background: var(--status-alta-card-bg, #FFF5F5);
}

.zone-b {
  border-top: 4px solid var(--status-ok-text, #15803D);
}

.zone-c {
  border-top: 4px solid var(--gray-400, #9CA3AF);
  background: var(--gray-50, #F9FAFB);
}

.zone-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-light, #E8ECF0);
  padding-bottom: 0.75rem;
}

.zone-card-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary, #172D40);
}

/* 4. Cuadrados de Métricas con Flexbox */
.metrics-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.metric-square {
  /* Flexbox approach: Toma el 50% menos la mitad del gap, creando una grilla 2x2 */
  flex: 1 1 calc(50% - 0.75rem); 
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem 0.5rem;
  border-radius: var(--radius-md, 8px);
  min-height: 80px;
}

.metric-alta {
  background-color: var(--status-alta-bg, #FEF2F2);
  color: var(--status-alta-text, #EF4444);
}

.metric-media {
  background-color: var(--status-media-bg, #FEF3C7);
  color: var(--status-media-text, #D97706);
}

.metric-baja {
  background-color: var(--status-baja-bg, #FEF9C3);
  color: var(--status-baja-text, #CA8A04);
}

.metric-incidentes {
  background-color: var(--gray-200, #E5E7EB);
  color: var(--gray-800, #1F2937);
}

.metric-val {
  font-size: 1.5rem;
  line-height: 1.2;
}

.metric-lbl {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

/* 5. Leyenda Inferior */
.bottom-legend {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  background: #FFFFFF;
  padding: 1.25rem 1.5rem;
  border-radius: var(--radius-lg, 12px);
  border: 1px solid var(--border-light, #E8ECF0);
  gap: 1.5rem;
}

.legend-title {
  font-weight: 700;
  color: var(--text-primary, #172D40);
  font-size: 1rem;
}

.legend-items {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--gray-700, #374151);
  font-weight: 500;
}

.color-box {
  width: 16px;
  height: 16px;
  border-radius: var(--radius-sm, 4px);
  display: inline-block;
}

.box-alta { background-color: var(--status-alta-text, #EF4444); }
.box-media { background-color: var(--status-media-text, #D97706); }
.box-baja { background-color: var(--status-baja-text, #CA8A04); }
.box-ok { background-color: var(--status-ok-text, #15803D); }

.mono-text {
  font-family: var(--font-mono, 'JetBrains Mono', monospace, sans-serif);
  font-weight: 700;
}
</style>