import { describe, expect, it, vi } from 'vitest'

import { MicrocycleWorkoutsTemplate, MovementPattern, MuscleGroup, ProvidedExercise } from '../../muscle-group'
import { LiftingExperience } from '../../onboarding'

import { ExercisePicker } from './exercise-picker'
import { ExerciseProvider } from './exercise-provider'

const makeExercise = (id: string, muscleGroup: MuscleGroup, movementPattern: MovementPattern): ProvidedExercise => ({
  id,
  name: id,
  muscleGroup,
  movementPattern,
  movementPatternPriority: 0,
  minimumLiftingExperience: LiftingExperience.None,
})

describe('ExercisePicker', () => {
  describe('set redistribution on exercise exhaustion', () => {
    it('redistributes orphaned sets evenly across remaining exercises of same muscle group', async () => {
      const exerciseA = makeExercise('a', MuscleGroup.Chest, MovementPattern.ChestUpper)
      const exerciseB = makeExercise('b', MuscleGroup.Chest, MovementPattern.ChestMiddle)

      const provider = new ExerciseProvider([])
      let callCount = 0
      vi.spyOn(provider, 'provideExercise').mockImplementation(() => {
        callCount++
        if (callCount === 1) return exerciseA
        if (callCount === 2) return exerciseB
        return undefined
      })

      const template: MicrocycleWorkoutsTemplate = [
        {
          exercises: [
            { muscleGroup: MuscleGroup.Chest, sets: 3 },
            { muscleGroup: MuscleGroup.Chest, sets: 3 },
            { muscleGroup: MuscleGroup.Chest, sets: 4 },
          ],
        },
      ]

      const result = await new ExercisePicker(provider).pickExercises(template, LiftingExperience.None)

      expect(result).toHaveLength(1)
      expect(result[0].exercises).toHaveLength(2)

      const totalSets = result[0].exercises.reduce((sum, e) => sum + e.sets, 0)
      expect(totalSets).toBe(10)

      expect(result[0].exercises[0].sets).toBe(5)
      expect(result[0].exercises[1].sets).toBe(5)
    })

    it('distributes remainder to first exercises', async () => {
      const exerciseA = makeExercise('a', MuscleGroup.Back, MovementPattern.BackVerticalPull)
      const exerciseB = makeExercise('b', MuscleGroup.Back, MovementPattern.BackHorizontalPull)

      const provider = new ExerciseProvider([])
      let callCount = 0
      vi.spyOn(provider, 'provideExercise').mockImplementation(() => {
        callCount++
        if (callCount === 1) return exerciseA
        if (callCount === 2) return exerciseB
        return undefined
      })

      const template: MicrocycleWorkoutsTemplate = [
        {
          exercises: [
            { muscleGroup: MuscleGroup.Back, sets: 3 },
            { muscleGroup: MuscleGroup.Back, sets: 3 },
            { muscleGroup: MuscleGroup.Back, sets: 3 },
          ],
        },
      ]

      const result = await new ExercisePicker(provider).pickExercises(template, LiftingExperience.None)

      expect(result[0].exercises).toHaveLength(2)
      expect(result[0].exercises[0].sets).toBe(5)
      expect(result[0].exercises[1].sets).toBe(4)
    })

    it('filters out empty workout days', async () => {
      const exerciseA = makeExercise('a', MuscleGroup.Abs, MovementPattern.AbsUpper)

      const provider = new ExerciseProvider([])
      let callCount = 0
      vi.spyOn(provider, 'provideExercise').mockImplementation(() => {
        callCount++
        if (callCount === 1) return exerciseA
        return undefined
      })

      const template: MicrocycleWorkoutsTemplate = [
        { exercises: [{ muscleGroup: MuscleGroup.Abs, sets: 3 }] },
        { exercises: [{ muscleGroup: MuscleGroup.Abs, sets: 3 }] },
      ]

      const result = await new ExercisePicker(provider).pickExercises(template, LiftingExperience.None)

      expect(result).toHaveLength(1)
      expect(result[0].exercises[0].sets).toBe(6)
    })
  })
})
