import { GetDayDeliveriesBoardUseCase } from '@/application/distribution/use-cases/get-day-deliveries-board-use-case'
import { GetDeliveryHistoryUseCase } from '@/application/distribution/use-cases/get-delivery-history-use-case'
import { GetLiveDriversUseCase } from '@/application/distribution/use-cases/get-live-drivers-use-case'
import type { IDeliveryRepository } from '@/domain/distribution/repositories/delivery-repository'
import { MockDeliveryRepository } from '@/infrastructure/distribution/mock-delivery-repository'

function createDeliveryRepository(): IDeliveryRepository {
  return new MockDeliveryRepository()
}

const deliveryRepository = createDeliveryRepository()

export const getDayDeliveriesBoardUseCase = new GetDayDeliveriesBoardUseCase(deliveryRepository)
export const getDeliveryHistoryUseCase = new GetDeliveryHistoryUseCase(deliveryRepository)
export const getLiveDriversUseCase = new GetLiveDriversUseCase(deliveryRepository)
