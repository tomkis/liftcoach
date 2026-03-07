import { describe, expect, it } from 'vitest'

import { Unit } from '../onboarding'
import { LoadingType } from '../weight-snapping'
import { calculateWeightFromLoadedExercise } from './calculate-weight-from-loaded-exercise'

const doublePlates = LoadingType.DoublePlates
const metric = Unit.Metric

describe('calculateWeightFromLoadedExercise', () => {
  it('20kg 8 reps failure → valid snapped weight (real user scenario)', () => {
    const coefficients = [0.85, 0.95, 1, 1.05, 1.06, 1.1]

    for (const coeff of coefficients) {
      const result = calculateWeightFromLoadedExercise(
        { loadingSet: { weight: 20, reps: 8 }, targetReps: 10 },
        7,
        coeff,
        doublePlates,
        metric
      )

      expect(result % 2.5, `coeff ${coeff} → ${result}`).toBe(0)
    }
  })

  it('always proposes snapped weights when loaded with integer weight', () => {
    const result = calculateWeightFromLoadedExercise(
      { loadingSet: { weight: 20, reps: 8 }, targetReps: 8 },
      8,
      1,
      doublePlates,
      metric
    )

    expect(result % 2.5).toBe(0)
  })

  it('always proposes snapped weights when loaded with fractional weight', () => {
    const result = calculateWeightFromLoadedExercise(
      { loadingSet: { weight: 17.5, reps: 8 }, targetReps: 8 },
      8,
      1,
      doublePlates,
      metric
    )

    expect(result % 2.5).toBe(0)
  })

  it('proposes snapped weights across various RPE targets', () => {
    const rpeValues = [6, 7, 8, 9, 10] as const

    for (const rpe of rpeValues) {
      const result = calculateWeightFromLoadedExercise(
        { loadingSet: { weight: 62.5, reps: 10 }, targetReps: 8 },
        rpe,
        1,
        doublePlates,
        metric
      )

      expect(result % 2.5, `RPE ${rpe} → ${result}`).toBe(0)
    }
  })

  it('proposes snapped weights with user coefficient', () => {
    const result = calculateWeightFromLoadedExercise(
      { loadingSet: { weight: 50, reps: 8 }, targetReps: 10 },
      8,
      0.85,
      doublePlates,
      metric
    )

    expect(result % 2.5).toBe(0)
  })

  it('never proposes non-snapped values regardless of input combination', () => {
    const weights = [10, 12.5, 20, 30, 42.5, 60, 80, 100]
    const reps = [5, 8, 10, 12]
    const rpeValues = [6, 7, 8, 9, 10]
    const coefficients = [0.85, 1, 1.06, 1.15]

    for (const w of weights) {
      for (const r of reps) {
        for (const rpe of rpeValues) {
          for (const coeff of coefficients) {
            const result = calculateWeightFromLoadedExercise(
              { loadingSet: { weight: w, reps: r }, targetReps: 8 },
              rpe,
              coeff,
              doublePlates,
              metric
            )

            expect(
              result % 2.5,
              `w=${w} r=${r} rpe=${rpe} coeff=${coeff} → ${result}`
            ).toBe(0)
          }
        }
      }
    }
  })

  it('snaps to dumbbell increments when loading type is dumbbell', () => {
    const result = calculateWeightFromLoadedExercise(
      { loadingSet: { weight: 12, reps: 10 }, targetReps: 10 },
      8,
      1,
      LoadingType.Dumbbell,
      metric
    )

    expect(result % 1).toBe(0)
  })

  it('snaps to stack increments when loading type is stack', () => {
    const result = calculateWeightFromLoadedExercise(
      { loadingSet: { weight: 50, reps: 8 }, targetReps: 10 },
      8,
      1,
      LoadingType.Stack,
      metric
    )

    expect(result % 2.5).toBe(0)
  })
})
