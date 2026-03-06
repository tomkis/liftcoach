import { Unit } from '../onboarding'
import { EquipmentType, snapWeight } from '../weight-snapping'
import { ProgressionType } from '../working-exercise'

const htRange = { min: 8, max: 12 }

const incrementReps = (lastReps: number) => {
  return Math.min(lastReps + 1, htRange.max)
}

export const applySetProgression = (
  progressionType: ProgressionType,
  lastReps: number,
  set: { reps: number; weight: number },
  equipmentType: EquipmentType,
  unit: Unit
): { weight: number; reps: number } => {
  switch (progressionType) {
    case ProgressionType.LoweredWeightTooHeavy:
    case ProgressionType.LoweredWeightTooManyFailures:
    case ProgressionType.RegressTooMuchVolume:
      return {
        weight: snapWeight(set.weight * 0.9, equipmentType, unit),
        reps: set.reps,
      }

    case ProgressionType.NoProgressFailure:
    case ProgressionType.KeepProgressSuboptimalLifestyle:
      return {
        weight: set.weight,
        reps: set.reps,
      }
    case ProgressionType.ProgressedReps:
      return {
        weight: set.weight,
        reps: incrementReps(lastReps),
      }
    default:
      throw new Error('Illegal State')
  }
}

export const getRepsForCycle = (cycleIndex: number) => {
  return Math.min(htRange.min + cycleIndex, htRange.max)
}
