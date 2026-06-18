<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="inv-placeholder surface-card border-round-lg p-4">
    <div class="inv-placeholder__title">{{ title }}</div>
    <p class="inv-placeholder__text text-color-secondary m-0">
      Esta sección estará disponible próximamente.
    </p>
  </div>
</template>

<style scoped>
.inv-placeholder__title {
  font-weight: 700;
  margin-bottom: 0.35rem;
}
</style>
