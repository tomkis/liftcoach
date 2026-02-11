import { z } from 'zod'

import { MuscleGroup } from './muscle-group'

export enum WorkoutExerciseState {
  loading = 'loading',
  testing = 'testing',
  tested = 'tested',
  pending = 'pending',
  finished = 'finished',
  loaded = 'loaded',
}

export enum WorkingSetState {
  failed = 'failed',
  done = 'done',
  pending = 'pending',
}

export enum ExerciseAssesmentScore {
  Ideal = 'ideal',
  Hard = 'hard',
}

export enum HardAssesmentTag {
  TooHeavy = 'too_heavy',
  TooHighVolume = 'too_high_volume',
  BadForm = 'bad_form',
  Other = 'other',
}

export enum ProgressionType {
  KeepProgressSuboptimalLifestyle = 'keep_progress_suboptimal_lifestyle',
  ProgressedReps = 'progressed_reps',
  NoProgressFailure = 'no_progress_failure',
  LoweredWeightTooHeavy = 'lowered_weight_too_heavy',
  LoweredWeightBadForm = 'lowered_weight_bad_form',
  LoweredWeightTooManyFailures = 'lowered_weight_too_many_failures',
  RegressTooMuchVolume = 'regress_too_much_volume',
}

const progressionTypeSchema = z.nativeEnum(ProgressionType)

const failedSetSchema = z.object({
  id: z.string().uuid(),
  state: z.literal(WorkingSetState.failed),
  orderIndex: z.number(),
  weight: z.number(),
  reps: z.number(),
})
const doneSetSchema = z.object({
  id: z.string().uuid(),
  state: z.literal(WorkingSetState.done),
  orderIndex: z.number(),
  weight: z.number(),
  reps: z.number(),
})
const pendingSetSchema = z.object({
  id: z.string().uuid(),
  state: z.literal(WorkingSetState.pending),
  orderIndex: z.number(),
  weight: z.number(),
  reps: z.number(),
})
export const exerciseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  muscleGroup: z.nativeEnum(MuscleGroup),
})
export type Exercise = z.infer<typeof exerciseSchema>

export const workingSetSchema = z.discriminatedUnion('state', [failedSetSchema, doneSetSchema, pendingSetSchema])
export type WorkingSet = z.infer<typeof workingSetSchema>

export const loadingSetSchema = z.object({
  weight: z.number(),
  reps: z.number(),
})
export type LoadingSet = z.infer<typeof loadingSetSchema>

const workingExerciseBaseSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  exercise: exerciseSchema,
  orderIndex: z.number(),
  targetSets: z.number(),
  targetReps: z.number(),
})
export const loadingWorkingExerciseSchema = workingExerciseBaseSchema.extend({
  state: z.literal(WorkoutExerciseState.loading),
  sets: z.array(z.never()),
})
export type LoadingWorkingExercise = z.infer<typeof loadingWorkingExerciseSchema>

export const testingWorkingExerciseSchema = workingExerciseBaseSchema.extend({
  state: z.literal(WorkoutExerciseState.testing),
  testingWeight: z.number(),
  sets: z.array(z.never()),
})
export type TestingWorkingExercise = z.infer<typeof testingWorkingExerciseSchema>

export const testedWorkingExerciseScehma = workingExerciseBaseSchema.extend({
  state: z.literal(WorkoutExerciseState.tested),
  loadingSet: loadingSetSchema,
  sets: z.array(workingSetSchema),
})
export type TestedWorkingExercise = z.infer<typeof testedWorkingExerciseScehma>

export const loadedWorkingExerciseSchema = workingExerciseBaseSchema.extend({
  state: z.literal(WorkoutExerciseState.loaded),
  loadingSet: loadingSetSchema,
  sets: z.array(workingSetSchema),
})
export type LoadedWorkingExercise = z.infer<typeof loadedWorkingExerciseSchema>

const exerciseAssesmentIdeal = z.object({
  assesment: z.literal(ExerciseAssesmentScore.Ideal),
})
const exerciseAssesmentHard = z.object({
  assesment: z.literal(ExerciseAssesmentScore.Hard),
  assesmentTag: z.nativeEnum(HardAssesmentTag),
})
export const exerciseAssesment = z.discriminatedUnion('assesment', [exerciseAssesmentIdeal, exerciseAssesmentHard])
export type ExerciseAssesment = z.infer<typeof exerciseAssesment>

export const finishedWorkingExerciseSchema = workingExerciseBaseSchema.extend({
  state: z.literal(WorkoutExerciseState.finished),
  sets: z.array(workingSetSchema),
  exerciseAssesment,
})
export type FinishedWorkingExercise = z.infer<typeof finishedWorkingExerciseSchema>

export const pendingWorkingExerciseSchema = workingExerciseBaseSchema.extend({
  state: z.literal(WorkoutExerciseState.pending),
  progressionType: progressionTypeSchema,
  sets: z.array(workingSetSchema),
})
export type PendingWorkingExercise = z.infer<typeof pendingWorkingExerciseSchema>

export const workingExerciseSchema = z.discriminatedUnion('state', [
  finishedWorkingExerciseSchema,
  pendingWorkingExerciseSchema,
  loadedWorkingExerciseSchema,
  loadingWorkingExerciseSchema,
  testingWorkingExerciseSchema,
  testedWorkingExerciseScehma,
])
export type WorkingExercise = z.infer<typeof workingExerciseSchema>
