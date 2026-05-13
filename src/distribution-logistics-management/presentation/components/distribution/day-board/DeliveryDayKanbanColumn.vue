<script setup lang="ts">
import Button from 'primevue/button'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  titleKey: string
  dotClass: string
  count: number
}>()

const { t } = useI18n()
</script>

<template>
  <section class="column">
    <header class="column__head">
      <span :class="['column__dot', props.dotClass]" aria-hidden="true" />
      <h2 class="column__title">{{ t(props.titleKey) }}</h2>
      <span class="column__count">{{ props.count }}</span>
      <Button
        icon="pi pi-ellipsis-h"
        text
        rounded
        type="button"
        class="column__menu"
        :aria-label="t('distribution.dayBoard.columnMenu')"
      />
    </header>
    <div class="column__body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.column {
  background: var(--regula-app-bg);
  border-radius: var(--regula-radius-lg);
  min-height: 10rem;
  padding: 1rem;
}

.column__head {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.column__dot {
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 999px;
  display: inline-block;
}

.column__dot--route {
  background: var(--regula-color-primary);
}

.column__dot--done {
  background: var(--regula-color-success);
}

.column__dot--fail {
  background: var(--regula-color-steel);
}

.column__title {
  flex: 1;
  margin: 0;
  font-size: var(--regula-font-size-sm);
  font-weight: 700;
}

.column__count {
  font-size: var(--regula-font-size-xs);
  font-weight: 700;
  padding: 0.1rem 0.45rem;
  border-radius: 999px;
  background: var(--regula-color-border-soft);
  color: var(--regula-color-primary);
}

.column__menu {
  margin-left: auto;
}

.column__body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
