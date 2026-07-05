<script setup>
import AppNavbar from '@/shared/presentation/components/app-navbar.vue'
import AppSidebar from '@/shared/presentation/components/app-sidebar.vue'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const { t } = useI18n()

const navigationItems = computed(() => [
  { label: t('shared.nav.dashboard'), icon: 'pi pi-th-large', to: '/dashboard', matchPrefix: '/dashboard' },
  { label: t('shared.nav.inventory'), icon: 'pi pi-box', to: '/inventory', matchPrefix: '/inventory' },
  { label: t('shared.nav.distribution'), icon: 'pi pi-truck', to: '/distribution/deliveries', matchPrefix: '/distribution' },
  { label: t('shared.nav.sales'), icon: 'pi pi-shopping-cart', to: '/commercial/sales', matchPrefix: '/commercial/sales' },
])

const brandLabel = 'REGULA'

const navOpen = ref(false)

function closeMobileNav() {
  navOpen.value = false
}

function toggleMobileNav() {
  navOpen.value = !navOpen.value
}

function onBackdropClick() {
  closeMobileNav()
}

function onSidebarInteract() {
  if (typeof window !== 'undefined' && window.matchMedia('(max-width: 639px)').matches) {
    closeMobileNav()
  }
}

watch(
    () => route.fullPath,
    () => {
      closeMobileNav()
    },
)
</script>

<template>
  <div class="regula-shell">
    <header class="regula-mobile-header" :aria-label="t('shared.shell.mobileBar')">
      <button
          type="button"
          class="regula-mobile-header__toggle"
          :aria-expanded="navOpen"
          aria-controls="regula-app-navigation"
          v-tooltip.bottom="t('shared.shell.openMenuTooltip')"
          @click="toggleMobileNav"
      >
        <i class="pi pi-bars" aria-hidden="true" />
        <span class="regula-sr-only">{{ t('shared.shell.toggleMenu') }}</span>
      </button>
      <span class="regula-mobile-header__brand">{{ brandLabel }}</span>
    </header>

    <div
        v-show="navOpen"
        class="regula-shell__backdrop"
        aria-hidden="true"
        @click="onBackdropClick"
    />

    <AppSidebar
        :brand-label="brandLabel"
        :items="navigationItems"
        :mobile-open="navOpen"
        @interact="onSidebarInteract"
    />

    <div class="regula-shell__main-column">
      <AppNavbar />
      <main class="regula-shell__content surface-ground">
        <div class="regula-shell__container">
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.regula-shell {
  min-height: 100vh;
  display: flex;
  background: var(--regula-page-bg);
}

.regula-mobile-header {
  display: none;
  align-items: center;
  gap: 0.75rem;
  padding: 0 0.75rem;
  height: 52px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 400;
  background: var(--regula-navy);
  color: var(--regula-white);
  border-bottom: 1px solid color-mix(in srgb, var(--regula-white) 10%, transparent);
}

.regula-mobile-header__toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: none;
  border-radius: var(--regula-radius-btn);
  background: transparent;
  color: var(--regula-white);
  cursor: pointer;
  transition: background 0.15s ease;
}

.regula-mobile-header__toggle:hover {
  background: color-mix(in srgb, var(--regula-white) 10%, transparent);
}

.regula-mobile-header__brand {
  font-weight: 800;
  letter-spacing: 0.07em;
  font-size: 1.05rem;
}

.regula-shell__backdrop {
  display: none;
}

.regula-shell__main-column {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.regula-shell__content {
  flex: 1;
  padding: clamp(1rem, 3vw, 1.5rem) clamp(1rem, 3vw, 1.75rem) 2rem;
}

.regula-shell__container {
  width: 100%;
  max-width: var(--regula-container-max);
  margin-inline: auto;
}

@media (max-width: 639px) {
  .regula-mobile-header {
    display: flex;
  }

  .regula-shell__backdrop {
    display: block;
    position: fixed;
    top: 52px;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 340;
    background: rgba(23, 45, 64, 0.42);
    backdrop-filter: blur(1px);
  }

  .regula-shell__main-column {
    padding-top: 52px;
    width: 100%;
  }
}

@media (min-width: 640px) {
  .regula-shell__backdrop {
    display: none !important;
  }
}
</style>
