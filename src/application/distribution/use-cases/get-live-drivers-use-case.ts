import type { IDeliveryRepository } from '@/domain/distribution/repositories/delivery-repository'
import type { LiveDriversResultDto } from '../dtos/live-drivers-result-dto'

export class GetLiveDriversUseCase {
  private readonly deliveryRepository: IDeliveryRepository

  constructor(deliveryRepository: IDeliveryRepository) {
    this.deliveryRepository = deliveryRepository
  }

  async execute(): Promise<LiveDriversResultDto> {
    const drivers = await this.deliveryRepository.getLiveDrivers()
    return { drivers }
  }
}
