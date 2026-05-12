<script setup lang="ts">
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import { useSessionShellStore } from '@/presentation/stores/use-session-shell-store'

const { t } = useI18n()
const route = useRoute()
const session = useSessionShellStore()

const tabItems = computed(() => [
  { to: '/distribucion/entregas-del-dia', labelKey: 'distribution.tabs.dayDeliveries', name: 'distribution-day-deliveries' },
  { to: '/distribucion/mapa', labelKey: 'distribution.tabs.liveMap', name: 'distribution-live-map' },
  { to: '/distribucion/historial', labelKey: 'distribution.tabs.history', name: 'distribution-history' },
])

function isTabActive(name: string): boolean {
  return route.name === name
}
</script>

<template>
  <div class="dist-layout">
    <header class="dist-layout__header">
      <div class="dist-layout__header-row">
        <div>
          <nav class="crumbs" aria-label="Breadcrumb">
            <ol class="crumbs__list">
              <li class="crumbs__item">
                <RouterLink to="/distribucion/entregas-del-dia" class="crumbs__link">
                  {{ t('distribution.breadcrumbRoot') }}
                </RouterLink>
              </li>
              <li class="crumbs__sep" aria-hidden="true">/</li>
              <li class="crumbs__item crumbs__item--current" aria-current="page">
                {{ t('distribution.pageTitle') }}
              </li>
            </ol>
          </nav>
          <h1 class="dist-layout__title">{{ t('distribution.pageTitle') }}</h1>
        </div>

        <div class="dist-layout__session" :aria-label="t('shell.sessionNavLabel')">
          <Button
            icon="pi pi-bell"
            rounded
            text
            type="button"
            :badge="String(session.unreadNotifications)"
            badge-class="p-badge-danger"
            badge-severity="danger"
            :aria-label="t('shell.notificationsUnread', { count: session.unreadNotifications })"
          />
          <div class="dist-layout__profile">
            <Avatar :label="'AU'" shape="circle" class="dist-layout__profile-avatar" />
            <div class="dist-layout__profile-text">
              <span class="dist-layout__profile-name">{{ t('shell.sessionAdminName') }}</span>
              <span class="dist-layout__profile-role">{{ t('shell.sessionAdminRole') }}</span>
            </div>
          </div>
        </div>
      </div>

      <nav class="tabs" :aria-label="t('distribution.pageTitle')">
        <RouterLink
          v-for="tab in tabItems"
          :key="tab.to"
          :to="tab.to"
          class="tabs__link"
          :class="{ 'tabs__link--active': isTabActive(tab.name) }"
          role="tab"
          :aria-selected="isTabActive(tab.name)"
        >
          {{ t(tab.labelKey) }}
        </RouterLink>
      </nav>
    </header>

    <section class="dist-layout__body">
      <RouterView />
    </section>
  </div>
</template>

<style scoped>
.dist-layout {
  max-width: var(--regula-max-content-width);
  margin: 0 auto;
  padding: 1.5rem 0 2rem;
}

.dist-layout__header {
  margin-bottom: 2rem;
}

.dist-layout__header-row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.dist-layout__title {
  margin: 0.5rem 0 0;
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 700;
}

.crumbs__list {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  font-size: var(--regula-font-size-sm);
  color: var(--regula-app-text-muted);
}

.crumbs__link {
  color: inherit;
  text-decoration: none;
}

.crumbs__link:hover {
  text-decoration: underline;
}

.crumbs__sep {
  user-select: none;
}

.crumbs__item--current {
  color: var(--regula-app-text);
  font-weight: 600;
}

.dist-layout__session {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.dist-layout__profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.dist-layout__profile-avatar {
  background: var(--regula-color-bg-ice);
  color: var(--regula-color-primary);
  font-weight: 700;
}

.dist-layout__profile-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.dist-layout__profile-name {
  font-weight: 600;
  font-size: var(--regula-font-size-sm);
}

.dist-layout__profile-role {
  font-size: var(--regula-font-size-xs);
  color: var(--regula-app-text-muted);
}

.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-top: 1.5rem;
  border-bottom: 1px solid var(--regula-color-border-soft);
}

.tabs__link {
  padding: 1rem 0;
  margin-bottom: -1px;
  border-bottom: 3px solid transparent;
  color: var(--regula-app-text-muted);
  text-decoration: none;
  font-weight: 600;
  font-size: var(--regula-font-size-sm);
}

.tabs__link--active {
  color: var(--regula-color-primary);
  border-bottom-color: var(--regula-color-primary);
}

.tabs__link:focus-visible {
  outline: 2px solid var(--regula-color-primary);
  outline-offset: 2px;
}

.dist-layout__body {
  min-height: 12rem;
}

:deep(.dist-layout .p-tag) {
  padding: 0.2rem 0.55rem;
  font-size: 0.72rem;
  line-height: 1.1;
}

:deep(.dist-layout .p-badge) {
  padding: 0.2rem 0.55rem;
  font-size: 0.72rem;
  line-height: 1.1;
}

:deep(.dist-layout .p-button.p-button-text) {
  padding: 0.35rem 0.5rem;
}

@media (max-width: 39.999rem) {
  .dist-layout {
    padding: 1rem 0 1.5rem;
  }
}
</style>
