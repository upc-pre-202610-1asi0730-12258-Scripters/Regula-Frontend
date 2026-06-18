<script setup>
import TabPanel from 'primevue/tabpanel'
import TabView from 'primevue/tabview'
import { onMounted, ref } from 'vue'

const props = defineProps({
  panels: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['section-change'])

const activeIndex = ref(0)

function emitSection(index) {
  const p = props.panels[index]
  if (p) {
    emit('section-change', { key: p.key })
  }
}

function onTabChange(event) {
  emitSection(event.index)
}

onMounted(() => {
  emitSection(0)
})
</script>

<template>
  <TabView
      v-model:activeIndex="activeIndex"
      class="inv-shell-tabs"
      :scrollable="true"
      @tab-change="onTabChange"
  >
    <TabPanel v-for="panel in panels" :key="panel.key">
      <template #header>
        <span class="inv-shell-tabs__head">
          <span>{{ panel.header }}</span>
          <span v-if="panel.badge" class="inv-shell-tabs__badge">{{ panel.badge }}</span>
        </span>
      </template>
      <slot :name="panel.key" />
    </TabPanel>
  </TabView>
</template>

<style scoped>
:deep(.inv-shell-tabs .p-tabview-nav) {
  border: none;
  background: transparent;
  gap: 0.25rem;
}

:deep(.inv-shell-tabs .p-tabview-tab-header) {
  margin: 0;
}

:deep(.inv-shell-tabs .p-tabview-tab-header .p-tabview-tab-header-link) {
  border: none;
  background: transparent;
  padding: 0.75rem 0.35rem;
  margin: 0 0.65rem;
  border-radius: 0;
  font-weight: 600;
  font-size: var(--regula-type-small-size);
  color: var(--regula-text-muted);
  min-height: 44px;
}

:deep(.inv-shell-tabs .p-tabview-tab-header.p-highlight .p-tabview-tab-header-link) {
  color: var(--regula-orange);
  box-shadow: inset 0 -3px 0 var(--regula-orange);
}

:deep(.inv-shell-tabs .p-tabview-panels) {
  padding: 1.25rem 0 0;
  background: transparent;
}

:deep(.inv-shell-tabs .p-tabview-panel) {
  padding: 0;
}

.inv-shell-tabs__head {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  flex-wrap: wrap;
}

.inv-shell-tabs__badge {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  padding: 0.1rem 0.45rem;
  border-radius: 999px;
  background: #fef9c3;
  color: #854d0e;
  border: 1px solid #fde047;
  white-space: nowrap;
}
</style>
