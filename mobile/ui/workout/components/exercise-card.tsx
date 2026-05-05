import {
  ExerciseAssesment,
  LoadingSet,
  ProgressionMode,
  WorkingSet,
  WorkingSetState,
  WorkoutExerciseState,
} from '@/mobile/domain'
import { useCallback, useMemo, useState } from 'react'
import { match } from 'ts-pattern'

import { useTracking } from '@/mobile/ui/tracking/tracking'
import { ExerciseFinished } from '@/mobile/ui/workout/components/exercise-finished'
import { ExerciseLoadTesting } from '@/mobile/ui/workout/components/exercise-load-testing'
import { ExerciseLoadedAndTested } from '@/mobile/ui/workout/components/exercise-loaded-and-tested'
import { ExercisePending } from '@/mobile/ui/workout/components/exercise-pending'
import { ExercisePendingCustom } from '@/mobile/ui/workout/components/exercise-pending-custom'
import { ExerciseTesting } from '@/mobile/ui/workout/components/exercise-testing'
import { AdjustExerciseOverlay } from '@/mobile/ui/workout/components/ux/adjust-exercise-overlay'
import { useWorkoutContext } from '@/mobile/ui/workout/hooks/use-workout-context'
import { theme } from '@/mobile/theme/theme'
import { ScreenContainer } from '@/mobile/ui/ds/layout'

export const ExerciseCard = ({ exerciseIndex, active }: { exerciseIndex: number; active: boolean }) => {
  const workoutContext = useWorkoutContext()
  const exercise = workoutContext.workout.exercises[exerciseIndex]
  const [showExtraActions, setShowExtraActions] = useState(false)
  const tracking = useTracking()

  const hasMoreExercises =
    workoutContext.workout.exercises.filter(
      (e, i) =>
        i !== exerciseIndex &&
        [WorkoutExerciseState.testing, WorkoutExerciseState.loading, WorkoutExerciseState.pending].includes(e.state)
    ).length >= 1

  const isSetFullyLogged = (set: WorkingSet) =>
    (set.state === WorkingSetState.done || set.state === WorkingSetState.failed) &&
    set.weight !== null &&
    set.reps !== null

  const incompleteExerciseNames = workoutContext.workout.exercises
    .filter(e => !e.sets.every(isSetFullyLogged))
    .map(e => e.exercise.name)

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
    (exerciseAssesment: ExerciseAssesment | null) => {
      workoutContext.exerciseDone(exerciseIndex, exerciseAssesment)
    },
    [exerciseIndex, workoutContext]
  )

  const onExtraActions = useCallback(() => {
    tracking.exerciseExtraActionsShowed()

    setShowExtraActions(true)
  }, [tracking])

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

  const onSetWeightChanged = useCallback(
    (setId: string, weight: number) => {
      workoutContext.changeSetWeight(exercise.id, setId, weight)
    },
    [exercise.id, workoutContext]
  )

  const onSetRepsChanged = useCallback(
    (setId: string, reps: number) => {
      workoutContext.changeSetReps(exercise.id, setId, reps)
    },
    [exercise.id, workoutContext]
  )

  const currentWeight = useMemo(() => {
    return match(exercise)
      .with({ state: WorkoutExerciseState.pending }, ({ sets }) => sets[0]?.weight)
      .with({ state: WorkoutExerciseState.testing }, ({ testingWeight }) => testingWeight)
      .with({ state: WorkoutExerciseState.loaded }, ({ sets }) => sets[0]?.weight)
      .with({ state: WorkoutExerciseState.tested }, ({ sets }) => sets[0]?.weight)
      .otherwise(() => undefined)
  }, [exercise])

  return (
    <ScreenContainer
      style={{
        width: '100%',
        backgroundColor: theme.colors.background,
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
        .with({ state: WorkoutExerciseState.pending }, exercise =>
          workoutContext.workout.progressionMode === ProgressionMode.Custom ? (
            <ExercisePendingCustom
              active={active}
              pendingExercise={exercise}
              hasMoreExercises={hasMoreExercises}
              incompleteExerciseNames={incompleteExerciseNames}
              onNext={() => onMoveNextAfterPending(null)}
              onExtraActions={onExtraActions}
              onSetStateChanged={onSetChanged}
              onSetWeightChanged={onSetWeightChanged}
              onSetRepsChanged={onSetRepsChanged}
              unit={workoutContext.unit}
            />
          ) : (
            <ExercisePending
              active={active}
              pendingExercise={exercise}
              onSkipped={() => {}}
              onNext={onMoveNextAfterPending}
              onExtraActions={onExtraActions}
              hasMoreExercises={hasMoreExercises}
              onSetChanged={onSetChanged}
              unit={workoutContext.unit}
            />
          )
        )
        .with({ state: WorkoutExerciseState.finished }, exercise =>
          workoutContext.workout.progressionMode === ProgressionMode.Custom ? (
            <ExercisePendingCustom
              active={active}
              pendingExercise={exercise}
              hasMoreExercises={hasMoreExercises}
              incompleteExerciseNames={incompleteExerciseNames}
              onNext={() => onMoveNextAfterPending(null)}
              onExtraActions={onExtraActions}
              onSetStateChanged={onSetChanged}
              onSetWeightChanged={onSetWeightChanged}
              onSetRepsChanged={onSetRepsChanged}
              unit={workoutContext.unit}
            />
          ) : (
            <ExerciseFinished
              active={active}
              finishedExercise={exercise}
              unit={workoutContext.unit}
              onUndo={() => workoutContext.undoFinishExercise(exercise.id)}
            />
          )
        )
        .with({ state: WorkoutExerciseState.loaded }, exercise => (
          <ExerciseLoadedAndTested
            exercise={exercise}
            unit={workoutContext.unit}
            onSetChanged={onSetChanged}
            onNext={onMoveNextAfterTesting}
            hasMoreExercises={hasMoreExercises}
            onExtraActions={onExtraActions}
            onUndo={() => workoutContext.undoFinishExercise(exercise.id)}
          />
        ))
        .with({ state: WorkoutExerciseState.tested }, exercise => (
          <ExerciseLoadedAndTested
            exercise={exercise}
            unit={workoutContext.unit}
            onSetChanged={onSetChanged}
            onNext={onMoveNextAfterTesting}
            hasMoreExercises={hasMoreExercises}
            onExtraActions={onExtraActions}
            onUndo={() => workoutContext.undoFinishExercise(exercise.id)}
          />
        ))
        .exhaustive()}

      <AdjustExerciseOverlay
        visible={showExtraActions}
        onCancel={handleExtraActionsCancel}
        exerciseId={exercise.id}
        currentWeight={currentWeight ?? undefined}
        onWeightChange={onWeightChanged}
        exerciseName={exercise.exercise.name}
        onExerciseReplace={workoutContext.skipExercise}
        canReplaceExercise={[WorkoutExerciseState.pending, WorkoutExerciseState.testing, WorkoutExerciseState.loading].includes(exercise.state)}
        canChangeWeight={
          [WorkoutExerciseState.testing, WorkoutExerciseState.loaded, WorkoutExerciseState.tested].includes(
            exercise.state
          ) ||
          (exercise.state === WorkoutExerciseState.pending &&
            workoutContext.workout.progressionMode !== ProgressionMode.Custom)
        }
        unit={workoutContext.unit}
        loadingType={exercise.exercise.loadingType}
      />
    </ScreenContainer>
  )
}
