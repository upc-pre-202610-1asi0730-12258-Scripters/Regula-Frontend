<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

defineProps({
  brandLabel: {
    type: String,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
  profile: {
    type: Object,
    required: true,
  },
  mobileOpen: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['interact'])

const route = useRoute()
const router = useRouter()
const { locale, t } = useI18n()

function setLocale(code) {
  locale.value = code
}

function isActive(item) {
  if (item.to === '#') {
    return false
  }
  if (item.matchPrefix) {
    return route.path.startsWith(item.matchPrefix)
  }
  return route.path === item.to
}

function logout() {
  emit('interact')
  sessionStorage.removeItem('regula_role')
  router.push({ name: 'role-select' })
}

function onNavInteract() {
  emit('interact')
}
</script>

<template>
  <aside
      id="regula-app-navigation"
      class="regula-sidebar"
      :class="{ 'regula-sidebar--open': mobileOpen }"
      aria-label="Navegación principal"
  >
    <div class="regula-sidebar__brand">
      {{ brandLabel }}
    </div>

    <nav class="regula-sidebar__nav" aria-label="Secciones">
      <template v-for="item in items" :key="item.label">
        <button
            v-if="item.to === '#'"
            type="button"
            class="regula-sidebar__link regula-sidebar__link--ghost"
            :class="{ 'regula-sidebar__link--active': isActive(item) }"
            @click="onNavInteract"
        >
          <i :class="item.icon" aria-hidden="true" />
          <span>{{ item.label }}</span>
        </button>
        <RouterLink
            v-else
            :to="item.to"
            class="regula-sidebar__link"
            :class="{ 'regula-sidebar__link--active': isActive(item) }"
            @click="onNavInteract"
        >
          <i :class="item.icon" aria-hidden="true" />
          <span>{{ item.label }}</span>
        </RouterLink>
      </template>
    </nav>

    <div class="regula-sidebar__footer">
      <div class="regula-sidebar__lang" role="group" :aria-label="t('inventory.sidebar.language')">
        <span class="regula-sidebar__lang-label">{{ t('inventory.sidebar.language') }}</span>
        <div class="regula-sidebar__lang-row">
          <button
              type="button"
              class="regula-sidebar__lang-btn"
              :class="{ 'regula-sidebar__lang-btn--active': locale === 'es' }"
              @click="setLocale('es')"
          >
            {{ t('inventory.sidebar.spanish') }}
          </button>
          <button
              type="button"
              class="regula-sidebar__lang-btn"
              :class="{ 'regula-sidebar__lang-btn--active': locale === 'en' }"
              @click="setLocale('en')"
          >
            {{ t('inventory.sidebar.english') }}
          </button>
        </div>
      </div>

      <button
          type="button"
          class="regula-sidebar__logout"
          aria-label="Cerrar sesión y volver a elegir perfil"
          v-tooltip.bottom="'Cierra tu sesión y vuelve a elegir Empresa o Distribuidor'"
          @click="logout"
      >
        <i class="pi pi-sign-out" aria-hidden="true" />
        <span>Cerrar sesión</span>
      </button>
      <div class="regula-sidebar__user">
        <img
            class="regula-sidebar__avatar"
            :src="profile.avatarUrl"
            width="40"
            height="40"
            alt=""
        />
        <div class="regula-sidebar__user-text">
          <div class="regula-sidebar__user-name">{{ profile.name }}</div>
          <div class="regula-sidebar__user-sub">{{ profile.subtitle }}</div>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.regula-sidebar {
  width: var(--regula-sidebar-width);
  flex-shrink: 0;
  background: linear-gradient(180deg, var(--regula-navy) 0%, #101922 100%);
  color: var(--regula-white);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  border-right: 1px solid color-mix(in srgb, var(--regula-steel) 25%, transparent);
}

.regula-sidebar__brand {
  padding: 1.5rem 1.25rem 1rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  font-size: 1.05rem;
  line-height: 1.2;
}

.regula-sidebar__nav {
  flex: 1;
  padding: 0.5rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.regula-sidebar__link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 0.85rem;
  border-radius: var(--regula-radius-btn);
  color: var(--regula-snow);
  text-decoration: none;
  font-size: var(--regula-type-small-size);
  font-weight: 500;
  transition:
      background 0.15s ease,
      color 0.15s ease;
  border: none;
  width: 100%;
  text-align: left;
  background: transparent;
  cursor: pointer;
  font-family: inherit;
  min-height: 44px;
}

.regula-sidebar__link--ghost {
  opacity: 0.95;
}

.regula-sidebar__link i {
  opacity: 0.88;
  font-size: 1rem;
}

.regula-sidebar__link:hover {
  background: color-mix(in srgb, var(--regula-white) 6%, transparent);
}

.regula-sidebar__link--active {
  background: color-mix(in srgb, var(--regula-orange) 22%, transparent);
  color: var(--regula-white);
  box-shadow: inset 3px 0 0 var(--regula-orange);
}

.regula-sidebar__footer {
  padding: 1rem 1rem 1.25rem;
  border-top: 1px solid color-mix(in srgb, var(--regula-steel) 18%, transparent);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.regula-sidebar__lang {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  padding-bottom: 0.25rem;
}

.regula-sidebar__lang-label {
  font-size: var(--regula-type-caption-size);
  color: color-mix(in srgb, var(--regula-white) 65%, transparent);
  font-weight: 600;
}

.regula-sidebar__lang-row {
  display: flex;
  gap: 0.5rem;
}

.regula-sidebar__lang-btn {
  flex: 1;
  min-height: 40px;
  border-radius: var(--regula-radius-btn);
  border: 1px solid color-mix(in srgb, var(--regula-white) 22%, transparent);
  background: transparent;
  color: var(--regula-white);
  font-family: inherit;
  font-size: var(--regula-type-caption-size);
  font-weight: 700;
  cursor: pointer;
}

.regula-sidebar__lang-btn--active {
  background: color-mix(in srgb, var(--regula-orange) 35%, transparent);
  border-color: var(--regula-orange);
}

.regula-sidebar__logout {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 0.5rem;
  border: none;
  border-radius: var(--regula-radius-btn);
  background: transparent;
  color: color-mix(in srgb, var(--regula-white) 82%, transparent);
  cursor: pointer;
  font-size: var(--regula-type-small-size);
  min-height: 44px;
  font-family: inherit;
}

.regula-sidebar__logout:hover {
  background: color-mix(in srgb, var(--regula-white) 7%, transparent);
  color: var(--regula-white);
}

.regula-sidebar__user {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.regula-sidebar__avatar {
  border-radius: 999px;
  object-fit: cover;
  border: 2px solid color-mix(in srgb, var(--regula-white) 18%, transparent);
}

.regula-sidebar__user-name {
  font-size: var(--regula-type-small-size);
  font-weight: 600;
  color: var(--regula-white);
}

.regula-sidebar__user-sub {
  font-size: var(--regula-type-caption-size);
  color: color-mix(in srgb, var(--regula-white) 68%, transparent);
}

@media (max-width: 639px) {
  .regula-sidebar {
    position: fixed;
    top: 52px;
    left: 0;
    width: var(--regula-sidebar-width);
    height: calc(100vh - 52px);
    z-index: 350;
    transform: translateX(-100%);
    transition: transform 0.22s ease;
    box-shadow: 6px 0 24px rgba(23, 45, 64, 0.15);
  }

  .regula-sidebar--open {
    transform: translateX(0);
  }

  .regula-sidebar__brand {
    display: none;
  }
}

@media (min-width: 640px) {
  .regula-sidebar {
    position: relative;
    transform: none !important;
    height: auto;
    top: auto;
    box-shadow: none;
  }
}
</style>
