<script setup lang="ts">
import Card from 'primevue/card'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  titleKey: string
}>()

const { t } = useI18n()
</script>

<template>
  <Card>
    <template #title>{{ t(props.titleKey) }}</template>
    <template #content>
      <p class="muted">{{ t('meta.appDescription') }}</p>
    </template>
  </Card>
</template>

<style scoped>
.muted {
  margin: 0;
  color: var(--regula-app-text-muted);
  line-height: 1.5;
}
</style>
