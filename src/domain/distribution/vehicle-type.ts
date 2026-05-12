export const VehicleType = {
  Motorcycle: 'MOTORCYCLE',
  Van: 'VAN',
} as const

export type VehicleType = (typeof VehicleType)[keyof typeof VehicleType]
