import { format, subDays } from 'date-fns'
import { and, desc, eq, gte, inArray, isNull, or, sql } from 'drizzle-orm'
import { v4 } from 'uuid'

import {
  ExerciseAssesmentScore,
  getBalancedMuscleGroupPreferenceFemale,
  getBalancedMuscleGroupPreferenceMale,
  HistoricalResult,
  MuscleGroup,
  muscleGroupSchema,
  OnboardedUser,
  ProvidedExercise,
  StrengthTest,
  WorkingSetState,
  WorkoutExerciseState,
  WorkoutState,
} from '@/mobile/domain'

import { db } from './index'
import * as schema from './schema'

const LOCAL_USER_ID = 'local-user'

export const getAvailableExercises = async (): Promise<ProvidedExercise[]> => {
  const rows = await db
    .select()
    .from(schema.exercise)
    .leftJoin(schema.exerciseMetadata, eq(schema.exerciseMetadata.exerciseId, schema.exercise.id))
    .orderBy(schema.exerciseMetadata.movementPatternPriority)

  return rows.map(r => {
    if (r.exercise_metadata) {
      return {
        type: 'curated' as const,
        muscleGroup: r.exercise.muscleGroup as MuscleGroup,
        movementPattern: r.exercise_metadata.movementPattern,
        name: r.exercise.name,
        minimumLiftingExperience: r.exercise_metadata.minimumLiftingExperience,
        movementPatternPriority: r.exercise_metadata.movementPatternPriority,
        id: r.exercise.id,
      }
    }
    return {
      type: 'custom' as const,
      muscleGroup: r.exercise.muscleGroup as MuscleGroup,
      name: r.exercise.name,
      id: r.exercise.id,
    }
  }) as ProvidedExercise[]
}

export const getExerciseWithHistory = async (exerciseId: string) => {
  const exerciseRow = await db
    .select()
    .from(schema.exercise)
    .where(eq(schema.exercise.id, exerciseId))
    .then(r => r[0])
  if (!exerciseRow) throw new Error('Exercise not found')

  const historicalResultStates = [WorkoutExerciseState.loaded, WorkoutExerciseState.tested]

  const historicalResult = await db
    .select()
    .from(schema.workoutExercise)
    .innerJoin(schema.microcycleWorkout, eq(schema.workoutExercise.workoutId, schema.microcycleWorkout.id))
    .innerJoin(schema.microcycle, eq(schema.microcycleWorkout.microcycleId, schema.microcycle.id))
    .where(
      and(
        eq(schema.workoutExercise.exerciseId, exerciseId),
        inArray(schema.workoutExercise.state, historicalResultStates)
      )
    )
    .orderBy(desc(schema.microcycle.createdAt))
    .limit(1)
    .then(r => r[0])

  const getHistoricalResults = (): HistoricalResult | null => {
    if (historicalResult) {
      const we = historicalResult.workout_exercise
      if (!historicalResultStates.includes(we.state as WorkoutExerciseState)) {
        throw new Error('Illegal State')
      }
      if (we.loadedReps === null || we.loadedWeight === null) {
        throw new Error('Illegal State')
      }
      return {
        state: we.state as HistoricalResult['state'],
        loadedReps: we.loadedReps,
        loadedWeight: we.loadedWeight,
        targetReps: we.targetReps,
        targetSets: we.targetSets,
      }
    }
    return null
  }

  return {
    exercise: {
      id: exerciseRow.id,
      name: exerciseRow.name,
      muscleGroup: exerciseRow.muscleGroup as MuscleGroup,
    },
    historicalResult: getHistoricalResults(),
  }
}

export const getLastTestingWeights = async (
  exercises: Array<{ name: string; muscleGroup: MuscleGroup }>
): Promise<Map<string, number>> => {
  if (exercises.length === 0) return new Map()

  const conditions = exercises.map(e =>
    and(eq(schema.exercise.name, e.name), eq(schema.exercise.muscleGroup, e.muscleGroup))
  )

  const historicalExercises = await db
    .select({
      exerciseId: schema.workoutExercise.exerciseId,
      loadedWeight: schema.workoutExercise.loadedWeight,
    })
    .from(schema.workoutExercise)
    .innerJoin(schema.exercise, eq(schema.workoutExercise.exerciseId, schema.exercise.id))
    .innerJoin(schema.microcycleWorkout, eq(schema.workoutExercise.workoutId, schema.microcycleWorkout.id))
    .innerJoin(schema.microcycle, eq(schema.microcycleWorkout.microcycleId, schema.microcycle.id))
    .where(and(or(...conditions), sql`${schema.workoutExercise.loadedWeight} IS NOT NULL`))
    .orderBy(desc(schema.microcycle.createdAt))

  const exerciseMap = new Map<string, number>()
  for (const row of historicalExercises) {
    if (!exerciseMap.has(row.exerciseId) && row.loadedWeight !== null) {
      exerciseMap.set(row.exerciseId, row.loadedWeight)
    }
  }

  return exerciseMap
}

export const getExerciseLibraryData = async () => {
  const cutoff = subDays(new Date(), 120).getTime()

  const historicalExercises = await db
    .select({
      exerciseId: schema.workoutExercise.exerciseId,
      loadedWeight: schema.workoutExercise.loadedWeight,
      loadedReps: schema.workoutExercise.loadedReps,
    })
    .from(schema.workoutExercise)
    .innerJoin(schema.microcycleWorkout, eq(schema.workoutExercise.workoutId, schema.microcycleWorkout.id))
    .innerJoin(schema.microcycle, eq(schema.microcycleWorkout.microcycleId, schema.microcycle.id))
    .where(
      and(
        inArray(schema.workoutExercise.state, [WorkoutExerciseState.loaded, WorkoutExerciseState.tested]),
        sql`${schema.workoutExercise.loadedWeight} IS NOT NULL`,
        sql`${schema.workoutExercise.loadedReps} IS NOT NULL`,
        gte(schema.microcycle.createdAt, cutoff)
      )
    )
    .orderBy(desc(schema.microcycle.createdAt))

  const historyByExercise = new Map<string, Array<{ weight: number; reps: number }>>()
  for (const h of historicalExercises) {
    if (h.loadedWeight === null || h.loadedReps === null) continue
    const arr = historyByExercise.get(h.exerciseId) ?? []
    arr.push({ weight: h.loadedWeight, reps: h.loadedReps })
    historyByExercise.set(h.exerciseId, arr)
  }

  const rows = await db
    .select()
    .from(schema.exercise)
    .orderBy(schema.exercise.name)

  return rows.map(r => ({
    id: r.id,
    name: r.name,
    muscleGroup: muscleGroupSchema.parse(r.muscleGroup),
    loadingHistory: historyByExercise.get(r.id) ?? [],
  }))
}

export const createExercise = async (input: { name: string; muscleGroup: MuscleGroup }) => {
  await db.insert(schema.exercise).values({
    id: v4(),
    name: input.name,
    muscleGroup: input.muscleGroup,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  })
}

export const storeOnboardingData = async (onboardedUser: OnboardedUser) => {
  const existing = await db
    .select({ id: schema.onboardingData.id })
    .from(schema.onboardingData)
    .where(eq(schema.onboardingData.userId, LOCAL_USER_ID))
    .limit(1)

  const values = {
    userId: LOCAL_USER_ID,
    gender: onboardedUser.gender,
    unit: onboardedUser.unit,
    trainingFrequency: onboardedUser.trainingFrequency,
    trainingDays: onboardedUser.trainingDays,
    liftingExperience: onboardedUser.liftingExperience,
    muscleGroupPreference: onboardedUser.muscleGroupPreference
      ? JSON.stringify(onboardedUser.muscleGroupPreference)
      : null,
    createdAt: Date.now(),
  }

  if (existing.length > 0) {
    await db.update(schema.onboardingData).set(values).where(eq(schema.onboardingData.userId, LOCAL_USER_ID))
  } else {
    await db.insert(schema.onboardingData).values({
      id: v4(),
      ...values,
    })
  }
}

export const getOnboardingData = async (): Promise<OnboardedUser | null> => {
  const row = await db
    .select()
    .from(schema.onboardingData)
    .where(eq(schema.onboardingData.userId, LOCAL_USER_ID))
    .limit(1)
    .then(r => r[0])

  if (!row) return null

  return {
    gender: row.gender as OnboardedUser['gender'],
    unit: row.unit as OnboardedUser['unit'],
    liftingExperience: row.liftingExperience as OnboardedUser['liftingExperience'],
    muscleGroupPreference: row.muscleGroupPreference
      ? JSON.parse(row.muscleGroupPreference)
      : row.gender === 'male'
        ? getBalancedMuscleGroupPreferenceMale()
        : getBalancedMuscleGroupPreferenceFemale(),
    trainingFrequency: row.trainingFrequency as OnboardedUser['trainingFrequency'],
    trainingDays: row.trainingDays,
  }
}

export const getPastTrainingResults = async () => {
  const cutoff = subDays(new Date(), 30).getTime()

  const workouts = await db
    .select()
    .from(schema.microcycleWorkout)
    .innerJoin(schema.microcycle, eq(schema.microcycleWorkout.microcycleId, schema.microcycle.id))
    .innerJoin(schema.mesocycle, eq(schema.microcycle.mesocycleId, schema.mesocycle.id))
    .where(
      and(
        eq(schema.mesocycle.userId, LOCAL_USER_ID),
        gte(schema.microcycleWorkout.completedAt, cutoff),
        eq(schema.microcycleWorkout.state, WorkoutState.completed)
      )
    )
    .orderBy(schema.microcycleWorkout.completedAt)

  const workoutIds = workouts.map(w => w.microcycle_workout.id)
  if (workoutIds.length === 0) return []

  const exercises = await db
    .select()
    .from(schema.workoutExercise)
    .where(inArray(schema.workoutExercise.workoutId, workoutIds))

  const exerciseIds = exercises.map(e => e.id)
  const sets =
    exerciseIds.length > 0
      ? await db
          .select()
          .from(schema.workoutExerciseSet)
          .where(inArray(schema.workoutExerciseSet.workoutExerciseId, exerciseIds))
      : []

  const setsByExercise = new Map<string, (typeof sets)[number][]>()
  for (const set of sets) {
    const arr = setsByExercise.get(set.workoutExerciseId) ?? []
    arr.push(set)
    setsByExercise.set(set.workoutExerciseId, arr)
  }

  const exercisesByWorkout = new Map<string, (typeof exercises)[number][]>()
  for (const ex of exercises) {
    const arr = exercisesByWorkout.get(ex.workoutId) ?? []
    arr.push(ex)
    exercisesByWorkout.set(ex.workoutId, arr)
  }

  const assesmentTable = {
    [ExerciseAssesmentScore.Ideal]: 1,
    [ExerciseAssesmentScore.Hard]: 0,
  }

  return workouts.map(w => {
    const workout = w.microcycle_workout
    if (!workout.completedAt) throw new Error('Illegal State')

    const workoutExercises = exercisesByWorkout.get(workout.id) ?? []
    const finishedExercises = workoutExercises.filter(e => e.state === WorkoutExerciseState.finished)

    const exercisesFeelingAvg =
      finishedExercises.reduce((acc, exercise) => {
        if (!exercise.assesment) throw new Error('Illegal State')
        return acc + assesmentTable[exercise.assesment as ExerciseAssesmentScore]
      }, 0) / finishedExercises.length

    const successRate =
      finishedExercises.reduce((acc, exercise) => {
        const exerciseSets = setsByExercise.get(exercise.id) ?? []
        const failedSets = exerciseSets.filter(s => s.state === WorkingSetState.failed)
        const totalSets = exerciseSets.length
        if (totalSets === 0) return acc
        return acc + (totalSets - failedSets.length) / totalSets
      }, 0) / finishedExercises.length

    return {
      date: format(new Date(workout.completedAt), 'yyyy-MM-dd'),
      feeling: isNaN(exercisesFeelingAvg) ? 1 : exercisesFeelingAvg,
      successRate,
    }
  })
}

export const getUserFlags = async () => {
  const strengthTests = await db
    .select({ id: schema.strengthTest.id })
    .from(schema.strengthTest)
    .where(eq(schema.strengthTest.userId, LOCAL_USER_ID))

  const userRow = await db
    .select()
    .from(schema.user)
    .where(eq(schema.user.id, LOCAL_USER_ID))
    .then(r => r[0])
  if (!userRow) throw new Error('User not found')

  const askedForStrengthTest = userRow.askedForStrengthTest === 1 || strengthTests.length > 0
  const hasStrengthTest = strengthTests.length > 0

  const activeMeso = await db
    .select()
    .from(schema.mesocycle)
    .where(and(eq(schema.mesocycle.userId, LOCAL_USER_ID), isNull(schema.mesocycle.finishedAt)))
    .then(r => r[0])

  const isConfirmedMicrocycle = activeMeso ? activeMeso.isConfirmed === 1 : false

  return {
    askedForStrengthTest,
    hasStrengthTest,
    isConfirmedMicrocycle,
  }
}

export const storeStrengthTest = async (strengthTest: StrengthTest) => {
  const existing = await db
    .select({ id: schema.strengthTest.id })
    .from(schema.strengthTest)
    .where(eq(schema.strengthTest.userId, LOCAL_USER_ID))

  if (existing.length > 0) throw new Error('Strength test already exists')

  await db.insert(schema.strengthTest).values({
    id: v4(),
    userId: LOCAL_USER_ID,
    ...strengthTest,
    testedAt: Date.now(),
  })
}

export const skipStrengthTest = async () => {
  await db.update(schema.user).set({ askedForStrengthTest: 1 }).where(eq(schema.user.id, LOCAL_USER_ID))
}
