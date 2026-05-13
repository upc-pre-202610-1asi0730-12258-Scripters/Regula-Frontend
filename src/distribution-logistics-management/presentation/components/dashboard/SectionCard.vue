<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <section class="section">
    <header class="section__head">
      <div>
        <h2 class="section__title">{{ title }}</h2>
        <p v-if="subtitle" class="section__sub">{{ subtitle }}</p>
      </div>
      <div class="section__actions">
        <slot name="actions" />
      </div>
    </header>
    <div class="section__body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.section {
  background: var(--regula-app-card);
  border: 1px solid var(--regula-color-border-soft);
  border-radius: 0.75rem;
  box-shadow: var(--regula-shadow-card);
}

.section__head {
  padding: 1rem 1.15rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
}

.section__title {
  font-size: 1rem;
  font-weight: 900;
  color: var(--regula-color-primary);
}

.section__sub {
  margin: 0.25rem 0 0;
  font-size: 0.75rem;
  color: var(--regula-app-text-muted);
}

.section__actions {
  display: inline-flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.section__body {
  padding: 1rem 1.15rem 1.15rem;
}
</style>

