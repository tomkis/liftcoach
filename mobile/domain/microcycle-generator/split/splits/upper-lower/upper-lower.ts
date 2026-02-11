import { MicrocycleWorkoutsTemplate, MuscleGroup, SplitResult, SplitType, VolumePerMuscleGroup } from '../../../../muscle-group'

import { calculateTotalSets, distributeVolumeEvenly } from '../volume-manipulation'

const UPPER_MUSCLE_GROUPS = [
  MuscleGroup.Chest,
  MuscleGroup.Biceps,
  MuscleGroup.Triceps,

  MuscleGroup.Back,
  MuscleGroup.Abs,
]
const LOWER_MUSCLE_GROUPS = [
  MuscleGroup.Quads,
  MuscleGroup.Hamstrings,
  MuscleGroup.Glutes,
  MuscleGroup.SideDelts,
  MuscleGroup.RearDelts,
]

const getUpperExercises = (volume: VolumePerMuscleGroup) =>
  Object.entries(volume)
    .filter(([mg]) => UPPER_MUSCLE_GROUPS.includes(mg as MuscleGroup))
    .map(([muscleGroup, sets]) => ({
      muscleGroup: muscleGroup as MuscleGroup,
      sets,
    }))

const getLowerExercises = (volume: VolumePerMuscleGroup) =>
  Object.entries(volume)
    .filter(([mg]) => LOWER_MUSCLE_GROUPS.includes(mg as MuscleGroup))
    .map(([muscleGroup, sets]) => ({
      muscleGroup: muscleGroup as MuscleGroup,
      sets,
    }))

const maxUpperLowerDeviation = 0.2

function getSplit(volume: VolumePerMuscleGroup, trainingDays: number): MicrocycleWorkoutsTemplate {
  const upperExercises = getUpperExercises(volume)
  const lowerExercises = getLowerExercises(volume)

  const fraction = trainingDays / 2

  const distributedUpper = distributeVolumeEvenly(upperExercises, fraction, 1 / fraction)
  const distributedLower = distributeVolumeEvenly(lowerExercises, fraction, 1 / fraction)

  const split = new Array(fraction).fill(null).reduce((acc, _, index) => {
    acc.push({ exercises: distributedUpper[index] })
    acc.push({ exercises: distributedLower[index] })
    return acc
  }, [] as MicrocycleWorkoutsTemplate)

  return split
}

export const upperLower = (volume: VolumePerMuscleGroup, trainingDays: number): SplitResult => {
  if ([1, 3, 5, 7].includes(trainingDays)) {
    throw new Error('Upper Lower Split is not suitable for this number of training days')
  }

  const upperExercises = getUpperExercises(volume)
  const lowerExercises = getLowerExercises(volume)

  const upperVolume = calculateTotalSets(upperExercises)
  const lowerVolume = calculateTotalSets(lowerExercises)

  const volumeDeviation = Math.abs(upperVolume / lowerVolume - 1)

  if (volumeDeviation > maxUpperLowerDeviation) {
    console.log('Skipping Upper Lower, volume deviation too high', {
      volumeDeviation,
      upperVolume,
      lowerVolume,
    })

    return false
  }

  const split = getSplit(volume, trainingDays)

  return {
    type: SplitType.UPPER_LOWER,
    split,
  }
}
