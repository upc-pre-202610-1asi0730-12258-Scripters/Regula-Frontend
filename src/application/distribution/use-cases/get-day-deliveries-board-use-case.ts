import type { IDeliveryRepository } from '@/domain/distribution/repositories/delivery-repository'
import type { DayBoardResultDto } from '../dtos/day-board-result-dto'

export class GetDayDeliveriesBoardUseCase {
  private readonly deliveryRepository: IDeliveryRepository

  constructor(deliveryRepository: IDeliveryRepository) {
    this.deliveryRepository = deliveryRepository
  }

  async execute(dayIso: string): Promise<DayBoardResultDto> {
    const deliveries = await this.deliveryRepository.getDayBoard({ dayIso })
    return { deliveries }
  }
}
