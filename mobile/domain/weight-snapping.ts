import { Unit } from './onboarding'

export enum LoadingType {
  DoublePlates = 'double_plates',
  Dumbbell = 'dumbbell',
  Plates = 'plates',
  Stack = 'stack',
}

export const getIncrement = (loadingType: LoadingType, unit: Unit): number => {
  if (unit === Unit.Imperial) {
    return 5
  }

  switch (loadingType) {
    case LoadingType.DoublePlates:
    case LoadingType.Plates:
      return 2.5
    case LoadingType.Stack:
      return 5
    case LoadingType.Dumbbell:
      return 1
  }
}

export const snapWeight = (weight: number, loadingType: LoadingType, unit: Unit): number => {
  const increment = getIncrement(loadingType, unit)
  return Math.round(weight / increment) * increment
}
