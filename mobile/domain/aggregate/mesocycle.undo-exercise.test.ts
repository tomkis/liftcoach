import { describe, expect, it } from 'vitest'
import { v4 } from 'uuid'

import { Mesocycle, WorkoutState } from '../microcycle'
import { MuscleGroup } from '../muscle-group'
import {
  ExerciseAssesmentScore,
  HardAssesmentTag,
  ProgressionType,
  WorkingExercise,
  WorkingSetState,
  WorkoutExerciseState,
} from '../working-exercise'
import { MesocycleAggregateRoot } from './mesocycle.aggregate-root'

const makeExercise = () => ({
  id: v4(),
  name: 'Bench Press',
  muscleGroup: MuscleGroup.Chest,
})

const makeSet = (overrides?: Record<string, unknown>) => ({
  id: v4(),
  state: WorkingSetState.pending,
  orderIndex: 0,
  weight: 60,
  reps: 10,
  ...overrides,
})

const makeFinishedExercise = (id: string) =>
  ({
    id,
    createdAt: '2026-02-01T00:00:00Z',
    exercise: makeExercise(),
    orderIndex: 0,
    targetSets: 3,
    targetReps: 10,
    state: WorkoutExerciseState.finished,
    sets: [
      makeSet({ state: WorkingSetState.done, orderIndex: 0 }),
      makeSet({ state: WorkingSetState.done, orderIndex: 1 }),
      makeSet({ state: WorkingSetState.failed, orderIndex: 2 }),
    ],
    assesment: ExerciseAssesmentScore.Ideal,
    hardAssesmentTag: null,
  }) as unknown as WorkingExercise

const makeFinishedExerciseHard = (id: string) =>
  ({
    id,
    createdAt: '2026-02-01T00:00:00Z',
    exercise: makeExercise(),
    orderIndex: 0,
    targetSets: 3,
    targetReps: 10,
    state: WorkoutExerciseState.finished,
    sets: [
      makeSet({ state: WorkingSetState.done, orderIndex: 0 }),
      makeSet({ state: WorkingSetState.done, orderIndex: 1 }),
      makeSet({ state: WorkingSetState.failed, orderIndex: 2 }),
    ],
    assesment: ExerciseAssesmentScore.Hard,
    hardAssesmentTag: HardAssesmentTag.TooHeavy,
  }) as unknown as WorkingExercise

const makeLoadedExercise = (id: string): WorkingExercise => ({
  id,
  createdAt: '2026-02-01T00:00:00Z',
  exercise: makeExercise(),
  orderIndex: 0,
  targetSets: 3,
  targetReps: 10,
  state: WorkoutExerciseState.loaded,
  loadingSet: { weight: 80, reps: 6 },
  sets: [
    makeSet({ state: WorkingSetState.pending, orderIndex: 0 }),
    makeSet({ state: WorkingSetState.pending, orderIndex: 1 }),
    makeSet({ state: WorkingSetState.pending, orderIndex: 2 }),
  ],
})

const makeTestedExercise = (id: string): WorkingExercise => ({
  id,
  createdAt: '2026-02-01T00:00:00Z',
  exercise: makeExercise(),
  orderIndex: 0,
  targetSets: 3,
  targetReps: 10,
  state: WorkoutExerciseState.tested,
  loadingSet: { weight: 80, reps: 6 },
  sets: [
    makeSet({ state: WorkingSetState.pending, orderIndex: 0 }),
    makeSet({ state: WorkingSetState.pending, orderIndex: 1 }),
    makeSet({ state: WorkingSetState.pending, orderIndex: 2 }),
  ],
})

const makePendingExercise = (id: string): WorkingExercise => ({
  id,
  createdAt: '2026-02-01T00:00:00Z',
  exercise: makeExercise(),
  orderIndex: 0,
  targetSets: 3,
  targetReps: 10,
  state: WorkoutExerciseState.pending,
  progressionType: ProgressionType.ProgressedReps,
  sets: [
    makeSet({ state: WorkingSetState.pending, orderIndex: 0 }),
    makeSet({ state: WorkingSetState.pending, orderIndex: 1 }),
    makeSet({ state: WorkingSetState.pending, orderIndex: 2 }),
  ],
})

const makeLoadingExercise = (id: string): WorkingExercise => ({
  id,
  createdAt: '2026-02-01T00:00:00Z',
  exercise: makeExercise(),
  orderIndex: 0,
  targetSets: 3,
  targetReps: 10,
  state: WorkoutExerciseState.loading,
  sets: [] as never[],
})

const makeTestingExercise = (id: string): WorkingExercise => ({
  id,
  createdAt: '2026-02-01T00:00:00Z',
  exercise: makeExercise(),
  orderIndex: 0,
  targetSets: 3,
  targetReps: 10,
  state: WorkoutExerciseState.testing,
  testingWeight: 60,
  sets: [] as never[],
})

const makeMesocycleWithAggregate = (exercises: WorkingExercise[], workoutOverrides?: Partial<{ state: WorkoutState; active: boolean }>) => {
  const microcycleId = v4()
  const workoutId = v4()

  const dto: Mesocycle = {
    id: v4(),
    createdAt: '2026-01-01T00:00:00Z',
    isConfirmed: true,
    microcycles: [
      {
        id: microcycleId,
        mesocycleId: v4(),
        createdAt: '2026-01-01T00:00:00Z',
        index: 0,
        workouts: [
          {
            id: workoutId,
            microcycleId,
            index: 0,
            state: workoutOverrides?.state ?? WorkoutState.pending,
            active: workoutOverrides?.active ?? true,
            exercises,
          },
        ],
      },
    ],
  }

  const aggregate = new MesocycleAggregateRoot(dto, 1)

  return { aggregate, dto, workoutId, microcycleId }
}

describe('undoExercise', () => {
  describe('happy paths', () => {
    it('undo finished → pending, sets reset, assessment cleared', () => {
      const exerciseId = v4()
      const { aggregate, dto } = makeMesocycleWithAggregate([makeFinishedExercise(exerciseId)])

      aggregate.undoExercise(exerciseId)

      const exercise = dto.microcycles[0].workouts[0].exercises[0] as Record<string, unknown>
      expect(exercise.state).toBe(WorkoutExerciseState.pending)
      expect((exercise.sets as Array<{ state: string }>).every(s => s.state === WorkingSetState.pending)).toBe(true)
      expect(exercise.assesment).toBeUndefined()
      expect(exercise.hardAssesmentTag).toBeUndefined()
      expect(exercise.exerciseAssesment).toBeUndefined()

      const eventTypes = aggregate.events.map(e => e.type)
      expect(eventTypes).toContain('ExerciseUpdated')
      expect(eventTypes).toContain('ExerciseFinishUndone')
    })

    it('undo loaded → loading, sets cleared, loadingSet cleared', () => {
      const exerciseId = v4()
      const { aggregate, dto } = makeMesocycleWithAggregate([makeLoadedExercise(exerciseId)])

      aggregate.undoExercise(exerciseId)

      const exercise = dto.microcycles[0].workouts[0].exercises[0] as Record<string, unknown>
      expect(exercise.state).toBe(WorkoutExerciseState.loading)
      expect(exercise.sets).toEqual([])
      expect(exercise.loadingSet).toBeUndefined()

      const eventTypes = aggregate.events.map(e => e.type)
      expect(eventTypes).toContain('ExerciseUpdated')
      expect(eventTypes).toContain('ExerciseLoadUndone')
    })

    it('undo tested → testing, sets cleared, loadingSet cleared', () => {
      const exerciseId = v4()
      const { aggregate, dto } = makeMesocycleWithAggregate([makeTestedExercise(exerciseId)])

      aggregate.undoExercise(exerciseId)

      const exercise = dto.microcycles[0].workouts[0].exercises[0] as Record<string, unknown>
      expect(exercise.state).toBe(WorkoutExerciseState.testing)
      expect(exercise.sets).toEqual([])
      expect(exercise.loadingSet).toBeUndefined()

      const eventTypes = aggregate.events.map(e => e.type)
      expect(eventTypes).toContain('ExerciseUpdated')
      expect(eventTypes).toContain('ExerciseTestUndone')
    })
  })

  describe('error cases', () => {
    it('throws when exercise not found', () => {
      const { aggregate } = makeMesocycleWithAggregate([makeFinishedExercise(v4())])

      expect(() => aggregate.undoExercise(v4())).toThrow('Exercise not found in the workout')
    })

    it('throws when exercise is pending', () => {
      const exerciseId = v4()
      const { aggregate } = makeMesocycleWithAggregate([makePendingExercise(exerciseId)])

      expect(() => aggregate.undoExercise(exerciseId)).toThrow('cant undo')
    })

    it('throws when exercise is loading', () => {
      const exerciseId = v4()
      const { aggregate } = makeMesocycleWithAggregate([makeLoadingExercise(exerciseId)])

      expect(() => aggregate.undoExercise(exerciseId)).toThrow('cant undo')
    })

    it('throws when exercise is testing', () => {
      const exerciseId = v4()
      const { aggregate } = makeMesocycleWithAggregate([makeTestingExercise(exerciseId)])

      expect(() => aggregate.undoExercise(exerciseId)).toThrow('cant undo')
    })

    it('throws when workout is already completed', () => {
      const exerciseId = v4()
      const { aggregate } = makeMesocycleWithAggregate([makeFinishedExercise(exerciseId)], {
        state: WorkoutState.completed,
        active: true,
      })

      expect(() => aggregate.undoExercise(exerciseId)).toThrow('Workout is already completed')
    })
  })

  describe('edge cases', () => {
    it('only targeted exercise is undone, others unchanged', () => {
      const targetId = v4()
      const otherId = v4()
      const { aggregate, dto } = makeMesocycleWithAggregate([
        makeFinishedExercise(targetId),
        makeLoadedExercise(otherId),
      ])

      aggregate.undoExercise(targetId)

      const target = dto.microcycles[0].workouts[0].exercises[0]
      const other = dto.microcycles[0].workouts[0].exercises[1]
      expect(target.state).toBe(WorkoutExerciseState.pending)
      expect(other.state).toBe(WorkoutExerciseState.loaded)
    })

    it('hard assessment tag cleared on undo finished', () => {
      const exerciseId = v4()
      const { aggregate, dto } = makeMesocycleWithAggregate([makeFinishedExerciseHard(exerciseId)])

      aggregate.undoExercise(exerciseId)

      const exercise = dto.microcycles[0].workouts[0].exercises[0] as Record<string, unknown>
      expect(exercise.state).toBe(WorkoutExerciseState.pending)
      expect(exercise.assesment).toBeUndefined()
      expect(exercise.hardAssesmentTag).toBeUndefined()
    })
  })
})
