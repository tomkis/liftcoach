import { MicrocycleWorkoutsTemplate, MuscleGroup, SplitResult, SplitType, VolumePerMuscleGroup } from '../../../../muscle-group'

import { calculateTotalSets, distributeVolumeEvenly } from '../volume-manipulation'

const PUSH_MUSCLE_GROUPS = [MuscleGroup.Triceps, MuscleGroup.SideDelts, MuscleGroup.Quads, MuscleGroup.Chest]
const PULL_MUSCLE_GROUPS = [
  MuscleGroup.Biceps,
  MuscleGroup.RearDelts,
  MuscleGroup.Hamstrings,
  MuscleGroup.Back,
  MuscleGroup.Glutes,
  MuscleGroup.Abs,
]

const getPullExercises = (volume: VolumePerMuscleGroup) =>
  Object.entries(volume)
    .filter(([mg]) => PULL_MUSCLE_GROUPS.includes(mg as MuscleGroup))
    .map(([muscleGroup, sets]) => ({
      muscleGroup: muscleGroup as MuscleGroup,
      sets,
    }))

const getPushExercises = (volume: VolumePerMuscleGroup) =>
  Object.entries(volume)
    .filter(([mg]) => PUSH_MUSCLE_GROUPS.includes(mg as MuscleGroup))
    .map(([muscleGroup, sets]) => ({
      muscleGroup: muscleGroup as MuscleGroup,
      sets,
    }))

const maxPushPullDeviation = 0.2

function getSplit(volume: VolumePerMuscleGroup, trainingDays: number): MicrocycleWorkoutsTemplate {
  const pushExercises = getPushExercises(volume)
  const pullExercises = getPullExercises(volume)

  const fraction = trainingDays / 2

  const distributedPush = distributeVolumeEvenly(pushExercises, fraction, 1 / fraction)
  const distributedPull = distributeVolumeEvenly(pullExercises, fraction, 1 / fraction)

  const split = new Array(fraction).fill(null).reduce((acc, _, index) => {
    acc.push({ exercises: distributedPush[index] })
    acc.push({ exercises: distributedPull[index] })
    return acc
  }, [] as MicrocycleWorkoutsTemplate)

  return split
}

export const pushPull = (volume: VolumePerMuscleGroup, trainingDays: number): SplitResult => {
  const pushExercises = getPushExercises(volume)
  const pullExercises = getPullExercises(volume)

  if ([2, 4, 6].includes(trainingDays)) {
    const pushVolume = calculateTotalSets(pushExercises)
    const pullVolume = calculateTotalSets(pullExercises)

    const volumeDeviation = Math.abs(pushVolume / pullVolume - 1)

    if (volumeDeviation > maxPushPullDeviation) {
      console.log('Skipping push pull, volume deviation too high', { volumeDeviation, pushVolume, pullVolume })

      return false
    }

    const totalVolume = pushVolume + pullVolume
    const avgDailyVolume = totalVolume / trainingDays

    console.log('Generating Push Pull Split', { pushVolume, pullVolume, totalVolume, avgDailyVolume })

    const finalizedSplit = getSplit(volume, trainingDays)

    finalizedSplit.forEach((day, index) => {
      console.log(`Day ${index + 1}: ${calculateTotalSets(day.exercises)}`)
    })

    return { type: SplitType.PUSH_PULL, split: finalizedSplit }
  } else {
    throw new Error('Not implemented')
  }
}
