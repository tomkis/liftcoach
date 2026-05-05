import { describe, expect, it } from 'vitest'
import { v4 } from 'uuid'

import { Mesocycle, WorkoutState } from '../microcycle'
import { MuscleGroup } from '../muscle-group'
import { Unit } from '../onboarding'
import { LoadingType } from '../weight-snapping'
import {
  ProgressionMode,
  ProgressionType,
  WorkingExercise,
  WorkingSetState,
  WorkoutExerciseState,
} from '../working-exercise'
import { MesocycleAggregateRoot } from './mesocycle.aggregate-root'

const makePendingCustomExercise = (): WorkingExercise & { state: WorkoutExerciseState.pending } => ({
  id: v4(),
  createdAt: '2026-02-01T00:00:00Z',
  exercise: {
    id: v4(),
    name: 'Bench Press',
    muscleGroup: MuscleGroup.Chest,
    loadingType: LoadingType.DoublePlates,
  },
  orderIndex: 0,
  targetSets: 3,
  targetReps: 8,
  state: WorkoutExerciseState.pending,
  progressionType: ProgressionType.CustomUserProvided,
  sets: [
    { id: 'set-1', state: WorkingSetState.pending, orderIndex: 0, weight: null, reps: null },
    { id: 'set-2', state: WorkingSetState.pending, orderIndex: 1, weight: 80, reps: 6 },
    { id: 'set-3', state: WorkingSetState.pending, orderIndex: 2, weight: null, reps: null },
  ],
})

const makeMesocycle = (
  progressionMode: ProgressionMode,
  exerciseOverride?: WorkingExercise
): { aggregate: MesocycleAggregateRoot; exerciseId: string; workoutId: string } => {
  const mesocycleId = v4()
  const microcycleId = v4()
  const workoutId = v4()
  const exercise = exerciseOverride ?? makePendingCustomExercise()

  const dto: Mesocycle = {
    id: mesocycleId,
    createdAt: '2026-01-01T00:00:00Z',
    isConfirmed: true,
    unit: Unit.Metric,
    progressionMode,
    microcycles: [
      {
        id: microcycleId,
        mesocycleId,
        createdAt: '2026-02-01T00:00:00Z',
        index: 0,
        workouts: [
          {
            id: workoutId,
            microcycleId,
            index: 0,
            state: WorkoutState.pending,
            active: true,
            exercises: [exercise],
          },
        ],
      },
    ],
  }

  return {
    aggregate: new MesocycleAggregateRoot(dto, 1),
    exerciseId: exercise.id,
    workoutId,
  }
}

describe('setWeightChanged', () => {
  it('emits ExerciseSetWeightChanged event with snapped weight', () => {
    const { aggregate, exerciseId } = makeMesocycle(ProgressionMode.Custom)

    aggregate.setWeightChanged(exerciseId, 'set-1', 82.5)

    const event = aggregate.events.find(e => e.type === 'ExerciseSetWeightChanged')
    expect(event).toBeDefined()
    if (event?.type !== 'ExerciseSetWeightChanged') throw new Error('wrong event')
    expect(event.payload.setId).toBe('set-1')
    expect(event.payload.weight).toBe(82.5)
  })

  it('snaps weight to loading-type increment', () => {
    const { aggregate, exerciseId } = makeMesocycle(ProgressionMode.Custom)

    aggregate.setWeightChanged(exerciseId, 'set-1', 82.3)

    const event = aggregate.events.find(e => e.type === 'ExerciseSetWeightChanged')
    if (event?.type !== 'ExerciseSetWeightChanged') throw new Error('wrong event')
    expect(event.payload.weight).toBe(82.5)
  })

  it('throws in LiftCoach mode', () => {
    const { aggregate, exerciseId } = makeMesocycle(ProgressionMode.LiftCoach)

    expect(() => aggregate.setWeightChanged(exerciseId, 'set-1', 80)).toThrow(
      /only allowed in Custom mode/
    )
  })

  it('throws when set does not exist', () => {
    const { aggregate, exerciseId } = makeMesocycle(ProgressionMode.Custom)

    expect(() => aggregate.setWeightChanged(exerciseId, 'unknown-set', 80)).toThrow(/Set not found/)
  })

  it('throws when exercise is finished', () => {
    const finishedExercise: WorkingExercise = {
      id: v4(),
      createdAt: '2026-02-01T00:00:00Z',
      exercise: {
        id: v4(),
        name: 'Bench Press',
        muscleGroup: MuscleGroup.Chest,
        loadingType: LoadingType.DoublePlates,
      },
      orderIndex: 0,
      targetSets: 1,
      targetReps: 8,
      state: WorkoutExerciseState.finished,
      exerciseAssesment: null,
      sets: [{ id: 'set-1', state: WorkingSetState.done, orderIndex: 0, weight: 80, reps: 8 }],
    }
    const { aggregate, exerciseId } = makeMesocycle(ProgressionMode.Custom, finishedExercise)

    expect(() => aggregate.setWeightChanged(exerciseId, 'set-1', 80)).toThrow(/non-pending/)
  })

  it('updates only the targeted set in aggregate state', () => {
    const { aggregate, exerciseId } = makeMesocycle(ProgressionMode.Custom)

    aggregate.setWeightChanged(exerciseId, 'set-1', 70)

    const event = aggregate.events.find(e => e.type === 'ExerciseSetWeightChanged')
    if (event?.type !== 'ExerciseSetWeightChanged') throw new Error('wrong event')
    expect(event.payload.weight).toBe(70)
  })
})

describe('setRepsChanged', () => {
  it('emits ExerciseSetRepsChanged event for the set', () => {
    const { aggregate, exerciseId } = makeMesocycle(ProgressionMode.Custom)

    aggregate.setRepsChanged(exerciseId, 'set-1', 12)

    const event = aggregate.events.find(e => e.type === 'ExerciseSetRepsChanged')
    expect(event).toBeDefined()
    if (event?.type !== 'ExerciseSetRepsChanged') throw new Error('wrong event')
    expect(event.payload.setId).toBe('set-1')
    expect(event.payload.reps).toBe(12)
  })

  it('throws in LiftCoach mode', () => {
    const { aggregate, exerciseId } = makeMesocycle(ProgressionMode.LiftCoach)

    expect(() => aggregate.setRepsChanged(exerciseId, 'set-1', 8)).toThrow(/only allowed in Custom mode/)
  })

  it('throws when set does not exist', () => {
    const { aggregate, exerciseId } = makeMesocycle(ProgressionMode.Custom)

    expect(() => aggregate.setRepsChanged(exerciseId, 'unknown-set', 8)).toThrow(/Set not found/)
  })
})
