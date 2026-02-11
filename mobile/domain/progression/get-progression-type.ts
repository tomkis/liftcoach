import {
  ExerciseAssesmentScore,
  FinishedWorkingExercise,
  HardAssesmentTag,
  ProgressionType,
  WorkingSetState,
} from '../working-exercise'
import { LifestyleFeedback } from '../microcycle'

const TOO_MANY_CONSECUTIVE_FAILURES = 2

const isLifestyleFeedbackGood = ({ lifestyleFeedback }: { lifestyleFeedback: LifestyleFeedback | null }) => {
  return (
    !lifestyleFeedback ||
    (lifestyleFeedback && lifestyleFeedback.dietQuality >= 5 && lifestyleFeedback.sleepQuality >= 5)
  )
}

export const getProgressionType = (
  pastExercises: Array<{ exercise: FinishedWorkingExercise; lifestyleFeedback: LifestyleFeedback | null }>
): ProgressionType => {
  const lastPastExerciseResult = pastExercises[pastExercises.length - 1]
  if (!lastPastExerciseResult) {
    return ProgressionType.ProgressedReps
  }

  const lastPastExercise = lastPastExerciseResult.exercise
  const pastConsecutiveExercises = pastExercises.slice(0, TOO_MANY_CONSECUTIVE_FAILURES)

  if (
    pastConsecutiveExercises.length === TOO_MANY_CONSECUTIVE_FAILURES &&
    pastConsecutiveExercises.every(({ exercise }) => exercise.sets.some(set => set.state === WorkingSetState.failed))
  ) {
    if (!isLifestyleFeedbackGood(lastPastExerciseResult)) {
      return ProgressionType.KeepProgressSuboptimalLifestyle
    }

    return ProgressionType.LoweredWeightTooManyFailures
  }

  if (
    lastPastExercise.exerciseAssesment.assesment === ExerciseAssesmentScore.Hard &&
    lastPastExercise.exerciseAssesment.assesmentTag === HardAssesmentTag.TooHeavy
  ) {
    if (!isLifestyleFeedbackGood(lastPastExerciseResult)) {
      return ProgressionType.KeepProgressSuboptimalLifestyle
    }

    return ProgressionType.LoweredWeightTooHeavy
  }

  if (pastExercises.some(({ exercise }) => exercise.sets.some(set => set.state === WorkingSetState.failed))) {
    return ProgressionType.NoProgressFailure
  }

  return ProgressionType.ProgressedReps
}
