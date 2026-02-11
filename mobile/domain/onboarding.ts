import { z } from 'zod'

export enum Unit {
  Metric = 'metric',
  Imperial = 'imperial',
}
const unit = z.nativeEnum(Unit)

const gender = z.enum(['male', 'female'])

export enum LiftingExperience {
  None = 'none',
  Beginner = 'beginner',
  Intermediate = 'intermediate',
  Advanced = 'advanced',
  Expert = 'expert',
}
const liftingExperience = z.nativeEnum(LiftingExperience)

export enum TrainingFrequency {
  TwoDays = 'twoDays',
  ThreeDays = 'threeDays',
  FourDays = 'fourDays',
  FiveDays = 'fiveDays',
  SixDays = 'sixDays',
}
const trainingFrequency = z.nativeEnum(TrainingFrequency)

export const muscleGroupPreference = z
  .object({
    chest: z.number().min(0).max(10),
    back: z.number().min(0).max(10),

    shoulders: z.number().min(0).max(10),
    sideDelts: z.number().min(0).max(10),
    rearDelts: z.number().min(0).max(10),

    arms: z.number().min(0).max(10),
    biceps: z.number().min(0).max(10),
    triceps: z.number().min(0).max(10),

    legs: z.number().min(0).max(10),
    glutes: z.number().min(0).max(10),
    hamstrings: z.number().min(0).max(10),
    quads: z.number().min(0).max(10),

    abs: z.number().min(0).max(10),
  })
  .partial()

export type MuscleGroupPreference = z.infer<typeof muscleGroupPreference>

export const onboardedUserSchema = z.object({
  gender,
  unit,
  liftingExperience,
  muscleGroupPreference: muscleGroupPreference.nullable(),
  trainingFrequency,
  trainingDays: z.number().min(1).max(7),
})
export type OnboardedUser = z.infer<typeof onboardedUserSchema>
