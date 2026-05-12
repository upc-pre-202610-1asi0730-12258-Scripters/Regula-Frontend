<script setup lang="ts">
import { computed, ref } from 'vue'
import Button from 'primevue/button'
import Tag from 'primevue/tag'

import KpiCard from '@/distribution-logistics-management/presentation/components/dashboard/KpiCard.vue'
import SectionCard from '@/distribution-logistics-management/presentation/components/dashboard/SectionCard.vue'
import { useI18n } from 'vue-i18n'

type Period = 'today' | 'week' | 'month'

const { t } = useI18n()

const activePeriod = ref<Period>('today')

const periodLabel = computed(() => {
  if (activePeriod.value === 'week') return t('dashboardEnterprise.period.week')
  if (activePeriod.value === 'month') return t('dashboardEnterprise.period.month')
  return t('dashboardEnterprise.period.today')
})

const kpis = computed(() => [
  {
    title: t('dashboardEnterprise.kpis.orders'),
    value: '128',
    subtitle: t('dashboardEnterprise.kpis.ordersSub'),
    icon: 'pi-shopping-bag',
    accent: 'navy' as const,
    badgeLeft: t('dashboardEnterprise.badges.vsYesterday', { value: '+12%' }),
  },
  {
    title: t('dashboardEnterprise.kpis.dispatches'),
    value: '42',
    subtitle: t('dashboardEnterprise.kpis.dispatchesSub'),
    icon: 'pi-truck',
    accent: 'orange' as const,
    badgeLeft: t('dashboardEnterprise.badges.pending', { value: 6 }),
  },
  {
    title: t('dashboardEnterprise.kpis.onTime'),
    value: '93%',
    subtitle: t('dashboardEnterprise.kpis.onTimeSub'),
    icon: 'pi-clock',
    accent: 'green' as const,
    badgeLeft: t('dashboardEnterprise.badges.goal', { value: '95%' }),
  },
  {
    title: t('dashboardEnterprise.kpis.incidents'),
    value: '3',
    subtitle: t('dashboardEnterprise.kpis.incidentsSub'),
    icon: 'pi-exclamation-triangle',
    accent: 'gray' as const,
    badgeLeft: t('dashboardEnterprise.badges.open', { value: 2 }),
    badgeRight: t('dashboardEnterprise.badges.closed', { value: 1 }),
  },
])

const opsLoad = computed(() => [
  { label: t('dashboardEnterprise.ops.preparing'), value: 18, color: 'warn' as const },
  { label: t('dashboardEnterprise.ops.onRoute'), value: 21, color: 'success' as const },
  { label: t('dashboardEnterprise.ops.delivered'), value: 3, color: 'secondary' as const },
])

const warehouses = computed(() => [
  { name: t('dashboardEnterprise.warehouses.main'), metric: t('dashboardEnterprise.warehouses.capacity', { value: '72%' }), trend: '+4%' },
  { name: t('dashboardEnterprise.warehouses.north'), metric: t('dashboardEnterprise.warehouses.capacity', { value: '55%' }), trend: '-2%' },
  { name: t('dashboardEnterprise.warehouses.south'), metric: t('dashboardEnterprise.warehouses.capacity', { value: '81%' }), trend: '+1%' },
])

const inventoryAlerts = computed(() => [
  { sku: 'SKU-2041', name: t('dashboardEnterprise.inventory.skuExample1'), severity: 'danger' as const, tag: t('dashboardEnterprise.inventory.lowStock') },
  { sku: 'SKU-1180', name: t('dashboardEnterprise.inventory.skuExample2'), severity: 'warn' as const, tag: t('dashboardEnterprise.inventory.reorderSoon') },
  { sku: 'SKU-3302', name: t('dashboardEnterprise.inventory.skuExample3'), severity: 'secondary' as const, tag: t('dashboardEnterprise.inventory.review') },
])
</script>

<template>
  <div class="page">
    <header class="hero">
      <div>
        <p class="hero__kicker">{{ t('dashboardEnterprise.kicker') }}</p>
        <h1 class="hero__title">
          {{ t('dashboardEnterprise.greeting', { name: 'Juan' }) }}
        </h1>
        <p class="hero__subtitle">
          {{ t('dashboardEnterprise.subtitle', { period: periodLabel }) }}
        </p>
      </div>

      <div class="hero__controls">
        <div class="chips" role="tablist" :aria-label="t('dashboardEnterprise.periodLabel')">
          <Button
            type="button"
            class="chip"
            :severity="activePeriod === 'today' ? 'secondary' : 'contrast'"
            :outlined="activePeriod !== 'today'"
            size="small"
            @click="activePeriod = 'today'"
          >
            {{ t('dashboardEnterprise.period.today') }}
          </Button>
          <Button
            type="button"
            class="chip"
            :severity="activePeriod === 'week' ? 'secondary' : 'contrast'"
            :outlined="activePeriod !== 'week'"
            size="small"
            @click="activePeriod = 'week'"
          >
            {{ t('dashboardEnterprise.period.week') }}
          </Button>
          <Button
            type="button"
            class="chip"
            :severity="activePeriod === 'month' ? 'secondary' : 'contrast'"
            :outlined="activePeriod !== 'month'"
            size="small"
            @click="activePeriod = 'month'"
          >
            {{ t('dashboardEnterprise.period.month') }}
          </Button>
        </div>
      </div>
    </header>

    <section class="kpis" aria-label="KPIs">
      <KpiCard
        v-for="kpi in kpis"
        :key="kpi.title"
        :title="kpi.title"
        :value="kpi.value"
        :subtitle="kpi.subtitle"
        :icon="kpi.icon"
        :accent="kpi.accent"
        :badge-left="kpi.badgeLeft"
        :badge-right="kpi.badgeRight"
      />
    </section>

    <div class="grid">
      <SectionCard :title="t('dashboardEnterprise.sections.opsLoad')">
        <div class="ops">
          <div v-for="item in opsLoad" :key="item.label" class="ops__row">
            <div class="ops__label">
              <span class="ops__dot" :class="`ops__dot--${item.color}`" aria-hidden="true" />
              <span>{{ item.label }}</span>
            </div>
            <div class="ops__value">
              <span class="ops__num">{{ item.value }}</span>
              <Tag :severity="item.color" rounded>{{ t('dashboardEnterprise.ops.dispatches') }}</Tag>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard :title="t('dashboardEnterprise.sections.inventoryAlerts')" :subtitle="t('dashboardEnterprise.sections.inventoryAlertsSub')">
        <div class="alerts">
          <div v-for="row in inventoryAlerts" :key="row.sku" class="alerts__row">
            <div class="alerts__left">
              <div class="alerts__sku">{{ row.sku }}</div>
              <div class="alerts__name">{{ row.name }}</div>
            </div>
            <Tag :severity="row.severity" rounded>{{ row.tag }}</Tag>
          </div>
        </div>
      </SectionCard>

      <SectionCard :title="t('dashboardEnterprise.sections.warehouses')" :subtitle="t('dashboardEnterprise.sections.warehousesSub')">
        <div class="warehouses">
          <div v-for="wh in warehouses" :key="wh.name" class="wh">
            <div class="wh__name">{{ wh.name }}</div>
            <div class="wh__metric">{{ wh.metric }}</div>
            <div class="wh__trend">
              <i class="pi pi-chart-line" aria-hidden="true" />
              <span>{{ wh.trend }}</span>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard :title="t('dashboardEnterprise.sections.quickActions')">
        <template #actions>
          <Button size="small" severity="secondary" icon="pi pi-plus">
            {{ t('dashboardEnterprise.actions.newDispatch') }}
          </Button>
          <Button size="small" severity="contrast" outlined icon="pi pi-file-export">
            {{ t('dashboardEnterprise.actions.export') }}
          </Button>
        </template>

        <div class="actions">
          <button type="button" class="action">
            <i class="pi pi-truck" aria-hidden="true" />
            <span>{{ t('dashboardEnterprise.actions.viewRoutes') }}</span>
          </button>
          <button type="button" class="action">
            <i class="pi pi-map-marker" aria-hidden="true" />
            <span>{{ t('dashboardEnterprise.actions.liveMap') }}</span>
          </button>
          <button type="button" class="action">
            <i class="pi pi-box" aria-hidden="true" />
            <span>{{ t('dashboardEnterprise.actions.inventory') }}</span>
          </button>
          <button type="button" class="action">
            <i class="pi pi-bell" aria-hidden="true" />
            <span>{{ t('dashboardEnterprise.actions.alerts') }}</span>
          </button>
        </div>
      </SectionCard>
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.hero {
  background: linear-gradient(135deg, #eff6ff, #ffffff);
  border: 1px solid var(--regula-color-border-soft);
  border-radius: 1rem;
  box-shadow: var(--regula-shadow-card);
  padding: 1.25rem 1.35rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.25rem;
  flex-wrap: wrap;
}

.hero__kicker {
  margin: 0;
  font-size: 0.75rem;
  color: var(--regula-app-text-muted);
}

.hero__title {
  margin: 0.35rem 0 0;
  font-size: 1.55rem;
  line-height: 1.15;
  font-weight: 1000;
  color: var(--regula-color-primary);
}

.hero__subtitle {
  margin: 0.5rem 0 0;
  font-size: 0.85rem;
  color: var(--regula-app-text-muted);
}

.hero__controls {
  display: flex;
  justify-content: flex-end;
  width: fit-content;
}

.chips {
  display: inline-flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.chip :deep(.p-button) {
  padding: 0.4rem 0.75rem;
  border-radius: 999px;
}

.kpis {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
}

.grid {
  display: grid;
  grid-template-columns: 1.25fr 1fr;
  gap: 1rem;
}

.ops {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.ops__row {
  padding: 0.85rem 0.95rem;
  border: 1px solid var(--regula-color-border-soft);
  border-radius: 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.ops__label {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 800;
  color: var(--regula-color-primary);
}

.ops__dot {
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 999px;
  background: #94a3b8;
}

.ops__dot--warn {
  background: var(--yellow-500);
}

.ops__dot--success {
  background: var(--green-500);
}

.ops__dot--secondary {
  background: var(--bluegray-400);
}

.ops__value {
  display: inline-flex;
  gap: 0.6rem;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.ops__num {
  font-weight: 1000;
  font-size: 1.15rem;
  color: var(--regula-color-primary);
}

.alerts {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.alerts__row {
  padding: 0.85rem 0.95rem;
  border: 1px solid var(--regula-color-border-soft);
  border-radius: 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.alerts__sku {
  font-size: 0.72rem;
  font-weight: 900;
  color: var(--regula-app-text-muted);
}

.alerts__name {
  margin-top: 0.2rem;
  font-weight: 900;
  color: var(--regula-color-primary);
}

.warehouses {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
}

.wh {
  border: 1px solid var(--regula-color-border-soft);
  border-radius: 0.75rem;
  padding: 0.9rem 0.95rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.wh__name {
  font-weight: 1000;
  color: var(--regula-color-primary);
}

.wh__metric {
  font-size: 0.85rem;
  color: var(--regula-app-text-muted);
}

.wh__trend {
  margin-top: 0.25rem;
  display: inline-flex;
  gap: 0.45rem;
  align-items: center;
  font-size: 0.8rem;
  color: var(--regula-color-primary);
}

.actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.action {
  border: 1px solid var(--regula-color-border-soft);
  border-radius: 0.75rem;
  padding: 0.9rem 0.95rem;
  background: #fff;
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-weight: 900;
  color: var(--regula-color-primary);
  cursor: pointer;
  transition: transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease;
}

.action:hover {
  transform: translateY(-0.06rem);
  box-shadow: 0 0.45rem 1.2rem rgba(15, 23, 42, 0.08);
  border-color: rgba(14, 116, 144, 0.25);
}

@media (max-width: 74rem) {
  .kpis {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .grid {
    grid-template-columns: 1fr;
  }

  .warehouses {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 40rem) {
  .warehouses {
    grid-template-columns: 1fr;
  }

  .actions {
    grid-template-columns: 1fr;
  }
}
</style>

