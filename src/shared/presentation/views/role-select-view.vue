<script setup>
import Button from 'primevue/button'
import { useRouter } from 'vue-router'

const router = useRouter()

function goEnterprise() {
  sessionStorage.setItem('regula_role', 'enterprise')
  router.push({ name: 'inventory-enterprise' })
}

function goDistributor() {
  sessionStorage.setItem('regula_role', 'distributor')
  router.push({ name: 'inventory-distributor' })
}
</script>

<template>
  <div class="role-select surface-ground">
    <div class="role-select__panel surface-card border-round-2xl shadow-2">
      <div class="role-select__brand">REGULA</div>
      <h1 class="role-select__title">Selecciona tu interfaz</h1>
      <p class="role-select__subtitle">
        Elige el perfil para cargar la experiencia de Empresa o Distribuidor. Puedes cambiar
        después desde “Cerrar sesión”.
      </p>

      <div class="role-select__actions">
        <Button
            label="Empresa"
            icon="pi pi-building"
            class="role-select__btn role-select__btn--enterprise"
            @click="goEnterprise"
        />
        <Button
            label="Distribuidor"
            icon="pi pi-user"
            severity="secondary"
            outlined
            class="role-select__btn"
            @click="goDistributor"
        />
      </div>

      <div class="role-select__hint">
        API simulada: ejecuta <code>npm run api</code> (usa <code>server/db.json</code>, puerto 3001).
      </div>
    </div>
  </div>
</template>

<style scoped>
.role-select {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 2rem 1rem;
}

.role-select__panel {
  width: min(720px, 100%);
  padding: 2rem 2rem 1.75rem;
}

.role-select__brand {
  font-weight: 900;
  letter-spacing: 0.08em;
  color: #f97316;
  margin-bottom: 0.75rem;
}

.role-select__title {
  margin: 0 0 0.5rem;
  font-size: 1.75rem;
  color: #0f172a;
}

.role-select__subtitle {
  margin: 0 0 1.5rem;
  color: #64748b;
  line-height: 1.55;
}

.role-select__actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.role-select__btn :deep(.p-button) {
  font-weight: 800;
}

.role-select__btn--enterprise :deep(.p-button) {
  background: #f97316;
  border-color: #f97316;
}

.role-select__hint {
  margin-top: 1.25rem;
  font-size: 0.85rem;
  color: #64748b;
}

.role-select__hint code {
  font-size: 0.82rem;
  padding: 0.15rem 0.35rem;
  border-radius: 0.35rem;
  background: #f1f5f9;
}
</style>
