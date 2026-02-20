import { differenceInDays, parse } from 'date-fns'
import { match } from 'ts-pattern'
import { v4 } from 'uuid'

import {
  FailureSetsInsight,
  LiftCoachInsight,
  LiftCoachInsights,
  LiftedWeightInsight,
  PerformedSetsInsight,
  ProgressStalledSuboptimalLifestyleInsight,
} from '../dashboard'
import {
  ActivePlanSummary,
  CycleProgress,
  CycleProgressState,
  LifestyleFeedback,
  Mesocycle as MesocycleType,
  Microcycle,
  MicrocycleWorkout,
  WorkoutState,
  WorkoutStats,
} from '../microcycle'
import {
  calculate1RMEplay,
  calculateRepsFromLoadedExercise,
  calculateWeightFromLoadedExercise,
} from '../microcycle-generator/calculate-weight-from-loaded-exercise'
import { ExerciseProvider } from '../microcycle-generator/exercise/exercise-provider'
import { ProvidedExercise } from '../muscle-group'
import { applySetProgression, getRepsForCycle } from '../progression/apply-set-progression'
import { getProgressionType } from '../progression/get-progression-type'
import { HistoricalResult } from '../user/user.types'
import { dateTimeFormat, toDateTime } from '../utils/date'
import {
  Exercise,
  ExerciseAssesment,
  ExerciseAssesmentScore,
  FinishedWorkingExercise,
  LoadedWorkingExercise,
  LoadingSet,
  PendingWorkingExercise,
  ProgressionType,
  TestedWorkingExercise,
  WorkingExercise,
  WorkingSetState,
  WorkoutExerciseState,
} from '../working-exercise'
import { MesocycleEvent } from './mesocycle.events'

const TRAINING_WEEKS = 5

export class MesocycleAggregateRoot {
  public readonly events: MesocycleEvent[] = []

  constructor(
    private readonly mesocycleDTO: MesocycleType,
    private readonly userCoefficient: number
  ) {
    this.checkInvariants()
  }

  private isWorkoutExerciseFinished(workoutExercise: WorkingExercise) {
    return [WorkoutExerciseState.finished, WorkoutExerciseState.tested, WorkoutExerciseState.loaded].includes(
      workoutExercise.state
    )
  }

  private getAllPastFinishedExercises(
    exercise: WorkingExercise
  ): Array<{ exercise: FinishedWorkingExercise; lifestyleFeedback: LifestyleFeedback | null }> {
    const allPastResults: Array<{ exercise: FinishedWorkingExercise; lifestyleFeedback: LifestyleFeedback | null }> =
      this.mesocycleDTO.microcycles
        .flatMap(microcycle =>
          microcycle.workouts.flatMap(workout => {
            const matchingExercise = workout.exercises.find(e => e.exercise.id === exercise.exercise.id)

            if (matchingExercise) {
              return { exercise: matchingExercise, lifestyleFeedback: workout.lifestyleFeedback ?? null }
            }

            return null
          })
        )
        .filter(e => e !== null && e.exercise.state === WorkoutExerciseState.finished) as Array<{
        exercise: FinishedWorkingExercise
        lifestyleFeedback: LifestyleFeedback | null
      }>

    return allPastResults.sort((a, b) => {
      const aCreated = a.exercise.createdAt
      const bCreated = b.exercise.createdAt

      if (aCreated === null) {
        return 1
      }

      if (bCreated === null) {
        return -1
      }

      return new Date(aCreated).getTime() - new Date(bCreated).getTime()
    })
  }

  checkInvariants() {
    if (this.mesocycleDTO.microcycles.length === 0) {
      return
    }

    const activeMicrocycle = this.getActiveMicrocycle()

    activeMicrocycle.workouts.forEach(workout => {
      const allExercisesFinished = workout.exercises.every(this.isWorkoutExerciseFinished)

      if (workout.state === WorkoutState.completed && !allExercisesFinished) {
        throw new Error('Workout is completed but not all exercises are finished')
      }
    })
  }

  isConfirmed() {
    return this.mesocycleDTO.isConfirmed
  }

  finishExercise(exerciseId: string, exerciseAssesment: ExerciseAssesment) {
    const activeWorkout = this.getActiveWorkout()
    const exercise = activeWorkout.exercises.find(exercise => exercise.id === exerciseId)
    if (!exercise) {
      throw new Error('Exercise not found in the workout')
    }

    if (exercise.state !== WorkoutExerciseState.pending) {
      console.log(exercise)
      throw new Error(`Exercise is not pending, cant finish it (${exercise.state})`)
    }

    const pendingSets = exercise.sets.filter(set => set.state === WorkingSetState.pending)
    pendingSets.forEach(set => {
      this.apply({
        type: 'SetStateHasChanged',
        payload: {
          workoutExerciseId: exercise.id,
          setId: set.id,
          state: WorkingSetState.failed,
          workoutId: activeWorkout.id,
          microcycleId: activeWorkout.microcycleId,
        },
      })
    })

    this.apply({
      type: 'ExerciseUpdated',
      payload: {
        workoutExerciseId: exercise.id,
        workoutId: activeWorkout.id,
        microcycleId: activeWorkout.microcycleId,
      },
    })
    this.apply({
      type: 'ExerciseFinished',
      payload: {
        exerciseId,
        when: toDateTime(new Date()),
        microcycleId: activeWorkout.microcycleId,
        workoutId: activeWorkout.id,
        exerciseAssesment,
      },
    })
  }

  finishWorkout(workoutId: string, lifestyleFeedback?: LifestyleFeedback) {
    const microcycle = this.getMicrocycleForWorkout(workoutId)
    if (!microcycle) {
      throw new Error('Microcycle for workout to be finished not found')
    }

    const workout = microcycle.workouts.find(workout => workout.id === workoutId)
    if (!workout) {
      throw new Error('Workout not found in the microcycle')
    }
    if (workout.state === WorkoutState.completed) {
      throw new Error('Workout is already finished')
    }

    const loadedOrTested = workout.exercises.filter(e =>
      [WorkoutExerciseState.loaded, WorkoutExerciseState.tested].includes(e.state)
    )

    loadedOrTested.forEach(exercise => {
      const pendingSets = exercise.sets.filter(set => set.state === WorkingSetState.pending)

      pendingSets.forEach(set => {
        this.apply({
          type: 'SetStateHasChanged',
          payload: {
            workoutExerciseId: exercise.id,
            setId: set.id,
            state: WorkingSetState.failed,
            workoutId,
            microcycleId: microcycle.id,
          },
        })
      })
    })

    if (!workout.exercises.every(this.isWorkoutExerciseFinished)) {
      throw new Error('Workout has pending exercises, cant finish it.')
    }

    if (lifestyleFeedback) {
      this.apply({
        type: 'LifestyleFeedbackProvided',
        payload: { lifestyleFeedback, microcycleId: microcycle.id, workoutId },
      })
    }

    this.apply({
      type: 'WorkoutFinished',
      payload: { workoutId, when: toDateTime(new Date()), microcycleId: microcycle.id },
    })
  }

  finishMesocycle(lastTestingResults: Map<string, number>) {
    const newMesocycleId = v4()
    const newMicrocycleId = v4()

    const findLastTestingWeight = (expectedExercise: Exercise) => {
      const lastTestingResult = lastTestingResults.get(expectedExercise.id)
      if (lastTestingResult === undefined) {
        throw new Error('Last testing result not found')
      }

      return lastTestingResult
    }

    const newMicrocycle: Microcycle = {
      id: newMicrocycleId,
      mesocycleId: newMesocycleId,
      createdAt: toDateTime(new Date()),
      index: 0,
      workouts: this.getActiveMicrocycle().workouts.map(workout => {
        return {
          id: v4(),
          microcycleId: newMicrocycleId,
          index: workout.index,
          state: WorkoutState.pending,
          active: false,
          exercises: workout.exercises.map(exercise => {
            return {
              id: v4(),
              createdAt: toDateTime(new Date()),
              state: WorkoutExerciseState.testing,
              exercise: exercise.exercise,
              orderIndex: exercise.orderIndex,
              targetSets: exercise.targetSets,
              targetReps: exercise.targetReps,
              testingWeight: findLastTestingWeight(exercise.exercise),
              sets: [],
            }
          }),
        }
      }),
    }

    const microcycle = this.getActiveMicrocycle()

    this.apply({
      type: 'MicrocycleFinished',
      payload: { microcycleId: microcycle.id, when: toDateTime(new Date()) },
    })
    this.apply({
      type: 'MesocycleFinished',
      payload: { mesocycleId: this.mesocycleDTO.id, when: toDateTime(new Date()) },
    })

    return newMicrocycle
  }

  extendMicrocycle() {
    const activeMicrocycle = this.getActiveMicrocycle()
    if (activeMicrocycle.finishedAt) {
      throw new Error('Microcycle has already been finished, cant extend it.')
    }

    const currentCycleIndex = this.getCurrentCycleIndex()

    this.apply({
      type: 'MicrocycleFinished',
      payload: { microcycleId: activeMicrocycle.id, when: toDateTime(new Date()) },
    })

    const applyProgression = (
      exercise: WorkingExercise,
      pastExerciseResults: Array<{ exercise: FinishedWorkingExercise; lifestyleFeedback: LifestyleFeedback | null }>
    ): WorkingExercise => {
      if (exercise.state === 'loading') {
        throw new Error("Exercise is loading, progression can't be applied")
      }

      if (exercise.state === 'pending') {
        throw new Error("Exercise is pending, progression can't be applied")
      }

      if (exercise.state === 'testing') {
        throw new Error("Exercise is testing, progression can't be applied")
      }

      if (exercise.state === 'loaded' || exercise.state === 'tested') {
        if (!exercise.loadingSet) {
          throw new Error('Exercise is loaded but loading set is not provided')
        }

        const progressionType = ProgressionType.ProgressedReps
        const loadingSet = exercise.loadingSet

        return {
          ...exercise,
          createdAt: toDateTime(new Date()),
          state: WorkoutExerciseState.pending,
          progressionType,
          sets: Array.from({ length: exercise.targetSets }).map((_, index) => {
            const repCount = getRepsForCycle(currentCycleIndex)

            return {
              id: v4(),
              state: WorkingSetState.pending,
              weight: calculateWeightFromLoadedExercise({ loadingSet, targetReps: repCount }, 6, this.userCoefficient),
              orderIndex: index,
              reps: repCount,
            }
          }),
        }
      } else if (exercise.state === 'finished') {
        const progressionType = getProgressionType(pastExerciseResults)
        const eachSetSame = new Set(exercise.sets.map(set => `${set.reps}-${set.weight}`)).size === 1

        if (!eachSetSame) {
          throw new Error('Exercise has different values - illegal state')
        }

        return {
          ...exercise,
          createdAt: toDateTime(new Date()),
          state: WorkoutExerciseState.pending,
          progressionType,
          sets: exercise.sets.map(set => {
            const lastReps = pastExerciseResults[pastExerciseResults.length - 1].exercise.sets[0].reps
            const progressionResult = applySetProgression(progressionType, lastReps, set)

            return {
              id: v4(),
              orderIndex: set.orderIndex,
              state: WorkingSetState.pending,
              weight: progressionResult.weight,
              reps: progressionResult.reps,
            }
          }),
        }
      }

      throw new Error('Illegal State')
    }

    const newMicrocycleId = v4()

    const newMicrocycle: Microcycle = {
      id: newMicrocycleId,
      mesocycleId: activeMicrocycle.mesocycleId,
      createdAt: toDateTime(new Date()),
      index: activeMicrocycle.index + 1,
      workouts: activeMicrocycle.workouts.map(workout => {
        const newWorkout: MicrocycleWorkout = {
          id: v4(),
          active: false,
          microcycleId: newMicrocycleId,
          state: WorkoutState.pending,
          index: workout.index,
          exercises: workout.exercises.map(e => {
            return {
              ...applyProgression(e, this.getAllPastFinishedExercises(e)),
              id: v4(),
            }
          }),
        }

        return newWorkout
      }),
    }

    this.apply({ type: 'MicrocycleExtended', payload: { newMicrocycle } })
  }

  isActiveMicrocycleFinished() {
    const activeMicrocycle = this.getActiveMicrocycle()
    return activeMicrocycle.workouts.every(workout => workout.state === WorkoutState.completed)
  }

  isMesocycleFinished() {
    const activeMicrocycle = this.getActiveMicrocycle()
    const activeMicrocycleIndex = this.mesocycleDTO.microcycles
      .sort((a, b) => a.index - b.index)
      .findIndex(microcycle => microcycle.id === activeMicrocycle.id)

    const allWorkoutsFinished = activeMicrocycle.workouts.every(workout => workout.state === WorkoutState.completed)
    const finished = allWorkoutsFinished && activeMicrocycleIndex === 5

    console.debug('Is mesocycle finished?', { finished, allWorkoutsFinished, activeMicrocycleIndex })

    return finished
  }

  getActiveMicrocycle() {
    if (this.mesocycleDTO.microcycles.length === 0) {
      throw new Error('There are no microcycles in the mesocycle')
    }

    const microcycle = this.mesocycleDTO.microcycles.find(microcycle => !microcycle.finishedAt)
    if (!microcycle) {
      throw new Error('There is no active microcycle')
    }

    return microcycle
  }

  getLastCompletedWorkout() {
    const activeMicrocycle = this.getActiveMicrocycle()
    const lastCompletedWorkout = activeMicrocycle.workouts
      .sort((a, b) => b.index - a.index)
      .find(workout => workout.state === WorkoutState.completed)

    if (!lastCompletedWorkout) {
      throw new Error('There is no completed workout')
    }

    return lastCompletedWorkout
  }

  getNextActiveWorkout(): MicrocycleWorkout | null {
    const activeMicrocycle = this.getActiveMicrocycle()
    const [activeWorkout] = activeMicrocycle.workouts
      .sort((a, b) => a.index - b.index)
      .filter(workout => workout.state === WorkoutState.pending && !workout.active)

    if (!activeWorkout) {
      return null
    }

    return activeWorkout
  }

  hasActiveWorkout() {
    return this.getActiveMicrocycle().workouts.some(workout => workout.active)
  }

  startWorkout() {
    if (this.hasActiveWorkout()) {
      throw new Error('There is already an active workout')
    }
    const nextActiveWorkout = this.getNextActiveWorkout()
    if (!nextActiveWorkout) {
      throw new Error('Trying to start workout when there is no next active workout')
    }

    this.apply({
      type: 'WorkoutStarted',
      payload: { workoutId: nextActiveWorkout.id, microcycleId: nextActiveWorkout.microcycleId },
    })
  }

  getActiveWorkout() {
    const activeMicrocycle = this.getActiveMicrocycle()
    const [activeWorkout] = activeMicrocycle.workouts
      .sort((a, b) => a.index - b.index)
      .filter(workout => workout.active)

    if (!activeWorkout) {
      throw new Error('No active workout found')
    }

    return activeWorkout
  }

  getWorkoutStats(historicalResults: Array<LoadedWorkingExercise | TestedWorkingExercise>): WorkoutStats | null {
    const activeWorkout = this.getNextActiveWorkout()
    if (!activeWorkout) {
      return null
    }

    const exercises = activeWorkout.exercises.map(exercise => {
      return match(exercise)
        .with({ state: WorkoutExerciseState.testing }, () => {
          return {
            exercise: exercise.exercise,
            sets: exercise.targetSets,
            reps: exercise.targetReps,
            weight: null,
            lastTested1Rm: null,
            projected1Rm: null,
            exerciseStatus: null,
          }
        })
        .with({ state: WorkoutExerciseState.loading }, () => {
          return {
            exercise: exercise.exercise,
            sets: exercise.targetSets,
            reps: exercise.targetReps,
            weight: null,
            lastTested1Rm: null,
            projected1Rm: null,
            exerciseStatus: null,
          }
        })
        .with({ state: WorkoutExerciseState.pending }, () => {
          const historicalResult = historicalResults.find(result => result.exercise.id === exercise.exercise.id)
          if (!historicalResult) {
            throw new Error('Historical result not found')
          }

          const firstSet = exercise.sets[0]
          if (!firstSet) {
            throw new Error('First set not found')
          }

          return {
            exercise: exercise.exercise,
            sets: exercise.targetSets,
            reps: firstSet.reps,
            weight: firstSet.weight,
            lastTested1Rm: calculate1RMEplay(historicalResult.loadingSet.weight, historicalResult.loadingSet.reps),
            projected1Rm: calculate1RMEplay(firstSet.weight, firstSet.reps),
            exerciseStatus: ProgressionType.ProgressedReps,
          }
        })
        .otherwise(exercise => {
          throw new Error('Illegal State - ' + exercise.state)
        })
    })

    return {
      exercises,
      currentWeek: this.getCurrentCycleIndex() + 1,
      currentWeekProgress: this.getCurrentMicrocycleIndex() + 1,
    }
  }

  getActivePlanSummary(): ActivePlanSummary {
    const activeMicrocycle = this.getActiveMicrocycle()
    const workoutsPerWeek = activeMicrocycle.workouts.length
    const cycleIndex = this.getCurrentCycleIndex()
    const completedInCurrentMicrocycle = activeMicrocycle.workouts.filter(
      w => w.state === WorkoutState.completed
    ).length

    return {
      splitType: `${workoutsPerWeek}-Day Split`,
      currentWeek: cycleIndex + 1,
      totalWeeks: TRAINING_WEEKS + 1,
      trainingDaysPerWeek: workoutsPerWeek,
      workoutsCompleted: cycleIndex * workoutsPerWeek + completedInCurrentMicrocycle,
      totalWorkouts: (TRAINING_WEEKS + 1) * workoutsPerWeek,
    }
  }

  terminateMesocycle() {
    const pendingMicrocycles = this.mesocycleDTO.microcycles.filter(microcycle => !microcycle.finishedAt)
    pendingMicrocycles.forEach(microcycle => {
      const pendingWorkouts = microcycle.workouts.filter(workout => workout.state === WorkoutState.pending)

      pendingWorkouts.forEach(workout => {
        const pendingExercises = workout.exercises.filter(e => !this.isWorkoutExerciseFinished(e))

        pendingExercises.forEach(exercise => {
          const pendingSets = exercise.sets.filter(set => set.state === WorkingSetState.pending)

          pendingSets.forEach(set => {
            this.apply({
              type: 'SetStateHasChanged',
              payload: {
                workoutExerciseId: exercise.id,
                setId: set.id,
                state: WorkingSetState.failed,
                workoutId: workout.id,
                microcycleId: microcycle.id,
              },
            })
          })
        })

        this.apply({
          type: 'WorkoutFinished',
          payload: { workoutId: workout.id, microcycleId: microcycle.id, when: toDateTime(new Date()) },
        })
      })
    })

    pendingMicrocycles.forEach(microcycle => {
      this.apply({
        type: 'MicrocycleFinished',
        payload: { microcycleId: microcycle.id, when: toDateTime(new Date()) },
      })
    })

    this.apply({ type: 'MesocycleTerminated', payload: { id: this.mesocycleDTO.id, when: toDateTime(new Date()) } })
  }

  initializeMesocycle(microcycle: Microcycle, isConfirmed: boolean) {
    this.apply({
      type: 'MesocycleInitialized',
      payload: { microcycle, mesocycleId: microcycle.mesocycleId, when: this.mesocycleDTO.createdAt, isConfirmed },
    })
  }

  exerciseLoaded(exerciseId: string, loadingSet: LoadingSet, reachedFailure: boolean) {
    const activeWorkout = this.getActiveWorkout()

    const exercise = activeWorkout.exercises.find(exercise => exercise.id === exerciseId)
    if (!exercise) {
      throw new Error('Exercise not found in the workout')
    }

    if (exercise.state !== WorkoutExerciseState.loading) {
      throw new Error('Cant load non-loading exercise')
    }

    this.apply({
      type: 'ExerciseUpdated',
      payload: { workoutExerciseId: exerciseId, workoutId: activeWorkout.id, microcycleId: activeWorkout.microcycleId },
    })
    this.apply({
      type: 'ExerciseLoaded',
      payload: { exerciseId, loadingSet, workoutId: activeWorkout.id, microcycleId: activeWorkout.microcycleId },
    })

    this.generateCalibrationSets(exercise, loadingSet, reachedFailure ? 7 : 8)
  }

  exerciseTested(exerciseId: string, loadingSet: LoadingSet) {
    const activeWorkout = this.getActiveWorkout()

    const exercise = activeWorkout.exercises.find(exercise => exercise.id === exerciseId)
    if (!exercise) {
      throw new Error('Exercise not found in the workout')
    }

    if (exercise.state !== WorkoutExerciseState.testing) {
      throw new Error('Cant test non-testing exercise')
    }

    this.apply({
      type: 'ExerciseUpdated',
      payload: { workoutExerciseId: exerciseId, workoutId: activeWorkout.id, microcycleId: activeWorkout.microcycleId },
    })
    this.apply({
      type: 'ExerciseTested',
      payload: { exerciseId, loadingSet, workoutId: activeWorkout.id, microcycleId: activeWorkout.microcycleId },
    })

    this.generateCalibrationSets(exercise, loadingSet, 8)
  }

  private generateCalibrationSets(exercise: WorkingExercise, loadingSet: LoadingSet, targetRpe: number) {
    const activeWorkout = this.getActiveWorkout()
    const targetReps = 10

    const targetWeight = calculateWeightFromLoadedExercise({ loadingSet, targetReps }, targetRpe, this.userCoefficient)

    const sets = Array.from({ length: exercise.targetSets }).map((_, index) => ({
      id: v4(),
      state: WorkingSetState.pending,
      weight: targetWeight,
      reps: targetReps,
      orderIndex: index,
    }))

    this.apply({
      type: 'TestingSetsGenerated',
      payload: { exerciseId: exercise.id, sets, workoutId: activeWorkout.id, microcycleId: activeWorkout.microcycleId },
    })
  }

  replaceExercise(
    workoutExerciseId: string,
    replacingExercise: { exercise: Exercise & { id: string }; historicalResult: HistoricalResult | null },
    workoutId: string
  ): WorkingExercise {
    const getReplacingWorkout = () => {
      const replacingInWorkout = this.mesocycleDTO.microcycles
        .flatMap(microcycle => microcycle.workouts)
        .find(workout => workout.id === workoutId)
      if (!replacingInWorkout) {
        throw new Error('Workout not found')
      }

      return replacingInWorkout
    }

    const replacingInWorkout = getReplacingWorkout()
    const [originalExercise] = this.mesocycleDTO.microcycles
      .flatMap(microcycle => {
        return microcycle.workouts
          .flatMap(workout => {
            return workout.exercises.find(exercise => exercise.id === workoutExerciseId)
          })
          .filter(Boolean)
      })
      .filter(Boolean)

    if (!originalExercise) {
      throw new Error('Exercise not found in the mesocycle')
    }

    if (
      ![WorkoutExerciseState.pending, WorkoutExerciseState.testing, WorkoutExerciseState.loading].includes(
        originalExercise.state
      )
    ) {
      throw new Error('Cant replace finished exercise')
    }

    const getNewExercise = (): WorkingExercise => {
      const replacingExerciseBase = {
        id: v4(),
        createdAt: toDateTime(new Date()),
        exercise: replacingExercise.exercise,
        orderIndex: originalExercise.orderIndex,
        targetSets: originalExercise.targetSets,
        targetReps: originalExercise.targetReps,
      }

      const historicalResult = replacingExercise.historicalResult
      if (historicalResult === null) {
        return {
          ...replacingExerciseBase,
          state: WorkoutExerciseState.loading,
          sets: [],
        }
      }

      return match(originalExercise)
        .with({ state: WorkoutExerciseState.testing }, () => {
          const targetWeight = calculateWeightFromLoadedExercise(
            {
              loadingSet: {
                weight: historicalResult.loadedWeight,
                reps: historicalResult.loadedReps,
              },
              targetReps: 8,
            },
            10,
            this.userCoefficient
          )

          return {
            ...replacingExerciseBase,
            state: WorkoutExerciseState.testing,
            testingWeight: targetWeight,
            sets: [] as never[],
          } as const
        })
        .with({ state: WorkoutExerciseState.loading }, () => {
          const targetWeight = calculateWeightFromLoadedExercise(
            {
              loadingSet: {
                weight: historicalResult.loadedWeight,
                reps: historicalResult.loadedReps,
              },
              targetReps: 8,
            },
            10,
            this.userCoefficient
          )

          return {
            ...replacingExerciseBase,
            state: WorkoutExerciseState.testing,
            testingWeight: targetWeight,
            sets: [] as never[],
          } as const
        })
        .with({ state: WorkoutExerciseState.pending }, ({ sets }) => {
          const allRepsAreTheSame = new Set(originalExercise.sets.map(set => set.reps)).size === 1
          if (!allRepsAreTheSame) {
            throw new Error('All reps are not the same, cant replace exercise')
          }

          const repsForReplacement = sets[0].reps

          const targetWeight = calculateWeightFromLoadedExercise(
            {
              loadingSet: {
                weight: historicalResult.loadedWeight,
                reps: historicalResult.loadedReps,
              },
              targetReps: historicalResult.targetReps,
            },
            6,
            this.userCoefficient
          )

          const newExercise: PendingWorkingExercise = {
            ...replacingExerciseBase,
            state: WorkoutExerciseState.pending,
            progressionType: ProgressionType.ProgressedReps,
            sets: Array.from({ length: originalExercise.targetSets }).map((_, index) => {
              return {
                id: v4(),
                state: WorkingSetState.pending,
                weight: targetWeight,
                reps: repsForReplacement,
                orderIndex: index,
              }
            }),
          }

          return newExercise
        })
        .otherwise(() => {
          throw new Error('Illegal state')
        })
    }
    const workingExercise = getNewExercise()

    this.apply({
      type: 'ExerciseUpdated',
      payload: { workoutExerciseId, workoutId: replacingInWorkout.id, microcycleId: replacingInWorkout.microcycleId },
    })
    this.apply({
      type: 'ExerciseReplaced',
      payload: {
        workoutExerciseId,
        newExercise: workingExercise,
        workoutId: replacingInWorkout.id,
        microcycleId: replacingInWorkout.microcycleId,
      },
    })

    return workingExercise
  }

  exerciseWeightChanged(workoutExerciseId: string, weight: number, historicalResults: HistoricalResult | null) {
    const activeWorkout = this.getActiveWorkout()

    const exercise = activeWorkout.exercises.find(exercise => exercise.id === workoutExerciseId)
    if (!exercise) {
      throw new Error('Exercise not found in the workout')
    }
    this.apply({
      type: 'ExerciseUpdated',
      payload: { workoutExerciseId, workoutId: activeWorkout.id, microcycleId: activeWorkout.microcycleId },
    })

    if (exercise.state === WorkoutExerciseState.pending) {
      // TODO: Make it smarter
      if (!historicalResults) {
        throw new Error('Historical result not found')
      }
      const newReps = calculateRepsFromLoadedExercise(
        {
          loadingSet: {
            weight: historicalResults.loadedWeight,
            reps: historicalResults.loadedReps,
          },
          targetWeight: weight,
        },
        this.getCurrentRpe()
      )

      if (newReps === null) {
        throw new Error("Couldn't resolve new rep count.")
      }

      if (newReps !== exercise.sets[0].reps) {
        this.apply({
          type: 'ExerciseRepsChangedDueToWeightChange',
          payload: {
            workoutExerciseId,
            newReps,
            workoutId: activeWorkout.id,
            microcycleId: activeWorkout.microcycleId,
          },
        })
      }

      this.apply({
        type: 'ExerciseWeightChangedPending',
        payload: { workoutExerciseId, weight, workoutId: activeWorkout.id, microcycleId: activeWorkout.microcycleId },
      })
    } else if (exercise.state === WorkoutExerciseState.testing) {
      this.apply({
        type: 'ExerciseWeightChangedTesting',
        payload: { workoutExerciseId, weight, workoutId: activeWorkout.id, microcycleId: activeWorkout.microcycleId },
      })
    } else {
      throw new Error('Cant change weight of non-pending or testing exercise')
    }
  }

  // TODO: this is wrong (works just for admins, should not be here)
  adminChangeWeight(microcycleId: string, workoutId: string, workoutExerciseId: string, weight: number) {
    const exercise = this.mesocycleDTO.microcycles
      .flatMap(microcycle =>
        microcycle.workouts.filter(workout => workout.id === workoutId).flatMap(workout => workout.exercises)
      )
      .find(workoutExercise => workoutExercise.id === workoutExerciseId)

    if (!exercise) {
      throw new Error('Could not find exercise')
    }

    if (exercise.state !== WorkoutExerciseState.pending) {
      throw new Error('Cant change weight of non-pending exercise')
    }

    this.apply({
      type: 'ExerciseWeightChangedPending',
      payload: { workoutExerciseId, weight, workoutId, microcycleId: microcycleId },
    })
  }

  setStateHasChanged(workoutExerciseId: string, setId: string, state: WorkingSetState) {
    const activeWorkout = this.getActiveWorkout()

    if (activeWorkout.state !== WorkoutState.pending) {
      throw new Error('Cant set state of non-pending workout')
    }

    const exercise = activeWorkout.exercises.find(exercise => exercise.id === workoutExerciseId)
    if (!exercise) {
      throw new Error('Exercise not found in the workout')
    }

    if (
      ![WorkoutExerciseState.pending, WorkoutExerciseState.loaded, WorkoutExerciseState.tested].includes(exercise.state)
    ) {
      throw new Error('Cant set state of non-pending or loaded exercise')
    }

    const set = exercise.sets.find(set => set.id === setId)
    if (!set) {
      throw new Error('Set not found in the exercise')
    }

    this.apply({
      type: 'ExerciseUpdated',
      payload: { workoutExerciseId, workoutId: activeWorkout.id, microcycleId: activeWorkout.microcycleId },
    })

    this.apply({
      type: 'SetStateHasChanged',
      payload: {
        workoutExerciseId,
        setId,
        state,
        workoutId: activeWorkout.id,
        microcycleId: activeWorkout.microcycleId,
      },
    })
  }

  private getExerciseResultInMesocycle(id: string) {
    return this.mesocycleDTO.microcycles.flatMap(microcycle =>
      microcycle.workouts
        .map(workout => workout.exercises.find(exercise => exercise.exercise.id === id))
        .filter(Boolean)
    )
  }

  getRollingAverageVolume() {
    const currentWorkouts = this.mesocycleDTO.microcycles
      .filter((_, index) => index > 0)
      .flatMap(microcycle => microcycle.workouts.filter(workout => workout.state === WorkoutState.completed))

    if (this.mesocycleDTO.microcycles.length < 2) {
      return null
    }

    const startOfMicrocycle = this.mesocycleDTO.microcycles[1].createdAt

    const totalSets = currentWorkouts.reduce(
      (acc, workout) => acc + workout.exercises.flatMap(exercise => exercise.sets).length,
      0
    )

    const daysOfTraining = differenceInDays(new Date(), parse(startOfMicrocycle, dateTimeFormat, new Date())) + 2

    if (daysOfTraining < 7) {
      return null
    }

    if (totalSets === 0) {
      return null
    }

    return Math.round(totalSets / daysOfTraining)
  }

  getWeeklyPerformedSetsInsight(): PerformedSetsInsight {
    const microcycle = this.getActiveMicrocycle()
    const totalSets = microcycle.workouts.flatMap(workout =>
      workout.exercises
        .filter(e => [WorkoutExerciseState.finished, WorkoutExerciseState.pending].includes(e.state))
        .flatMap(exercise => exercise.sets)
    ).length

    const performedSets = microcycle.workouts.flatMap(workout =>
      workout.exercises
        .filter(e => [WorkoutExerciseState.finished, WorkoutExerciseState.pending].includes(e.state))
        .flatMap(exercise => exercise.sets.filter(set => set.state === WorkingSetState.done))
    ).length

    return {
      type: 'PERFORMED_SETS',
      totalSets,
      performedSets,
    }
  }

  getWeeklyLiftedWeightInsight(): LiftedWeightInsight {
    const microcycle = this.getActiveMicrocycle()

    const totalWeight = microcycle.workouts
      .flatMap(workout =>
        workout.exercises
          .filter(e => [WorkoutExerciseState.finished, WorkoutExerciseState.pending].includes(e.state))
          .flatMap(exercise => exercise.sets)
      )
      .reduce((acc, set) => acc + set.weight * set.reps, 0)

    const liftedWeight = microcycle.workouts
      .flatMap(workout =>
        workout.exercises
          .filter(e => [WorkoutExerciseState.finished, WorkoutExerciseState.pending].includes(e.state))
          .flatMap(exercise => exercise.sets.filter(set => set.state === WorkingSetState.done))
      )
      .reduce((acc, set) => acc + set.weight * set.reps, 0)

    return {
      type: 'LIFTED_WEIGHT',
      totalWeight,
      liftedWeight,
    }
  }

  getWeeklyFailureSetsInsight(): FailureSetsInsight | null {
    const reachedFailure = this.getActiveMicrocycle().workouts.some(workout =>
      workout.exercises.some(
        e => e.state === WorkoutExerciseState.pending && e.progressionType === ProgressionType.NoProgressFailure
      )
    )

    if (reachedFailure) {
      return {
        type: 'PROGRESS_STALLED_FAILURE',
      }
    }

    return null
  }

  getWeeklyProgressStalledSuboptimalLifestyle(): ProgressStalledSuboptimalLifestyleInsight | null {
    const progressStalled = this.getActiveMicrocycle().workouts.some(workout =>
      workout.exercises.some(
        e =>
          e.state === WorkoutExerciseState.pending &&
          e.progressionType === ProgressionType.KeepProgressSuboptimalLifestyle
      )
    )

    if (progressStalled) {
      return {
        type: 'PROGRESS_STALLED_SUBOPTIMAL_LIFESTYLE',
      }
    }

    return null
  }

  getLiftCoachInsights(): LiftCoachInsights {
    const weekIndex = this.getCurrentCycleIndex()

    if (weekIndex === 0) {
      return {
        subtitle: 'Testing Week',
        insights: [{ type: 'TESTING_WEEK' }],
      }
    } else if (weekIndex === 1) {
      return {
        subtitle: 'First Training Week',
        insights: [{ type: 'FIRST_WEEK' }],
      }
    } else if (weekIndex === 2) {
      return {
        subtitle: 'Second Training Week',
        insights: [
          { type: 'SECOND_WEEK' },
          this.getWeeklyLiftedWeightInsight(),
          this.getWeeklyPerformedSetsInsight(),
          this.getWeeklyFailureSetsInsight(),
          this.getWeeklyProgressStalledSuboptimalLifestyle(),
        ].filter(Boolean) as LiftCoachInsight[],
      }
    } else if (weekIndex === 3) {
      return {
        subtitle: 'Third Training Week',
        insights: [
          { type: 'THIRD_WEEK' },
          this.getWeeklyLiftedWeightInsight(),
          this.getWeeklyPerformedSetsInsight(),
          this.getWeeklyFailureSetsInsight(),
          this.getWeeklyProgressStalledSuboptimalLifestyle(),
        ].filter(Boolean) as LiftCoachInsight[],
      }
    } else if (weekIndex === 4) {
      return {
        subtitle: 'Fourth Training Week',
        insights: [
          { type: 'FOURTH_WEEK' },
          this.getWeeklyLiftedWeightInsight(),
          this.getWeeklyPerformedSetsInsight(),
          this.getWeeklyFailureSetsInsight(),
          this.getWeeklyProgressStalledSuboptimalLifestyle(),
        ].filter(Boolean) as LiftCoachInsight[],
      }
    } else if (weekIndex === 5) {
      return {
        subtitle: 'Last Training Week',
        insights: [
          { type: 'LAST_WEEK' },
          this.getWeeklyLiftedWeightInsight(),
          this.getWeeklyPerformedSetsInsight(),
          this.getWeeklyFailureSetsInsight(),
          this.getWeeklyProgressStalledSuboptimalLifestyle(),
        ].filter(Boolean) as LiftCoachInsight[],
      }
    }

    throw new Error('No insights for this week')
  }

  getCurrentCycleIndex() {
    return Math.min(
      TRAINING_WEEKS,
      this.mesocycleDTO.microcycles.findIndex(microcycle => microcycle.id === this.getActiveMicrocycle().id)
    )
  }

  getCurrentRpe() {
    return Math.round(7 + this.getCurrentCycleIndex() / 12)
  }

  getCurrentMicrocycleIndex() {
    const micro = this.getActiveMicrocycle()
    return micro.workouts.findIndex(w => w.state === WorkoutState.pending)
  }

  getCycleProgressForExercise(exerciseId: string): CycleProgress {
    const results = this.getExerciseResultInMesocycle(exerciseId)
    const cycleLength = TRAINING_WEEKS + 1

    const firstResult = results[0]
    if (!firstResult) {
      throw new Error('No exercise found in the mesocycle')
    }

    const progress = Array(cycleLength)
      .fill(null)
      .map((_, index) => {
        if (index < results.length) {
          const exercise = results[index]
          if (!exercise) {
            throw new Error('Exercise not found in the mesocycle')
          }

          if (!this.isWorkoutExerciseFinished(exercise)) {
            return {
              sets: Array.from({ length: firstResult.targetSets }).map(() => CycleProgressState.pending),
              isTesting: false,
            }
          }

          const isTesting =
            exercise.state === WorkoutExerciseState.loaded || exercise.state === WorkoutExerciseState.tested

          if (isTesting) {
            return {
              sets: Array.from({ length: firstResult.targetSets }).map(() => CycleProgressState.completed),
              isTesting: true,
            }
          }

          return {
            sets: exercise.sets.map(set => {
              switch (set.state) {
                case WorkingSetState.done:
                  return CycleProgressState.completed
                case WorkingSetState.failed:
                  return CycleProgressState.failed
                case WorkingSetState.pending:
                  return CycleProgressState.pending
                default:
                  throw new Error('Illegal state')
              }
            }),
            isTesting: false,
          }
        } else {
          return {
            sets: Array.from({ length: firstResult.targetSets }).map(() => CycleProgressState.pending),
            isTesting: false,
          }
        }
      })

    return progress
  }

  proposeExerciseReplacement(workoutExerciseId: string, exercises: ProvidedExercise[]) {
    const [exercise] = this.mesocycleDTO.microcycles
      .flatMap(microcycle =>
        microcycle.workouts.flatMap(workout => workout.exercises.find(exercise => exercise.id === workoutExerciseId))
      )
      .filter(Boolean)

    if (!exercise) {
      throw new Error('Exercise not found in the mesocycle')
    }

    const allSelectedExercises = Array.from(
      new Set(
        this.mesocycleDTO.microcycles
          .flatMap(microcycle => microcycle.workouts.flatMap(workout => workout.exercises))
          .map(exercise => exercise.exercise.id)
      )
    )

    const exerciseProvider = new ExerciseProvider(exercises)
    const replacementExercises = exerciseProvider.replaceExercise(
      exercise.exercise.id,
      exercise.exercise.muscleGroup,
      allSelectedExercises
    )

    return replacementExercises
  }

  confirmMesocycle() {
    this.apply({
      type: 'MesocycleConfirmed',
      payload: {
        mesocycleId: this.mesocycleDTO.id,
      },
    })
  }

  private getMicrocycleForWorkout(workoutId: string) {
    return this.mesocycleDTO.microcycles.find(microcycle =>
      microcycle.workouts.some(workout => workout.id === workoutId)
    )
  }

  private apply(event: MesocycleEvent) {
    this.events.push(event)

    const updateMicrocycleWorkout = (
      microcycleId: string,
      workoutId: string,
      update: (workout: MicrocycleWorkout) => MicrocycleWorkout
    ) => {
      this.mesocycleDTO.microcycles = this.mesocycleDTO.microcycles.map(microcycle => {
        if (microcycle.id === microcycleId) {
          return {
            ...microcycle,
            workouts: microcycle.workouts.map(workout => {
              if (workout.id === workoutId) {
                return update(workout)
              }

              return workout
            }),
          }
        }

        return microcycle
      })
    }

    match(event)
      .with({ type: 'WorkoutFinished' }, event => {
        updateMicrocycleWorkout(event.payload.microcycleId, event.payload.workoutId, workout => {
          workout.state = WorkoutState.completed
          workout.active = false

          return workout
        })
      })
      .with({ type: 'MicrocycleExtended' }, event => {
        this.mesocycleDTO.microcycles.push(event.payload.newMicrocycle)
      })
      .with({ type: 'MicrocycleFinished' }, event => {
        this.mesocycleDTO.microcycles = this.mesocycleDTO.microcycles.map(microcycle => {
          if (microcycle.id === event.payload.microcycleId) {
            return { ...microcycle, finishedAt: event.payload.when }
          }

          return microcycle
        })
      })
      .with({ type: 'MesocycleTerminated' }, event => {
        this.mesocycleDTO.finishedAt = event.payload.when
      })
      .with({ type: 'MesocycleInitialized' }, event => {
        this.mesocycleDTO.id = event.payload.mesocycleId
        this.mesocycleDTO.createdAt = event.payload.when
        this.mesocycleDTO.finishedAt = undefined
        this.mesocycleDTO.microcycles = [event.payload.microcycle]
      })
      .with({ type: 'MesocycleFinished' }, event => {
        this.mesocycleDTO.finishedAt = event.payload.when
      })
      .with({ type: 'ExerciseLoaded' }, event => {
        updateMicrocycleWorkout(event.payload.microcycleId, event.payload.workoutId, workout => {
          return {
            ...workout,
            exercises: workout.exercises.map(exercise => {
              if (exercise.id === event.payload.exerciseId) {
                return { ...exercise, state: WorkoutExerciseState.loaded, loadingSet: event.payload.loadingSet }
              }

              return exercise
            }),
          } as MicrocycleWorkout
        })
      })
      .with({ type: 'ExerciseTested' }, event => {
        updateMicrocycleWorkout(event.payload.microcycleId, event.payload.workoutId, workout => {
          return {
            ...workout,
            exercises: workout.exercises.map(exercise => {
              if (exercise.id === event.payload.exerciseId) {
                return { ...exercise, state: WorkoutExerciseState.tested, loadingSet: event.payload.loadingSet }
              }

              return exercise
            }),
          } as MicrocycleWorkout
        })
      })
      .with({ type: 'ExerciseFinished' }, event => {
        updateMicrocycleWorkout(event.payload.microcycleId, event.payload.workoutId, workout => {
          return {
            ...workout,
            exercises: workout.exercises.map(exercise => {
              if (exercise.id === event.payload.exerciseId) {
                const assessmentData = match(event.payload.exerciseAssesment)
                  .with({ assesment: ExerciseAssesmentScore.Hard }, assessment => ({
                    assesment: assessment.assesment,
                    hardAssesmentTag: assessment.assesmentTag,
                  }))
                  .with({ assesment: ExerciseAssesmentScore.Ideal }, assessment => ({
                    assesment: assessment.assesment,
                    hardAssesmentTag: null,
                  }))
                  .exhaustive()

                return {
                  ...exercise,
                  state: WorkoutExerciseState.finished,
                  ...assessmentData,
                }
              }

              return exercise
            }),
          } as MicrocycleWorkout
        })
      })
      .with({ type: 'ExerciseReplaced' }, event => {
        updateMicrocycleWorkout(event.payload.microcycleId, event.payload.workoutId, workout => {
          return {
            ...workout,
            exercises: workout.exercises.map(exercise => {
              if (exercise.id === event.payload.workoutExerciseId) {
                return event.payload.newExercise
              }

              return exercise
            }),
          }
        })
      })
      .with({ type: 'SetStateHasChanged' }, event => {
        updateMicrocycleWorkout(event.payload.microcycleId, event.payload.workoutId, workout => {
          return {
            ...workout,
            exercises: workout.exercises.map(exercise => {
              if (exercise.id === event.payload.workoutExerciseId) {
                return {
                  ...exercise,
                  sets: exercise.sets.map(set => {
                    if (set.id === event.payload.setId) {
                      return { ...set, state: event.payload.state }
                    }
                    return set
                  }),
                }
              }
              return exercise
            }),
          } as MicrocycleWorkout
        })
      })
      .with({ type: 'ExerciseRepsChangedDueToWeightChange' }, event => {
        updateMicrocycleWorkout(event.payload.microcycleId, event.payload.workoutId, workout => {
          return {
            ...workout,
            exercises: workout.exercises.map(exercise => {
              if (exercise.id === event.payload.workoutExerciseId) {
                return {
                  ...exercise,
                  sets: exercise.sets.map(set => {
                    return { ...set, reps: event.payload.newReps }
                  }),
                }
              }

              return exercise
            }),
          } as MicrocycleWorkout
        })
      })
      .with({ type: 'ExerciseWeightChangedPending' }, event => {
        updateMicrocycleWorkout(event.payload.microcycleId, event.payload.workoutId, workout => {
          return {
            ...workout,
            exercises: workout.exercises.map(exercise => {
              if (exercise.id === event.payload.workoutExerciseId) {
                return {
                  ...exercise,
                  sets: exercise.sets.map(set => {
                    return { ...set, weight: event.payload.weight }
                  }),
                }
              }

              return exercise
            }),
          } as MicrocycleWorkout
        })
      })
      .with({ type: 'ExerciseUpdated' }, event => {
        updateMicrocycleWorkout(event.payload.microcycleId, event.payload.workoutId, workout => {
          return {
            ...workout,
            exercises: workout.exercises.map(exercise => {
              if (exercise.id === event.payload.workoutExerciseId) {
                return {
                  ...exercise,
                  updatedAt: new Date(),
                }
              }

              return exercise
            }),
          } as MicrocycleWorkout
        })
      })
      .with({ type: 'ExerciseWeightChangedTesting' }, event => {
        updateMicrocycleWorkout(event.payload.microcycleId, event.payload.workoutId, workout => {
          return {
            ...workout,
            exercises: workout.exercises.map(exercise => {
              if (exercise.id === event.payload.workoutExerciseId) {
                if (exercise.state !== WorkoutExerciseState.testing) {
                  throw new Error('Exercise is not in testing state')
                }

                return {
                  ...exercise,
                  testingWeight: event.payload.weight,
                }
              }

              return exercise
            }),
          } as MicrocycleWorkout
        })
      })
      .with({ type: 'LifestyleFeedbackProvided' }, event => {
        updateMicrocycleWorkout(event.payload.microcycleId, event.payload.workoutId, workout => {
          return {
            ...workout,
            lifestyleFeedback: event.payload.lifestyleFeedback,
          } as MicrocycleWorkout
        })
      })
      .with({ type: 'WorkoutStarted' }, event => {
        updateMicrocycleWorkout(event.payload.microcycleId, event.payload.workoutId, workout => {
          return { ...workout, active: true }
        })
      })
      .with({ type: 'MesocycleConfirmed' }, () => {
        this.mesocycleDTO.isConfirmed = true
      })
      .with({ type: 'TestingSetsGenerated' }, event => {
        updateMicrocycleWorkout(event.payload.microcycleId, event.payload.workoutId, workout => {
          return {
            ...workout,
            exercises: workout.exercises.map(exercise => {
              if (exercise.id === event.payload.exerciseId) {
                return { ...exercise, sets: event.payload.sets }
              }
            }),
          } as MicrocycleWorkout
        })
      })
      .exhaustive()
  }
}
