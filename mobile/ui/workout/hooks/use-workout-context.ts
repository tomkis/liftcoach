import {
  ExerciseAssesment,
  ExerciseAssesmentScore,
  LifestyleFeedback,
  LoadedWorkingExercise,
  LoadingSet,
  MicrocycleWorkout,
  OnboardedUser,
  PendingWorkingExercise,
  TestedWorkingExercise,
  Unit,
  WorkingExercise,
  WorkingSetState,
  WorkoutExerciseState,
} from '@/mobile/domain'
import React, { useCallback, useMemo, useState } from 'react'
import Swiper from 'react-native-swiper'

import { useResetToHomeNavigation } from '@/mobile/ui/workout/hooks/use-workout-navigation'
import { trpc } from '@/mobile/trpc'

export enum WorkoutLifestyleFeedbackModal {
  FailedSets = 'FailedSets',
  HardSets = 'HardSets',
  NotNeeded = 'NotNeeded',
}

interface WorkoutContextType {
  workout: MicrocycleWorkout
  exerciseLoaded: (loadingSet: LoadingSet, exerciseIndex: number, reachedFailure: boolean) => void
  exerciseTested: (loadingSet: LoadingSet, exerciseIndex: number) => void
  testingSetsExerciseCompleted: (exerciseIndex: number) => void
  exerciseDone: (exerciseIndex: number, exerciseAssesment: ExerciseAssesment) => void
  skipExercise: (pendingExerciseId: string, newExerciseId: string | null) => Promise<void>
  finishWorkout: () => void
  changeWeight: (exerciseId: string, newWeight: number) => void
  exerciseSetStateChanged: (workingExerciseId: string, setId: string, state: WorkingSetState) => void
  isWorkoutFinished: boolean
  lifestyleFeedbackModal: WorkoutLifestyleFeedbackModal
  onLifestyleFeedbackConfirm: (feedback: { dietQuality: number; sleepQuality: number }) => void
  unit: Unit
}

export const WorkoutContext = React.createContext<null | WorkoutContextType>(null)

export const useCreateWorkoutContext = (
  workout: MicrocycleWorkout,
  onboardingInfo: OnboardedUser,
  swiperRef: React.RefObject<Swiper>
): WorkoutContextType => {
  const { mutateAsync: exerciseSetStateChangedMutation } = trpc.workout.exerciseSetStateChanged.useMutation()
  const { mutateAsync: changeWeightMutation } = trpc.workout.exerciseChangeWeight.useMutation()
  const { mutateAsync: exerciseFinishedMutation } = trpc.workout.exerciseFinished.useMutation()
  const { mutateAsync: replaceExerciseMutation } = trpc.workout.replaceExercise.useMutation()
  const { mutateAsync: finishWorkoutMutation } = trpc.workout.finishWorkout.useMutation()
  const { mutateAsync: exerciseLoadedMutation } = trpc.workout.exerciseLoaded.useMutation()
  const { mutateAsync: exerciseTestedMutation } = trpc.workout.exerciseTested.useMutation()

  const trpcUtils = trpc.useUtils()

  const resetToHome = useResetToHomeNavigation()
  const [lifestyleFeedbackModal, setLifestyleFeedbackModal] = useState(WorkoutLifestyleFeedbackModal.NotNeeded)

  const isWorkoutFinished = useMemo(() => {
    return workout.exercises.every(
      exercise =>
        [WorkoutExerciseState.finished, WorkoutExerciseState.loaded].includes(exercise.state) &&
        exercise.sets.every(set => [WorkingSetState.done, WorkingSetState.failed].includes(set.state))
    )
  }, [workout.exercises])

  const isAnyExerciseHard = useMemo(() => {
    return workout.exercises.some(
      exercise =>
        exercise.state === WorkoutExerciseState.finished &&
        exercise.exerciseAssesment?.assesment === ExerciseAssesmentScore.Hard
    )
  }, [workout.exercises])

  const isAnyFailedSets = useMemo(() => {
    return workout.exercises.some(
      exercise =>
        exercise.state === WorkoutExerciseState.finished &&
        exercise.sets.some(set => set.state === WorkingSetState.failed)
    )
  }, [workout.exercises])

  const findNextPendingExerciseIndex = useCallback(
    (predicate: (exercise: WorkingExercise) => boolean) => {
      return workout.exercises.findIndex(
        exercise =>
          [WorkoutExerciseState.pending, WorkoutExerciseState.loading, WorkoutExerciseState.testing].includes(
            exercise.state
          ) && predicate(exercise)
      )
    },
    [workout.exercises]
  )

  const finishWorkoutInternal = useCallback(
    async (lifestyleFeedback?: LifestyleFeedback) => {
      await finishWorkoutMutation({ workoutId: workout.id, lifestyleFeedback })
      await trpcUtils.workout.invalidate()
      resetToHome()
    },
    [finishWorkoutMutation, trpcUtils.workout, resetToHome, workout.id]
  )

  const finishWorkoutAndProvideFeedbackIfNeeded = useCallback(async () => {
    if (isAnyExerciseHard) {
      setLifestyleFeedbackModal(WorkoutLifestyleFeedbackModal.HardSets)
    } else if (isAnyFailedSets) {
      setLifestyleFeedbackModal(WorkoutLifestyleFeedbackModal.FailedSets)
    } else {
      await finishWorkoutInternal()
    }
  }, [isAnyExerciseHard, isAnyFailedSets, finishWorkoutInternal])

  const goToNextExercise = useCallback(
    async (ignoreExerciseId: string) => {
      const nextPendingExerciseIndex = findNextPendingExerciseIndex(({ id }) => id !== ignoreExerciseId)

      if (nextPendingExerciseIndex !== -1) {
        swiperRef.current?.scrollTo(nextPendingExerciseIndex, true)
      } else {
        finishWorkoutAndProvideFeedbackIfNeeded()
      }
    },
    [findNextPendingExerciseIndex, swiperRef, finishWorkoutAndProvideFeedbackIfNeeded]
  )

  const onLifestyleFeedbackConfirm = useCallback(
    async (feedback: LifestyleFeedback) => {
      setLifestyleFeedbackModal(WorkoutLifestyleFeedbackModal.NotNeeded)
      await finishWorkoutInternal(feedback)
    },
    [finishWorkoutInternal]
  )

  const testingSetsExerciseCompleted = useCallback(
    async (exerciseIndex: number) => {
      const exercise = workout.exercises[exerciseIndex]
      goToNextExercise(exercise.id)
    },
    [goToNextExercise, workout.exercises]
  )

  const exerciseLoaded = useCallback(
    async (loadingSet: LoadingSet, exerciseIndex: number, reachedFailure: boolean) => {
      const exercise = workout.exercises[exerciseIndex]

      await exerciseLoadedMutation({
        workoutExerciseId: exercise.id,
        loadingSet,
        workoutId: workout.id,
        reachedFailure,
      })

      void trpcUtils.workout.getWorkout.invalidate()
    },
    [exerciseLoadedMutation, trpcUtils.workout.getWorkout, workout.exercises, workout.id]
  )

  const exerciseTested = useCallback(
    async (loadingSet: LoadingSet, exerciseIndex: number) => {
      const exercise = workout.exercises[exerciseIndex]

      await exerciseTestedMutation({
        workoutExerciseId: exercise.id,
        loadingSet,
        workoutId: workout.id,
      })

      void trpcUtils.workout.getWorkout.invalidate()
    },
    [exerciseTestedMutation, trpcUtils.workout.getWorkout, workout.exercises, workout.id]
  )

  const exerciseDone = useCallback(
    async (exerciseIndex: number, exerciseAssesment: ExerciseAssesment) => {
      const workingExercise = workout.exercises[exerciseIndex]

      await exerciseFinishedMutation({
        workoutId: workout.id,
        workingExerciseId: workingExercise.id,
        exerciseAssesment,
      })
      trpcUtils.workout.getWorkout.invalidate()
      goToNextExercise(workingExercise.id)
    },
    [exerciseFinishedMutation, goToNextExercise, trpcUtils.workout.getWorkout, workout.exercises, workout.id]
  )

  const skipExercise = useCallback(
    async (pendingExerciseId: string, newExerciseId: string | null) => {
      if (newExerciseId) {
        const newExercise = await replaceExerciseMutation({
          workoutExerciseId: pendingExerciseId,
          replacementExerciseId: newExerciseId,
          workoutId: workout.id,
        })

        trpcUtils.workout.getWorkout.setData(undefined, workout => {
          if (!workout) {
            return workout
          }

          return {
            ...workout,
            exercises: workout.exercises.map(exercise => {
              if (exercise.id === pendingExerciseId) {
                return newExercise
              }

              return exercise
            }),
          }
        })

        await trpcUtils.workout.getWorkout.invalidate()
      } else {
        void trpcUtils.workout.getWorkout.invalidate()
        goToNextExercise(pendingExerciseId)
      }
    },
    [goToNextExercise, replaceExerciseMutation, trpcUtils.workout.getWorkout, workout.id]
  )

  const changeWeight = useCallback(
    async (workingExerciseId: string, weight: number) => {
      trpcUtils.workout.getWorkout.setData(undefined, workout => {
        if (!workout) {
          return workout
        }

        return {
          ...workout,
          exercises: workout.exercises.map(exercise => {
            if (exercise.id === workingExerciseId) {
              if (exercise.state === WorkoutExerciseState.pending) {
                return {
                  ...exercise,
                  sets: exercise.sets.map(set => {
                    return { ...set, weight }
                  }),
                }
              } else if (exercise.state === WorkoutExerciseState.testing) {
                return {
                  ...exercise,
                  testingWeight: weight,
                }
              } else {
                throw new Error('Illegal State - Exercise is not pending or testing')
              }
            }

            return exercise
          }),
        }
      })

      // Make the API call in the background
      try {
        await changeWeightMutation({
          workingExerciseId,
          workoutId: workout.id,
          weight,
        })
      } catch (error) {
        // If the API call fails, revert the optimistic update
        await trpcUtils.workout.getWorkout.invalidate()
        throw error
      }
    },
    [changeWeightMutation, trpcUtils.workout.getWorkout, workout.id]
  )

  const exerciseSetStateChanged = useCallback(
    async (workingExerciseId: string, setId: string, state: WorkingSetState) => {
      // Optimistically update the UI immediately
      trpcUtils.workout.getWorkout.setData(undefined, workout => {
        if (!workout) {
          return workout
        }

        return {
          ...workout,
          exercises: workout.exercises.map(exercise => {
            if (exercise.id === workingExerciseId) {
              const isAllowed = (
                workoutExercise: WorkingExercise
              ): workoutExercise is PendingWorkingExercise | LoadedWorkingExercise | TestedWorkingExercise => {
                const allowedStates = [
                  WorkoutExerciseState.loaded,
                  WorkoutExerciseState.tested,
                  WorkoutExerciseState.pending,
                ]

                return allowedStates.includes(workoutExercise.state)
              }

              if (!isAllowed(exercise)) {
                throw new Error('Illegal State - Exercise is not loaded, pending or testing')
              }

              return {
                ...exercise,
                sets: exercise.sets.map(set => {
                  if (set.id === setId) {
                    return { ...set, state } as const
                  }

                  return set
                }),
              }
            }

            return exercise
          }),
        }
      })

      // Make the API call in the background
      try {
        await exerciseSetStateChangedMutation({
          workoutId: workout.id,
          workoutExerciseId: workingExerciseId,
          setId,
          state,
        })
      } catch (error) {
        // If the API call fails, revert the optimistic update
        await trpcUtils.workout.getWorkout.invalidate()
        throw error
      }
    },
    [exerciseSetStateChangedMutation, trpcUtils.workout.getWorkout, workout.id]
  )

  return {
    exerciseLoaded,
    exerciseTested,
    testingSetsExerciseCompleted,
    exerciseDone,
    skipExercise,
    finishWorkout: finishWorkoutAndProvideFeedbackIfNeeded,
    exerciseSetStateChanged,
    changeWeight,
    workout,
    lifestyleFeedbackModal,
    onLifestyleFeedbackConfirm,
    isWorkoutFinished,
    unit: onboardingInfo.unit,
  }
}

export const useWorkoutContext = () => {
  const ctx = React.useContext(WorkoutContext)
  if (!ctx) {
    throw new Error('Missing WorkoutContext')
  }
  return ctx
}
