import { index, integer, real, sqliteTable, text, unique, uniqueIndex } from 'drizzle-orm/sqlite-core'

export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  createdAt: integer('created_at').notNull(),
  askedForStrengthTest: integer('asked_for_strength_test').notNull().default(0),
})

export const onboardingData = sqliteTable(
  'onboarding_data',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id),
    unit: text('unit').notNull(),
    trainingFrequency: text('training_frequency').notNull(),
    trainingDays: integer('training_days').notNull(),
    liftingExperience: text('lifting_experience').notNull(),
    muscleGroupPreference: text('muscle_group_preference'),
    gender: text('gender').notNull(),
    createdAt: integer('created_at').notNull(),
  },
  table => [uniqueIndex('onboarding_data_user_id_unique').on(table.userId)]
)

export const exercise = sqliteTable('exercise', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  muscleGroup: text('muscle_group').notNull(),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
})

export const exerciseMetadata = sqliteTable(
  'exercise_metadata',
  {
    id: text('id').primaryKey(),
    exerciseId: text('exercise_id')
      .notNull()
      .references(() => exercise.id),
    movementPattern: text('movement_pattern').notNull(),
    movementPatternPriority: integer('movement_pattern_priority').notNull(),
    minimumLiftingExperience: text('minimum_lifting_experience').notNull().default('none'),
  },
  table => [unique('exercise_metadata_exercise_id_unique').on(table.exerciseId)]
)

export const mesocycle = sqliteTable(
  'mesocycle',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id),
    isConfirmed: integer('is_confirmed').notNull(),
    finishedAt: integer('finished_at'),
    createdAt: integer('created_at').notNull(),
  },
  table => [index('mesocycle_user_id_idx').on(table.userId)]
)

export const microcycle = sqliteTable(
  'microcycle',
  {
    id: text('id').primaryKey(),
    mesocycleId: text('mesocycle_id')
      .notNull()
      .references(() => mesocycle.id),
    index: integer('index').notNull(),
    finishedAt: integer('finished_at'),
    createdAt: integer('created_at').notNull(),
  },
  table => [index('microcycle_mesocycle_id_idx').on(table.mesocycleId)]
)

export const microcycleWorkout = sqliteTable(
  'microcycle_workout',
  {
    id: text('id').primaryKey(),
    microcycleId: text('microcycle_id')
      .notNull()
      .references(() => microcycle.id),
    dayIndex: integer('day_index').notNull(),
    state: text('state').notNull(),
    active: integer('active').notNull(),
    completedAt: integer('completed_at'),
    sleepQuality: integer('sleep_quality'),
    dietQuality: integer('diet_quality'),
  },
  table => [index('microcycle_workout_microcycle_id_idx').on(table.microcycleId)]
)

export const workoutExercise = sqliteTable(
  'workout_exercise',
  {
    id: text('id').primaryKey(),
    workoutId: text('workout_id')
      .notNull()
      .references(() => microcycleWorkout.id),
    exerciseId: text('exercise_id')
      .notNull()
      .references(() => exercise.id),
    state: text('state').notNull(),
    targetReps: integer('target_reps').notNull(),
    targetSets: integer('target_sets').notNull(),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at'),
    loadedWeight: real('loaded_weight'),
    testingWeight: real('testing_weight'),
    loadedReps: integer('loaded_reps'),
    progressionType: text('progression_type'),
    orderIndex: integer('order_index').notNull(),
    assesment: text('assesment'),
    hardAssesmentTag: text('hard_assesment_tag'),
  },
  table => [
    index('workout_exercise_workout_id_idx').on(table.workoutId),
    index('workout_exercise_exercise_id_idx').on(table.exerciseId),
  ]
)

export const workoutExerciseSet = sqliteTable(
  'workout_exercise_set',
  {
    id: text('id').primaryKey(),
    workoutExerciseId: text('workout_exercise_id')
      .notNull()
      .references(() => workoutExercise.id),
    state: text('state').notNull(),
    orderIndex: integer('order_index').notNull(),
    reps: integer('reps').notNull(),
    weight: real('weight').notNull(),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
  },
  table => [index('workout_exercise_set_workout_exercise_id_idx').on(table.workoutExerciseId)]
)

export const strengthTest = sqliteTable(
  'strength_test',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id),
    upperFrontIndex: real('upper_front_index').notNull(),
    upperFrontReps: text('upper_front_reps').notNull(),
    upperBackIndex: real('upper_back_index').notNull(),
    upperBackReps: text('upper_back_reps').notNull(),
    lowerFrontIndex: real('lower_front_index').notNull(),
    lowerFrontReps: text('lower_front_reps').notNull(),
    lowerBackIndex: real('lower_back_index').notNull(),
    lowerBackReps: text('lower_back_reps').notNull(),
    testedAt: integer('tested_at').notNull(),
  },
  table => [index('strength_test_user_id_idx').on(table.userId)]
)
