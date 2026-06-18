<template>
  <div class="company-operational-security">

    <div class="mb-4">
      <h1 class="text-3xl font-bold">
        {{ $t('security.title') }}
      </h1>

      <p class="text-color-secondary">
        {{ $t('security.subtitle') }}
      </p>
    </div>

    <TabMenu :model="items">
      <template #item="{ item, props }">
        <router-link
            :to="item.to"
            custom
            v-slot="{ navigate, href }"
        >
          <a
              :href="href"
              v-bind="props.action"
              @click="navigate"
              class="flex align-items-center gap-2"
          >
            <i :class="item.icon"></i>
            <span>{{ item.label }}</span>
          </a>
        </router-link>
      </template>
    </TabMenu>

    <div class="mt-4">
      <router-view />
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import TabMenu from 'primevue/tabmenu';

const { t } = useI18n();

const items = computed(() => [
  {
    label: t('security.menu.active_alerts'),
    icon: 'pi pi-bell',
    to: '/seguridad/empresa/active-alerts'

  },
  {
    label: t('security.menu.company_alerts'),
    icon: 'pi pi-history',
    to: '/seguridad/empresa/company-alert-history'

  },
  {
    label: t('security.menu.warehouses'),
    icon: 'pi pi-building',
    to: '/seguridad/empresa/warehouse-status'

  },
  {
    label: t('security.menu.zone_analysis'),
    icon: 'pi pi-chart-bar',
    to: '/seguridad/empresa/zone-analysis'


  }
]);
</script>