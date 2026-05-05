import { Microcycle } from '../microcycle'

export type SeedSet = { orderIndex: number; weight: number | null; reps: number | null }
export type CustomMicrocycleSeed = Map<string, SeedSet[]>

export const buildCustomMicrocycleSeed = (priorLastMicrocycle: Microcycle): CustomMicrocycleSeed => {
  const seed: CustomMicrocycleSeed = new Map()

  priorLastMicrocycle.workouts.forEach(workout => {
    workout.exercises.forEach(exercise => {
      if (seed.has(exercise.exercise.id)) return
      if (exercise.sets.length === 0) return

      seed.set(
        exercise.exercise.id,
        exercise.sets.map(set => ({
          orderIndex: set.orderIndex,
          weight: set.weight,
          reps: set.reps,
        }))
      )
    })
  })

  return seed
}
