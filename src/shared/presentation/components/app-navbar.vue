<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useIamStore } from '@/iam/application/iam.store.js'

const route = useRoute()
const router = useRouter()
const iamStore = useIamStore()
const { t } = useI18n()

const title = computed(() => {
  const key = route.meta?.pageTitleKey
  return key ? t(key) : ''
})

const avatarUrl = computed(() => {
  const name = iamStore.currentUsername || t('shared.nav.distributorFallback')
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=e8ecf0&color=172d40&size=128`
})

const displayName = computed(() => iamStore.currentUsername || t('shared.nav.distributorFallback'))

function signOut() {
  iamStore.signOut(router)
}
</script>

<template>
  <header class="regula-navbar surface-card">
    <div class="regula-navbar__top">
      <div class="regula-navbar__left">
        <h1 class="regula-navbar__title">{{ title }}</h1>
      </div>

      <div class="regula-navbar__actions">
        <div class="regula-navbar__quick-actions">
          <button
              type="button"
              class="regula-navbar__profile-btn"
              :aria-label="t('shared.sidebar.signOut')"
              v-tooltip.bottom="t('shared.sidebar.signOut')"
              @click="signOut"
          >
            <span class="regula-navbar__name">{{ displayName }}</span>
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

.regula-navbar__profile-btn {
  padding: 0.35rem 0.6rem 0.35rem 0.9rem;
  border: 1px solid var(--regula-gray-light);
  border-radius: 999px;
  background: var(--regula-white);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  flex-shrink: 0;
}

.regula-navbar__profile-btn:hover {
  border-color: var(--regula-steel);
}

.regula-navbar__name {
  font-size: var(--regula-type-small-size);
  font-weight: 600;
  color: var(--regula-navy);
  white-space: nowrap;
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

  .regula-navbar__actions {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }

  .regula-navbar__name {
    display: none;
  }

  .regula-navbar__profile-btn {
    align-self: flex-end;
    padding: 0.25rem;
  }

  .regula-navbar__quick-actions {
    justify-content: flex-end;
    width: 100%;
  }
}
</style>
