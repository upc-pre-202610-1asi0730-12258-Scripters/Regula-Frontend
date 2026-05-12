<script setup lang="ts">
import Message from 'primevue/message'
import ProgressSpinner from 'primevue/progressspinner'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

import { DeliveryBoardStatus } from '@/domain/distribution/delivery-board-status'
import { filterDeliveriesByBoardStatus } from '@/domain/distribution/delivery-board-rules'
import DeliveryDayKanbanColumn from '@/distribution-logistics-management/presentation/components/distribution/day-board/DeliveryDayKanbanColumn.vue'
import DayDeliveryCard from '@/distribution-logistics-management/presentation/components/distribution/day-board/DayDeliveryCard.vue'
import DayDeliveryCompactCard from '@/distribution-logistics-management/presentation/components/distribution/day-board/DayDeliveryCompactCard.vue'
import { useDistributionDayBoardStore } from '@/distribution-logistics-management/presentation/stores/use-distribution-day-board-store'

const { t } = useI18n()
const store = useDistributionDayBoardStore()

onMounted(() => {
  void store.loadBoard()
})
</script>

<template>
  <div>
    <div v-if="store.loading" class="state">
      <ProgressSpinner aria-hidden="true" stroke-width="4" />
      <span class="sr-only">{{ t('common.loading') }}</span>
    </div>
    <Message v-else-if="store.errorKey" severity="error" :closable="false">
      {{ t(store.errorKey) }}
    </Message>
    <div v-else class="board">
      <DeliveryDayKanbanColumn
        :title-key="'distribution.dayBoard.columnInRoute'"
        :dot-class="'board__dot--route'"
        :count="filterDeliveriesByBoardStatus(store.deliveries, DeliveryBoardStatus.InRoute).length"
      >
        <DayDeliveryCard
          v-for="d in filterDeliveriesByBoardStatus(store.deliveries, DeliveryBoardStatus.InRoute)"
          :key="d.id"
          :delivery="d"
        />
      </DeliveryDayKanbanColumn>

      <DeliveryDayKanbanColumn
        :title-key="'distribution.dayBoard.columnCompleted'"
        :dot-class="'board__dot--done'"
        :count="filterDeliveriesByBoardStatus(store.deliveries, DeliveryBoardStatus.Completed).length"
      >
        <DayDeliveryCompactCard
          v-for="d in filterDeliveriesByBoardStatus(store.deliveries, DeliveryBoardStatus.Completed)"
          :key="d.id"
          :delivery="d"
        />
      </DeliveryDayKanbanColumn>

      <DeliveryDayKanbanColumn
        :title-key="'distribution.dayBoard.columnFailed'"
        :dot-class="'board__dot--fail'"
        :count="filterDeliveriesByBoardStatus(store.deliveries, DeliveryBoardStatus.Failed).length"
      >
        <div
          v-if="filterDeliveriesByBoardStatus(store.deliveries, DeliveryBoardStatus.Failed).length === 0"
          class="empty"
        >
          <i class="pi pi-check-circle empty__icon" aria-hidden="true" />
          <p class="empty__title">{{ t('distribution.dayBoard.failedEmptyTitle') }}</p>
          <p class="empty__body">{{ t('distribution.dayBoard.failedEmptyBody') }}</p>
        </div>
        <DayDeliveryCard
          v-for="d in filterDeliveriesByBoardStatus(store.deliveries, DeliveryBoardStatus.Failed)"
          :key="d.id"
          :delivery="d"
        />
      </DeliveryDayKanbanColumn>
    </div>
  </div>
</template>

<style scoped>
.state {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.board {
  display: grid;
  gap: 1.5rem;
  align-items: flex-start;
}

@media (min-width: 40rem) {
  .board {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 64rem) {
  .board {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.empty {
  text-align: center;
  padding: 1.5rem 0.75rem;
  color: var(--regula-app-text-muted);
}

.empty__icon {
  font-size: 2.75rem;
  color: var(--regula-color-success);
  margin-bottom: 0.75rem;
}

.empty__title {
  margin: 0 0 0.5rem;
  font-weight: 600;
  color: var(--regula-app-text);
}

.empty__body {
  margin: 0;
  font-size: var(--regula-font-size-sm);
  line-height: 1.5;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
