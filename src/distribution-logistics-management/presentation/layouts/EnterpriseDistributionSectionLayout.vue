<script setup lang="ts">
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const { t } = useI18n()
const route = useRoute()

const tabItems = computed(() => [
  { to: '/distribucion/repartos-del-dia', labelKey: 'distributionEnterprise.tabs.day', name: 'enterprise-distribution-day' },
  { to: '/distribucion/mapa-tiempo-real', labelKey: 'distributionEnterprise.tabs.liveMap', name: 'enterprise-distribution-live-map' },
  { to: '/distribucion/supervision-rutas', labelKey: 'distributionEnterprise.tabs.supervision', name: 'enterprise-distribution-supervision' },
  { to: '/distribucion/historial-repartos', labelKey: 'distributionEnterprise.tabs.history', name: 'enterprise-distribution-history' },
])

function isTabActive(name: string): boolean {
  return route.name === name
}
</script>

<template>
  <div class="ent-layout">
    <header class="ent-layout__header">
      <div class="ent-layout__top">
        <div>
          <nav class="crumbs" aria-label="Breadcrumb">
            <ol class="crumbs__list">
              <li class="crumbs__item">
                <RouterLink to="/distribucion/repartos-del-dia" class="crumbs__link">
                  REGULA
                </RouterLink>
              </li>
              <li class="crumbs__sep" aria-hidden="true">/</li>
              <li class="crumbs__item crumbs__item--current" aria-current="page">
                {{ t('distribution.pageTitle') }}
              </li>
            </ol>
          </nav>
          <h1 class="ent-layout__title">{{ t('distribution.pageTitle') }}</h1>
        </div>

        <div class="ent-layout__session">
          <Button icon="pi pi-bell" rounded text type="button" />
          <div class="ent-layout__profile">
            <Avatar :label="'AU'" shape="circle" class="ent-layout__avatar" />
            <div class="ent-layout__profile-text">
              <span class="ent-layout__profile-name">{{ t('shell.sessionAdminName') }}</span>
              <span class="ent-layout__profile-role">{{ t('shell.sessionAdminRole') }}</span>
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

    <section class="ent-layout__body">
      <RouterView />
    </section>
  </div>
</template>

<style scoped>
.ent-layout {
  max-width: var(--regula-max-content-width);
  margin: 0 auto;
  padding: 1.5rem 0 2rem;
}

.ent-layout__header {
  margin-bottom: 1.5rem;
}

.ent-layout__top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
}

.ent-layout__title {
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

.crumbs__sep {
  user-select: none;
}

.crumbs__item--current {
  color: var(--regula-app-text);
  font-weight: 600;
}

.ent-layout__session {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.ent-layout__profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.ent-layout__avatar {
  background: var(--regula-color-bg-ice);
  color: var(--regula-color-primary);
  font-weight: 700;
}

.ent-layout__profile-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.ent-layout__profile-name {
  font-weight: 600;
  font-size: var(--regula-font-size-sm);
}

.ent-layout__profile-role {
  font-size: var(--regula-font-size-xs);
  color: var(--regula-app-text-muted);
}

.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-top: 1.25rem;
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

.ent-layout__body {
  min-height: 12rem;
}
</style>

