<script setup lang="ts">
import Button from 'primevue/button'
import Drawer from 'primevue/drawer'
import { ref, watch } from 'vue'

import { useIsMobile } from '@/presentation/composables/use-is-mobile'
import { useSeoMeta } from '@/presentation/composables/use-seo-meta'
import RegulaAppSidebar from '@/presentation/components/shell/RegulaAppSidebar.vue'

useSeoMeta()

const { isMobile } = useIsMobile()
const drawerVisible = ref(false)

watch(isMobile, (mobile) => {
  if (!mobile) {
    drawerVisible.value = false
  }
})

function closeDrawer() {
  drawerVisible.value = false
}

function openDrawer() {
  drawerVisible.value = true
}
</script>

<template>
  <div class="shell">
    <aside v-if="!isMobile" class="shell__sidebar" aria-hidden="false">
      <RegulaAppSidebar @navigate="closeDrawer" />
    </aside>

    <Drawer
      v-else
      v-model:visible="drawerVisible"
      position="left"
      class="shell__drawer"
      :pt="{
        root: { style: { width: 'min(20rem, 88vw)' } },
      }"
    >
      <RegulaAppSidebar @navigate="closeDrawer" />
    </Drawer>

    <div class="shell__main">
      <header v-if="isMobile" class="shell__mobile-header">
        <Button
          icon="pi pi-bars"
          text
          rounded
          type="button"
          :aria-label="$t('shell.mobileMenuOpen')"
          @click="openDrawer"
        />
        <span class="shell__mobile-brand">{{ $t('shell.brand') }}</span>
      </header>

      <main id="main-content" class="shell__content" tabindex="-1">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.shell {
  min-height: 100vh;
  display: flex;
  flex-direction: row;
  background: var(--regula-app-bg);
}

.shell__sidebar {
  width: var(--regula-sidebar-width);
  flex-shrink: 0;
  position: sticky;
  top: 0;
  align-self: flex-start;
  height: 100vh;
  overflow: auto;
  border-right: 1px solid var(--regula-shell-border);
}

.shell__main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.shell__mobile-header {
  display: flex;
  align-items: center;
  gap: var(--regula-space-3);
  height: var(--regula-header-height);
  padding: 0 var(--regula-space-3);
  background: var(--regula-app-card);
  border-bottom: 1px solid var(--regula-color-border-soft);
  position: sticky;
  top: 0;
  z-index: 1;
}

.shell__mobile-brand {
  font-weight: 700;
  letter-spacing: 0.06em;
  font-size: var(--regula-font-size-sm);
}

.shell__content {
  flex: 1;
  padding: var(--regula-space-4);
}

@media (min-width: 40rem) {
  .shell__content {
    padding: var(--regula-space-6);
  }
}
</style>
