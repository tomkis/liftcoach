import { MicrocycleWorkoutsTemplate, MuscleGroup, SplitResult, SplitType, VolumePerMuscleGroup } from '../../../../muscle-group'

import { calculateTotalSets, distributeVolumeEvenly } from '../volume-manipulation'

const IDEAL_RATIO = 1 / 3

const MAX_PPL_DEVIATION = 0.05

const PUSH_MUSCLE_GROUPS = [MuscleGroup.Chest, MuscleGroup.SideDelts, MuscleGroup.Triceps]
const PULL_MUSCLE_GROUPS = [MuscleGroup.Back, MuscleGroup.Biceps, MuscleGroup.RearDelts]
const LEGS_MUSCLE_GROUPS = [MuscleGroup.Quads, MuscleGroup.Hamstrings, MuscleGroup.Glutes, MuscleGroup.Abs]

const getTotalSets = (volume: VolumePerMuscleGroup) => Object.values(volume).reduce((acc, curr) => acc + curr, 0)

const getPushExercises = (volume: VolumePerMuscleGroup) =>
  Object.entries(volume)
    .filter(([mg]) => PUSH_MUSCLE_GROUPS.includes(mg as MuscleGroup))
    .map(([muscleGroup, sets]) => ({
      muscleGroup: muscleGroup as MuscleGroup,
      sets,
    }))

const getPullExercises = (volume: VolumePerMuscleGroup) =>
  Object.entries(volume)
    .filter(([mg]) => PULL_MUSCLE_GROUPS.includes(mg as MuscleGroup))
    .map(([muscleGroup, sets]) => ({
      muscleGroup: muscleGroup as MuscleGroup,
      sets,
    }))

const getLegsExercises = (volume: VolumePerMuscleGroup) =>
  Object.entries(volume)
    .filter(([mg]) => LEGS_MUSCLE_GROUPS.includes(mg as MuscleGroup))
    .map(([muscleGroup, sets]) => ({
      muscleGroup: muscleGroup as MuscleGroup,
      sets,
    }))

const isIdealPplDistribution = (volume: VolumePerMuscleGroup) => {
  const totalSets = getTotalSets(volume)

  const pushExercisesCount = calculateTotalSets(getPushExercises(volume))
  const pullSetsCount = calculateTotalSets(getPullExercises(volume))
  const legsSetsCount = calculateTotalSets(getLegsExercises(volume))

  const pushSetsRatio = pushExercisesCount / totalSets
  const pullSetsRatio = pullSetsCount / totalSets
  const legsSetsRatio = legsSetsCount / totalSets

  const pushDeviation = Math.abs(pushSetsRatio - IDEAL_RATIO)
  const pullDeviation = Math.abs(pullSetsRatio - IDEAL_RATIO)
  const legsDeviation = Math.abs(legsSetsRatio - IDEAL_RATIO)

  const isIdeal =
    pushDeviation <= MAX_PPL_DEVIATION && pullDeviation <= MAX_PPL_DEVIATION && legsDeviation <= MAX_PPL_DEVIATION

  if (!isIdeal) {
    console.log('Split is not suitable for PPL because distribution is not ideal', {
      pushExercisesCount,
      pullSetsCount,
      legsSetsCount,
      pushDeviation,
      pullDeviation,
      legsDeviation,
    })
  }

  return isIdeal
}

function getSplit(volume: VolumePerMuscleGroup, trainingDays: number): MicrocycleWorkoutsTemplate {
  const pushExercises = getPushExercises(volume)
  const pullExercises = getPullExercises(volume)
  const legsExercises = getLegsExercises(volume)

  const fraction = trainingDays / 3

  const distributedPush = distributeVolumeEvenly(pushExercises, fraction, 1 / fraction)
  const distributedPull = distributeVolumeEvenly(pullExercises, fraction, 1 / fraction)
  const distributedLegs = distributeVolumeEvenly(legsExercises, fraction, 1 / fraction)

  const split = new Array(fraction).fill(null).reduce((acc, _, index) => {
    acc.push({ exercises: distributedPush[index] })
    acc.push({ exercises: distributedPull[index] })
    acc.push({ exercises: distributedLegs[index] })

    return acc
  }, [] as MicrocycleWorkoutsTemplate)

  return split
}

export const ppl = (volume: VolumePerMuscleGroup, trainingDays: number): SplitResult => {
  if ([1, 2, 4, 5, 7].includes(trainingDays)) {
    throw new Error('Invalid training days for PPL')
  }

  const idealDistribution = isIdealPplDistribution(volume)

  if (!idealDistribution) {
    return false
  }

  const split = getSplit(volume, trainingDays)

  return { type: SplitType.PPL, split }
}
