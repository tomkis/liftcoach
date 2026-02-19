import { describe, expect, it, vi } from 'vitest'

import { MicrocycleWorkoutsTemplate, MovementPattern, MuscleGroup, ProvidedExercise } from '../../muscle-group'
import { LiftingExperience } from '../../onboarding'

import { ExercisePicker } from './exercise-picker'
import { ExerciseProvider } from './exercise-provider'

const makeExercise = (id: string, muscleGroup: MuscleGroup, movementPattern: MovementPattern): ProvidedExercise => ({
  type: 'curated' as const,
  id,
  name: id,
  muscleGroup,
  movementPattern,
  movementPatternPriority: 0,
  minimumLiftingExperience: LiftingExperience.None,
})

const makeCustomExercise = (id: string, muscleGroup: MuscleGroup): ProvidedExercise => ({
  type: 'custom' as const,
  id,
  name: id,
  muscleGroup,
})

describe('ExercisePicker', () => {
  describe('custom exercise handling', () => {
    it('picks custom before curated for same muscle group', () => {
      const custom = makeCustomExercise('custom-1', MuscleGroup.Chest)
      const curated = makeExercise('curated-1', MuscleGroup.Chest, MovementPattern.ChestUpper)
      const provider = new ExerciseProvider([custom, curated])

      const result = provider.provideExercise(MuscleGroup.Chest, 0, [], LiftingExperience.None)
      expect(result).toBe(custom)
    })

    it('custom ignores experience threshold', () => {
      const custom = makeCustomExercise('custom-1', MuscleGroup.Chest)
      const curated: ProvidedExercise = {
        type: 'curated' as const,
        id: 'curated-1',
        name: 'curated-1',
        muscleGroup: MuscleGroup.Chest,
        movementPattern: MovementPattern.ChestUpper,
        movementPatternPriority: 0,
        minimumLiftingExperience: LiftingExperience.Expert,
      }
      const provider = new ExerciseProvider([custom, curated])

      const result = provider.provideExercise(MuscleGroup.Chest, 0, [], LiftingExperience.None)
      expect(result).toBe(custom)
    })

    it('multiple customs consume all slots', () => {
      const custom1 = makeCustomExercise('custom-1', MuscleGroup.Chest)
      const custom2 = makeCustomExercise('custom-2', MuscleGroup.Chest)
      const curated = makeExercise('curated-1', MuscleGroup.Chest, MovementPattern.ChestUpper)
      const provider = new ExerciseProvider([custom1, custom2, curated])

      const first = provider.provideExercise(MuscleGroup.Chest, 0, [], LiftingExperience.None)
      expect(first).toBe(custom1)

      const second = provider.provideExercise(MuscleGroup.Chest, 1, [custom1], LiftingExperience.None)
      expect(second).toBe(custom2)

      const third = provider.provideExercise(MuscleGroup.Chest, 2, [custom1, custom2], LiftingExperience.None)
      expect(third).toBe(curated)
    })

    it('falls back to curated after customs exhausted', () => {
      const custom = makeCustomExercise('custom-1', MuscleGroup.Chest)
      const curated = makeExercise('curated-1', MuscleGroup.Chest, MovementPattern.ChestUpper)
      const provider = new ExerciseProvider([custom, curated])

      const result = provider.provideExercise(MuscleGroup.Chest, 1, [custom], LiftingExperience.None)
      expect(result).toBe(curated)
    })

    it('replaceExercise lists custom before curated', () => {
      const original = makeExercise('orig', MuscleGroup.Chest, MovementPattern.ChestUpper)
      const custom = makeCustomExercise('custom-1', MuscleGroup.Chest)
      const curated = makeExercise('curated-1', MuscleGroup.Chest, MovementPattern.ChestMiddle)
      const provider = new ExerciseProvider([original, custom, curated])

      const replacements = provider.replaceExercise('orig', MuscleGroup.Chest, [])
      expect(replacements[0]).toBe(custom)
    })

    it('replaceExercise works when original is custom', () => {
      const original = makeCustomExercise('custom-orig', MuscleGroup.Chest)
      const curated = makeExercise('curated-1', MuscleGroup.Chest, MovementPattern.ChestUpper)
      const custom2 = makeCustomExercise('custom-2', MuscleGroup.Chest)
      const provider = new ExerciseProvider([original, curated, custom2])

      const replacements = provider.replaceExercise('custom-orig', MuscleGroup.Chest, [])
      expect(replacements[0]).toBe(custom2)
      expect(replacements).toContain(curated)
      expect(replacements).not.toContain(original)
    })
  })

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

    it('throws when a workout day has no exercises', async () => {
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

      await expect(
        new ExercisePicker(provider).pickExercises(template, LiftingExperience.None)
      ).rejects.toThrow('No exercises could be picked for workout day 1')
    })
  })
})
