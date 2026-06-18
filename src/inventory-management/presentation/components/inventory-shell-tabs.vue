<script setup>
import TabPanel from 'primevue/tabpanel'
import TabView from 'primevue/tabview'
import { onMounted, ref } from 'vue'

const props = defineProps({
  panels: { type: Array, required: true },
})

const emit = defineEmits(['section-change'])

const activeIndex = ref(0)

function onTabChange(event) {
  const panel = props.panels[event.index]
  if (panel) {
    emit('section-change', { key: panel.key })
  }
}

onMounted(() => {
  if (props.panels[0]) {
    emit('section-change', { key: props.panels[0].key })
  }
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
      <template #header>{{ panel.header }}</template>
      <slot :name="panel.key" />
    </TabPanel>
  </TabView>
</template>
