import type { HistoryQuery, IDeliveryRepository } from '@/domain/distribution/repositories/delivery-repository'
import type { DeliveryHistoryResultDto } from '../dtos/delivery-history-result-dto'

export class GetDeliveryHistoryUseCase {
  private readonly deliveryRepository: IDeliveryRepository

  constructor(deliveryRepository: IDeliveryRepository) {
    this.deliveryRepository = deliveryRepository
  }

  async execute(query: HistoryQuery): Promise<DeliveryHistoryResultDto> {
    const entries = await this.deliveryRepository.getHistory(query)
    return { entries }
  }
}
