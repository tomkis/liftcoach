import { z } from 'zod'

import { MuscleGroup } from './muscle-group'
import { exerciseSchema, ProgressionType, workingExerciseSchema } from './working-exercise'

export enum WorkoutState {
  pending = 'pending',
  completed = 'completed',
}

export const lifestyleFeedbackSchema = z.object({
  dietQuality: z.number(),
  sleepQuality: z.number(),
})
export type LifestyleFeedback = z.infer<typeof lifestyleFeedbackSchema>

export const workoutSchema = z.object({
  microcycleId: z.string().uuid(),
  id: z.string().uuid(),
  index: z.number(),
  state: z.nativeEnum(WorkoutState),
  active: z.boolean(),
  exercises: z.array(workingExerciseSchema),
  lifestyleFeedback: lifestyleFeedbackSchema.optional(),
})
export type MicrocycleWorkout = z.infer<typeof workoutSchema>

export const workoutStatsExerciseSchema = z.object({
  exercise: exerciseSchema,
  sets: z.number(),
  reps: z.number(),
  weight: z.number().nullable(),
  projected1Rm: z.number().nullable(),
  lastTested1Rm: z.number().nullable(),
  exerciseStatus: z.nativeEnum(ProgressionType).nullable(),
})
export type WorkoutStatsExercise = z.infer<typeof workoutStatsExerciseSchema>

export const workoutStatsSchema = z.object({
  currentWeek: z.number(),
  currentWeekProgress: z.number(),
  exercises: z.array(workoutStatsExerciseSchema),
})
export type WorkoutStats = z.infer<typeof workoutStatsSchema>

const workoutsSchema = z.array(workoutSchema)

export const microcycleSchema = z.object({
  id: z.string().uuid(),
  index: z.number(),
  mesocycleId: z.string().uuid(),
  createdAt: z.string(),
  finishedAt: z.string().optional(),
  workouts: workoutsSchema,
})
export type Microcycle = z.infer<typeof microcycleSchema>

export const mesocycleSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string(),
  isConfirmed: z.boolean(),
  microcycles: z.array(microcycleSchema),
  finishedAt: z.string().optional(),
})
export type Mesocycle = z.infer<typeof mesocycleSchema>

export const muscleGroupPrioritiesSchema = z.array(
  z.object({
    muscleGroup: z.nativeEnum(MuscleGroup),
    priority: z.number(),
  })
)
export type MuscleGroupPriorities = z.infer<typeof muscleGroupPrioritiesSchema>

export const microcycleGeneratorSchema = z.object({
  userLiftingExperience: z.object({
    calculatedExperienceTrustFactor: z.number(),
  }),
  volumeConfig: z.object({
    minSetsPerMicrocycle: z.number(),
    maxSetsPerMicrocycle: z.number(),
    maxSetsPerWorkout: z.number(),
  }),
})
export type MicrocycleGeneratorConfig = z.infer<typeof microcycleGeneratorSchema>

export const configSchema = z.object({
  microcycleGenerator: microcycleGeneratorSchema,
  apiVersion: z.string(),
})
export type AppConfiguration = z.infer<typeof configSchema>

export enum CycleProgressState {
  completed = 'completed',
  failed = 'failed',
  pending = 'pending',
}

export const cycleProgressSchema = z.array(
  z.object({
    sets: z.array(z.nativeEnum(CycleProgressState)),
    isTesting: z.boolean(),
  })
)
export type CycleProgress = z.infer<typeof cycleProgressSchema>
