import { MicrocycleWorkoutsTemplate, SplitResult, VolumePerMuscleGroup } from '../../muscle-group'

import { fullBodySplit } from './splits/fb/full-body-split'
import { ppl } from './splits/ppl/ppl-split'
import { pushPull } from './splits/push-pull/push-pull'
import { upperLower } from './splits/upper-lower/upper-lower'
import { ensureIdealSetsPerExercise } from './splits/volume-manipulation'

function twoDays(volume: VolumePerMuscleGroup): SplitResult {
  const upperLowerSplit = upperLower(volume, 2)
  if (upperLowerSplit) {
    return upperLowerSplit
  }

  const pushPullSplit = pushPull(volume, 2)
  if (pushPullSplit) {
    return pushPullSplit
  }

  return fullBodySplit(volume, 4)
}

function threeDays(volume: VolumePerMuscleGroup): SplitResult {
  const pplSplit = ppl(volume, 3)
  if (pplSplit) {
    return pplSplit
  }
  const upperLowerSplit = upperLower(volume, 4)
  if (upperLowerSplit) {
    return upperLowerSplit
  }

  const pushPullSplit = pushPull(volume, 4)
  if (pushPullSplit) {
    return pushPullSplit
  }

  return fullBodySplit(volume, 3)
}

function fourDays(volume: VolumePerMuscleGroup): SplitResult {
  const upperLowerSplit = upperLower(volume, 4)
  if (upperLowerSplit) {
    return upperLowerSplit
  }

  const pushPullSplit = pushPull(volume, 4)
  if (pushPullSplit) {
    return pushPullSplit
  }

  return fullBodySplit(volume, 4)
}

function fiveDays(volume: VolumePerMuscleGroup): SplitResult {
  const pplSplit = ppl(volume, 6)
  if (pplSplit) {
    return pplSplit
  }

  const upperLowerSplit = upperLower(volume, 6)
  if (upperLowerSplit) {
    return upperLowerSplit
  }

  const pushPullSplit = pushPull(volume, 6)
  if (pushPullSplit) {
    return pushPullSplit
  }

  return fullBodySplit(volume, 5)
}

function sixDays(volume: VolumePerMuscleGroup): SplitResult {
  const pplSplit = ppl(volume, 6)
  if (pplSplit) {
    return pplSplit
  }

  const upperLowerSplit = upperLower(volume, 6)
  if (upperLowerSplit) {
    return upperLowerSplit
  }

  const pushPullSplit = pushPull(volume, 6)
  if (pushPullSplit) {
    return pushPullSplit
  }

  return fullBodySplit(volume, 6)
}

const sortExercisesByPriority = (
  template: MicrocycleWorkoutsTemplate,
  volume: VolumePerMuscleGroup
): MicrocycleWorkoutsTemplate => {
  return template.map(day => {
    return {
      ...day,
      exercises: day.exercises.sort((a, b) => {
        const volumeForExerciseA = volume[a.muscleGroup]
        const volumeForExerciseB = volume[b.muscleGroup]

        if (volumeForExerciseA === undefined) {
          throw new Error('Illegal State')
        }

        if (volumeForExerciseB === undefined) {
          throw new Error('Illegal State')
        }

        return volumeForExerciseB - volumeForExerciseA
      }),
    }
  })
}

const selectSplit = (volume: VolumePerMuscleGroup, trainingDays: number): SplitResult => {
  switch (trainingDays) {
    case 2:
      return twoDays(volume)
    case 3:
      return threeDays(volume)
    case 4:
      return fourDays(volume)
    case 5:
      return fiveDays(volume)
    case 6:
      return sixDays(volume)
    default:
      throw new Error(`No split found for ${trainingDays} days`)
  }
}

export const splitSelector = (volume: VolumePerMuscleGroup, trainingDays: number): SplitResult => {
  const split = selectSplit(volume, trainingDays)

  if (!split) {
    return false
  }

  return {
    type: split.type,
    split: sortExercisesByPriority(ensureIdealSetsPerExercise(split.split), volume),
  }
}
