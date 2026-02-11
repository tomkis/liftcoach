import { and, desc, eq, inArray, isNull } from 'drizzle-orm'
import {
  ExerciseAssesmentScore,
  FinishedWorkingExercise,
  LifestyleFeedback,
  LoadedWorkingExercise,
  Mesocycle as MesocycleType,
  MesocycleEvent,
  Microcycle as MicrocycleType,
  TestedWorkingExercise,
  toDateTime,
  WorkingExercise,
  WorkingSet,
  WorkoutExerciseState,
  WorkoutState,
} from '@/mobile/domain'
import { match } from 'ts-pattern'

import { db } from './index'
import * as schema from './schema'

const LOCAL_USER_ID = 'local-user'

const byOrderIndex = (a: { orderIndex: number }, b: { orderIndex: number }) => a.orderIndex - b.orderIndex

type WorkoutExerciseRow = typeof schema.workoutExercise.$inferSelect
type ExerciseRow = typeof schema.exercise.$inferSelect
type SetRow = typeof schema.workoutExerciseSet.$inferSelect

const mapWorkoutExerciseToDTO = (
  row: WorkoutExerciseRow,
  exerciseRow: ExerciseRow,
  sets: SetRow[]
): WorkingExercise => {
  const base = {
    id: row.id,
    createdAt: toDateTime(new Date(row.createdAt)),
    orderIndex: row.orderIndex,
    exercise: {
      id: exerciseRow.id,
      name: exerciseRow.name,
      muscleGroup: exerciseRow.muscleGroup,
    },
    targetReps: row.targetReps,
    targetSets: row.targetSets,
  } as const

  const toSet = (set: SetRow) => ({
    id: set.id,
    state: set.state as WorkingSet['state'],
    reps: set.reps,
    weight: set.weight ?? 0,
    orderIndex: set.orderIndex,
  })

  const toLoadingSet = () => {
    if (row.loadedWeight === null) throw new Error('Loaded weight is undefined')
    if (row.loadedReps === null) throw new Error('Loaded reps is undefined')
    return { weight: row.loadedWeight, reps: row.loadedReps }
  }

  const toTestingWeight = () => {
    if (row.testingWeight === null) throw new Error('Testing weight is undefined')
    return row.testingWeight
  }

  const toExerciseAssessment = () => {
    if (row.state !== WorkoutExerciseState.finished) throw new Error('Exercise is not finished')
    if (row.assesment === ExerciseAssesmentScore.Ideal) {
      return { assesment: ExerciseAssesmentScore.Ideal } as const
    }
    if (row.assesment === ExerciseAssesmentScore.Hard && row.hardAssesmentTag) {
      return { assesment: ExerciseAssesmentScore.Hard, assesmentTag: row.hardAssesmentTag } as const
    }
    throw new Error('Exercise is missing assesment')
  }

  return match(row.state as WorkoutExerciseState)
    .with(WorkoutExerciseState.finished, state => ({
      ...base,
      state,
      sets: sets.map(toSet).sort(byOrderIndex),
      exerciseAssesment: toExerciseAssessment(),
    }))
    .with(WorkoutExerciseState.loading, state => ({
      ...base,
      state,
      sets: [] as never[],
    }))
    .with(WorkoutExerciseState.loaded, state => ({
      ...base,
      state,
      loadingSet: toLoadingSet(),
      sets: sets.map(toSet).sort(byOrderIndex),
    }))
    .with(WorkoutExerciseState.pending, state => {
      if (row.progressionType === null) throw new Error('Progression type is null')
      return {
        ...base,
        state,
        progressionType: row.progressionType,
        sets: sets.map(toSet).sort(byOrderIndex),
      }
    })
    .with(WorkoutExerciseState.testing, state => ({
      ...base,
      state,
      testingWeight: toTestingWeight(),
      sets: [] as never[],
    }))
    .with(WorkoutExerciseState.tested, state => ({
      ...base,
      state,
      loadingSet: toLoadingSet(),
      sets: sets.map(toSet).sort(byOrderIndex),
    }))
    .exhaustive() as WorkingExercise
}

const mapMicrocycleToDTO = (
  microcycleRow: typeof schema.microcycle.$inferSelect,
  workoutRows: (typeof schema.microcycleWorkout.$inferSelect)[],
  exerciseRows: WorkoutExerciseRow[],
  exerciseCatalog: Map<string, ExerciseRow>,
  setRows: SetRow[]
): MicrocycleType => {
  const exercisesByWorkout = new Map<string, WorkoutExerciseRow[]>()
  for (const ex of exerciseRows) {
    const arr = exercisesByWorkout.get(ex.workoutId) ?? []
    arr.push(ex)
    exercisesByWorkout.set(ex.workoutId, arr)
  }

  const setsByExercise = new Map<string, SetRow[]>()
  for (const set of setRows) {
    const arr = setsByExercise.get(set.workoutExerciseId) ?? []
    arr.push(set)
    setsByExercise.set(set.workoutExerciseId, arr)
  }

  return {
    id: microcycleRow.id,
    mesocycleId: microcycleRow.mesocycleId,
    index: microcycleRow.index,
    createdAt: toDateTime(new Date(microcycleRow.createdAt)),
    finishedAt: microcycleRow.finishedAt ? toDateTime(new Date(microcycleRow.finishedAt)) : undefined,
    workouts: workoutRows
      .map(workout => {
        const workoutExercises = exercisesByWorkout.get(workout.id) ?? []
        const exercises = workoutExercises.map(we => {
          const exRow = exerciseCatalog.get(we.exerciseId)
          if (!exRow) throw new Error(`Exercise ${we.exerciseId} not found`)
          return mapWorkoutExerciseToDTO(we, exRow, setsByExercise.get(we.id) ?? [])
        })

        const getLifestyleFeedback = (): LifestyleFeedback | undefined => {
          if (workout.state !== WorkoutState.completed) return
          const feedback: Partial<LifestyleFeedback> = {}
          if (workout.sleepQuality) feedback.sleepQuality = workout.sleepQuality
          if (workout.dietQuality) feedback.dietQuality = workout.dietQuality
          if (Object.keys(feedback).length > 0) return feedback as LifestyleFeedback
          return undefined
        }

        return {
          id: workout.id,
          microcycleId: microcycleRow.id,
          index: workout.dayIndex,
          state: workout.state as WorkoutState,
          active: workout.active === 1,
          exercises: exercises.sort(byOrderIndex),
          lifestyleFeedback: getLifestyleFeedback(),
        }
      })
      .sort((a, b) => a.index - b.index),
  }
}

const buildExerciseCatalog = async (exerciseIds: string[]): Promise<Map<string, ExerciseRow>> => {
  if (exerciseIds.length === 0) return new Map()
  const rows = await db
    .select()
    .from(schema.exercise)
    .where(inArray(schema.exercise.id, exerciseIds))
  const map = new Map<string, ExerciseRow>()
  for (const r of rows) map.set(r.id, r)
  return map
}

export const getMesocycleById = async (id: string): Promise<MesocycleType> => {
  const meso = await db.select().from(schema.mesocycle).where(eq(schema.mesocycle.id, id)).then(r => r[0])
  if (!meso) throw new Error('Mesocycle not found')

  const microcycles = await db
    .select()
    .from(schema.microcycle)
    .where(eq(schema.microcycle.mesocycleId, id))

  const microcycleIds = microcycles.map(m => m.id)
  const workouts =
    microcycleIds.length > 0
      ? await db.select().from(schema.microcycleWorkout).where(inArray(schema.microcycleWorkout.microcycleId, microcycleIds))
      : []

  const workoutIds = workouts.map(w => w.id)
  const exercises =
    workoutIds.length > 0
      ? await db.select().from(schema.workoutExercise).where(inArray(schema.workoutExercise.workoutId, workoutIds))
      : []

  const exerciseIds = [...new Set(exercises.map(e => e.exerciseId))]
  const exerciseCatalog = await buildExerciseCatalog(exerciseIds)

  const weIds = exercises.map(e => e.id)
  const sets =
    weIds.length > 0
      ? await db.select().from(schema.workoutExerciseSet).where(inArray(schema.workoutExerciseSet.workoutExerciseId, weIds))
      : []

  return {
    id: meso.id,
    createdAt: toDateTime(new Date(meso.createdAt)),
    isConfirmed: meso.isConfirmed === 1,
    microcycles: microcycles
      .map(mc => {
        const mcWorkouts = workouts.filter(w => w.microcycleId === mc.id)
        const mcWorkoutIds = mcWorkouts.map(w => w.id)
        const mcExercises = exercises.filter(e => mcWorkoutIds.includes(e.workoutId))
        const mcExerciseIds = mcExercises.map(e => e.id)
        const mcSets = sets.filter(s => mcExerciseIds.includes(s.workoutExerciseId))
        return mapMicrocycleToDTO(mc, mcWorkouts, mcExercises, exerciseCatalog, mcSets)
      })
      .sort((a, b) => a.index - b.index),
  }
}

export const getCurrentMesocycleId = async (): Promise<string | null> => {
  const result = await db
    .select({ id: schema.mesocycle.id })
    .from(schema.mesocycle)
    .where(and(eq(schema.mesocycle.userId, LOCAL_USER_ID), isNull(schema.mesocycle.finishedAt)))
    .limit(1)
  return result[0]?.id ?? null
}

export const getAllRecentlyTestedExercises = async (
  exerciseIds: string[]
): Promise<Array<LoadedWorkingExercise | TestedWorkingExercise>> => {
  if (exerciseIds.length === 0) return []

  const finishedStates = [WorkoutExerciseState.loaded, WorkoutExerciseState.tested]
  const rows = await db
    .select()
    .from(schema.workoutExercise)
    .where(
      and(inArray(schema.workoutExercise.exerciseId, exerciseIds), inArray(schema.workoutExercise.state, finishedStates))
    )
    .orderBy(desc(schema.workoutExercise.createdAt))

  const allExerciseIds = [...new Set(rows.map(r => r.exerciseId))]
  const exerciseCatalog = await buildExerciseCatalog(allExerciseIds)

  const weIds = rows.map(r => r.id)
  const sets =
    weIds.length > 0
      ? await db.select().from(schema.workoutExerciseSet).where(inArray(schema.workoutExerciseSet.workoutExerciseId, weIds))
      : []

  const setsByExercise = new Map<string, SetRow[]>()
  for (const set of sets) {
    const arr = setsByExercise.get(set.workoutExerciseId) ?? []
    arr.push(set)
    setsByExercise.set(set.workoutExerciseId, arr)
  }

  return rows.map(row => {
    const exRow = exerciseCatalog.get(row.exerciseId)!
    return mapWorkoutExerciseToDTO(row, exRow, setsByExercise.get(row.id) ?? [])
  }) as Array<LoadedWorkingExercise | TestedWorkingExercise>
}

export const getAllRecentlyFinishedExercises = async (
  days: number,
  exerciseName?: string
): Promise<Array<FinishedWorkingExercise | LoadedWorkingExercise | TestedWorkingExercise>> => {
  const finishedStates = [WorkoutExerciseState.loaded, WorkoutExerciseState.tested, WorkoutExerciseState.finished]
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000

  let exerciseFilter: string | undefined
  if (exerciseName) {
    const exRow = await db
      .select()
      .from(schema.exercise)
      .where(eq(schema.exercise.name, exerciseName))
      .then(r => r[0])
    exerciseFilter = exRow?.id
  }

  const mesosInRange = await db
    .select({ id: schema.mesocycle.id })
    .from(schema.mesocycle)
    .where(and(eq(schema.mesocycle.userId, LOCAL_USER_ID)))

  const mesoIds = mesosInRange.map(m => m.id)
  if (mesoIds.length === 0) return []

  const microcycleRows = await db
    .select()
    .from(schema.microcycle)
    .where(inArray(schema.microcycle.mesocycleId, mesoIds))

  const recentMicrocycles = microcycleRows.filter(mc => mc.createdAt >= cutoff)
  if (recentMicrocycles.length === 0) return []

  const mcIds = recentMicrocycles.map(mc => mc.id)
  const workouts = await db
    .select()
    .from(schema.microcycleWorkout)
    .where(inArray(schema.microcycleWorkout.microcycleId, mcIds))

  const workoutIds = workouts.map(w => w.id)
  if (workoutIds.length === 0) return []

  const exercisesQuery = db
    .select()
    .from(schema.workoutExercise)
    .where(
      and(
        inArray(schema.workoutExercise.workoutId, workoutIds),
        inArray(schema.workoutExercise.state, finishedStates)
      )
    )
    .orderBy(desc(schema.workoutExercise.createdAt))

  let rows = await exercisesQuery
  if (exerciseFilter) {
    rows = rows.filter(r => r.exerciseId === exerciseFilter)
  }

  const allExerciseIds = [...new Set(rows.map(r => r.exerciseId))]
  const exerciseCatalog = await buildExerciseCatalog(allExerciseIds)

  const weIds = rows.map(r => r.id)
  const sets =
    weIds.length > 0
      ? await db.select().from(schema.workoutExerciseSet).where(inArray(schema.workoutExerciseSet.workoutExerciseId, weIds))
      : []

  const setsByExercise = new Map<string, SetRow[]>()
  for (const set of sets) {
    const arr = setsByExercise.get(set.workoutExerciseId) ?? []
    arr.push(set)
    setsByExercise.set(set.workoutExerciseId, arr)
  }

  return rows.map(row => {
    const exRow = exerciseCatalog.get(row.exerciseId)!
    return mapWorkoutExerciseToDTO(row, exRow, setsByExercise.get(row.id) ?? [])
  }) as Array<FinishedWorkingExercise | LoadedWorkingExercise | TestedWorkingExercise>
}

export const getMesocycleIdByWorkoutId = async (workoutId: string): Promise<string> => {
  const workout = await db
    .select()
    .from(schema.microcycleWorkout)
    .where(eq(schema.microcycleWorkout.id, workoutId))
    .then(r => r[0])
  if (!workout) throw new Error('Workout not found')

  const mc = await db
    .select()
    .from(schema.microcycle)
    .where(eq(schema.microcycle.id, workout.microcycleId))
    .then(r => r[0])
  if (!mc) throw new Error('Microcycle not found')

  return mc.mesocycleId
}

const insertMicrocycle = async (newMicrocycle: MicrocycleType) => {
  await db.insert(schema.microcycle).values({
    id: newMicrocycle.id,
    mesocycleId: newMicrocycle.mesocycleId,
    createdAt: new Date(newMicrocycle.createdAt).getTime(),
    index: newMicrocycle.index,
  })

  for (const workout of newMicrocycle.workouts) {
    await db.insert(schema.microcycleWorkout).values({
      id: workout.id,
      microcycleId: newMicrocycle.id,
      dayIndex: workout.index,
      state: workout.state,
      active: workout.active ? 1 : 0,
    })

    for (const workoutExercise of workout.exercises) {
      await db.insert(schema.workoutExercise).values({
        id: workoutExercise.id,
        workoutId: workout.id,
        exerciseId: workoutExercise.exercise.id,
        state: workoutExercise.state,
        targetReps: workoutExercise.targetReps,
        targetSets: workoutExercise.targetSets,
        orderIndex: workoutExercise.orderIndex,
        createdAt: new Date(workoutExercise.createdAt).getTime(),
        progressionType:
          workoutExercise.state === WorkoutExerciseState.pending ? workoutExercise.progressionType : null,
        testingWeight:
          workoutExercise.state === WorkoutExerciseState.testing ? workoutExercise.testingWeight : null,
      })

      for (const set of workoutExercise.sets) {
        const now = Date.now()
        await db.insert(schema.workoutExerciseSet).values({
          id: set.id,
          workoutExerciseId: workoutExercise.id,
          state: set.state,
          reps: set.reps,
          weight: set.weight,
          orderIndex: set.orderIndex,
          createdAt: now,
          updatedAt: now,
        })
      }
    }
  }
}

export const updateMesocycle = async (events: MesocycleEvent[]) => {
  for (const event of events) {
    await match(event)
      .with({ type: 'MesocycleInitialized' }, async event => {
        await db.insert(schema.mesocycle).values({
          id: event.payload.mesocycleId,
          userId: LOCAL_USER_ID,
          createdAt: new Date(event.payload.when).getTime(),
          isConfirmed: event.payload.isConfirmed ? 1 : 0,
        })
        await insertMicrocycle(event.payload.microcycle)
      })
      .with({ type: 'MicrocycleExtended' }, async event => {
        await insertMicrocycle(event.payload.newMicrocycle)
      })
      .with({ type: 'WorkoutStarted' }, async event => {
        await db
          .update(schema.microcycleWorkout)
          .set({ active: 1 })
          .where(eq(schema.microcycleWorkout.id, event.payload.workoutId))
      })
      .with({ type: 'WorkoutFinished' }, async event => {
        await db
          .update(schema.microcycleWorkout)
          .set({
            state: WorkoutState.completed,
            completedAt: new Date(event.payload.when).getTime(),
            active: 0,
          })
          .where(eq(schema.microcycleWorkout.id, event.payload.workoutId))
      })
      .with({ type: 'MicrocycleFinished' }, async event => {
        await db
          .update(schema.microcycle)
          .set({ finishedAt: new Date(event.payload.when).getTime() })
          .where(eq(schema.microcycle.id, event.payload.microcycleId))
      })
      .with({ type: 'MesocycleFinished' }, async event => {
        await db
          .update(schema.mesocycle)
          .set({ finishedAt: new Date(event.payload.when).getTime() })
          .where(eq(schema.mesocycle.id, event.payload.mesocycleId))
      })
      .with({ type: 'MesocycleTerminated' }, async event => {
        await db
          .update(schema.mesocycle)
          .set({ finishedAt: new Date(event.payload.when).getTime() })
          .where(eq(schema.mesocycle.id, event.payload.id))
      })
      .with({ type: 'MesocycleConfirmed' }, async event => {
        await db
          .update(schema.mesocycle)
          .set({ isConfirmed: 1 })
          .where(eq(schema.mesocycle.id, event.payload.mesocycleId))
      })
      .with({ type: 'ExerciseLoaded' }, async event => {
        await db
          .update(schema.workoutExercise)
          .set({
            state: WorkoutExerciseState.loaded,
            loadedReps: event.payload.loadingSet.reps,
            loadedWeight: event.payload.loadingSet.weight,
          })
          .where(eq(schema.workoutExercise.id, event.payload.exerciseId))
      })
      .with({ type: 'ExerciseTested' }, async event => {
        await db
          .update(schema.workoutExercise)
          .set({
            state: WorkoutExerciseState.tested,
            loadedReps: event.payload.loadingSet.reps,
            loadedWeight: event.payload.loadingSet.weight,
          })
          .where(eq(schema.workoutExercise.id, event.payload.exerciseId))
      })
      .with({ type: 'ExerciseFinished' }, async event => {
        const assessmentData = match(event.payload.exerciseAssesment)
          .with({ assesment: ExerciseAssesmentScore.Hard }, assessment => ({
            assesment: assessment.assesment as string,
            hardAssesmentTag: assessment.assesmentTag as string,
          }))
          .with({ assesment: ExerciseAssesmentScore.Ideal }, assessment => ({
            assesment: assessment.assesment as string,
            hardAssesmentTag: null,
          }))
          .exhaustive()

        await db
          .update(schema.workoutExercise)
          .set({
            state: WorkoutExerciseState.finished,
            ...assessmentData,
          })
          .where(eq(schema.workoutExercise.id, event.payload.exerciseId))
      })
      .with({ type: 'ExerciseReplaced' }, async event => {
        await db
          .delete(schema.workoutExerciseSet)
          .where(eq(schema.workoutExerciseSet.workoutExerciseId, event.payload.workoutExerciseId))
        await db.delete(schema.workoutExercise).where(eq(schema.workoutExercise.id, event.payload.workoutExerciseId))

        const newEx = event.payload.newExercise
        await db.insert(schema.workoutExercise).values({
          id: newEx.id,
          workoutId: event.payload.workoutId,
          exerciseId: newEx.exercise.id,
          state: newEx.state,
          targetReps: newEx.targetReps,
          targetSets: newEx.targetSets,
          orderIndex: newEx.orderIndex,
          createdAt: new Date(newEx.createdAt).getTime(),
          progressionType: newEx.state === WorkoutExerciseState.pending ? newEx.progressionType : null,
          testingWeight: newEx.state === WorkoutExerciseState.testing ? newEx.testingWeight : null,
        })

        for (const set of newEx.sets) {
          const now = Date.now()
          await db.insert(schema.workoutExerciseSet).values({
            id: set.id,
            workoutExerciseId: newEx.id,
            state: set.state,
            reps: set.reps,
            weight: set.weight,
            orderIndex: set.orderIndex,
            createdAt: now,
            updatedAt: now,
          })
        }
      })
      .with({ type: 'ExerciseUpdated' }, async event => {
        await db
          .update(schema.workoutExercise)
          .set({ updatedAt: Date.now() })
          .where(eq(schema.workoutExercise.id, event.payload.workoutExerciseId))
      })
      .with({ type: 'SetStateHasChanged' }, async event => {
        await db
          .update(schema.workoutExerciseSet)
          .set({ state: event.payload.state })
          .where(eq(schema.workoutExerciseSet.id, event.payload.setId))
      })
      .with({ type: 'ExerciseWeightChangedPending' }, async event => {
        await db
          .update(schema.workoutExerciseSet)
          .set({ weight: event.payload.weight })
          .where(eq(schema.workoutExerciseSet.workoutExerciseId, event.payload.workoutExerciseId))
      })
      .with({ type: 'ExerciseWeightChangedTesting' }, async event => {
        await db
          .update(schema.workoutExercise)
          .set({ testingWeight: event.payload.weight })
          .where(eq(schema.workoutExercise.id, event.payload.workoutExerciseId))
      })
      .with({ type: 'ExerciseRepsChangedDueToWeightChange' }, async event => {
        await db
          .update(schema.workoutExerciseSet)
          .set({ reps: event.payload.newReps })
          .where(eq(schema.workoutExerciseSet.workoutExerciseId, event.payload.workoutExerciseId))
      })
      .with({ type: 'LifestyleFeedbackProvided' }, async event => {
        await db
          .update(schema.microcycleWorkout)
          .set({
            sleepQuality: event.payload.lifestyleFeedback.sleepQuality,
            dietQuality: event.payload.lifestyleFeedback.dietQuality,
          })
          .where(eq(schema.microcycleWorkout.id, event.payload.workoutId))
      })
      .with({ type: 'TestingSetsGenerated' }, async event => {
        for (const set of event.payload.sets) {
          const now = Date.now()
          await db.insert(schema.workoutExerciseSet).values({
            id: set.id,
            workoutExerciseId: event.payload.exerciseId,
            state: set.state,
            reps: set.reps,
            weight: set.weight,
            orderIndex: set.orderIndex,
            createdAt: now,
            updatedAt: now,
          })
        }
      })
      .exhaustive()
  }
}
