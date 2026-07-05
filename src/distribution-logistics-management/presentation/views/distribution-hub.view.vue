<script setup>
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDistributionStore } from '@/distribution-logistics-management/application/distribution.store.js'

const { t } = useI18n()
const store = useDistributionStore()

const tabs = computed(() => [
  { name: t('distribution.hub.dayDeliveries'), routeName: 'distribution-day-deliveries' },
  { name: t('distribution.hub.liveMap'), routeName: 'distribution-live-map' },
  { name: t('distribution.hub.history'), routeName: 'distribution-history' },
])

onMounted(() => {
  if (!store.loaded) {
    store.fetchDistributionData()
  }
})
</script>

<template>
  <div class="distribution-hub">
    <div class="distribution-hub__tabs-container">
      <nav class="distribution-hub__tabs" :aria-label="t('distribution.hub.tabs')">
        <router-link
          v-for="tab in tabs"
          :key="tab.name"
          :to="{ name: tab.routeName }"
          class="distribution-hub__tab"
          exact-active-class="distribution-hub__tab--active"
        >
          {{ tab.name }}
        </router-link>
      </nav>
    </div>

    <div class="distribution-hub__content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<style scoped>
.distribution-hub {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 0;
}

.distribution-hub__tabs-container {
  border-bottom: 1px solid var(--regula-gray-light, #e8ecf0);
  width: 100%;
  overflow-x: auto;
}

.distribution-hub__tabs {
  display: flex;
  gap: 2rem;
}

.distribution-hub__tab {
  text-decoration: none;
  font-family: var(--regula-font-sans, 'Inter', sans-serif);
  color: var(--regula-gray-mid, #555f6e);
  font-size: 0.95rem;
  font-weight: 500;
  padding: 0.75rem 0;
  border-bottom: 2px solid transparent;
  transition: color 0.2s ease, border-color 0.2s ease;
  white-space: nowrap;
}

.distribution-hub__tab:hover {
  color: var(--regula-text-primary, #111);
}

.distribution-hub__tab--active {
  color: var(--regula-orange, #f26e22);
  border-bottom-color: var(--regula-orange, #f26e22);
  font-weight: 600;
}

.distribution-hub__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
