import { Unit } from './onboarding'

export enum EquipmentType {
  Barbell = 'barbell',
  Dumbbell = 'dumbbell',
  Machine = 'machine',
}

const getIncrement = (equipmentType: EquipmentType, unit: Unit, weight: number): number => {
  if (unit === Unit.Imperial) {
    return 5
  }

  switch (equipmentType) {
    case EquipmentType.Barbell:
    case EquipmentType.Machine:
      return 2.5
    case EquipmentType.Dumbbell:
      return weight < 10 ? 1 : 2
  }
}

export const snapWeight = (weight: number, equipmentType: EquipmentType, unit: Unit): number => {
  const increment = getIncrement(equipmentType, unit, weight)
  return Math.round(weight / increment) * increment
}

/**
 * Returns the smallest valid increment for the given equipment/unit combo.
 * Used as the slider step so users can reach any valid weight.
 */
export const getSliderStep = (equipmentType: EquipmentType, unit: Unit): number =>
  getIncrement(equipmentType, unit, 0)
