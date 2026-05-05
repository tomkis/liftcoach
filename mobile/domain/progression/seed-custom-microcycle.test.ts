import { describe, expect, it } from 'vitest'
import { v4 } from 'uuid'

import { Microcycle, WorkoutState } from '../microcycle'
import { MuscleGroup } from '../muscle-group'
import {
  ProgressionType,
  WorkingExercise,
  WorkingSetState,
  WorkoutExerciseState,
} from '../working-exercise'
import { LoadingType } from '../weight-snapping'
import { buildCustomMicrocycleSeed } from './seed-custom-microcycle'

const makeExercise = (id: string, name = 'Squat') => ({
  id,
  name,
  muscleGroup: MuscleGroup.Quads,
  loadingType: LoadingType.DoublePlates,
})

const makeCustomFinished = (
  exerciseId: string,
  sets: Array<{ weight: number | null; reps: number | null }>
): WorkingExercise => ({
  id: v4(),
  createdAt: '2026-02-01T00:00:00Z',
  exercise: makeExercise(exerciseId),
  orderIndex: 0,
  targetSets: sets.length,
  targetReps: 10,
  state: WorkoutExerciseState.finished,
  exerciseAssesment: null,
  sets: sets.map((s, index) =>
    s.weight !== null && s.reps !== null
      ? {
          id: v4(),
          state: WorkingSetState.done,
          orderIndex: index,
          weight: s.weight,
          reps: s.reps,
        }
      : {
          id: v4(),
          state: WorkingSetState.pending,
          orderIndex: index,
          weight: s.weight,
          reps: s.reps,
        }
  ),
})

const makeCustomPending = (
  exerciseId: string,
  sets: Array<{ weight: number | null; reps: number | null }>
): WorkingExercise => ({
  id: v4(),
  createdAt: '2026-02-01T00:00:00Z',
  exercise: makeExercise(exerciseId),
  orderIndex: 0,
  targetSets: sets.length,
  targetReps: 10,
  state: WorkoutExerciseState.pending,
  progressionType: ProgressionType.CustomUserProvided,
  sets: sets.map((s, index) => ({
    id: v4(),
    state: WorkingSetState.pending,
    orderIndex: index,
    weight: s.weight,
    reps: s.reps,
  })),
})

const makeLcLoading = (exerciseId: string): WorkingExercise => ({
  id: v4(),
  createdAt: '2026-02-01T00:00:00Z',
  exercise: makeExercise(exerciseId),
  orderIndex: 0,
  targetSets: 3,
  targetReps: 10,
  state: WorkoutExerciseState.loading,
  sets: [],
})

const makeLcLoaded = (
  exerciseId: string,
  sets: Array<{ weight: number; reps: number }>
): WorkingExercise => ({
  id: v4(),
  createdAt: '2026-02-01T00:00:00Z',
  exercise: makeExercise(exerciseId),
  orderIndex: 0,
  targetSets: sets.length,
  targetReps: 10,
  state: WorkoutExerciseState.loaded,
  loadingSet: { weight: 100, reps: 8 },
  sets: sets.map((s, index) => ({
    id: v4(),
    state: WorkingSetState.pending,
    orderIndex: index,
    weight: s.weight,
    reps: s.reps,
  })),
})

const wrapInMicrocycle = (workouts: WorkingExercise[][]): Microcycle => {
  const microcycleId = v4()
  return {
    id: microcycleId,
    mesocycleId: v4(),
    createdAt: '2026-01-01T00:00:00Z',
    index: 0,
    workouts: workouts.map((exercises, index) => ({
      id: v4(),
      microcycleId,
      index,
      state: WorkoutState.completed,
      active: false,
      exercises,
    })),
  }
}

describe('buildCustomMicrocycleSeed', () => {
  it('returns empty map when prior microcycle has no exercises', () => {
    const seed = buildCustomMicrocycleSeed(wrapInMicrocycle([[]]))
    expect(seed.size).toBe(0)
  })

  it('seeds per-set weight and reps from custom-finished exercise', () => {
    const exerciseId = v4()
    const seed = buildCustomMicrocycleSeed(
      wrapInMicrocycle([
        [
          makeCustomFinished(exerciseId, [
            { weight: 100, reps: 5 },
            { weight: 80, reps: 8 },
            { weight: 70, reps: 10 },
          ]),
        ],
      ])
    )

    expect(seed.get(exerciseId)).toEqual([
      { orderIndex: 0, weight: 100, reps: 5 },
      { orderIndex: 1, weight: 80, reps: 8 },
      { orderIndex: 2, weight: 70, reps: 10 },
    ])
  })

  it('preserves nulls from custom-finished exercise with blank pending sets', () => {
    const exerciseId = v4()
    const seed = buildCustomMicrocycleSeed(
      wrapInMicrocycle([
        [
          makeCustomFinished(exerciseId, [
            { weight: null, reps: null },
            { weight: null, reps: null },
          ]),
        ],
      ])
    )

    expect(seed.get(exerciseId)).toEqual([
      { orderIndex: 0, weight: null, reps: null },
      { orderIndex: 1, weight: null, reps: null },
    ])
  })

  it('seeds from custom-pending exercise (mid-mesocycle terminate)', () => {
    const exerciseId = v4()
    const seed = buildCustomMicrocycleSeed(
      wrapInMicrocycle([
        [
          makeCustomPending(exerciseId, [
            { weight: 90, reps: 6 },
            { weight: 75, reps: 9 },
          ]),
        ],
      ])
    )

    expect(seed.get(exerciseId)).toEqual([
      { orderIndex: 0, weight: 90, reps: 6 },
      { orderIndex: 1, weight: 75, reps: 9 },
    ])
  })

  it('seeds across multiple workouts with distinct exercises', () => {
    const a = v4()
    const b = v4()
    const seed = buildCustomMicrocycleSeed(
      wrapInMicrocycle([
        [makeCustomFinished(a, [{ weight: 100, reps: 5 }])],
        [makeCustomFinished(b, [{ weight: 50, reps: 12 }])],
      ])
    )

    expect(seed.size).toBe(2)
    expect(seed.get(a)).toEqual([{ orderIndex: 0, weight: 100, reps: 5 }])
    expect(seed.get(b)).toEqual([{ orderIndex: 0, weight: 50, reps: 12 }])
  })

  it('first match wins when same exercise appears in multiple workouts', () => {
    const exerciseId = v4()
    const seed = buildCustomMicrocycleSeed(
      wrapInMicrocycle([
        [makeCustomFinished(exerciseId, [{ weight: 100, reps: 5 }])],
        [makeCustomFinished(exerciseId, [{ weight: 50, reps: 12 }])],
      ])
    )

    expect(seed.size).toBe(1)
    expect(seed.get(exerciseId)).toEqual([{ orderIndex: 0, weight: 100, reps: 5 }])
  })

  it('skips LC loading-state exercises (empty sets)', () => {
    const exerciseId = v4()
    const seed = buildCustomMicrocycleSeed(wrapInMicrocycle([[makeLcLoading(exerciseId)]]))
    expect(seed.size).toBe(0)
  })

  it('seeds from LC loaded-state exercise (calibration sets carry as working seed)', () => {
    const exerciseId = v4()
    const seed = buildCustomMicrocycleSeed(
      wrapInMicrocycle([
        [
          makeLcLoaded(exerciseId, [
            { weight: 60, reps: 10 },
            { weight: 60, reps: 10 },
            { weight: 60, reps: 10 },
          ]),
        ],
      ])
    )

    expect(seed.get(exerciseId)).toEqual([
      { orderIndex: 0, weight: 60, reps: 10 },
      { orderIndex: 1, weight: 60, reps: 10 },
      { orderIndex: 2, weight: 60, reps: 10 },
    ])
  })

  it('seeds LC-finished alongside Custom-finished in mixed prior (mode-switch path)', () => {
    const lcId = v4()
    const customId = v4()
    const seed = buildCustomMicrocycleSeed(
      wrapInMicrocycle([
        [
          makeCustomFinished(lcId, [
            { weight: 80, reps: 9 },
            { weight: 80, reps: 9 },
          ]),
          makeCustomFinished(customId, [{ weight: 110, reps: 4 }]),
        ],
      ])
    )

    expect(seed.size).toBe(2)
    expect(seed.get(lcId)).toEqual([
      { orderIndex: 0, weight: 80, reps: 9 },
      { orderIndex: 1, weight: 80, reps: 9 },
    ])
    expect(seed.get(customId)).toEqual([{ orderIndex: 0, weight: 110, reps: 4 }])
  })
})
