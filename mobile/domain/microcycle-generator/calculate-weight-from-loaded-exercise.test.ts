import { describe, expect, it } from 'vitest'

import { calculateWeightFromLoadedExercise } from './calculate-weight-from-loaded-exercise'

describe('calculateWeightFromLoadedExercise', () => {
  it('20kg 8 reps failure → integer working weight (real user scenario)', () => {
    const coefficients = [0.85, 0.95, 1, 1.05, 1.06, 1.1]

    for (const coeff of coefficients) {
      const result = calculateWeightFromLoadedExercise(
        { loadingSet: { weight: 20, reps: 8 }, targetReps: 10 },
        7,
        coeff
      )

      expect(Number.isInteger(result), `coeff ${coeff} → ${result}`).toBe(true)
    }
  })

  it('always proposes whole-number weights when loaded with integer weight', () => {
    const result = calculateWeightFromLoadedExercise(
      { loadingSet: { weight: 20, reps: 8 }, targetReps: 8 },
      8,
      1
    )

    expect(Number.isInteger(result)).toBe(true)
  })

  it('always proposes whole-number weights when loaded with fractional weight', () => {
    const result = calculateWeightFromLoadedExercise(
      { loadingSet: { weight: 17.5, reps: 8 }, targetReps: 8 },
      8,
      1
    )

    expect(Number.isInteger(result)).toBe(true)
  })

  it('proposes whole numbers across various RPE targets', () => {
    const rpeValues = [6, 7, 8, 9, 10] as const

    for (const rpe of rpeValues) {
      const result = calculateWeightFromLoadedExercise(
        { loadingSet: { weight: 62.5, reps: 10 }, targetReps: 8 },
        rpe,
        1
      )

      expect(Number.isInteger(result), `RPE ${rpe} → ${result}`).toBe(true)
    }
  })

  it('proposes whole numbers with user coefficient', () => {
    const result = calculateWeightFromLoadedExercise(
      { loadingSet: { weight: 50, reps: 8 }, targetReps: 10 },
      8,
      0.85
    )

    expect(Number.isInteger(result)).toBe(true)
  })

  it('never proposes fractions regardless of input combination', () => {
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
              coeff
            )

            expect(
              Number.isInteger(result),
              `w=${w} r=${r} rpe=${rpe} coeff=${coeff} → ${result}`
            ).toBe(true)
          }
        }
      }
    }
  })
})
