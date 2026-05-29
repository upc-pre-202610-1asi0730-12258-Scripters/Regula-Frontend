
<template>
  <div class="warehouse-status p-4">
    <!-- Header -->
    <div class="flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="text-2xl font-bold m-0">
          {{ $t('security.warehouses.title') }}
        </h2>

        <small class="text-color-secondary">
          {{ $t('security.warehouses.subtitle') }}
        </small>
      </div>

      <Tag severity="success" rounded>
        <template #default>
          <div class="flex align-items-center gap-2 px-2 py-1">
            <i class="pi pi-circle-fill" style="font-size: 0.5rem"></i>

            <span>
              {{ $t('security.warehouses.system_active') }}
            </span>
          </div>
        </template>
      </Tag>
    </div>

    <!-- Info Banner -->
    <Message severity="info" :closable="false" class="mb-4">
      <p class="info-text">
        <i18n-t keypath="security.warehouses.banner" tag="span">
          <template #time>
            <span class="mono-bold text-blue">30 seg</span>
          </template>
        </i18n-t>
      </p>
    </Message>

    <!-- Loading -->
    <div
        v-if="securityStore.isLoading"
        class="flex justify-content-center my-6"
    >
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
    </div>

    <!-- Error -->
    <Message
        v-else-if="securityStore.error"
        severity="error"
        :closable="false"
        class="mb-4"
    >
      {{ securityStore.error }}
    </Message>

    <!-- Warehouses -->
    <div v-else class="grid">
      <div
          v-for="warehouse in warehousesData"
          :key="warehouse.id"
          class="col-12 md:col-6 lg:col-4"
      >
        <Card
            class="warehouse-card h-full"
            :class="getCardClass(warehouse)"
        >
          <template #content>

            <!-- Top -->
            <div class="flex justify-content-between align-items-start mb-3">
              <div>
                <div class="flex align-items-center gap-2 mb-2">
                  <i
                      class="pi pi-building"
                      :class="getIconClass(warehouse)"
                  ></i>

                  <span class="font-semibold text-lg">
                    {{ warehouse.name }}
                  </span>
                </div>

                <small class="text-color-secondary">
                  {{ warehouse.zone }}
                </small>
              </div>

              <Tag
                  :value="warehouse.alertLevel"
                  :severity="getAlertSeverity(warehouse.alertLevel)"
              />
            </div>

            <!-- Gas Concentration -->
            <div class="my-4">
              <span
                  class="font-bold"
                  :class="getPpmClass(warehouse)"
                  style="font-size: 2rem"
              >
                {{
                  warehouse.gasConcentration !== null
                      ? warehouse.gasConcentration
                      : '--'
                }}
              </span>

              <span
                  class="ml-2 text-xl font-medium"
                  :class="getPpmClass(warehouse)"
              >
                ppm
              </span>
            </div>

            <Divider />

            <!-- Bottom -->
            <div class="flex justify-content-between align-items-center mb-3">
              <small class="text-color-secondary">
                <i class="pi pi-clock mr-1"></i>

                {{ $t('security.warehouses.last_reading') }}:
                {{ warehouse.lastReading }}
              </small>

              <small
                  class="font-medium"
                  :class="getStatusClass(warehouse)"
              >
                <i
                    class="pi pi-circle-fill mr-1"
                    style="font-size: 0.4rem"
                ></i>

                {{ warehouse.status }}
              </small>
            </div>

            <!-- Actions -->
            <Button
                v-if="warehouse.alertLevel === 'ALERTA'"
                :label="$t('security.warehouses.actions.attend_alert')"
                icon="pi pi-bell"
                severity="danger"
                class="w-full"
            />

            <Button
                v-else-if="warehouse.status === 'Offline'"
                :label="$t('security.warehouses.actions.check_connection')"
                icon="pi pi-refresh"
                severity="secondary"
                outlined
                class="w-full"
            />

            <Button
                v-else
                :label="$t('security.warehouses.actions.view_detail')"
                icon="pi pi-eye"
                severity="secondary"
                outlined
                class="w-full"
            />
          </template>
        </Card>
      </div>
    </div>

    <!-- Footer -->
    <div class="mt-5">
      <Message severity="info" :closable="false">
        {{ $t('security.warehouses.footer_info') }}
      </Message>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useSecurityStore } from '../../application/security.store.js';

import Card from 'primevue/card';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Divider from 'primevue/divider';
import Message from 'primevue/message';

const securityStore = useSecurityStore();

onMounted(() => {
  securityStore.fetchWarehouses();
});

const warehousesData = computed(() =>
    securityStore.warehouses.map((warehouse) => ({
      ...warehouse,
    }))
);

const getAlertSeverity = (level) => {
  if (!level) return 'secondary';

  const lvl = level.toLowerCase();

  if (lvl.includes('alerta')) return 'danger';
  if (lvl.includes('ok')) return 'success';
  if (lvl.includes('sin')) return 'secondary';

  return 'info';
};

const getCardClass = (warehouse) => {
  if (warehouse.alertLevel === 'ALERTA') {
    return 'border-left-danger';
  }

  if (warehouse.status === 'Offline') {
    return 'border-left-gray';
  }

  return 'border-left-success';
};

const getIconClass = (warehouse) => {
  if (warehouse.alertLevel === 'ALERTA') {
    return 'text-red-500';
  }

  if (warehouse.status === 'Offline') {
    return 'text-gray-400';
  }

  return 'text-green-500';
};

const getPpmClass = (warehouse) => {
  if (warehouse.alertLevel === 'ALERTA') {
    return 'text-red-500';
  }

  if (warehouse.status === 'Offline') {
    return 'text-gray-400';
  }

  return 'text-green-600';
};

const getStatusClass = (warehouse) => {
  if (warehouse.status === 'Offline') {
    return 'text-gray-500';
  }

  return 'text-green-600';
};
</script>

<style scoped>
.warehouse-card {
  border-radius: 16px;
  transition: all 0.2s ease;
}

.warehouse-card:hover {
  transform: translateY(-2px);
}

.border-left-danger {
  border-top: 4px solid #ef4444;
}

.border-left-success {
  border-top: 4px solid #22c55e;
}

.border-left-gray {
  border-top: 4px solid #9ca3af;
}

.info-text {
  margin: 0;
}

.mono-bold {
  font-weight: 700;
}

.text-blue {
  color: #2563eb;
}
</style>

