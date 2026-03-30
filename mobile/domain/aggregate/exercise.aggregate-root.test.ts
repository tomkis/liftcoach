import { describe, expect, it } from 'vitest'

import { MuscleGroup } from '../muscle-group'
import { ExerciseAggregateRoot } from './exercise.aggregate-root'

const base = {
  id: 'ex-1',
  name: 'Squat',
  muscleGroup: MuscleGroup.Quads,
}

describe('ExerciseAggregateRoot.toLibraryItem', () => {
  describe('no history', () => {
    it('returns doneInPast: false when both histories empty', () => {
      const root = new ExerciseAggregateRoot({ ...base, loadingHistory: [], workingSetHistory: [] })
      const item = root.toLibraryItem()
      expect(item.doneInPast).toBe(false)
    })
  })

  describe('workingSetHistory only (custom mode)', () => {
    it('returns E1RM from single week, no progressState', () => {
      const root = new ExerciseAggregateRoot({
        ...base,
        loadingHistory: [],
        workingSetHistory: [{ weight: 100, reps: 5 }],
      })
      const item = root.toLibraryItem()
      expect(item.doneInPast).toBe(true)
      if (!item.doneInPast) return
      expect(item.estimatedOneRepMax).toBe(Math.round(100 * (1 + 5 / 30)))
      expect(item.progressState).toBeNull()
    })

    it('computes progressState as progressing across two weeks', () => {
      const root = new ExerciseAggregateRoot({
        ...base,
        loadingHistory: [],
        workingSetHistory: [
          { weight: 110, reps: 5 },
          { weight: 100, reps: 5 },
        ],
      })
      const item = root.toLibraryItem()
      expect(item.doneInPast).toBe(true)
      if (!item.doneInPast) return
      expect(item.progressState).toBe('progressing')
    })

    it('computes progressState as regressing across two weeks', () => {
      const root = new ExerciseAggregateRoot({
        ...base,
        loadingHistory: [],
        workingSetHistory: [
          { weight: 90, reps: 5 },
          { weight: 100, reps: 5 },
        ],
      })
      const item = root.toLibraryItem()
      expect(item.doneInPast).toBe(true)
      if (!item.doneInPast) return
      expect(item.progressState).toBe('regressing')
    })
  })

  describe('loadingHistory only (liftcoach mode)', () => {
    it('uses loadingHistory when workingSetHistory is empty', () => {
      const root = new ExerciseAggregateRoot({
        ...base,
        loadingHistory: [{ weight: 120, reps: 3 }],
        workingSetHistory: [],
      })
      const item = root.toLibraryItem()
      expect(item.doneInPast).toBe(true)
      if (!item.doneInPast) return
      expect(item.estimatedOneRepMax).toBe(Math.round(120 * (1 + 3 / 30)))
    })
  })

  describe('both histories present (mode switch)', () => {
    it('picks workingSetHistory when it has higher E1RM', () => {
      const root = new ExerciseAggregateRoot({
        ...base,
        loadingHistory: [{ weight: 100, reps: 5 }],
        workingSetHistory: [{ weight: 130, reps: 5 }],
      })
      const item = root.toLibraryItem()
      expect(item.doneInPast).toBe(true)
      if (!item.doneInPast) return
      expect(item.estimatedOneRepMax).toBe(Math.round(130 * (1 + 5 / 30)))
    })

    it('picks loadingHistory when it has higher E1RM', () => {
      const root = new ExerciseAggregateRoot({
        ...base,
        loadingHistory: [{ weight: 150, reps: 5 }],
        workingSetHistory: [{ weight: 100, reps: 5 }],
      })
      const item = root.toLibraryItem()
      expect(item.doneInPast).toBe(true)
      if (!item.doneInPast) return
      expect(item.estimatedOneRepMax).toBe(Math.round(150 * (1 + 5 / 30)))
    })
  })
})
