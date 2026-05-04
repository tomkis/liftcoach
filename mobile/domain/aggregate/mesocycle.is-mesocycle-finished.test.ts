import { describe, expect, it } from 'vitest'
import { v4 } from 'uuid'

import { Mesocycle, WorkoutState } from '../microcycle'
import { MuscleGroup } from '../muscle-group'
import { Unit } from '../onboarding'
import { LoadingType } from '../weight-snapping'
import {
  ProgressionMode,
  WorkingExercise,
  WorkingSetState,
  WorkoutExerciseState,
} from '../working-exercise'
import { MesocycleAggregateRoot } from './mesocycle.aggregate-root'

const makeFinishedExercise = (): WorkingExercise => ({
  id: v4(),
  createdAt: '2026-02-01T00:00:00Z',
  exercise: {
    id: v4(),
    name: 'Squat',
    muscleGroup: MuscleGroup.Quads,
    loadingType: LoadingType.DoublePlates,
  },
  orderIndex: 0,
  targetSets: 3,
  targetReps: 10,
  state: WorkoutExerciseState.finished,
  exerciseAssesment: null,
  sets: [
    { id: v4(), state: WorkingSetState.done, orderIndex: 0, weight: 80, reps: 8 },
    { id: v4(), state: WorkingSetState.done, orderIndex: 1, weight: 80, reps: 8 },
    { id: v4(), state: WorkingSetState.done, orderIndex: 2, weight: 80, reps: 8 },
  ],
})

const makeMesocycle = (
  progressionMode: ProgressionMode,
  activeMicrocycleIndex: number
): MesocycleAggregateRoot => {
  const mesocycleId = v4()

  const finishedMicrocycles = Array.from({ length: activeMicrocycleIndex }, (_, i) => ({
    id: v4(),
    mesocycleId,
    createdAt: '2026-01-01T00:00:00Z',
    finishedAt: '2026-01-08T00:00:00Z',
    index: i,
    workouts: [
      {
        id: v4(),
        microcycleId: '',
        index: 0,
        state: WorkoutState.completed,
        active: false,
        exercises: [makeFinishedExercise()],
      },
    ],
  }))

  const activeMicrocycleId = v4()
  const activeMicrocycle = {
    id: activeMicrocycleId,
    mesocycleId,
    createdAt: '2026-01-01T00:00:00Z',
    index: activeMicrocycleIndex,
    workouts: [
      {
        id: v4(),
        microcycleId: activeMicrocycleId,
        index: 0,
        state: WorkoutState.completed,
        active: false,
        exercises: [makeFinishedExercise()],
      },
    ],
  }

  const dto: Mesocycle = {
    id: mesocycleId,
    createdAt: '2026-01-01T00:00:00Z',
    isConfirmed: true,
    unit: Unit.Metric,
    progressionMode,
    microcycles: [...finishedMicrocycles, activeMicrocycle],
  }

  return new MesocycleAggregateRoot(dto, 1)
}

describe('isMesocycleFinished', () => {
  describe('LiftCoach mode', () => {
    it('returns true at week 6 (index 5) when all workouts completed', () => {
      const aggregate = makeMesocycle(ProgressionMode.LiftCoach, 5)
      expect(aggregate.isMesocycleFinished()).toBe(true)
    })

    it('returns false at week 5 (index 4) even with all workouts completed', () => {
      const aggregate = makeMesocycle(ProgressionMode.LiftCoach, 4)
      expect(aggregate.isMesocycleFinished()).toBe(false)
    })
  })

  describe('Custom mode', () => {
    it('returns false at week 6 (index 5) — no fixed cap', () => {
      const aggregate = makeMesocycle(ProgressionMode.Custom, 5)
      expect(aggregate.isMesocycleFinished()).toBe(false)
    })

    it('returns false past week 6 (index 12) — open-ended', () => {
      const aggregate = makeMesocycle(ProgressionMode.Custom, 12)
      expect(aggregate.isMesocycleFinished()).toBe(false)
    })

    it('returns false at week 1 (index 0)', () => {
      const aggregate = makeMesocycle(ProgressionMode.Custom, 0)
      expect(aggregate.isMesocycleFinished()).toBe(false)
    })
  })
})
