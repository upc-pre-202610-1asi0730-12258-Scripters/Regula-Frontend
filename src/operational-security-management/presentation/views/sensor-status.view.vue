<template>
  <div class="sensor-status-dashboard">
    
    <div v-if="securityStore.isLoading" class="flex justify-content-center my-5 w-full">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
    </div>
    
    <div v-else-if="securityStore.error" class="p-error mb-4 w-full">
      {{ $t('security.common.error') }}
    </div>

    <!-- 1. Tarjeta Principal (El primer sensor lo tomamos como el principal por ahora) -->
    <div v-if="mainSensor && !securityStore.isLoading" class="card-panel main-sensor-card" :class="{'sensor-offline': !mainSensor.hardware.online}">
      <div class="card-header">
        <h3 class="card-title">{{ mainSensor.name }}</h3>
        <Tag :value="mainSensor.status" :severity="mainSensor.hardware.online ? 'success' : 'danger'" class="status-tag" />
      </div>

      <div class="sensor-content">
        <!-- Indicador Circular de PPM -->
        <div class="ppm-indicator-container">
          <div class="ppm-circle" :style="{ background: `conic-gradient(var(--status-ok-text, #15803D) 0deg ${getDegree(mainSensor.ppm)}deg, var(--gray-200, #E5E7EB) ${getDegree(mainSensor.ppm)}deg 360deg)` }">
            <div class="ppm-value mono-text">{{ mainSensor.ppm >= 0 ? mainSensor.ppm : '--' }}</div>
          </div>
          <div class="ppm-label">{{ $t('security.sensor_status.ppm_label') }}</div>
        </div>

        <!-- Barra de Rango de Seguridad -->
        <div class="safety-range">
          <div class="range-labels">
            <span>0</span>
            <span>{{ $t('security.sensor_status.range_label') }}</span>
            <span>50+</span>
          </div>
          <div class="range-bar">
             <div class="range-fill"></div>
             <!-- Movemos el marcador dinámicamente -->
             <div class="marker-container" :style="{ paddingLeft: `${getPercentage(mainSensor.ppm)}%` }">
               <div class="marker"></div>
             </div>
          </div>
        </div>
      </div>

      <!-- Panel de Hardware inferior -->
      <div class="hardware-panel">
        <div class="hw-item">
          <i class="pi pi-wifi hw-icon" :class="{'text-green': mainSensor.hardware.signal === 'Fuerte'}"></i>
          <span class="hw-text">{{ $t('security.sensor_status.hw.signal', { strength: mainSensor.hardware.signal.toLowerCase() }) }}</span>
        </div>
        <div class="hw-item">
          <i class="pi pi-bolt hw-icon" :class="{'text-red': mainSensor.hardware.battery < 20}"></i>
          <span class="hw-text">{{ $t('security.sensor_status.hw.battery', { level: mainSensor.hardware.battery }) }}</span>
        </div>
        <div class="hw-item">
          <i :class="mainSensor.hardware.online ? 'pi pi-check-circle text-green' : 'pi pi-times-circle text-red'" class="hw-icon"></i>
          <span class="hw-text">{{ mainSensor.hardware.online ? $t('security.sensor_status.hw.online') : $t('security.sensor_status.hw.offline') }}</span>
        </div>
      </div>
    </div>

    <!-- 2. Grid Inferior (Advertencia y Metadatos) -->
    <div v-if="!securityStore.isLoading && securityStore.sensorsMetadata" class="bottom-grid">
      <!-- Tarjeta de Advertencia (Muestra el primer sensor offline si hay) -->
      <div v-if="offlineSensor" class="card-panel warning-card">
        <div class="warning-icon-wrapper">
          <i class="pi pi-exclamation-triangle warning-icon"></i>
        </div>
        <div class="warning-content">
          <h4 class="warning-title">{{ $t('security.sensor_status.warning_card.title') }}</h4>
          <p class="warning-desc">{{ $t('security.sensor_status.warning_card.location', { sensorName: offlineSensor.name, time: offlineSensor.last_connection }) }}</p>
        </div>
        <Button :label="$t('security.sensor_status.warning_card.reconnect_button')" severity="warn" size="small" outlined class="ml-auto" />
      </div>
      <div v-else class="card-panel warning-card" style="background: var(--status-ok-bg); border-color: var(--status-ok-border);">
         <div class="warning-icon-wrapper" style="background: white;">
          <i class="pi pi-check-circle text-green" style="font-size: 1.5rem;"></i>
        </div>
        <div class="warning-content">
          <h4 class="warning-title" style="color: var(--status-ok-text)">{{ $t('security.sensor_status.ok_card.title') }}</h4>
          <p class="warning-desc">{{ $t('security.sensor_status.ok_card.desc') }}</p>
        </div>
      </div>

      <!-- Tarjetas Pequeñas de Metadatos -->
      <div class="metadata-cards">
        <div class="card-panel meta-card">
          <div class="meta-label">{{ $t('security.sensor_status.meta.last_read') }}</div>
          <div class="meta-value mono-text">{{ securityStore.sensorsMetadata.last_global_read }}</div>
        </div>
        <div class="meta-card-separator"></div>
        <div class="card-panel meta-card">
          <div class="meta-label">{{ $t('security.sensor_status.meta.active_sensors') }}</div>
          <div class="meta-value mono-text">{{ securityStore.sensorsMetadata.active_sensors }} / {{ securityStore.sensorsMetadata.total_sensors }}</div>
        </div>
        <div class="meta-card-separator"></div>
        <div class="card-panel meta-card">
          <div class="meta-label">{{ $t('security.sensor_status.meta.critical_battery') }}</div>
          <div class="meta-value mono-text text-red">{{ securityStore.sensorsMetadata.critical_battery }}</div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useSecurityStore } from '../../application/security.store.js';
import Tag from 'primevue/tag';
import Button from 'primevue/button';

const securityStore = useSecurityStore();

onMounted(() => {
  securityStore.fetchSensorsData();
});

// Computed properties para enlazar la UI
const mainSensor = computed(() => {
  return securityStore.sensors.length > 0 ? securityStore.sensors[0] : null;
});

const offlineSensor = computed(() => {
  return securityStore.sensors.find(s => !s.hardware.online);
});

// Lógica visual para la barra y el círculo
const getPercentage = (ppm) => {
  if (ppm < 0) return 0;
  if (ppm > 50) return 100;
  return (ppm / 50) * 100;
};

const getDegree = (ppm) => {
  const percent = getPercentage(ppm);
  return (percent / 100) * 360;
};
</script>

<style scoped>
/* 1. Layout Principal usando CSS Grid */
.sensor-status-dashboard {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

/* 2. Tarjeta Principal */
.main-sensor-card {
  display: flex;
  flex-direction: column;
  background: #FFFFFF;
  border: 1px solid var(--border-light, #E8ECF0);
  border-radius: var(--radius-lg, 12px);
  box-shadow: var(--shadow-lg, 0px 8px 40px rgba(21, 128, 61, 0.1));
  border-top: 4px solid var(--status-ok-text, #15803D);
  overflow: hidden; 
}

.sensor-offline {
  border-top: 4px solid var(--status-alta-text, #EF4444);
  box-shadow: var(--shadow-md);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem 0.5rem 1.5rem;
}

.card-title {
  font-family: var(--font-primary, 'Inter', sans-serif);
  color: var(--text-primary, #172D40);
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
}

.sensor-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1.5rem;
  gap: 2rem;
}

/* Indicador Circular */
.ppm-indicator-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.ppm-circle {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  display: grid; 
  grid-template-areas: "stack";
  /* El background viene inyectado dinámicamente con el computed `getDegree` */
}

.ppm-circle > * {
  grid-area: stack;
}

.ppm-circle::after {
  content: "";
  grid-area: stack;
  margin: 15px; 
  background: #FFFFFF;
  border-radius: 50%;
}

.ppm-value {
  grid-area: stack;
  z-index: 1; 
  font-family: var(--font-mono, 'JetBrains Mono', monospace, sans-serif);
  font-size: 48px;
  font-weight: 700;
  color: var(--text-primary, #172D40);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.ppm-label {
  font-weight: 600;
  color: var(--gray-600, #4B5563);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Barra de Seguridad */
.safety-range {
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.range-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: var(--gray-500, #6B7280);
  font-weight: 500;
}

.range-bar {
  width: 100%;
  height: 12px;
  border-radius: var(--radius-pill, 9999px);
  background: linear-gradient(to right, 
    var(--status-ok-text, #15803D) 0%, 
    var(--status-media-text, #D97706) 60%, 
    var(--status-alta-text, #EF4444) 100%
  );
  display: flex;
  flex-direction: column;
}

.marker-container {
  width: 100%;
  display: flex;
  /* padding-left inyectado dinámicamente mueve este marcador */
  margin-top: -6px; 
  transition: padding-left 0.5s ease-out;
}

.marker {
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 8px solid var(--text-primary, #172D40);
}

/* Panel Hardware */
.hardware-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--gray-50, #F9FAFB);
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-light, #E8ECF0);
  flex-wrap: wrap;
  gap: 1rem;
}

.hw-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.hw-icon {
  font-size: 1.1rem;
  color: var(--gray-500, #6B7280);
}

.hw-text {
  font-size: 0.9rem;
  color: var(--gray-700, #374151);
  font-weight: 500;
}

.text-green { color: var(--status-ok-text, #15803D); }
.text-red { color: var(--status-alta-text, #EF4444); }

/* 3. Grid Inferior */
.bottom-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .bottom-grid {
    grid-template-columns: 1fr 1fr; 
  }
}

/* Tarjeta Advertencia */
.warning-card {
  display: flex;
  align-items: center;
  background-color: var(--status-media-card-bg, #FFF7ED);
  border-color: var(--status-media-border, #FDE68A);
  padding: 1.5rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.warning-icon-wrapper {
  background-color: var(--status-media-bg, #FEF3C7);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.warning-icon {
  color: var(--status-media-text, #D97706);
  font-size: 1.5rem;
}

.warning-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.warning-title {
  margin: 0;
  color: var(--status-media-text, #D97706);
  font-weight: 700;
  font-size: 1.1rem;
}

.warning-desc {
  margin: 0;
  color: var(--gray-600, #4B5563);
  font-size: 0.9rem;
}

.ml-auto {
  margin-left: auto;
}

/* Metadatos */
.metadata-cards {
  display: grid;
  grid-template-columns: 1fr auto 1fr auto 1fr;
  align-items: center;
  gap: 0.5rem;
}

.meta-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 0.5rem;
  text-align: center;
  gap: 0.5rem;
  box-shadow: var(--shadow-sm);
}

.meta-card-separator {
  width: 1px;
  height: 60%;
  background-color: var(--border-light, #E8ECF0);
}

.meta-label {
  font-size: 0.8rem;
  color: var(--gray-500, #6B7280);
  font-weight: 500;
  text-transform: uppercase;
}

.meta-value {
  font-size: 1.25rem;
  color: var(--text-primary, #172D40);
}

.mono-text {
  font-family: var(--font-mono, 'JetBrains Mono', monospace, sans-serif);
  font-weight: 700;
}
</style>
