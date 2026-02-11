import { ExerciseAssesment, LoadingSet, WorkingSetState, WorkoutExerciseState } from '@/mobile/domain'
import { useCallback, useMemo, useState } from 'react'
import { match } from 'ts-pattern'

import { useMixpanel } from '@/mobile/ui/tracking/with-mixpanel'
import { ExerciseFinished } from '@/mobile/ui/workout/components/exercise-finished'
import { ExerciseLoadTesting } from '@/mobile/ui/workout/components/exercise-load-testing'
import { ExerciseLoadedAndTested } from '@/mobile/ui/workout/components/exercise-loaded-and-tested'
import { ExercisePending } from '@/mobile/ui/workout/components/exercise-pending'
import { ExerciseTesting } from '@/mobile/ui/workout/components/exercise-testing'
import { AdjustExerciseOverlay } from '@/mobile/ui/workout/components/ux/adjust-exercise-overlay'
import { useWorkoutContext } from '@/mobile/ui/workout/hooks/use-workout-context'
import { theme } from '@/mobile/theme/theme'
import { ViewContainer } from '@/mobile/ui/components/view-container'

export const ExerciseCard = ({ exerciseIndex, active }: { exerciseIndex: number; active: boolean }) => {
  const workoutContext = useWorkoutContext()
  const exercise = workoutContext.workout.exercises[exerciseIndex]
  const [showExtraActions, setShowExtraActions] = useState(false)
  const mixpanel = useMixpanel()

  const hasMoreExercises =
    workoutContext.workout.exercises.filter(e =>
      [WorkoutExerciseState.testing, WorkoutExerciseState.loading, WorkoutExerciseState.pending].includes(e.state)
    ).length >= 1

  const onLoaded = useCallback(
    (loadingSet: LoadingSet, reachedFailure: boolean) => {
      workoutContext.exerciseLoaded(loadingSet, exerciseIndex, reachedFailure)
    },
    [exerciseIndex, workoutContext]
  )

  const onLoadTested = useCallback(
    (loadingSet: LoadingSet) => {
      workoutContext.exerciseTested(loadingSet, exerciseIndex)
    },
    [exerciseIndex, workoutContext]
  )

  const onMoveNextAfterTesting = useCallback(() => {
    workoutContext.testingSetsExerciseCompleted(exerciseIndex)
  }, [exerciseIndex, workoutContext])

  const onMoveNextAfterPending = useCallback(
    (exerciseAssesment: ExerciseAssesment) => {
      workoutContext.exerciseDone(exerciseIndex, exerciseAssesment)
    },
    [exerciseIndex, workoutContext]
  )

  const onExtraActions = useCallback(() => {
    mixpanel.exerciseExtraActionsShowed()

    setShowExtraActions(true)
  }, [mixpanel])

  const handleExtraActionsCancel = useCallback(() => {
    setShowExtraActions(false)
  }, [])

  const onWeightChanged = useCallback(
    (exerciseId: string, newWeight: number) => {
      workoutContext.changeWeight(exerciseId, newWeight)
    },
    [workoutContext]
  )

  const onSetChanged = useCallback(
    (setId: string, state: WorkingSetState) => {
      workoutContext.exerciseSetStateChanged(exercise.id, setId, state)
    },
    [exercise.id, workoutContext]
  )

  const currentWeight = useMemo(() => {
    return match(exercise)
      .with({ state: WorkoutExerciseState.pending }, ({ sets }) => sets[0]?.weight)
      .with({ state: WorkoutExerciseState.testing }, ({ testingWeight }) => testingWeight)
      .otherwise(() => undefined)
  }, [exercise])

  return (
    <ViewContainer
      style={{
        width: '100%',
        backgroundColor: theme.colors.newUi.background,
        paddingBottom: 20,
        paddingHorizontal: 20,
      }}
    >
      {match(exercise)
        .with({ state: WorkoutExerciseState.loading }, exercise => (
          <ExerciseLoadTesting
            active={active}
            loadingExercise={exercise}
            onExtraActions={onExtraActions}
            onLoaded={onLoaded}
            unit={workoutContext.unit}
          />
        ))
        .with({ state: WorkoutExerciseState.testing }, exercise => (
          <ExerciseTesting
            testingExercise={exercise}
            onExtraActions={onExtraActions}
            onLoadTested={onLoadTested}
            unit={workoutContext.unit}
          />
        ))
        .with({ state: WorkoutExerciseState.pending }, exercise => (
          <ExercisePending
            active={active}
            pendingExercise={exercise}
            onSkipped={() => {}}
            onNext={onMoveNextAfterPending}
            onExtraActions={onExtraActions}
            hasMoreExercises={hasMoreExercises}
            onWeightChanged={onWeightChanged}
            onSetChanged={onSetChanged}
            unit={workoutContext.unit}
          />
        ))
        .with({ state: WorkoutExerciseState.finished }, exercise => (
          <ExerciseFinished active={active} finishedExercise={exercise} unit={workoutContext.unit} />
        ))
        .with({ state: WorkoutExerciseState.loaded }, exercise => (
          <ExerciseLoadedAndTested
            exercise={exercise}
            unit={workoutContext.unit}
            onSetChanged={onSetChanged}
            onNext={onMoveNextAfterTesting}
            hasMoreExercises={hasMoreExercises}
          />
        ))
        .with({ state: WorkoutExerciseState.tested }, exercise => (
          <ExerciseLoadedAndTested
            exercise={exercise}
            unit={workoutContext.unit}
            onSetChanged={onSetChanged}
            onNext={onMoveNextAfterTesting}
            hasMoreExercises={hasMoreExercises}
          />
        ))
        .exhaustive()}

      <AdjustExerciseOverlay
        visible={showExtraActions}
        onCancel={handleExtraActionsCancel}
        exerciseId={exercise.id}
        currentWeight={currentWeight}
        onWeightChange={onWeightChanged}
        exerciseName={exercise.exercise.name}
        onExerciseReplace={workoutContext.skipExercise}
        canChangeWeight={[WorkoutExerciseState.pending, WorkoutExerciseState.testing].includes(exercise.state)}
        unit={workoutContext.unit}
      />
    </ViewContainer>
  )
}
