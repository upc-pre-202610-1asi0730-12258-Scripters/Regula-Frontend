<script setup>
import Button from 'primevue/button'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  unidades: {
    type: Number,
    required: true,
  },
  statusLabel: {
    type: String,
    required: true,
  },
  accent: {
    type: String,
    required: true,
  },
  footerHint: {
    type: String,
    default: null,
  },
  showRegistrarEntrada: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['registrar-entrada'])

const accentMap = {
  danger: {
    border: '#ef4444',
    iconBg: '#fee2e2',
    iconColor: '#b91c1c',
    badgeClass: 'inv-stock-card__badge--danger',
  },
  warning: {
    border: '#f59e0b',
    iconBg: '#fef3c7',
    iconColor: '#b45309',
    badgeClass: 'inv-stock-card__badge--warning',
  },
  success: {
    border: '#22c55e',
    iconBg: '#dcfce7',
    iconColor: '#166534',
    badgeClass: 'inv-stock-card__badge--success',
  },
}

const theme = () => accentMap[props.accent] || accentMap.success
</script>

<template>
  <article class="inv-stock-card" :style="{ borderLeftColor: theme().border }">
    <div class="inv-stock-card__top">
      <div
          class="inv-stock-card__glyph"
          :style="{ background: theme().iconBg, color: theme().iconColor }"
      >
        <i class="pi pi-database" aria-hidden="true" />
      </div>
      <span class="inv-stock-card__badge" :class="theme().badgeClass">
        {{ statusLabel }}
      </span>
    </div>

    <div class="inv-stock-card__title">{{ title }}</div>
    <div class="inv-stock-card__subtitle">{{ subtitle }}</div>

    <div class="inv-stock-card__qty">
      <span class="inv-stock-card__qty-num">{{ unidades }}</span>
      <span class="inv-stock-card__qty-unit">unidades</span>
    </div>

    <div v-if="footerHint" class="inv-stock-card__hint inv-stock-card__hint--warn">
      {{ footerHint }}
    </div>

    <div v-if="showRegistrarEntrada" class="inv-stock-card__actions">
      <span v-tooltip.bottom="'Registra balones que ingresan a tu local para mantener el stock al día'">
        <Button label="Registrar entrada" icon="pi pi-plus" class="inv-stock-card__cta" @click="emit('registrar-entrada')" />
      </span>
    </div>
  </article>
</template>

<style scoped>
.inv-stock-card {
  border-left: 5px solid #22c55e;
  padding: 1rem;
  height: 100%;
  border-radius: var(--regula-radius-card);
  box-shadow: var(--regula-shadow-card);
}

.inv-stock-card__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.inv-stock-card__glyph {
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 0.85rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
}

.inv-stock-card__badge {
  font-size: 0.72rem;
  font-weight: 800;
  padding: 0.35rem 0.55rem;
  border-radius: 999px;
  white-space: nowrap;
}

.inv-stock-card__badge--danger {
  background: #ef4444;
  color: #fff;
}

.inv-stock-card__badge--warning {
  background: #facc15;
  color: #422006;
}

.inv-stock-card__badge--success {
  background: #22c55e;
  color: #fff;
}

.inv-stock-card__title {
  font-weight: 600;
  font-size: var(--regula-type-h3-size);
  color: var(--regula-navy);
  margin-bottom: 0.15rem;
  line-height: 1.4;
}

.inv-stock-card__subtitle {
  font-size: var(--regula-type-small-size);
  color: var(--regula-text-muted);
  margin-bottom: 0.85rem;
  line-height: 1.5;
}

.inv-stock-card__qty {
  display: flex;
  align-items: baseline;
  gap: 0.45rem;
  margin-bottom: 0.75rem;
}

.inv-stock-card__qty-num {
  font-size: clamp(1.75rem, 4vw, 2.25rem);
  font-weight: 700;
  color: var(--regula-text-primary);
  line-height: 1.1;
}

.inv-stock-card__qty-unit {
  font-size: var(--regula-type-body-size);
  color: var(--regula-text-muted);
}

.inv-stock-card__hint {
  font-size: 0.85rem;
  margin-bottom: 0.75rem;
}

.inv-stock-card__hint--warn {
  color: #b45309;
  font-weight: 700;
}

.inv-stock-card__cta :deep(.p-button) {
  width: 100%;
  justify-content: center;
  background: var(--regula-orange);
  border-color: var(--regula-orange);
  font-weight: 700;
  border-radius: var(--regula-radius-btn);
  min-height: 44px;
}

.inv-stock-card__cta :deep(.p-button:hover) {
  background: var(--regula-orange-hover);
  border-color: var(--regula-orange-hover);
}
</style>
