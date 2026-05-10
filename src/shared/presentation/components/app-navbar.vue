<script setup>
import { useInventoryUiStore } from '@/inventory-management/application/inventory-ui.store.js'
import InputText from 'primevue/inputtext'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const route = useRoute()
const { t } = useI18n()
const inventoryUi = useInventoryUiStore()
const { sectionKey } = storeToRefs(inventoryUi)

const TAB_TO_I18N = {
  stock: 'stock',
  entrada: 'entry',
  salida: 'exit',
  historial: 'history',
  auditoria: 'audit',
}

const title = computed(() => route.meta?.pageTitle || 'Inventario')

const breadcrumbs = computed(() => {
  const base = route.meta?.breadcrumbs?.slice() || ['Regula', 'Inventario']
  if (route.name === 'inventory-enterprise' || route.name === 'inventory-distributor') {
    const tk = TAB_TO_I18N[sectionKey.value] || 'stock'
    return [...base, t(`inventory.tabs.${tk}`)]
  }
  return base
})

watch(
    () => route.name,
    (name) => {
      if (name !== 'inventory-enterprise' && name !== 'inventory-distributor') {
        inventoryUi.resetInventorySection()
      }
    },
)

const avatarUrl =
    'https://ui-avatars.com/api/?name=Usuario&background=e8ecf0&color=172d40&size=128'

const searchQuery = ref('')

function noop() {}
</script>

<template>
  <header class="regula-navbar surface-card">
    <div class="regula-navbar__top">
      <div class="regula-navbar__left">
        <h1 class="regula-navbar__title">{{ title }}</h1>
        <span class="regula-navbar__sep" aria-hidden="true" />
        <nav class="regula-navbar__crumbs" aria-label="Ubicación en la aplicación">
          <template v-for="(crumb, index) in breadcrumbs" :key="`${crumb}-${index}`">
            <span v-if="index > 0" class="regula-navbar__crumb-sep">›</span>
            <span
                class="regula-navbar__crumb"
                :class="{ 'regula-navbar__crumb--muted': index < breadcrumbs.length - 1 }"
            >
              {{ crumb }}
            </span>
          </template>
        </nav>
      </div>

      <div class="regula-navbar__actions">
        <div
            class="regula-navbar__search"
            v-tooltip.bottom="'Busca referencias, balones o movimientos en tu operación'"
        >
          <label class="regula-sr-only" for="regula-global-search">Buscar en Regula</label>
          <i class="pi pi-search regula-navbar__search-icon" aria-hidden="true" />
          <InputText
              id="regula-global-search"
              v-model="searchQuery"
              placeholder="Buscar..."
              class="regula-navbar__input"
              autocomplete="off"
              type="search"
          />
        </div>

        <div class="regula-navbar__quick-actions">
          <button
              type="button"
              class="regula-navbar__icon-btn"
              aria-label="Ver alertas y notificaciones operativas"
              v-tooltip.bottom="'Revisa alertas de inventario y seguridad (próximamente)'"
              @click="noop"
          >
            <i class="pi pi-bell" aria-hidden="true" />
            <span class="regula-navbar__badge" aria-hidden="true" />
          </button>

          <button
              type="button"
              class="regula-navbar__avatar-btn"
              aria-label="Abrir menú de tu cuenta"
              v-tooltip.bottom="'Tu cuenta y preferencias (activamos rutas en la siguiente versión)'"
              @click="noop"
          >
            <img class="regula-navbar__avatar" :src="avatarUrl" width="40" height="40" alt="" />
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.regula-navbar {
  border-bottom: 1px solid var(--regula-gray-light);
  padding: 1rem 1.25rem;
}

.regula-navbar__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  max-width: var(--regula-container-max);
  margin-inline: auto;
  width: 100%;
}

.regula-navbar__left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
  flex: 1 1 220px;
}

.regula-navbar__title {
  margin: 0;
  font-size: var(--regula-type-h1-size);
  font-weight: var(--regula-type-h1-weight);
  color: var(--regula-navy);
  line-height: 1.2;
  white-space: nowrap;
}

.regula-navbar__sep {
  width: 1px;
  height: 1.5rem;
  background: var(--regula-gray-light);
  flex-shrink: 0;
}

.regula-navbar__crumbs {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: var(--regula-type-small-size);
  color: var(--regula-text-muted);
  flex-wrap: wrap;
  line-height: 1.5;
}

.regula-navbar__crumb--muted {
  color: var(--regula-steel);
}

.regula-navbar__crumb-sep {
  color: var(--regula-steel);
  font-size: 0.85rem;
  padding: 0 0.15rem;
}

.regula-navbar__actions {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex: 0 1 auto;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.regula-navbar__quick-actions {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  flex-shrink: 0;
}

.regula-navbar__search {
  position: relative;
  display: inline-flex;
  align-items: center;
  flex: 1 1 200px;
  max-width: 320px;
  min-width: min(100%, 200px);
}

.regula-navbar__search-icon {
  position: absolute;
  left: 0.75rem;
  color: var(--regula-steel);
  pointer-events: none;
  z-index: 1;
}

.regula-navbar__search :deep(.p-inputtext) {
  width: 100%;
  min-height: 44px;
  border-radius: var(--regula-radius-btn);
  padding-left: 2.35rem;
  font-size: var(--regula-type-body-size);
  background: var(--regula-white);
  border: 1px solid var(--regula-steel);
  color: var(--regula-text-primary);
}

.regula-navbar__search :deep(.p-inputtext:enabled:focus) {
  border-color: var(--regula-orange);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--regula-orange) 22%, transparent);
}

.regula-navbar__icon-btn {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: var(--regula-radius-btn);
  border: 1px solid var(--regula-gray-light);
  background: var(--regula-white);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--regula-gray-mid);
  flex-shrink: 0;
}

.regula-navbar__icon-btn:hover {
  border-color: var(--regula-steel);
}

.regula-navbar__badge {
  position: absolute;
  top: 10px;
  right: 11px;
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--regula-orange-alert);
}

.regula-navbar__avatar-btn {
  padding: 0;
  border: 2px solid var(--regula-gray-light);
  border-radius: 999px;
  background: var(--regula-white);
  cursor: pointer;
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.regula-navbar__avatar-btn:hover {
  border-color: var(--regula-steel);
}

.regula-navbar__avatar {
  border-radius: 999px;
  object-fit: cover;
  width: 36px;
  height: 36px;
}

@media (max-width: 639px) {
  .regula-navbar {
    padding: 0.85rem 1rem;
  }

  .regula-navbar__top {
    flex-direction: column;
    align-items: stretch;
  }

  .regula-navbar__left {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.35rem;
  }

  .regula-navbar__sep {
    display: none;
  }

  .regula-navbar__actions {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }

  .regula-navbar__search {
    max-width: none;
    width: 100%;
  }

  .regula-navbar__quick-actions {
    justify-content: flex-end;
    width: 100%;
  }
}
</style>
