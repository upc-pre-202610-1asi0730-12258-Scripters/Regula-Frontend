<template>
  <div class="distributor-operational-security">

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
    to: '/seguridad/distribuidor/active-alerts'
  },
  {
    label: t('security.menu.alert_history'),
    icon: 'pi pi-history',
    to: '/seguridad/distribuidor/alert-history'

  },
  {
    label: t('security.menu.sensors'),
    icon: 'pi pi-wifi',
    to: '/seguridad/distribuidor/sensor-status'

  },
  {
    label: t('security.menu.route_deviations'),
    icon: 'pi pi-map'
    ,
    to: '/seguridad/distribuidor/route-deviations'

  }
]);
</script>