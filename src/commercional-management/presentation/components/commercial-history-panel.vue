<script setup>
import { useCommercialStore } from '@/commercional-management/application/commercial.store.js'

const store = useCommercialStore()
</script>

<template>
  <section class="history">
    <div class="history__header">
      <div>
        <h2>Historial de movimientos</h2>
        <p>Registro completo de deudas y pagos</p>
      </div>

      <button class="history__export">
        <i class="pi pi-download"></i>
        Exportar
      </button>
    </div>

    <div class="history__table-wrap">
      <table class="history__table">
        <thead>
        <tr>
          <th>ID</th>
          <th>FECHA Y HORA</th>
          <th>TIPO</th>
          <th>CLIENTE</th>
          <th>DESCRIPCIÓN</th>
          <th>MONTO</th>
          <th>SALDO POSTERIOR</th>
          <th>USUARIO</th>
        </tr>
        </thead>

        <tbody>
        <tr
            v-for="movement in store.debtMovements"
            :key="movement.id"
            :class="{ 'history__row--payment': movement.type === 'Pago' }"
        >
          <td>{{ movement.id }}</td>
          <td>
            <strong>{{ movement.date }}</strong>
            <span>{{ movement.time }}</span>
          </td>
          <td>
              <span class="history__badge" :class="movement.type === 'Pago' ? 'green' : 'red'">
                {{ movement.type }}
              </span>
          </td>
          <td>{{ movement.client }}</td>
          <td>{{ movement.description }}</td>
          <td>S/. {{ movement.amount }}</td>
          <td>
            <span v-if="movement.balance === 0" class="history__no-debt">Sin deuda</span>
            <strong v-else>S/. {{ movement.balance }}</strong>
          </td>
          <td>{{ movement.user }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.history__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.history h2 {
  margin: 0;
  color: var(--regula-navy);
}

.history p {
  margin: 0.25rem 0 0;
  color: var(--regula-text-muted);
}

.history__export {
  border: 1px solid var(--regula-gray-light);
  background: white;
  border-radius: 10px;
  padding: 0.7rem 1rem;
  cursor: pointer;
  font-weight: 700;
}

.history__table-wrap {
  overflow-x: auto;
  background: white;
  border: 1px solid var(--regula-gray-light);
  border-radius: var(--regula-radius-card);
  box-shadow: 0 8px 24px rgba(23, 45, 64, 0.08);
}

.history__table {
  width: 100%;
  min-width: 1000px;
  border-collapse: collapse;
}

.history__table th {
  background: var(--regula-navy);
  color: white;
  text-align: left;
  padding: 1rem;
  font-size: 0.75rem;
}

.history__table td {
  padding: 1rem;
  border-bottom: 1px solid var(--regula-gray-light);
  color: var(--regula-navy);
}

.history__table td span {
  display: block;
  color: var(--regula-text-muted);
  font-size: 0.8rem;
}

.history__row--payment {
  background: #ecfdf5;
}

.history__badge {
  display: inline-flex !important;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  font-weight: 800;
  font-size: 0.8rem;
}

.history__badge.green {
  background: #dcfce7;
  color: #15803d;
}

.history__badge.red {
  background: #fee2e2;
  color: #dc2626;
}

.history__no-debt {
  display: inline-flex !important;
  background: #22c55e;
  color: white !important;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  font-weight: 800;
}
</style>