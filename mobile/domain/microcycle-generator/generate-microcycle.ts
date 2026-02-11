import { v4 } from 'uuid'

import { AuditTrail } from '../audit-trail'
import {
  Microcycle,
  MicrocycleGeneratorConfig,
  MicrocycleWorkout,
  MuscleGroupPriorities,
  WorkoutState,
} from '../microcycle'
import {
  MicrocycleMuscleGroup,
  MicrocycleWorkoutsTemplateWithExercises,
  ProvidedExercise,
  SplitType,
} from '../muscle-group'
import { OnboardedUser } from '../onboarding'
import { toDateTime } from '../utils/date'
import {
  FinishedWorkingExercise,
  LoadedWorkingExercise,
  TestedWorkingExercise,
  WorkoutExerciseState,
} from '../working-exercise'
import { calculateWeightFromLoadedExercise } from './calculate-weight-from-loaded-exercise'
import { ExercisePicker } from './exercise/exercise-picker'
import { ExerciseProvider } from './exercise/exercise-provider'
import { splitSelector } from './split/split-selector'
import { UserVolumeCalculator } from './user-volume-calculator'

class MicrocycleIdGenerated {
  public readonly type = 'MicrocycleIdGenerated'
  constructor(public readonly id: string) {}
}

class MicrocycleGeneratingStarted {
  public readonly type = 'MicrocycleGeneratingStarted'

  constructor(
    public readonly trainingDays: number,
    public readonly muscleGroupPriorities: MuscleGroupPriorities
  ) {}
}
class SplitSelected {
  public readonly type = 'SplitSelected'
  constructor(public readonly splitType: SplitType) {}
}

class MicrocycleFinalized {
  public readonly type = 'MicrocycleFinalized'
  constructor(public readonly workouts: Array<{ exercises: MicrocycleMuscleGroup }>) {}
}

type MicrocycleGeneratorEvent =
  | MicrocycleIdGenerated
  | MicrocycleGeneratingStarted
  | MicrocycleFinalized
  | SplitSelected

export class MicrocycleGenerator {
  private readonly userVolumeCalculator: UserVolumeCalculator

  constructor(
    private readonly onboardedUser: OnboardedUser,
    private readonly config: MicrocycleGeneratorConfig,
    private readonly trail: AuditTrail
  ) {
    this.userVolumeCalculator = new UserVolumeCalculator(this.trail, this.config as any, this.onboardedUser)
  }

  getNumberOfTrainingDays() {
    const trainingDays = this.onboardedUser.trainingFrequency

    if (trainingDays === 'twoDays') {
      return 2
    } else if (trainingDays === 'threeDays') {
      return 3
    } else if (trainingDays === 'fourDays') {
      return 4
    } else if (trainingDays === 'fiveDays') {
      return 5
    } else if (trainingDays === 'sixDays') {
      return 6
    } else if (trainingDays === 'sevenDays') {
      return 7
    } else {
      throw new Error('Invalid training frequency')
    }
  }

  createMicrocycle(
    mesocycleId: string,
    microcycleId: string,
    template: MicrocycleWorkoutsTemplateWithExercises,
    executedExercises: Array<FinishedWorkingExercise | LoadedWorkingExercise | TestedWorkingExercise>,
    userCoefficient: number
  ) {
    const microcycleWorkouts: MicrocycleWorkout[] = template.map((workout, index) => ({
      id: v4(),
      state: WorkoutState.pending,
      microcycleId,
      index,
      orderIndex: index,
      active: false,
      exercises: workout.exercises.map((exercise, exerciseIndex) => {
        const executedExercise = executedExercises.find(
          executedExercise =>
            executedExercise.exercise.id === exercise.exercise.id &&
            (executedExercise.state === WorkoutExerciseState.loaded ||
              executedExercise.state === WorkoutExerciseState.tested)
        )
        const createdAt = toDateTime(new Date())
        const id = v4()

        if (!executedExercise) {
          return {
            id,
            createdAt,
            state: WorkoutExerciseState.loading,
            exercise: { id: exercise.exercise.id, name: exercise.exercise.name, muscleGroup: exercise.muscleGroup },
            targetSets: exercise.sets,
            targetReps: exercise.targetReps,
            orderIndex: exerciseIndex,
            sets: [],
          }
        } else {
          if (
            executedExercise.state === WorkoutExerciseState.loaded ||
            executedExercise.state === WorkoutExerciseState.tested
          ) {
            const weight = calculateWeightFromLoadedExercise(
              {
                loadingSet: executedExercise.loadingSet,
                targetReps: 8,
              },
              10,
              userCoefficient
            )

            return {
              id,
              createdAt,
              state: WorkoutExerciseState.testing,
              exercise: { id: exercise.exercise.id, name: exercise.exercise.name, muscleGroup: exercise.muscleGroup },
              orderIndex: exerciseIndex,
              targetSets: exercise.sets,
              targetReps: exercise.targetReps,
              testingWeight: weight,
              sets: [],
            }
          } else {
            throw new Error('Unknown exercise state')
          }
        }
      }),
    }))

    const generatedMicrocycle = {
      mesocycleId,
      workouts: microcycleWorkouts,
      id: microcycleId,
      index: 0,
      createdAt: toDateTime(new Date()),
    }
    return generatedMicrocycle
  }

  async generateMicrocycle(
    mesocycleId: string,
    executedExercises: Array<FinishedWorkingExercise | LoadedWorkingExercise | TestedWorkingExercise>,
    availableExercises: ProvidedExercise[],
    userCoefficient: number
  ): Promise<Microcycle> {
    const microcycleId = v4()

    this.dispatch(new MicrocycleIdGenerated(microcycleId))

    const trainingDays = this.getNumberOfTrainingDays()
    const volumePerMuscleGroup = this.userVolumeCalculator.getVolumePerMuscleGroup(trainingDays)

    const provider = new ExerciseProvider(availableExercises)
    const exercisePicker = new ExercisePicker(provider)
    const onboardedUser = this.onboardedUser

    async function getFinalizedWorkouts(self: MicrocycleGenerator) {
      const split = splitSelector(volumePerMuscleGroup, trainingDays)
      if (!split) {
        throw new Error('No reasonable split found.')
      } else {
        const workouts = split.split
        self.dispatch(new SplitSelected(split.type))

        const finalizedWorkouts = await exercisePicker.pickExercises(workouts, onboardedUser.liftingExperience)
        return finalizedWorkouts
      }
    }

    const finalizedWorkouts = await getFinalizedWorkouts(this)
    this.dispatch(new MicrocycleFinalized(finalizedWorkouts))

    return this.createMicrocycle(mesocycleId, microcycleId, finalizedWorkouts, executedExercises, userCoefficient)
  }

  dispatch(ev: MicrocycleGeneratorEvent) {
    this.trail.dispatch(ev)
  }
}
