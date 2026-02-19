import { z } from 'zod'

import { LiftingExperience } from './onboarding'

export enum BodyPart {
  Legs = 'Legs',
  Shoulders = 'Shoulders',
  Arms = 'Arms',
}
export enum MuscleGroup {
  Hamstrings = 'Hamstrings',
  Quads = 'Quads',
  Glutes = 'Glutes',
  Biceps = 'Biceps',
  Triceps = 'Triceps',
  RearDelts = 'RearDelts',
  SideDelts = 'SideDelts',
  Abs = 'Abs',
  Chest = 'Chest',
  Back = 'Back',
}

export const muscleGroupSchema = z.nativeEnum(MuscleGroup)
const muscleGroup = muscleGroupSchema

export const volumePerMuscleGroupSchema = z.record(muscleGroup, z.number())
export type VolumePerMuscleGroup = z.infer<typeof volumePerMuscleGroupSchema>

export type MicrocycleMuscleGroup = Array<{ muscleGroup: MuscleGroup; sets: number }>
export type MicrocycleWorkoutsTemplate = Array<{ exercises: MicrocycleMuscleGroup }>

const microcycleMuscleGroupSchema = z.array(
  z.object({
    muscleGroup: muscleGroup,
    sets: z.number(),
  })
)

export const microcycleWorkoutsTemplateSchema = z.array(
  z.object({
    exercises: microcycleMuscleGroupSchema,
  })
)

export enum SplitType {
  PPL = 'ppl',
  PUSH_PULL = 'push_pull',
  UPPER_LOWER = 'upper_lower',
  FULL_BODY = 'full_body',
}

const splitType = z.nativeEnum(SplitType)

export const splitResultSchema = z.union([
  z.object({
    type: splitType,
    split: microcycleWorkoutsTemplateSchema,
  }),
  z.literal(false),
])

export type SplitResult = z.infer<typeof splitResultSchema>

export enum MovementPattern {
  QuadsPress = 'QuadsPress',
  QuadsSquat = 'QuadsSquat',
  QuadsExtension = 'QuadsExtension',
  HamstringsHipHinge = 'HamstringsHipHinge',
  HamstringsCurl = 'HamstringsCurl',
  GlutesThrust = 'GlutesThrust',
  GlutesSquat = 'GlutesSquat',
  GlutesAbduction = 'GlutesAbduction',
  BicepsLengthenedCurl = 'BicepsLengthenedCurl',
  BicepsShorthenedCurl = 'BicepsShorthenedCurl',
  BicepsBrachialis = 'BicepsBrachialis',
  TricepsLonghead = 'TricepsLonghead',
  TricepsShorthead = 'TricepsShorthead',
  AbsUpper = 'AbsUpper',
  AbsLower = 'AbsLower',
  BackVerticalPull = 'BackVerticalPull',
  BackHorizontalPull = 'BackHorizontalPull',
  ChestUpper = 'ChestUpper',
  ChestMiddle = 'ChestMiddle',
  ChestFly = 'ChestFly',
  RearDeltsReverseFly = 'RearDeltsReverseFly',
  RearDeltsRow = 'RearDeltsRow',
  SideDeltsDumbellLateralRaise = 'SideDeltsDumbellLateralRaise',
  SideDeltsDumbellIsolatedLateralRaise = 'SideDeltsDumbellIsolatedLateralRaise',
  SideDeltsCableLateralRaise = 'SideDeltsCableLateralRaise',
  SideDeltsPress = 'SideDeltsPress',
}
const movementPatternSchema = z.nativeEnum(MovementPattern)

const providedExerciseBase = {
  id: z.string(),
  name: z.string(),
  muscleGroup: muscleGroup,
}

const curatedExerciseSchema = z.object({
  ...providedExerciseBase,
  type: z.literal('curated'),
  movementPattern: movementPatternSchema,
  movementPatternPriority: z.number(),
  minimumLiftingExperience: z.nativeEnum(LiftingExperience),
})

const customExerciseSchema = z.object({
  ...providedExerciseBase,
  type: z.literal('custom'),
})

export const providedExerciseSchema = z.discriminatedUnion('type', [curatedExerciseSchema, customExerciseSchema])
export type ProvidedExercise = z.infer<typeof providedExerciseSchema>
export type CuratedExercise = z.infer<typeof curatedExerciseSchema>
export const assertCurated = (exercise: ProvidedExercise): CuratedExercise => {
  if (exercise.type !== 'curated') {
    throw new Error('Only curated exercises supported')
  }
  return exercise
}

export type MovementPatternPriorities = {
  [MuscleGroup.Quads]: MovementPattern[]
  [MuscleGroup.Hamstrings]: MovementPattern[]
  [MuscleGroup.Glutes]: MovementPattern[]
  [MuscleGroup.Biceps]: MovementPattern[]
  [MuscleGroup.Triceps]: MovementPattern[]
  [MuscleGroup.Abs]: MovementPattern[]
  [MuscleGroup.Back]: MovementPattern[]
  [MuscleGroup.Chest]: MovementPattern[]
  [MuscleGroup.RearDelts]: MovementPattern[]
  [MuscleGroup.SideDelts]: MovementPattern[]
}

export const microcycleWorkoutsTemplateWithExercisesSchema = z.array(
  z.object({
    exercises: z.array(
      z.object({
        muscleGroup: muscleGroup,
        sets: z.number(),
        alternations: z.array(
          z.object({
            name: z.string(),
            muscleGroup: muscleGroup,
          })
        ),
        exercise: providedExerciseSchema,
        targetReps: z.number(),
      })
    ),
  })
)
export type MicrocycleWorkoutsTemplateWithExercises = z.infer<typeof microcycleWorkoutsTemplateWithExercisesSchema>
