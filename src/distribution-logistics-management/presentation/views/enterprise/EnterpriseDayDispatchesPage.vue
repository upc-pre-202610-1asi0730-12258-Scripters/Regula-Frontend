<script setup lang="ts">
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

type PendingDispatch = {
  id: string
  status: 'in_route' | 'delayed'
  delayedMinutes?: number
  eta: string
  driverName: string
  driverDoc: string
  vehicleName: string
  plate: string
  loadText: string
  zoneName: string
  address: string
}

type CompletedDispatch = {
  id: string
  statusLabel: string
  deliveredAt: string
  line: string
}

const pending = computed<PendingDispatch[]>(() => [
  {
    id: '#0045',
    status: 'delayed',
    delayedMinutes: 30,
    eta: '14:30',
    driverName: 'Carlos Ríos Vega',
    driverDoc: 'DNI: 45678912',
    vehicleName: 'Toyota Hilux',
    plate: 'XYZ-456',
    loadText: 'Carga\n20 balones',
    zoneName: 'Zona Sur',
    address: 'Av. Principal 123',
  },
  {
    id: '#0046',
    status: 'in_route',
    eta: '15:15',
    driverName: 'Miguel Torres',
    driverDoc: 'DNI: 78945612',
    vehicleName: 'Nissan Frontier',
    plate: 'ABC-123',
    loadText: 'Carga\n15 balones',
    zoneName: 'Zona Norte',
    address: 'Calle 8 Nro 45',
  },
])

const completed = computed<CompletedDispatch[]>(() => [
  { id: '#0031', statusLabel: t('distributionEnterprise.common.completed').toUpperCase(), deliveredAt: '13:45', line: 'Juan Pérez • Zona Centro' },
  { id: '#0030', statusLabel: t('distributionEnterprise.common.completed').toUpperCase(), deliveredAt: '12:30', line: 'Luis Gómez • Zona Este' },
  { id: '#0029', statusLabel: t('distributionEnterprise.common.completed').toUpperCase(), deliveredAt: '11:15', line: 'Carlos Ríos Vega • Zona Sur' },
])
</script>

<template>
  <div class="page">
    <section class="col col--pending">
      <header class="col__head col__head--pending">
        <div class="col__title">
          <i class="pi pi-clock" aria-hidden="true" />
          {{ t('distributionEnterprise.day.pendingTitle', { count: pending.length }) }}
        </div>
        <i class="pi pi-filter" aria-hidden="true" />
      </header>

      <div class="col__body">
        <article v-for="d in pending" :key="d.id" class="card">
          <header class="card__head">
            <div class="card__id">{{ t('distributionEnterprise.day.dispatchId', { id: d.id }) }}</div>
            <div class="card__eta">
              <span class="card__eta-label">{{ t('distributionEnterprise.day.etaEstimated') }}</span>
              <span class="card__eta-time">{{ d.eta }}</span>
            </div>
          </header>

          <div class="card__chips">
            <Tag severity="warn" rounded>
              {{ t('distributionEnterprise.common.inRoute') }}
            </Tag>
            <Tag v-if="d.status === 'delayed'" severity="danger" rounded>
              {{ t('distributionEnterprise.day.delayed', { minutes: d.delayedMinutes }) }}
            </Tag>
          </div>

          <div class="card__grid">
            <div class="info">
              <div class="info__line info__line--strong">
                <i class="pi pi-user" aria-hidden="true" />
                <div>
                  <div class="info__title">{{ d.driverName }}</div>
                  <div class="info__sub">{{ d.driverDoc }}</div>
                </div>
              </div>
              <div class="info__line">
                <i class="pi pi-car" aria-hidden="true" />
                <div>
                  <div class="info__title">{{ d.vehicleName }}</div>
                  <div class="info__sub">{{ t('distributionEnterprise.common.plate', { plate: d.plate }) }}</div>
                </div>
              </div>
            </div>

            <div class="meta">
              <div class="meta__row">
                <i class="pi pi-cloud" aria-hidden="true" />
                <div class="meta__label">{{ t('distributionEnterprise.common.load') }}</div>
                <div class="meta__value">
                  <span>{{ d.loadText.split('\n')[1] }}</span>
                </div>
              </div>
              <div class="meta__row">
                <i class="pi pi-map-marker" aria-hidden="true" />
                <div class="meta__label">{{ d.zoneName }}</div>
                <div class="meta__value meta__value--muted">{{ d.address }}</div>
              </div>
            </div>
          </div>

          <Button class="card__cta" severity="secondary" outlined>
            <i class="pi pi-check" aria-hidden="true" />
            <span>{{ t('distributionEnterprise.day.markCompleted') }}</span>
          </Button>
        </article>
      </div>
    </section>

    <section class="col col--completed">
      <header class="col__head col__head--completed">
        <div class="col__title">
          <i class="pi pi-check-circle" aria-hidden="true" />
          {{ t('distributionEnterprise.day.completedTitle', { count: 12 }) }}
        </div>
        <span class="col__pill">{{ t('distributionEnterprise.common.today') }}</span>
      </header>

      <div class="col__body">
        <article v-for="d in completed" :key="d.id" class="mini">
          <div class="mini__left">
            <div class="mini__icon" aria-hidden="true">✓</div>
          </div>
          <div class="mini__main">
            <div class="mini__top">
              <div class="mini__id">{{ t('distributionEnterprise.day.dispatchId', { id: d.id }) }}</div>
              <Tag severity="success" rounded class="mini__tag">{{ d.statusLabel }}</Tag>
            </div>
            <div class="mini__sub">{{ d.line }}</div>
          </div>
          <div class="mini__time">
            <div class="mini__time-value">{{ d.deliveredAt }}</div>
            <div class="mini__time-label">{{ t('distributionEnterprise.day.deliveredAt') }}</div>
          </div>
        </article>

        <div class="col__footer-link">{{ t('distributionEnterprise.day.viewFullHistory') }}</div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page {
  display: grid;
  gap: 1.25rem;
}

@media (min-width: 64rem) {
  .page {
    grid-template-columns: 1fr 1fr;
    align-items: start;
  }
}

.col {
  background: var(--regula-app-card);
  border: 1px solid var(--regula-color-border-soft);
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: var(--regula-shadow-card);
}

.col__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.85rem 1rem;
}

.col__head--pending {
  background: #fff7d1;
}

.col__head--completed {
  background: #dcfce7;
}

.col__title {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 800;
  color: var(--regula-color-primary);
  font-size: 0.95rem;
}

.col__pill {
  font-size: 0.75rem;
  font-weight: 800;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  background: rgba(23, 45, 64, 0.06);
  color: var(--regula-color-primary);
}

.col__body {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card {
  border: 1px solid var(--regula-color-border-soft);
  border-left: 0.3rem solid var(--regula-color-accent);
  border-radius: 0.75rem;
  padding: 1rem;
  background: var(--regula-color-bg-pure);
}

.card__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.card__id {
  font-weight: 800;
  color: var(--regula-color-primary);
}

.card__eta {
  text-align: right;
}

.card__eta-label {
  display: block;
  font-size: 0.75rem;
  color: var(--regula-app-text-muted);
}

.card__eta-time {
  display: block;
  font-weight: 900;
  font-size: 1.05rem;
  color: var(--regula-color-primary);
}

.card__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.card__grid {
  display: grid;
  gap: 1rem;
  margin-top: 0.9rem;
}

@media (min-width: 48rem) {
  .card__grid {
    grid-template-columns: 1.2fr 0.9fr;
  }
}

.info {
  background: #f6f7fb;
  border-radius: 0.75rem;
  padding: 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info__line {
  display: flex;
  gap: 0.6rem;
  align-items: flex-start;
}

.info__title {
  font-weight: 800;
  color: var(--regula-color-primary);
  line-height: 1.25;
}

.info__sub {
  font-size: 0.75rem;
  color: var(--regula-app-text-muted);
  line-height: 1.25;
  margin-top: 0.15rem;
}

.meta {
  border-radius: 0.75rem;
  padding: 0.85rem;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.meta__row {
  display: grid;
  grid-template-columns: 1.25rem 1fr;
  column-gap: 0.55rem;
  row-gap: 0.15rem;
  align-items: start;
}

.meta__label {
  font-weight: 800;
  color: var(--regula-color-primary);
  font-size: 0.85rem;
}

.meta__value {
  grid-column: 2;
  font-size: 0.85rem;
  color: var(--regula-app-text);
}

.meta__value--muted {
  color: var(--regula-app-text-muted);
}

.card__cta {
  width: 100%;
  margin-top: 0.9rem;
  display: inline-flex;
  justify-content: center;
  gap: 0.5rem;
}

.mini {
  display: grid;
  grid-template-columns: 2rem 1fr auto;
  gap: 0.75rem;
  align-items: center;
  padding: 0.9rem 1rem;
  border: 1px solid var(--regula-color-border-soft);
  border-left: 0.3rem solid var(--regula-color-success);
  border-radius: 0.75rem;
  background: var(--regula-color-bg-pure);
}

.mini__icon {
  width: 1.4rem;
  height: 1.4rem;
  border-radius: 999px;
  background: #dcfce7;
  color: #15803d;
  display: grid;
  place-items: center;
  font-weight: 900;
  font-size: 0.85rem;
}

.mini__top {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.mini__id {
  font-weight: 900;
  color: var(--regula-color-primary);
}

.mini__sub {
  margin-top: 0.2rem;
  font-size: 0.8rem;
  color: var(--regula-app-text-muted);
}

.mini__time {
  text-align: right;
}

.mini__time-value {
  font-weight: 900;
  color: var(--regula-color-primary);
}

.mini__time-label {
  font-size: 0.7rem;
  color: var(--regula-app-text-muted);
  margin-top: 0.15rem;
}

.col__footer-link {
  text-align: center;
  padding: 1rem 0 0.25rem;
  font-size: 0.85rem;
  color: var(--regula-app-text-muted);
}
</style>

