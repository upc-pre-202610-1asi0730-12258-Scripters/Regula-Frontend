<script setup>
const props = defineProps({
  deliverer: {
    type: Object,
    required: true,
  },
})

function getStatusClass(status) {
  if (status === 'En ruta') return 'deliverer-list-item__status--en-ruta'
  if (status === 'Completado') return 'deliverer-list-item__status--completado'
  return 'deliverer-list-item__status--sin-senal'
}

function getAvatarClass(status) {
  if (status === 'En ruta') return 'deliverer-list-item__avatar--en-ruta'
  if (status === 'Completado') return 'deliverer-list-item__avatar--completado'
  return 'deliverer-list-item__avatar--sin-senal'
}
</script>

<template>
  <div class="deliverer-list-item">
    <span class="deliverer-list-item__avatar" :class="getAvatarClass(deliverer.status)">
      {{ deliverer.initials }}
    </span>
    <div class="deliverer-list-item__info">
      <span class="deliverer-list-item__name">{{ deliverer.name }}</span>
      <span class="deliverer-list-item__plate">{{ deliverer.vehiclePlate }}</span>
    </div>
    <span class="deliverer-list-item__status" :class="getStatusClass(deliverer.status)">
      {{ deliverer.status }}
    </span>
  </div>
</template>

<style scoped>
.deliverer-list-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: var(--regula-white, #fff);
  border: 1px solid var(--regula-gray-light, #e8ecf0);
  border-radius: var(--regula-radius-card, 12px);
  transition: box-shadow 0.15s ease;
}

.deliverer-list-item:hover {
  box-shadow: var(--regula-shadow-card, 0 2px 8px rgba(23,45,64,0.08));
}

.deliverer-list-item__avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  flex-shrink: 0;
  color: #fff;
}

.deliverer-list-item__avatar--en-ruta {
  background: var(--regula-orange, #f26e22);
}

.deliverer-list-item__avatar--completado {
  background: #16a34a;
}

.deliverer-list-item__avatar--sin-senal {
  background: var(--regula-steel, #a5b1bf);
}

.deliverer-list-item__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
}

.deliverer-list-item__name {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--regula-text-primary, #111);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.deliverer-list-item__plate {
  font-size: 0.75rem;
  color: var(--regula-text-muted, #a5b1bf);
}

.deliverer-list-item__status {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  white-space: nowrap;
}

.deliverer-list-item__status--en-ruta {
  background: #fff7ed;
  color: var(--regula-orange, #f26e22);
}

.deliverer-list-item__status--completado {
  background: #dcfce7;
  color: #16a34a;
}

.deliverer-list-item__status--sin-senal {
  background: var(--regula-gray-light, #e8ecf0);
  color: var(--regula-gray-mid, #555f6e);
}
</style>
