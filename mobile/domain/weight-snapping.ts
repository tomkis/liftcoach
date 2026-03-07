import { Unit } from './onboarding'

export enum EquipmentType {
  Barbell = 'barbell',
  Dumbbell = 'dumbbell',
  Machine = 'machine',
}

const getIncrement = (equipmentType: EquipmentType, unit: Unit, weight: number): number => {
  if (unit === Unit.Imperial) {
    switch (equipmentType) {
      case EquipmentType.Barbell:
        return 5
      case EquipmentType.Dumbbell:
        return 5
      case EquipmentType.Machine:
        return 5
    }
  }

  switch (equipmentType) {
    case EquipmentType.Barbell:
      return 2.5
    case EquipmentType.Dumbbell:
      return weight < 10 ? 1 : 2
    case EquipmentType.Machine:
      return 2.5
  }
}

export const snapWeight = (weight: number, equipmentType: EquipmentType, unit: Unit): number => {
  const increment = getIncrement(equipmentType, unit, weight)
  return Math.round(weight / increment) * increment
}

export const getSliderStep = (equipmentType: EquipmentType, unit: Unit): number => {
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
