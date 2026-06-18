<script setup>
defineProps({
  options: { type: Array, required: true },
  modelValue: { type: String, default: null },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="inv-picker" role="group">
    <button
        v-for="opt in options"
        :key="opt.key"
        type="button"
        class="inv-picker__btn"
        :class="{ 'inv-picker__btn--on': modelValue === opt.key }"
        @click="$emit('update:modelValue', opt.key)"
    >
      {{ opt.title }}
    </button>
  </div>
</template>
