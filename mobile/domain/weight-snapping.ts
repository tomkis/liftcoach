import { Unit } from './onboarding'

export enum EquipmentType {
  Barbell = 'barbell',
  Dumbbell = 'dumbbell',
  Machine = 'machine',
}

export const getIncrement = (equipmentType: EquipmentType, unit: Unit): number => {
  if (unit === Unit.Imperial) {
    return 5
  }

  switch (equipmentType) {
    case EquipmentType.Barbell:
    case EquipmentType.Machine:
      return 2.5
    case EquipmentType.Dumbbell:
      return 1
  }
}

export const snapWeight = (weight: number, equipmentType: EquipmentType, unit: Unit): number => {
  const increment = getIncrement(equipmentType, unit)
  return Math.round(weight / increment) * increment
}
