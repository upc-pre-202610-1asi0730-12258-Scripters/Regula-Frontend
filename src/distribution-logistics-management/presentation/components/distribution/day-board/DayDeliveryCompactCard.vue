<script setup lang="ts">
import Tag from 'primevue/tag'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import type { Delivery } from '@/domain/distribution/delivery'

const props = defineProps<{
  delivery: Delivery
}>()

const { t } = useI18n()

const destination = computed(() =>
  t(props.delivery.destinationLineKey, props.delivery.destinationLineParams ?? {}),
)
</script>

<template>
  <article class="mini">
    <div class="mini__top">
      <span class="mini__id">{{ delivery.humanCode }}</span>
      <span class="mini__time">{{ delivery.completedAtLocalTime }}</span>
    </div>
    <div class="mini__name">{{ destination }}</div>
    <div class="mini__bottom">
      <span class="mini__count">
        {{ t('distribution.load.cylindersShort', { count: delivery.completedItemsCount ?? 0 }) }}
      </span>
      <Tag severity="success" rounded>{{ t('distribution.dayBoard.statusCompleted') }}</Tag>
    </div>
  </article>
</template>

<style scoped>
.mini {
  background: var(--regula-app-card);
  border-radius: var(--regula-radius-md);
  padding: 0.75rem;
  box-shadow: var(--regula-shadow-card);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mini__top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mini__id {
  font-weight: 700;
  font-size: var(--regula-font-size-sm);
}

.mini__time {
  font-size: var(--regula-font-size-xs);
  color: var(--regula-app-text-muted);
}

.mini__name {
  font-size: var(--regula-font-size-sm);
  line-height: 1.35;
}

.mini__bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.mini__count {
  font-size: var(--regula-font-size-xs);
  color: var(--regula-app-text-muted);
}
</style>
