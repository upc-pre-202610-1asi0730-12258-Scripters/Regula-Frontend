<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import Message from 'primevue/message'
import Tag from 'primevue/tag'
import { useI18n } from 'vue-i18n'

import KpiCard from '@/distribution-logistics-management/presentation/components/dashboard/KpiCard.vue'
import SectionCard from '@/distribution-logistics-management/presentation/components/dashboard/SectionCard.vue'

const { t } = useI18n()

const kpis = computed(() => [
  {
    title: t('dashboardDistributor.kpis.alerts'),
    value: '7',
    subtitle: t('dashboardDistributor.kpis.alertsSub'),
    icon: 'pi-bell',
    accent: 'orange' as const,
    badgeLeft: t('dashboardDistributor.badges.open', { value: 5 }),
    badgeRight: t('dashboardDistributor.badges.critical', { value: 2 }),
  },
  {
    title: t('dashboardDistributor.kpis.stock'),
    value: '24',
    subtitle: t('dashboardDistributor.kpis.stockSub'),
    icon: 'pi-box',
    accent: 'navy' as const,
    badgeLeft: t('dashboardDistributor.badges.low', { value: 8 }),
  },
  {
    title: t('dashboardDistributor.kpis.deliveries'),
    value: '15',
    subtitle: t('dashboardDistributor.kpis.deliveriesSub'),
    icon: 'pi-truck',
    accent: 'green' as const,
    badgeLeft: t('dashboardDistributor.badges.pending', { value: 4 }),
  },
  {
    title: t('dashboardDistributor.kpis.credits'),
    value: '$ 1,840',
    subtitle: t('dashboardDistributor.kpis.creditsSub'),
    icon: 'pi-wallet',
    accent: 'gray' as const,
    badgeLeft: t('dashboardDistributor.badges.dueToday', { value: 3 }),
  },
])

const salesRows = computed(() => [
  { label: t('dashboardDistributor.sales.gross'), value: '$ 8,250', tag: t('dashboardDistributor.sales.today') },
  { label: t('dashboardDistributor.sales.net'), value: '$ 7,410', tag: t('dashboardDistributor.sales.today') },
  { label: t('dashboardDistributor.sales.items'), value: '312', tag: t('dashboardDistributor.sales.units') },
  { label: t('dashboardDistributor.sales.tickets'), value: '46', tag: t('dashboardDistributor.sales.ticketsTag') },
])

const topProducts = computed(() => [
  { name: t('dashboardDistributor.topProducts.p1'), qty: 84 },
  { name: t('dashboardDistributor.topProducts.p2'), qty: 71 },
  { name: t('dashboardDistributor.topProducts.p3'), qty: 56 },
  { name: t('dashboardDistributor.topProducts.p4'), qty: 44 },
])
</script>

<template>
  <div class="page">
    <Message severity="warn" class="notice" :closable="false" icon="pi pi-info-circle">
      <div class="notice__content">
        <div class="notice__title">{{ t('dashboardDistributor.noticeTitle') }}</div>
        <div class="notice__text">{{ t('dashboardDistributor.noticeText') }}</div>
      </div>
      <template #icon>
        <i class="pi pi-bell" aria-hidden="true" />
      </template>
    </Message>

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
      <SectionCard :title="t('dashboardDistributor.sections.sales')" :subtitle="t('dashboardDistributor.sections.salesSub')">
        <template #actions>
          <Button size="small" severity="secondary" icon="pi pi-chart-line">
            {{ t('dashboardDistributor.actions.viewReport') }}
          </Button>
          <Button size="small" severity="contrast" outlined icon="pi pi-file-export">
            {{ t('dashboardDistributor.actions.export') }}
          </Button>
        </template>

        <div class="sales">
          <div v-for="row in salesRows" :key="row.label" class="sales__row">
            <div class="sales__label">{{ row.label }}</div>
            <div class="sales__value">
              <span class="sales__num">{{ row.value }}</span>
              <Tag severity="secondary" rounded>{{ row.tag }}</Tag>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard :title="t('dashboardDistributor.sections.topProducts')" :subtitle="t('dashboardDistributor.sections.topProductsSub')">
        <div class="tops">
          <div v-for="p in topProducts" :key="p.name" class="tops__row">
            <div class="tops__name">
              <i class="pi pi-star-fill" aria-hidden="true" />
              <span>{{ p.name }}</span>
            </div>
            <div class="tops__qty">
              <span class="tops__num">{{ p.qty }}</span>
              <span class="tops__unit">{{ t('dashboardDistributor.topProducts.units') }}</span>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard :title="t('dashboardDistributor.sections.quickActions')">
        <div class="actions">
          <button type="button" class="action">
            <i class="pi pi-truck" aria-hidden="true" />
            <span>{{ t('dashboardDistributor.actions.todayDeliveries') }}</span>
          </button>
          <button type="button" class="action">
            <i class="pi pi-box" aria-hidden="true" />
            <span>{{ t('dashboardDistributor.actions.checkStock') }}</span>
          </button>
          <button type="button" class="action">
            <i class="pi pi-shopping-cart" aria-hidden="true" />
            <span>{{ t('dashboardDistributor.actions.newSale') }}</span>
          </button>
          <button type="button" class="action">
            <i class="pi pi-wallet" aria-hidden="true" />
            <span>{{ t('dashboardDistributor.actions.collect') }}</span>
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

.notice {
  border-radius: 1rem;
  overflow: hidden;
}

.notice :deep(.p-message-wrapper) {
  padding: 1rem 1.15rem;
  gap: 0.85rem;
  align-items: flex-start;
}

.notice__content {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.notice__title {
  font-weight: 1000;
  color: var(--regula-color-primary);
}

.notice__text {
  color: var(--regula-app-text-muted);
  font-size: 0.85rem;
}

.kpis {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
}

.grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 1rem;
}

.sales {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.sales__row {
  padding: 0.85rem 0.95rem;
  border: 1px solid var(--regula-color-border-soft);
  border-radius: 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.sales__label {
  font-weight: 900;
  color: var(--regula-color-primary);
}

.sales__value {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.sales__num {
  font-weight: 1000;
  font-size: 1.1rem;
  color: var(--regula-color-primary);
}

.tops {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tops__row {
  padding: 0.85rem 0.95rem;
  border: 1px solid var(--regula-color-border-soft);
  border-radius: 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.tops__name {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 900;
  color: var(--regula-color-primary);
}

.tops__qty {
  display: inline-flex;
  align-items: baseline;
  gap: 0.35rem;
  color: var(--regula-color-primary);
}

.tops__num {
  font-weight: 1000;
  font-size: 1.1rem;
}

.tops__unit {
  font-size: 0.75rem;
  color: var(--regula-app-text-muted);
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
}

@media (max-width: 40rem) {
  .actions {
    grid-template-columns: 1fr;
  }
}
</style>

