<script setup>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDistributionStore } from '@/distribution-logistics-management/application/distribution.store.js'
import DeliveryCard from '../components/delivery-card.vue'
import RegisterDeliveryDialog from '../components/register-delivery-dialog.vue'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'

const { t } = useI18n()
const store = useDistributionStore()
const showRegisterDialog = ref(false)

const pending = computed(() => store.pendingDeliveries)
const enRoute = computed(() => store.enRouteDeliveries)
const completed = computed(() => store.completedDeliveries)
const failed = computed(() => store.failedDeliveries)

onMounted(() => {
  if (!store.loaded) {
    store.fetchDistributionData()
  }
})

function openRegisterDialog() {
  showRegisterDialog.value = true
}
</script>

<template>
  <div class="day-deliveries-page">
    <div class="day-deliveries-page__toolbar">
      <div v-if="store.hasError" class="day-deliveries-page__error">
        <i class="pi pi-exclamation-triangle" aria-hidden="true" />
        {{ t('distribution.dayDeliveries.errorBanner') }}
      </div>
      <Button
          :label="t('distribution.dayDeliveries.newDelivery')"
          icon="pi pi-plus"
          class="day-deliveries-page__new-btn"
          @click="openRegisterDialog"
      />
    </div>

    <div v-if="!store.loaded" class="day-deliveries-page__loading">
      <ProgressSpinner stroke-width="4" style="width: 42px; height: 42px" />
      <span>{{ t('distribution.dayDeliveries.loading') }}</span>
    </div>

    <div v-else class="day-deliveries">
      <!-- Pendientes Column -->
      <section class="day-deliveries__column">
        <header class="day-deliveries__column-header">
          <span class="day-deliveries__column-title">
            {{ t('distribution.dayDeliveries.pending') }}
            <span class="day-deliveries__column-count">{{ pending.length }}</span>
          </span>
        </header>
        <div class="day-deliveries__cards">
          <DeliveryCard
            v-for="delivery in pending"
            :key="delivery.id"
            :delivery="delivery"
          />
          <p v-if="pending.length === 0" class="day-deliveries__empty">
            {{ t('distribution.dayDeliveries.emptyPending') }}
          </p>
        </div>
      </section>

      <!-- En Ruta Column -->
      <section class="day-deliveries__column">
        <header class="day-deliveries__column-header">
          <span class="day-deliveries__column-title">
            {{ t('distribution.dayDeliveries.enRoute') }}
            <span class="day-deliveries__column-count">{{ enRoute.length }}</span>
          </span>
        </header>
        <div class="day-deliveries__cards">
          <DeliveryCard
            v-for="delivery in enRoute"
            :key="delivery.id"
            :delivery="delivery"
          />
          <p v-if="enRoute.length === 0" class="day-deliveries__empty">
            {{ t('distribution.dayDeliveries.emptyEnRoute') }}
          </p>
        </div>
      </section>

      <!-- Completadas Column -->
      <section class="day-deliveries__column">
        <header class="day-deliveries__column-header">
          <span class="day-deliveries__column-title">
            {{ t('distribution.dayDeliveries.completed') }}
            <span class="day-deliveries__column-count">{{ completed.length }}</span>
          </span>
        </header>
        <div class="day-deliveries__cards">
          <DeliveryCard
            v-for="delivery in completed"
            :key="delivery.id"
            :delivery="delivery"
          />
          <p v-if="completed.length === 0" class="day-deliveries__empty">
            {{ t('distribution.dayDeliveries.emptyCompleted') }}
          </p>
        </div>
      </section>

      <!-- No Entregadas Column -->
      <section class="day-deliveries__column">
        <header class="day-deliveries__column-header">
          <span class="day-deliveries__column-title">
            {{ t('distribution.dayDeliveries.notDelivered') }}
            <span class="day-deliveries__column-count">{{ failed.length }}</span>
          </span>
        </header>
        <div class="day-deliveries__cards">
          <DeliveryCard
            v-for="delivery in failed"
            :key="delivery.id"
            :delivery="delivery"
          />
          <div v-if="failed.length === 0" class="day-deliveries__no-failed">
            <div class="day-deliveries__no-failed-icon">
              <i class="pi pi-check" aria-hidden="true" />
            </div>
            <p class="day-deliveries__no-failed-title">{{ t('distribution.dayDeliveries.noFailedTitle') }}</p>
          </div>
        </div>
      </section>
    </div>

    <RegisterDeliveryDialog v-model:visible="showRegisterDialog" />
  </div>
</template>

<style scoped>
.day-deliveries-page {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.day-deliveries-page__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 1rem;
  flex-wrap: wrap;
}

.day-deliveries-page__error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #b45309;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 8px;
  padding: 0.5rem 0.85rem;
  font-size: 0.82rem;
  flex: 1;
}

.day-deliveries-page__new-btn :deep(.p-button) {
  background: var(--regula-orange, #f26e22);
  border-color: var(--regula-orange, #f26e22);
  font-weight: 700;
  min-height: 44px;
}

.day-deliveries-page__loading {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 0;
  color: var(--regula-text-muted, #a5b1bf);
}

.day-deliveries {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  align-items: start;
}

@media (max-width: 1100px) {
  .day-deliveries {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .day-deliveries {
    grid-template-columns: 1fr;
  }
}

.day-deliveries__column {
  background: #f4f6f9;
  border-radius: var(--regula-radius-card, 12px);
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-height: 200px;
}

.day-deliveries__column-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 0.25rem;
}

.day-deliveries__column-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--regula-text-primary, #111);
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.day-deliveries__column-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--regula-gray-light, #e8ecf0);
  color: var(--regula-gray-mid, #555f6e);
  border-radius: 9999px;
  width: 20px;
  height: 20px;
  font-size: 0.72rem;
  font-weight: 700;
}

.day-deliveries__cards {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.day-deliveries__empty {
  font-size: 0.8rem;
  color: var(--regula-text-muted, #a5b1bf);
  text-align: center;
  padding: 1rem 0;
}

.day-deliveries__no-failed {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 2.5rem 1rem;
  text-align: center;
}

.day-deliveries__no-failed-icon {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--regula-gray-light, #e8ecf0);
  display: flex;
  align-items: center;
  justify-content: center;
}

.day-deliveries__no-failed-icon .pi {
  font-size: 1.25rem;
  color: var(--regula-gray-mid, #555f6e);
}

.day-deliveries__no-failed-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--regula-text-primary, #111);
  margin: 0;
}
</style>
