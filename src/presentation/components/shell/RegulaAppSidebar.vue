<script setup lang="ts">
import Avatar from 'primevue/avatar'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

import { useAppLocaleStore } from '@/presentation/stores/use-app-locale-store'

const emit = defineEmits<{
  navigate: []
}>()

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const localeStore = useAppLocaleStore()

const navItems = computed(() => [
  { to: '/dashboard', labelKey: 'nav.dashboard', icon: 'pi pi-th-large', name: 'Dashboard' as const },
  { to: '/alerts-security', labelKey: 'nav.alertsSecurity', icon: 'pi pi-shield', name: 'AlertsSecurity' as const },
  { to: '/inventory', labelKey: 'nav.inventory', icon: 'pi pi-box', name: 'Inventory' as const },
  {
    to: '/distribution/day-deliveries',
    labelKey: 'nav.distribution',
    icon: 'pi pi-truck',
    name: 'Distribution' as const,
  },
  { to: '/sales', labelKey: 'nav.sales', icon: 'pi pi-shopping-cart', name: 'Sales' as const },
  {
    to: '/credit-collections',
    labelKey: 'nav.creditCollections',
    icon: 'pi pi-wallet',
    name: 'CreditCollections' as const,
  },
  {
    to: '/reports-analysis',
    labelKey: 'nav.reportsAnalysis',
    icon: 'pi pi-chart-line',
    name: 'ReportsAnalysis' as const,
  },
])

function isActive(item: (typeof navItems.value)[number]): boolean {
  if (item.name === 'Distribution') {
    return route.path.startsWith('/distribution')
  }
  return route.path === item.to || route.path.startsWith(`${item.to}/`)
}

function onNavigate() {
  emit('navigate')
}

async function onLogout() {
  onNavigate()
  await router.push({ name: 'Dashboard' })
}

const userInitials = 'CM'
</script>

<template>
  <div class="sidebar">
    <div class="sidebar__brand" aria-hidden="true">{{ t('shell.brand') }}</div>

    <nav class="sidebar__nav" :aria-label="t('shell.mainNavLabel')">
      <ul class="sidebar__list">
        <li v-for="item in navItems" :key="item.to">
          <RouterLink
            :to="item.to"
            class="sidebar__link"
            :class="{ 'sidebar__link--active': isActive(item) }"
            :aria-current="isActive(item) ? 'page' : undefined"
            @click="onNavigate"
          >
            <i :class="['sidebar__icon', 'pi', item.icon]" aria-hidden="true" />
            <span>{{ t(item.labelKey) }}</span>
          </RouterLink>
        </li>
      </ul>
    </nav>

    <div class="sidebar__divider" role="separator" />

    <div class="sidebar__footer">
      <div class="sidebar__lang">
        <span id="lang-label" class="sidebar__muted">{{ t('shell.languageLabel') }}</span>
        <div
          class="sidebar__lang-toggle"
          role="radiogroup"
          :aria-labelledby="'lang-label'"
        >
          <button
            type="button"
            class="sidebar__lang-btn"
            :class="{ 'sidebar__lang-btn--active': localeStore.current === 'es-419' }"
            role="radio"
            :aria-checked="localeStore.current === 'es-419'"
            @click="localeStore.setLocale('es-419')"
          >
            {{ t('shell.localeSpanish') }}
          </button>
          <button
            type="button"
            class="sidebar__lang-btn"
            :class="{ 'sidebar__lang-btn--active': localeStore.current === 'en-US' }"
            role="radio"
            :aria-checked="localeStore.current === 'en-US'"
            @click="localeStore.setLocale('en-US')"
          >
            {{ t('shell.localeEnglish') }}
          </button>
        </div>
      </div>

      <button type="button" class="sidebar__logout" @click="onLogout">
        <i class="pi pi-sign-out sidebar__icon" aria-hidden="true" />
        {{ t('shell.logout') }}
      </button>

      <div class="sidebar__user" :aria-label="t('shell.userCardLabel')">
        <Avatar :label="userInitials" shape="circle" class="sidebar__avatar" />
        <div class="sidebar__user-text">
          <div class="sidebar__user-name">{{ t('shell.mockUserName') }}</div>
          <div class="sidebar__muted">{{ t('shell.mockUserRole') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: var(--regula-space-6) var(--regula-space-4);
  background: var(--regula-shell-bg);
  color: var(--regula-shell-text);
}

.sidebar__brand {
  font-size: var(--regula-font-size-lg);
  font-weight: 700;
  letter-spacing: 0.08em;
  margin-bottom: var(--regula-space-8);
}

.sidebar__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--regula-space-1);
}

.sidebar__link {
  display: flex;
  align-items: center;
  gap: var(--regula-space-3);
  padding: var(--regula-space-3) var(--regula-space-3);
  border-radius: var(--regula-radius-md);
  color: var(--regula-shell-text);
  text-decoration: none;
  font-size: var(--regula-font-size-sm);
  border: 1px solid transparent;
  border-left-width: 3px;
  border-left-color: transparent;
}

.sidebar__link:focus-visible {
  outline: 2px solid var(--regula-color-primary);
  outline-offset: 2px;
}

.sidebar__link--active {
  background: var(--regula-shell-active-bg);
  border-color: rgba(249, 115, 22, 0.35);
  border-left-color: var(--regula-shell-active-border);
}

.sidebar__icon {
  font-size: 1.05rem;
  opacity: 0.9;
}

.sidebar__divider {
  height: 1px;
  background: var(--regula-shell-border);
  margin: var(--regula-space-6) 0;
}

.sidebar__footer {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: var(--regula-space-5);
}

.sidebar__muted {
  color: var(--regula-shell-text-muted);
  font-size: var(--regula-font-size-xs);
}

.sidebar__lang {
  display: flex;
  flex-direction: column;
  gap: var(--regula-space-2);
}

.sidebar__lang-toggle {
  display: flex;
  gap: var(--regula-space-2);
}

.sidebar__lang-btn {
  flex: 1;
  cursor: pointer;
  border-radius: var(--regula-radius-md);
  padding: var(--regula-space-2) var(--regula-space-3);
  font-size: var(--regula-font-size-xs);
  font-weight: 600;
  color: var(--regula-shell-text);
  background: transparent;
  border: 1px solid var(--regula-shell-border);
}

.sidebar__lang-btn--active {
  background: var(--regula-shell-active-bg);
  border-color: var(--regula-shell-active-border);
}

.sidebar__lang-btn:focus-visible {
  outline: 2px solid var(--regula-color-primary);
  outline-offset: 2px;
}

.sidebar__logout {
  display: flex;
  align-items: center;
  gap: var(--regula-space-3);
  padding: var(--regula-space-2) 0;
  background: none;
  border: none;
  color: var(--regula-shell-text);
  cursor: pointer;
  font-size: var(--regula-font-size-sm);
  text-align: left;
}

.sidebar__logout:focus-visible {
  outline: 2px solid var(--regula-color-primary);
  outline-offset: 2px;
}

.sidebar__user {
  display: flex;
  align-items: center;
  gap: var(--regula-space-3);
}

.sidebar__avatar {
  background: rgba(255, 255, 255, 0.18);
  color: #ffffff;
  font-weight: 700;
}

.sidebar__user-name {
  font-weight: 600;
  font-size: var(--regula-font-size-sm);
}

.sidebar__user-text {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}
</style>
