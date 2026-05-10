<script setup>
defineProps({
  options: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: String,
    default: null,
  },
  variant: {
    /** enterprise-entry | enterprise-exit | dist-cards */
    type: String,
    default: 'enterprise-entry',
  },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div
      class="ctp"
      :class="{
      'ctp--enterprise': variant === 'enterprise-entry' || variant === 'enterprise-exit',
      'ctp--dist': variant === 'dist-cards',
    }"
      role="group"
  >
    <button
        v-for="opt in options"
        :key="opt.key"
        type="button"
        class="ctp__card"
        :class="{
        'ctp__card--selected': modelValue === opt.key,
        'ctp__card--warn': opt.warn && variant === 'enterprise-exit',
        'ctp__card--dist': variant === 'dist-cards',
      }"
        @click="$emit('update:modelValue', opt.key)"
    >
      <span v-if="variant === 'dist-cards' && modelValue === opt.key" class="ctp__check">
        <i class="pi pi-check" aria-hidden="true" />
      </span>

      <template v-if="variant === 'dist-cards'">
        <i :class="opt.icon || 'pi pi-database'" class="ctp__ico" aria-hidden="true" />
        <span class="ctp__title">{{ opt.title }}</span>
        <span v-if="opt.subtitle" class="ctp__sub">{{ opt.subtitle }}</span>
      </template>

      <template v-else-if="variant === 'enterprise-exit'">
        <span class="ctp__kg">{{ opt.title }}</span>
        <span class="ctp__radio" aria-hidden="true">
          <span class="ctp__radio-dot" />
        </span>
      </template>

      <template v-else>
        <span class="ctp__kg">{{ opt.title }}</span>
      </template>
    </button>
  </div>
</template>

<style scoped>
.ctp {
  display: grid;
  gap: 0.75rem;
  width: 100%;
}

.ctp--enterprise {
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
}

.ctp--dist {
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
}

.ctp__card {
  position: relative;
  border-radius: var(--regula-radius-card);
  border: 2px solid var(--regula-gray-light);
  background: var(--regula-white);
  padding: 0.85rem 0.65rem;
  cursor: pointer;
  font-family: inherit;
  min-height: 44px;
  transition:
      border-color 0.15s ease,
      box-shadow 0.15s ease,
      background 0.15s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  color: var(--regula-text-primary);
}

.ctp__card:hover {
  border-color: var(--regula-steel);
}

.ctp__card--selected {
  border-color: var(--regula-orange);
  background: color-mix(in srgb, var(--regula-orange) 10%, var(--regula-white));
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--regula-orange) 35%, transparent);
}

.ctp__card--warn:not(.ctp__card--selected) {
  border-color: #fca5a5;
}

.ctp__card--dist.ctp__card--selected {
  background: #fef3c7;
}

.ctp__kg {
  font-weight: 700;
  font-size: var(--regula-type-body-size);
}

.ctp__radio {
  margin-top: 0.35rem;
  width: 100%;
  display: flex;
  justify-content: center;
}

.ctp__radio-dot {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  border: 2px solid var(--regula-steel);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.ctp__card--selected .ctp__radio-dot {
  border-color: var(--regula-orange);
  background: radial-gradient(circle, var(--regula-orange) 55%, transparent 56%);
}

.ctp__check {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  background: var(--regula-orange);
  color: var(--regula-white);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
}

.ctp__ico {
  font-size: 1.35rem;
  color: var(--regula-navy);
  margin-bottom: 0.25rem;
}

.ctp__title {
  font-weight: 700;
  font-size: var(--regula-type-small-size);
}

.ctp__sub {
  font-size: var(--regula-type-caption-size);
  color: var(--regula-text-muted);
  text-align: center;
  line-height: 1.35;
}
</style>
