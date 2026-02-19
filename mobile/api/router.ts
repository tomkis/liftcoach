import {
  exerciseAssesment,
  lifestyleFeedbackSchema,
  loadingSetSchema,
  microcycleWorkoutsTemplateSchema,
  microcycleWorkoutsTemplateWithExercisesSchema,
  muscleGroupPreference,
  muscleGroupSchema,
  onboardedUserSchema,
  strengthTestSchema,
  volumePerMuscleGroupSchema,
  WorkingSetState,
} from '@/mobile/domain'
import { z } from 'zod'

import { trpcInstance, trpcProcedureAuthProcedure } from './trpc'

const user = trpcInstance.router({
  me: trpcProcedureAuthProcedure.input(z.void()).query(async ({ ctx }) => {
    return await ctx.user.me(ctx.session)
  }),
  getOnboardingInfo: trpcProcedureAuthProcedure.input(z.void()).query(async ({ ctx }) => {
    return await ctx.user.getOnboardingInfo(ctx.session)
  }),
  getDashboardData: trpcProcedureAuthProcedure.input(z.void()).query(async ({ ctx }) => {
    const workoutStats = await ctx.workout.getWorkoutStats(ctx.session)
    const dashboardData = await ctx.user.getDashboardData(ctx.session)

    return { workoutStats, dashboardData }
  }),
  skipStrengthTest: trpcProcedureAuthProcedure.input(z.void()).mutation(async ({ ctx }) => {
    return await ctx.user.skipStrengthTest(ctx.session)
  }),
  storeStrengthTest: trpcProcedureAuthProcedure
    .input(z.object({ strengthTest: strengthTestSchema }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.user.storeStrengthTest(ctx.session, input.strengthTest)
    }),
  confirmMesocycle: trpcProcedureAuthProcedure
    .input(z.void())
    .mutation(async ({ ctx }) => {
      await ctx.workout.confirmMesocycle(ctx.session)
    }),
})

const workout = trpcInstance.router({
  generateMicrocycle: trpcProcedureAuthProcedure
    .input(z.object({ onboardedUser: onboardedUserSchema }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.workout.generateMicrocycle(ctx.session, input.onboardedUser)
    }),
  getCurrentMicrocycle: trpcProcedureAuthProcedure.input(z.void()).query(async ({ ctx }) => {
    return await ctx.workout.getCurrentMicrocycle(ctx.session)
  }),
  getActivePlanSummary: trpcProcedureAuthProcedure.input(z.void()).query(async ({ ctx }) => {
    return await ctx.workout.getActivePlanSummary(ctx.session)
  }),
  getWorkoutStats: trpcProcedureAuthProcedure.input(z.void()).query(async ({ ctx }) => {
    return await ctx.workout.getWorkoutStats(ctx.session)
  }),
  startWorkout: trpcProcedureAuthProcedure.input(z.void()).mutation(async ({ ctx }) => {
    return await ctx.workout.startWorkout(ctx.session)
  }),
  getWorkout: trpcProcedureAuthProcedure.input(z.void()).query(async ({ ctx }) => {
    return await ctx.workout.getWorkout(ctx.session)
  }),
  getCycleProgress: trpcProcedureAuthProcedure
    .input(z.object({ exerciseId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.workout.getCycleProgress(ctx.session, input.exerciseId)
    }),
  finishWorkout: trpcProcedureAuthProcedure
    .input(z.object({ workoutId: z.string(), lifestyleFeedback: lifestyleFeedbackSchema.optional() }))
    .mutation(
      async ({ ctx, input }) => await ctx.workout.finishWorkout(ctx.session, input.workoutId, input.lifestyleFeedback)
    ),
  getMuscleGroupPreference: trpcProcedureAuthProcedure.query(
    async ({ ctx }) => await ctx.workout.getBalancedMuscleGroupPreference(ctx.session)
  ),
  proposeExerciseReplacementQuery: trpcProcedureAuthProcedure
    .input(z.object({ workoutExerciseId: z.string() }))
    .query(
      async ({ ctx, input }) => await ctx.workout.proposeExerciseReplacement(ctx.session, input.workoutExerciseId)
    ),
  replaceExercise: trpcProcedureAuthProcedure
    .input(z.object({ workoutExerciseId: z.string(), replacementExerciseId: z.string(), workoutId: z.string() }))
    .mutation(
      async ({ ctx, input }) =>
        await ctx.workout.replaceExercise(
          ctx.session,
          input.workoutExerciseId,
          input.replacementExerciseId,
          input.workoutId
        )
    ),

  exerciseTested: trpcProcedureAuthProcedure
    .input(z.object({ loadingSet: loadingSetSchema, workoutExerciseId: z.string(), workoutId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.workout.exerciseTested(ctx.session, input.workoutId, input.workoutExerciseId, input.loadingSet)
    }),
  exerciseLoaded: trpcProcedureAuthProcedure
    .input(
      z.object({
        loadingSet: loadingSetSchema,
        workoutExerciseId: z.string(),
        workoutId: z.string(),
        reachedFailure: z.boolean().optional().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.workout.exerciseLoaded(
        ctx.session,
        input.workoutId,
        input.workoutExerciseId,
        input.loadingSet,
        input.reachedFailure
      )
    }),
  exerciseFinished: trpcProcedureAuthProcedure
    .input(z.object({ workoutId: z.string(), workingExerciseId: z.string(), exerciseAssesment }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.workout.exerciseFinished(
        ctx.session,
        input.workoutId,
        input.workingExerciseId,
        input.exerciseAssesment
      )
    }),
  exerciseSetStateChanged: trpcProcedureAuthProcedure
    .input(
      z.object({
        workoutId: z.string(),
        workoutExerciseId: z.string(),
        setId: z.string(),
        state: z.nativeEnum(WorkingSetState),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.workout.exerciseSetStateChanged(
        ctx.session,
        input.workoutId,
        input.workoutExerciseId,
        input.setId,
        input.state
      )
    }),
  exerciseChangeWeight: trpcProcedureAuthProcedure
    .input(z.object({ workoutId: z.string(), workingExerciseId: z.string(), weight: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.workout.exerciseChangeWeight(ctx.session, input.workoutId, input.workingExerciseId, input.weight)
    }),
  changeMicrocycle: trpcProcedureAuthProcedure
    .input(z.object({ template: microcycleWorkoutsTemplateWithExercisesSchema }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.workout.changeMicrocycle(ctx.session, input.template)
    }),
})

const exerciseLibrary = trpcInstance.router({
  getExercises: trpcProcedureAuthProcedure.input(z.void()).query(async ({ ctx }) => {
    return await ctx.exerciseLibrary.getExercises(ctx.session)
  }),
  createExercise: trpcProcedureAuthProcedure
    .input(z.object({ name: z.string(), muscleGroup: muscleGroupSchema }))
    .mutation(async ({ ctx, input }) => {
      await ctx.exerciseLibrary.createExercise(ctx.session, input)
    }),
})

const mesoPlanner = trpcInstance.router({
  proposeSplit: trpcProcedureAuthProcedure
    .input(
      z.object({
        volumePerMuscleGroup: volumePerMuscleGroupSchema,
        trainingDays: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.mesoPlanner.proposeSplit(ctx.session, input.volumePerMuscleGroup, input.trainingDays)
    }),
  proposeVolume: trpcProcedureAuthProcedure
    .input(
      z.object({
        muscleGroupPreference: muscleGroupPreference,
        trainingDays: z.number(),
      })
    )
    .query(
      async ({ ctx, input }) =>
        await ctx.mesoPlanner.proposeVolume(ctx.session, input.muscleGroupPreference, input.trainingDays)
    ),
  getAvailableExercises: trpcProcedureAuthProcedure.input(z.void()).query(async ({ ctx }) => {
    return await ctx.mesoPlanner.getAvailableExercises(ctx.session)
  }),
  getExercises: trpcProcedureAuthProcedure
    .input(z.object({ template: microcycleWorkoutsTemplateSchema }))
    .query(async ({ ctx, input }) => {
      return await ctx.mesoPlanner.getExercises(ctx.session, input.template)
    }),
})

export const router = trpcInstance.router({
  user,
  workout,
  mesoPlanner,
  exerciseLibrary,
})

export type Contract = typeof router
