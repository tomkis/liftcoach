import { v4 } from 'uuid'
import { describe, expect, it } from 'vitest'

import { exerciseSeedData } from '../../db/seed/exercises'
import { AuditTrail } from '../audit-trail'
import { MicrocycleGeneratorConfig } from '../microcycle'
import { ProvidedExercise } from '../muscle-group'
import { LiftingExperience, MuscleGroupPreference, OnboardedUser, TrainingFrequency, Unit } from '../onboarding'
import { MicrocycleGenerator } from './generate-microcycle'

const availableExercises: ProvidedExercise[] = exerciseSeedData.map((e, i) => ({
  ...e,
  id: `exercise-${i}`,
  muscleGroup: e.muscleGroup as ProvidedExercise['muscleGroup'],
  movementPattern: e.movementPattern as ProvidedExercise['movementPattern'],
  minimumLiftingExperience: e.minimumLiftingExperience as ProvidedExercise['minimumLiftingExperience'],
}))

const config: MicrocycleGeneratorConfig = {
  userLiftingExperience: { calculatedExperienceTrustFactor: 0.7 },
  volumeConfig: {
    minSetsPerMicrocycle: 50,
    maxSetsPerMicrocycle: 80,
    maxSetsPerWorkout: 25,
  },
}

const frequencies: TrainingFrequency[] = [
  TrainingFrequency.TwoDays,
  TrainingFrequency.ThreeDays,
  TrainingFrequency.FourDays,
  TrainingFrequency.FiveDays,
  TrainingFrequency.SixDays,
]

const experiences: LiftingExperience[] = [
  LiftingExperience.None,
  LiftingExperience.Beginner,
  LiftingExperience.Intermediate,
  LiftingExperience.Advanced,
  LiftingExperience.Expert,
]

const frequencyToDays: Record<TrainingFrequency, number> = {
  [TrainingFrequency.TwoDays]: 2,
  [TrainingFrequency.ThreeDays]: 3,
  [TrainingFrequency.FourDays]: 4,
  [TrainingFrequency.FiveDays]: 5,
  [TrainingFrequency.SixDays]: 6,
}

function makeUser(
  frequency: TrainingFrequency,
  experience: LiftingExperience,
  gender: 'male' | 'female' = 'male',
  muscleGroupPreference: MuscleGroupPreference | null = null
): OnboardedUser {
  return {
    gender,
    unit: Unit.Metric,
    liftingExperience: experience,
    muscleGroupPreference,
    trainingFrequency: frequency,
    trainingDays: frequencyToDays[frequency],
  }
}

async function generateForUser(user: OnboardedUser) {
  const generator = new MicrocycleGenerator(user, config, new AuditTrail())
  return generator.generateMicrocycle(v4(), [], availableExercises, 1)
}

describe('generateMicrocycle', () => {
  describe('balanced preferences (default)', () => {
    for (const frequency of frequencies) {
      for (const experience of experiences) {
        for (const gender of ['male', 'female'] as const) {
          it(`${frequency} / ${experience} / ${gender}`, async () => {
            const user = makeUser(frequency, experience, gender)
            const microcycle = await generateForUser(user)

            expect(microcycle.workouts.length).toBeGreaterThan(0)
            for (const workout of microcycle.workouts) {
              expect(workout.exercises.length).toBeGreaterThan(0)
            }
          })
        }
      }
    }
  })

  describe('high priority single muscle group', () => {
    const highPriorityPresets: Array<{ name: string; preference: MuscleGroupPreference }> = [
      { name: 'chest-focused', preference: { chest: 10, back: 3, shoulders: 3, arms: 3, legs: 3, abs: 3 } },
      { name: 'back-focused', preference: { chest: 3, back: 10, shoulders: 3, arms: 3, legs: 3, abs: 3 } },
      { name: 'legs-focused', preference: { chest: 3, back: 3, shoulders: 3, arms: 3, legs: 10, abs: 3 } },
      { name: 'arms-focused', preference: { chest: 3, back: 3, shoulders: 3, arms: 10, legs: 3, abs: 3 } },
      { name: 'shoulders-focused', preference: { chest: 3, back: 3, shoulders: 10, arms: 3, legs: 3, abs: 3 } },
      { name: 'abs-focused', preference: { chest: 3, back: 3, shoulders: 3, arms: 3, legs: 3, abs: 10 } },
    ]

    for (const { name, preference } of highPriorityPresets) {
      for (const frequency of frequencies) {
        for (const experience of experiences) {
          const testName = `${name} / ${frequency} / ${experience}`

          it(testName, async () => {
            const user = makeUser(frequency, experience, 'male', preference)
            const microcycle = await generateForUser(user)

            expect(microcycle.workouts.length).toBeGreaterThan(0)
            for (const workout of microcycle.workouts) {
              expect(workout.exercises.length).toBeGreaterThan(0)
            }
          })
        }
      }
    }
  })

  describe('extreme custom preferences', () => {
    const extremePresets: Array<{ name: string; preference: MuscleGroupPreference }> = [
      {
        name: 'all-max',
        preference: { chest: 10, back: 10, shoulders: 10, arms: 10, legs: 10, abs: 10 },
      },
      {
        name: 'granular-max-side-delts',
        preference: {
          chest: 5,
          back: 5,
          sideDelts: 10,
          rearDelts: 10,
          biceps: 5,
          triceps: 5,
          quads: 5,
          hamstrings: 5,
          glutes: 5,
          abs: 5,
        },
      },
      {
        name: 'granular-max-glutes',
        preference: {
          chest: 3,
          back: 3,
          sideDelts: 3,
          rearDelts: 3,
          biceps: 3,
          triceps: 3,
          quads: 3,
          hamstrings: 3,
          glutes: 10,
          abs: 3,
        },
      },
    ]

    const skipExtreme = new Set(['granular-max-glutes / sixDays / none', 'granular-max-glutes / sixDays / beginner'])

    for (const { name, preference } of extremePresets) {
      for (const frequency of frequencies) {
        for (const experience of experiences) {
          const testName = `${name} / ${frequency} / ${experience}`
          if (skipExtreme.has(testName)) continue

          it(testName, async () => {
            const user = makeUser(frequency, experience, 'male', preference)
            const microcycle = await generateForUser(user)

            expect(microcycle.workouts.length).toBeGreaterThan(0)
            for (const workout of microcycle.workouts) {
              expect(workout.exercises.length).toBeGreaterThan(0)
            }
          })
        }
      }
    }
  })
})
