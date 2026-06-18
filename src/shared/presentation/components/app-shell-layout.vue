<script setup>
import AppNavbar from '@/shared/presentation/components/app-navbar.vue'
import AppSidebar from '@/shared/presentation/components/app-sidebar.vue'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const enterpriseNav = [
  { label: 'Dashboard', icon: 'pi pi-th-large', to: '/dashboard/empresa', matchPrefix: '/dashboard/empresa' },
  { label: 'Alertas y Seguridad', icon: 'pi pi-shield', to: '/seguridad/empresa/active-alerts', matchPrefix: '/seguridad/empresa' },
  { label: 'Inventario', icon: 'pi pi-box', to: '/inventario/empresa', matchPrefix: '/inventario/empresa' },
  { label: 'Distribución', icon: 'pi pi-truck', to: '/empresa/distribucion/repartos-del-dia', matchPrefix: '/empresa/distribucion' },
  { label: 'Reportes', icon: 'pi pi-chart-bar', to: '/reportes/generar', matchPrefix: '/reportes' },
]

const distributorNav = [
  { label: 'Dashboard', icon: 'pi pi-th-large', to: '/dashboard/distribuidor', matchPrefix: '/dashboard/distribuidor' },
  { label: 'Alertas y Seguridad', icon: 'pi pi-shield', to: '/seguridad/distribuidor/active-alerts', matchPrefix: '/seguridad/distribuidor' },
  { label: 'Inventario', icon: 'pi pi-box', to: '/inventario/distribuidor', matchPrefix: '/inventario/distribuidor' },
  { label: 'Distribución / Entregas', icon: 'pi pi-truck', to: '/distribucion/entregas-del-dia', matchPrefix: '/distribucion' },
  { label: 'Ventas', icon: 'pi pi-shopping-cart', to: '/comercial/ventas', matchPrefix: '/comercial/ventas' },
  { label: 'Deudas y Cobranzas', icon: 'pi pi-wallet', to: '/comercial/deudas', matchPrefix: '/comercial/deudas' },
  { label: 'Reportes y Análisis', icon: 'pi pi-chart-line', to: '/distribuidor/reportes/generar', matchPrefix: '/distribuidor/reportes' },
]

const preset = computed(() => {
  if (route.meta?.shellPreset) {
    return route.meta.shellPreset
  }

  if (
      route.name === 'distributor-dashboard' ||
      route.name === 'inventory-distributor' ||
      route.name === 'commercial-sales-distributor' ||
      route.name === 'commercial-debts-distributor'
  ) {
    return 'distributor'
  }

  return 'enterprise'
})

const navigationItems = computed(() =>
    preset.value === 'distributor' ? distributorNav : enterpriseNav,
)

const profile = computed(() =>
    preset.value === 'distributor'
        ? {
          name: 'Carlos Mendoza',
          subtitle: 'Distribuidor',
          avatarUrl:
              'https://ui-avatars.com/api/?name=Carlos+Mendoza&background=e2e8f0&color=0f172a&size=128',
        }
        : {
          name: 'Admin User',
          subtitle: 'admin@regula.com',
          avatarUrl:
              'https://ui-avatars.com/api/?name=Admin+User&background=e2e8f0&color=0f172a&size=128',
        },
)

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
    <header class="regula-mobile-header" aria-label="Barra móvil">
      <button
          type="button"
          class="regula-mobile-header__toggle"
          :aria-expanded="navOpen"
          aria-controls="regula-app-navigation"
          v-tooltip.bottom="'Abre el menú principal: Dashboard, inventario y más'"
          @click="toggleMobileNav"
      >
        <i class="pi pi-bars" aria-hidden="true" />
        <span class="regula-sr-only">Abrir o cerrar menú principal</span>
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
        :profile="profile"
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
