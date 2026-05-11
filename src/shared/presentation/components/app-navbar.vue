<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const { t, locale } = useI18n()

const pageTitle = computed(() => route.meta?.pageTitle || route.meta?.title || 'Dashboard')
const breadcrumbs = computed(() => route.meta?.breadcrumbs || [])

const toggleLanguage = () => {
  locale.value = locale.value === 'es' ? 'en' : 'es'
}
</script>

<template>
  <header class="regula-navbar">
    <div class="regula-navbar__breadcrumbs hidden md:flex" aria-label="Breadcrumb">
      <template v-for="(item, index) in breadcrumbs" :key="index">
        <span class="regula-navbar__breadcrumb-item">{{ item }}</span>
        <i
            v-if="index < breadcrumbs.length - 1"
            class="pi pi-chevron-right regula-navbar__breadcrumb-separator"
            aria-hidden="true"
        />
      </template>
    </div>

    <h1 class="regula-navbar__title md:hidden">{{ pageTitle }}</h1>

    <div class="regula-navbar__actions">
      <!-- Botón para cambiar idioma -->
      <button 
        type="button" 
        class="regula-action-btn language-btn" 
        @click="toggleLanguage"
        v-tooltip.bottom="'Cambiar idioma / Change language'"
      >
        <span class="font-bold uppercase">{{ locale }}</span>
      </button>

      <button type="button" class="regula-action-btn" aria-label="Buscar" v-tooltip.bottom="'Buscar'">
        <i class="pi pi-search" aria-hidden="true" />
      </button>
      <button
          type="button"
          class="regula-action-btn"
          aria-label="Notificaciones"
          v-tooltip.bottom="'Notificaciones'"
      >
        <i class="pi pi-bell" aria-hidden="true" />
        <span class="regula-action-badge" aria-hidden="true" />
      </button>
    </div>
  </header>
</template>

<style scoped>
.regula-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 clamp(1rem, 3vw, 1.75rem);
  background: #ffffff;
  border-bottom: 1px solid var(--regula-border);
  position: sticky;
  top: 0;
  z-index: 300;
}

.regula-navbar__breadcrumbs {
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.regula-navbar__breadcrumb-item {
  color: var(--regula-text-muted);
  font-weight: 500;
}
.regula-navbar__breadcrumb-item:last-child {
  color: var(--regula-text);
}

.regula-navbar__breadcrumb-separator {
  font-size: 0.75rem;
  color: var(--regula-text-muted);
}

.regula-navbar__title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--regula-text);
  margin: 0;
}

.regula-navbar__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.regula-action-btn {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: var(--regula-radius-btn);
  border: none;
  background: transparent;
  color: var(--regula-text-muted);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.regula-action-btn:hover {
  background: var(--regula-surface);
  color: var(--regula-primary);
}

.language-btn {
  border: 1px solid var(--regula-border);
  background: var(--regula-surface);
  color: var(--regula-primary);
  font-size: 0.85rem;
}

.regula-action-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--regula-danger);
  border: 2px solid #ffffff;
}

@media (max-width: 639px) {
  .regula-navbar {
    top: 52px;
  }
}
</style>
