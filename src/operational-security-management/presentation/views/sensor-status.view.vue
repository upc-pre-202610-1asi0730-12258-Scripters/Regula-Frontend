<template>
  <div class="sensor-status-dashboard">

    <!-- Loader -->
    <div
        v-if="!securityStore.sensorsLoaded"
        class="flex justify-content-center my-5 w-full">

      <i class="pi pi-spin pi-spinner" style="font-size:2rem"></i>

    </div>

    <!-- Error -->
    <div
        v-else-if="securityStore.errors.length > 0"
        class="p-error mb-4 w-full">

      {{ $t('security.common.error') }}

    </div>


    <!-- Tarjeta principal -->
    <div
        v-if="mainSensor && securityStore.sensorsLoaded"
        class="card-panel main-sensor-card"
        :class="{ 'sensor-offline': !mainSensor.hardware.online }">

      <div class="card-header">

        <h3 class="card-title">
          {{ mainSensor.name }}
        </h3>

        <Tag
            :value="mainSensor.status"
            :severity="mainSensor.hardware.online ? 'success' : 'danger'"
            class="status-tag" />

      </div>


      <div class="sensor-content">

        <!-- Indicador circular -->
        <div class="ppm-indicator-container">

          <div
              class="ppm-circle"
              :style="{
                background:
                `conic-gradient(
                var(--status-ok-text,#15803D) 0deg ${getDegree(mainSensor.ppm)}deg,
                var(--gray-200,#E5E7EB) ${getDegree(mainSensor.ppm)}deg 360deg
                )`
              }">

            <div class="ppm-value mono-text">
              {{ mainSensor.ppm >= 0 ? mainSensor.ppm : '--' }}
            </div>

          </div>

          <div class="ppm-label">
            {{ $t('security.sensors.ppm') }}
          </div>

        </div>


        <!-- Barra -->
        <div class="safety-range">

          <div class="range-labels">

            <span>0</span>

            <span>
              {{ $t('security.sensors.ppm') }}
            </span>

            <span>50+</span>

          </div>

          <div class="range-bar">

            <div
                class="marker-container"
                :style="{
                  paddingLeft: `${getPercentage(mainSensor.ppm)}%`
                }">

              <div class="marker"></div>

            </div>

          </div>

        </div>

      </div>


      <!-- Hardware -->
      <div class="hardware-panel">

        <div class="hw-item">

          <i
              class="pi pi-wifi hw-icon"
              :class="{ 'text-green': mainSensor.hardware.signal === 'Fuerte' }">
          </i>

          <span class="hw-text">

            {{ $t('security.sensors.signal') }}:

            {{ mainSensor.hardware.signal }}

          </span>

        </div>


        <div class="hw-item">

          <i
              class="pi pi-bolt hw-icon"
              :class="{ 'text-red': mainSensor.hardware.battery < 20 }">
          </i>

          <span class="hw-text">

            {{ $t('security.sensors.battery') }}:

            {{ mainSensor.hardware.battery }}%

          </span>

        </div>


        <div class="hw-item">

          <i
              class="hw-icon"
              :class="
              mainSensor.hardware.online
              ? 'pi pi-check-circle text-green'
              : 'pi pi-times-circle text-red'
            ">
          </i>

          <span class="hw-text">

            {{
              mainSensor.hardware.online
                  ? $t('security.sensors.status.online')
                  : $t('security.sensors.status.offline')
            }}

          </span>

        </div>

      </div>

    </div>



    <!-- Grid inferior -->
    <div
        v-if="securityStore.sensorsLoaded && securityStore.sensorsMetadata"
        class="bottom-grid">


      <!-- Advertencia -->
      <div
          v-if="offlineSensor"
          class="card-panel warning-card">

        <div class="warning-icon-wrapper">

          <i class="pi pi-exclamation-triangle warning-icon"></i>

        </div>


        <div class="warning-content">

          <h4 class="warning-title">

            {{ $t('security.sensors.warning.offline') }}

          </h4>

          <p class="warning-desc">

            {{ offlineSensor.name }}

            ·

            {{ offlineSensor.lastConnection }}

          </p>

        </div>

        <Button
            :label="$t('security.sensors.actions.reconnect')"
            severity="warn"
            size="small"
            outlined
            class="ml-auto" />

      </div>



      <!-- Todo OK -->
      <div
          v-else
          class="card-panel warning-card"
          style="
          background: var(--status-ok-bg);
          border-color: var(--status-ok-border);
        ">

        <div
            class="warning-icon-wrapper"
            style="background:white">

          <i
              class="pi pi-check-circle text-green"
              style="font-size:1.5rem">
          </i>

        </div>

        <div class="warning-content">

          <h4
              class="warning-title"
              style="color:var(--status-ok-text)">

            All Sensors Operational

          </h4>

          <p class="warning-desc">

            No connectivity problems detected.

          </p>

        </div>

      </div>



      <!-- Metadata -->
      <div class="metadata-cards">

        <div class="card-panel meta-card">

          <div class="meta-label">

            {{ $t('security.sensors.summary.last_read') }}

          </div>

          <div class="meta-value mono-text">

            {{ securityStore.sensorsMetadata.last_global_read }}

          </div>

        </div>


        <div class="meta-card-separator"></div>


        <div class="card-panel meta-card">

          <div class="meta-label">

            {{ $t('security.sensors.summary.active') }}

          </div>

          <div class="meta-value mono-text">

            {{ securityStore.sensorsMetadata.active_sensors }}

            /

            {{ securityStore.sensorsMetadata.total_sensors }}

          </div>

        </div>


        <div class="meta-card-separator"></div>


        <div class="card-panel meta-card">

          <div class="meta-label">

            {{ $t('security.sensors.summary.critical') }}

          </div>

          <div class="meta-value mono-text text-red">

            {{ securityStore.sensorsMetadata.critical_battery }}

          </div>

        </div>

      </div>

    </div>

  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useSecurityStore } from '../../application/security.store.js'

import Tag from 'primevue/tag'
import Button from 'primevue/button'

const securityStore = useSecurityStore()

onMounted(() => {
  securityStore.fetchSensorsData()
})

const mainSensor = computed(() => {
  return securityStore.sensors.length > 0
      ? securityStore.sensors[0]
      : null
})

const offlineSensor = computed(() => {
  return securityStore.sensors.find(
      sensor => !sensor.hardware.online
  )
})

function getPercentage(ppm) {

  if (ppm < 0)
    return 0

  if (ppm > 50)
    return 100

  return (ppm / 50) * 100
}

function getDegree(ppm) {

  const percent = getPercentage(ppm)

  return (percent / 100) * 360
}
</script>
<style scoped>

/* == LAYOUT PRINCIPAL === */

.sensor-status-dashboard {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

/*==TARJETA PRINCIPAL==== */

.main-sensor-card {
  display: flex;
  flex-direction: column;
  background: #FFFFFF;
  border: 1px solid var(--border-light, #E8ECF0);
  border-radius: 12px;
  overflow: hidden;
  border-top: 4px solid var(--status-ok-text, #15803D);
  box-shadow: 0 8px 40px rgba(21, 128, 61, 0.1);
}

.sensor-offline {
  border-top: 4px solid var(--status-alta-text, #EF4444);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem .5rem;
}

.card-title {
  margin: 0;
  color: var(--text-primary, #172D40);
  font-size: 1.25rem;
  font-weight: 700;
}

/*====CONTENIDO SENSOR=======*/

.sensor-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1.5rem;
  gap: 2rem;
}

/*===CÍRCULO PPM==*/

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
}

.ppm-circle > * {
  grid-area: stack;
}

.ppm-circle::after {
  content: "";
  grid-area: stack;
  margin: 15px;
  background: white;
  border-radius: 50%;
}

.ppm-value {
  grid-area: stack;
  z-index: 1;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;

  font-size: 48px;
  font-weight: 700;
  color: var(--text-primary, #172D40);
}

.ppm-label {
  font-weight: 600;
  color: var(--gray-600, #4B5563);
  text-transform: uppercase;
}

/*===BARRA DE RANGO=====*/

.safety-range {
  width: 100%;
  max-width: 400px;

  display: flex;
  flex-direction: column;
  gap: .5rem;
}

.range-labels {
  display: flex;
  justify-content: space-between;

  font-size: .85rem;
  color: var(--gray-500, #6B7280);
  font-weight: 500;
}

.range-bar {
  width: 100%;
  height: 12px;

  border-radius: 9999px;

  background:
      linear-gradient(
          to right,
          var(--status-ok-text, #15803D) 0%,
          var(--status-media-text, #D97706) 60%,
          var(--status-alta-text, #EF4444) 100%
      );
}

.marker-container {
  width: 100%;
  display: flex;

  margin-top: -6px;

  transition: padding-left .5s ease;
}

.marker {
  width: 0;
  height: 0;

  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 8px solid var(--text-primary, #172D40);
}

/*====PANEL HARDWARE=====*/

.hardware-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;

  flex-wrap: wrap;
  gap: 1rem;

  padding: 1rem 1.5rem;

  background: var(--gray-50, #F9FAFB);

  border-top: 1px solid var(--border-light, #E8ECF0);
}

.hw-item {
  display: flex;
  align-items: center;
  gap: .5rem;
}

.hw-icon {
  font-size: 1.1rem;
  color: var(--gray-500, #6B7280);
}

.hw-text {
  font-size: .9rem;
  color: var(--gray-700, #374151);
  font-weight: 500;
}

.text-green {
  color: var(--status-ok-text, #15803D);
}

.text-red {
  color: var(--status-alta-text, #EF4444);
}

/*=====GRID INFERIOR====*/

.bottom-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width:768px) {

  .bottom-grid {
    grid-template-columns: 1fr 1fr;
  }

}

/*====WARNING CARD=======*/

.warning-card {
  display: flex;
  align-items: center;

  gap: 1rem;

  flex-wrap: wrap;

  padding: 1.5rem;

  background: #FFF7ED;

  border: 1px solid #FDE68A;

  border-radius: 12px;
}

.warning-icon-wrapper {
  width: 48px;
  height: 48px;

  border-radius: 50%;

  background: #FEF3C7;

  display: flex;
  justify-content: center;
  align-items: center;
}

.warning-icon {
  color: #D97706;
  font-size: 1.5rem;
}

.warning-content {
  display: flex;
  flex-direction: column;
  gap: .25rem;
}

.warning-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;

  color: #D97706;
}

.warning-desc {
  margin: 0;

  font-size: .9rem;

  color: var(--gray-600, #4B5563);
}

.ml-auto {
  margin-left: auto;
}

/*===METADATA === */

.metadata-cards {
  display: grid;

  grid-template-columns:
      1fr auto
      1fr auto
      1fr;

  gap: .5rem;

  align-items: center;
}

.meta-card {
  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;

  gap: .5rem;

  text-align: center;

  padding: 1.5rem .5rem;

  box-shadow: var(--shadow-sm);
}

.meta-card-separator {
  width: 1px;
  height: 60%;

  background: var(--border-light, #E8ECF0);
}

.meta-label {
  font-size: .8rem;
  font-weight: 500;

  text-transform: uppercase;

  color: var(--gray-500, #6B7280);
}

.meta-value {
  font-size: 1.25rem;
  color: var(--text-primary, #172D40);
}

.mono-text {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
}

</style>