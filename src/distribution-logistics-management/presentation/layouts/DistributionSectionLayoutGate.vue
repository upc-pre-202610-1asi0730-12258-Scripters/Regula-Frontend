<script setup lang="ts">
import { computed } from 'vue'

import DistributionSectionLayout from '@/distribution-logistics-management/presentation/layouts/DistributionSectionLayout.vue'
import EnterpriseDistributionSectionLayout from '@/distribution-logistics-management/presentation/layouts/EnterpriseDistributionSectionLayout.vue'

function getRole(): 'enterprise' | 'distributor' {
  try {
    return (sessionStorage.getItem('regula_role') || 'enterprise') as 'enterprise' | 'distributor'
  } catch {
    return 'enterprise'
  }
}

const Layout = computed(() =>
  getRole() === 'enterprise' ? EnterpriseDistributionSectionLayout : DistributionSectionLayout,
)
</script>

<template>
  <component :is="Layout" />
</template>

