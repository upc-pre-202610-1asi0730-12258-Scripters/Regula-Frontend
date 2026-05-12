<script setup lang="ts">
import Tag from 'primevue/tag'

defineProps<{
  title: string
  value: string
  subtitle?: string
  icon?: string
  accent?: 'orange' | 'green' | 'navy' | 'gray'
  badgeLeft?: string
  badgeRight?: string
}>()
</script>

<template>
  <section class="card" :class="accent ? `card--${accent}` : ''">
    <div class="card__top">
      <div class="card__text">
        <div class="card__value">{{ value }}</div>
        <div class="card__title">{{ title }}</div>
        <div v-if="subtitle" class="card__sub">{{ subtitle }}</div>
      </div>
      <i v-if="icon" :class="['pi', icon, 'card__icon']" aria-hidden="true" />
    </div>

    <div v-if="badgeLeft || badgeRight" class="card__badges">
      <Tag v-if="badgeLeft" severity="warn" rounded>{{ badgeLeft }}</Tag>
      <Tag v-if="badgeRight" severity="secondary" rounded>{{ badgeRight }}</Tag>
    </div>
  </section>
</template>

<style scoped>
.card {
  background: var(--regula-app-card);
  border: 1px solid var(--regula-color-border-soft);
  border-radius: 0.75rem;
  box-shadow: var(--regula-shadow-card);
  padding: 1rem 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  min-height: 6.2rem;
}

.card__top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.card__value {
  font-weight: 900;
  font-size: 1.7rem;
  line-height: 1;
  color: var(--regula-color-primary);
}

.card__title {
  margin-top: 0.35rem;
  font-size: 0.8rem;
  color: var(--regula-app-text-muted);
}

.card__sub {
  margin-top: 0.35rem;
  font-size: 0.75rem;
  color: var(--regula-app-text-muted);
}

.card__icon {
  font-size: 1.15rem;
  color: var(--regula-app-text-muted);
}

.card__badges {
  display: inline-flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.card--orange {
  border-top: 0.25rem solid var(--regula-color-accent);
}

.card--green {
  border-top: 0.25rem solid var(--regula-color-success);
}

.card--navy {
  border-top: 0.25rem solid var(--regula-color-primary);
}

.card--gray {
  border-top: 0.25rem solid #94a3b8;
}
</style>

