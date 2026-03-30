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

const makeExercise = () => ({
  id: v4(),
  name: 'Squat',
  muscleGroup: MuscleGroup.Quads,
  loadingType: LoadingType.DoublePlates,
})

const makeFinishedCustomExercise = (overrides?: { weight?: number | null; reps?: number | null }): WorkingExercise => ({
  id: v4(),
  createdAt: '2026-02-01T00:00:00Z',
  exercise: makeExercise(),
  orderIndex: 0,
  targetSets: 3,
  targetReps: 10,
  state: WorkoutExerciseState.finished,
  exerciseAssesment: null,
  sets: [
    { id: v4(), state: WorkingSetState.done, orderIndex: 0, weight: overrides?.weight ?? 80, reps: overrides?.reps ?? 8 },
    { id: v4(), state: WorkingSetState.done, orderIndex: 1, weight: overrides?.weight ?? 80, reps: overrides?.reps ?? 8 },
    { id: v4(), state: WorkingSetState.failed, orderIndex: 2, weight: overrides?.weight ?? 80, reps: overrides?.reps ?? 8 },
  ],
})

const makeFinishedCustomExerciseBlank = (): WorkingExercise => ({
  id: v4(),
  createdAt: '2026-02-01T00:00:00Z',
  exercise: makeExercise(),
  orderIndex: 0,
  targetSets: 3,
  targetReps: 10,
  state: WorkoutExerciseState.finished,
  exerciseAssesment: null,
  sets: [
    { id: v4(), state: WorkingSetState.pending, orderIndex: 0, weight: null, reps: null },
    { id: v4(), state: WorkingSetState.pending, orderIndex: 1, weight: null, reps: null },
    { id: v4(), state: WorkingSetState.pending, orderIndex: 2, weight: null, reps: null },
  ],
})

const makeCustomMesocycle = (exercises: WorkingExercise[], microcycleIndex = 0): { dto: Mesocycle; aggregate: MesocycleAggregateRoot } => {
  const mesocycleId = v4()
  const microcycleId = v4()

  const dto: Mesocycle = {
    id: mesocycleId,
    createdAt: '2026-01-01T00:00:00Z',
    isConfirmed: true,
    unit: Unit.Metric,
    progressionMode: ProgressionMode.Custom,
    microcycles: [
      {
        id: microcycleId,
        mesocycleId,
        createdAt: '2026-01-01T00:00:00Z',
        index: microcycleIndex,
        workouts: [
          {
            id: v4(),
            microcycleId,
            index: 0,
            state: WorkoutState.completed,
            active: false,
            exercises,
          },
        ],
      },
    ],
  }

  return { dto, aggregate: new MesocycleAggregateRoot(dto, 1) }
}

describe('extendMicrocycle (custom progression)', () => {
  it('carry-forward: next week sets pre-filled with previous weight/reps', () => {
    const { aggregate, dto } = makeCustomMesocycle([makeFinishedCustomExercise({ weight: 80, reps: 8 })])

    aggregate.extendMicrocycle()

    const newMicrocycle = dto.microcycles.find(m => m.finishedAt === undefined)!
    expect(newMicrocycle).toBeDefined()
    expect(newMicrocycle.index).toBe(1)

    const exercise = newMicrocycle.workouts[0].exercises[0]
    expect(exercise.state).toBe(WorkoutExerciseState.pending)
    expect((exercise as { progressionType: string }).progressionType).toBe(ProgressionType.CustomUserProvided)
    expect(exercise.sets).toHaveLength(3)
    exercise.sets.forEach(set => {
      expect(set.state).toBe(WorkingSetState.pending)
      expect(set.weight).toBe(80)
      expect(set.reps).toBe(8)
    })
  })

  it('carry-forward: null weight/reps carry forward as null', () => {
    const { aggregate, dto } = makeCustomMesocycle([makeFinishedCustomExerciseBlank()])

    aggregate.extendMicrocycle()

    const newMicrocycle = dto.microcycles.find(m => m.finishedAt === undefined)!
    const exercise = newMicrocycle.workouts[0].exercises[0]

    exercise.sets.forEach(set => {
      expect(set.weight).toBeNull()
      expect(set.reps).toBeNull()
    })
  })

  it('emits MicrocycleFinished and MicrocycleExtended events', () => {
    const { aggregate } = makeCustomMesocycle([makeFinishedCustomExercise()])

    aggregate.extendMicrocycle()

    const eventTypes = aggregate.events.map(e => e.type)
    expect(eventTypes).toContain('MicrocycleFinished')
    expect(eventTypes).toContain('MicrocycleExtended')
  })

  it('increments microcycle index', () => {
    const { aggregate, dto } = makeCustomMesocycle([makeFinishedCustomExercise()], 2)

    aggregate.extendMicrocycle()

    const newMicrocycle = dto.microcycles.find(m => m.finishedAt === undefined)!
    expect(newMicrocycle.index).toBe(3)
  })
})
