export type MockExercise = {
  id: string
  name: string
  muscleGroup: string
  movementPattern: string
  e1rm: number | null
  e1rmTrend: 'up' | 'down' | 'flat' | null
  performed: boolean
  recentE1rms: number[]
}

type MuscleGroupData = {
  name: string
  shortName: string
  exercises: MockExercise[]
}

export const MUSCLE_GROUPS: MuscleGroupData[] = [
  {
    name: 'Chest',
    shortName: 'CHE',
    exercises: [
      { id: 'c1', name: 'Flat Bench Press', muscleGroup: 'Chest', movementPattern: 'Chest Middle', e1rm: 95, e1rmTrend: 'up', performed: true, recentE1rms: [88, 90, 92, 95] },
      { id: 'c2', name: 'Incline DB Press', muscleGroup: 'Chest', movementPattern: 'Chest Upper', e1rm: 62, e1rmTrend: 'flat', performed: true, recentE1rms: [60, 61, 62, 62] },
      { id: 'c3', name: 'Cable Fly', muscleGroup: 'Chest', movementPattern: 'Chest Fly', e1rm: null, e1rmTrend: null, performed: false, recentE1rms: [] },
      { id: 'c4', name: 'Pec Deck', muscleGroup: 'Chest', movementPattern: 'Chest Fly', e1rm: 45, e1rmTrend: 'up', performed: true, recentE1rms: [40, 42, 44, 45] },
      { id: 'c5', name: 'Dips (Chest)', muscleGroup: 'Chest', movementPattern: 'Chest Middle', e1rm: null, e1rmTrend: null, performed: false, recentE1rms: [] },
    ],
  },
  {
    name: 'Back',
    shortName: 'BAK',
    exercises: [
      { id: 'b1', name: 'Pull-ups', muscleGroup: 'Back', movementPattern: 'Vertical Pull', e1rm: 85, e1rmTrend: 'up', performed: true, recentE1rms: [78, 80, 83, 85] },
      { id: 'b2', name: 'Barbell Row', muscleGroup: 'Back', movementPattern: 'Horizontal Pull', e1rm: 80, e1rmTrend: 'up', performed: true, recentE1rms: [72, 75, 78, 80] },
      { id: 'b3', name: 'Lat Pulldown', muscleGroup: 'Back', movementPattern: 'Vertical Pull', e1rm: 70, e1rmTrend: 'flat', performed: true, recentE1rms: [68, 70, 69, 70] },
      { id: 'b4', name: 'Seated Cable Row', muscleGroup: 'Back', movementPattern: 'Horizontal Pull', e1rm: null, e1rmTrend: null, performed: false, recentE1rms: [] },
      { id: 'b5', name: 'T-Bar Row', muscleGroup: 'Back', movementPattern: 'Horizontal Pull', e1rm: null, e1rmTrend: null, performed: false, recentE1rms: [] },
    ],
  },
  {
    name: 'Quads',
    shortName: 'QUA',
    exercises: [
      { id: 'q1', name: 'Barbell Back Squat', muscleGroup: 'Quads', movementPattern: 'Squat', e1rm: 120, e1rmTrend: 'up', performed: true, recentE1rms: [110, 115, 118, 120] },
      { id: 'q2', name: 'Leg Press', muscleGroup: 'Quads', movementPattern: 'Press', e1rm: 180, e1rmTrend: 'up', performed: true, recentE1rms: [160, 170, 175, 180] },
      { id: 'q3', name: 'Bulgarian Split Squat', muscleGroup: 'Quads', movementPattern: 'Squat', e1rm: 55, e1rmTrend: 'flat', performed: true, recentE1rms: [52, 54, 55, 55] },
      { id: 'q4', name: 'Leg Extension', muscleGroup: 'Quads', movementPattern: 'Extension', e1rm: 60, e1rmTrend: 'down', performed: true, recentE1rms: [65, 63, 62, 60] },
      { id: 'q5', name: 'Hack Squat', muscleGroup: 'Quads', movementPattern: 'Squat', e1rm: null, e1rmTrend: null, performed: false, recentE1rms: [] },
    ],
  },
  {
    name: 'Hamstrings',
    shortName: 'HAM',
    exercises: [
      { id: 'h1', name: 'Romanian Deadlift', muscleGroup: 'Hamstrings', movementPattern: 'Hip Hinge', e1rm: 100, e1rmTrend: 'up', performed: true, recentE1rms: [90, 95, 98, 100] },
      { id: 'h2', name: 'Lying Leg Curl', muscleGroup: 'Hamstrings', movementPattern: 'Curl', e1rm: 50, e1rmTrend: 'flat', performed: true, recentE1rms: [48, 50, 49, 50] },
      { id: 'h3', name: 'Nordic Curl', muscleGroup: 'Hamstrings', movementPattern: 'Curl', e1rm: null, e1rmTrend: null, performed: false, recentE1rms: [] },
      { id: 'h4', name: 'Seated Leg Curl', muscleGroup: 'Hamstrings', movementPattern: 'Curl', e1rm: 45, e1rmTrend: 'up', performed: true, recentE1rms: [40, 42, 44, 45] },
    ],
  },
  {
    name: 'Glutes',
    shortName: 'GLU',
    exercises: [
      { id: 'g1', name: 'Hip Thrust', muscleGroup: 'Glutes', movementPattern: 'Thrust', e1rm: 130, e1rmTrend: 'up', performed: true, recentE1rms: [120, 125, 128, 130] },
      { id: 'g2', name: 'Cable Kickback', muscleGroup: 'Glutes', movementPattern: 'Abduction', e1rm: 25, e1rmTrend: 'flat', performed: true, recentE1rms: [24, 25, 25, 25] },
      { id: 'g3', name: 'Glute Bridge', muscleGroup: 'Glutes', movementPattern: 'Thrust', e1rm: null, e1rmTrend: null, performed: false, recentE1rms: [] },
      { id: 'g4', name: 'Hip Abduction', muscleGroup: 'Glutes', movementPattern: 'Abduction', e1rm: null, e1rmTrend: null, performed: false, recentE1rms: [] },
    ],
  },
  {
    name: 'Biceps',
    shortName: 'BIC',
    exercises: [
      { id: 'bi1', name: 'Barbell Curl', muscleGroup: 'Biceps', movementPattern: 'Lengthened Curl', e1rm: 40, e1rmTrend: 'up', performed: true, recentE1rms: [36, 38, 39, 40] },
      { id: 'bi2', name: 'Incline DB Curl', muscleGroup: 'Biceps', movementPattern: 'Lengthened Curl', e1rm: 18, e1rmTrend: 'flat', performed: true, recentE1rms: [17, 18, 18, 18] },
      { id: 'bi3', name: 'Hammer Curl', muscleGroup: 'Biceps', movementPattern: 'Brachialis', e1rm: null, e1rmTrend: null, performed: false, recentE1rms: [] },
      { id: 'bi4', name: 'Preacher Curl', muscleGroup: 'Biceps', movementPattern: 'Shortened Curl', e1rm: 30, e1rmTrend: 'down', performed: true, recentE1rms: [33, 32, 31, 30] },
    ],
  },
  {
    name: 'Triceps',
    shortName: 'TRI',
    exercises: [
      { id: 't1', name: 'Overhead Extension', muscleGroup: 'Triceps', movementPattern: 'Long Head', e1rm: 35, e1rmTrend: 'up', performed: true, recentE1rms: [30, 32, 34, 35] },
      { id: 't2', name: 'Skull Crusher', muscleGroup: 'Triceps', movementPattern: 'Long Head', e1rm: 40, e1rmTrend: 'flat', performed: true, recentE1rms: [39, 40, 40, 40] },
      { id: 't3', name: 'Tricep Pushdown', muscleGroup: 'Triceps', movementPattern: 'Short Head', e1rm: null, e1rmTrend: null, performed: false, recentE1rms: [] },
      { id: 't4', name: 'Close-Grip Bench', muscleGroup: 'Triceps', movementPattern: 'Short Head', e1rm: 70, e1rmTrend: 'up', performed: true, recentE1rms: [64, 66, 68, 70] },
    ],
  },
  {
    name: 'Abs',
    shortName: 'ABS',
    exercises: [
      { id: 'a1', name: 'Cable Crunch', muscleGroup: 'Abs', movementPattern: 'Upper Abs', e1rm: 50, e1rmTrend: 'flat', performed: true, recentE1rms: [48, 50, 49, 50] },
      { id: 'a2', name: 'Hanging Leg Raise', muscleGroup: 'Abs', movementPattern: 'Lower Abs', e1rm: null, e1rmTrend: null, performed: false, recentE1rms: [] },
      { id: 'a3', name: 'Ab Rollout', muscleGroup: 'Abs', movementPattern: 'Upper Abs', e1rm: null, e1rmTrend: null, performed: false, recentE1rms: [] },
    ],
  },
  {
    name: 'Side Delts',
    shortName: 'SDL',
    exercises: [
      { id: 'sd1', name: 'DB Lateral Raise', muscleGroup: 'Side Delts', movementPattern: 'Lateral Raise', e1rm: 15, e1rmTrend: 'up', performed: true, recentE1rms: [12, 13, 14, 15] },
      { id: 'sd2', name: 'Cable Lateral Raise', muscleGroup: 'Side Delts', movementPattern: 'Lateral Raise', e1rm: 10, e1rmTrend: 'flat', performed: true, recentE1rms: [10, 10, 10, 10] },
      { id: 'sd3', name: 'Machine Lat Raise', muscleGroup: 'Side Delts', movementPattern: 'Lateral Raise', e1rm: null, e1rmTrend: null, performed: false, recentE1rms: [] },
    ],
  },
  {
    name: 'Rear Delts',
    shortName: 'RDL',
    exercises: [
      { id: 'rd1', name: 'Face Pull', muscleGroup: 'Rear Delts', movementPattern: 'Reverse Fly', e1rm: 30, e1rmTrend: 'up', performed: true, recentE1rms: [25, 27, 29, 30] },
      { id: 'rd2', name: 'Reverse Pec Deck', muscleGroup: 'Rear Delts', movementPattern: 'Reverse Fly', e1rm: 35, e1rmTrend: 'flat', performed: true, recentE1rms: [34, 35, 35, 35] },
      { id: 'rd3', name: 'Rear Delt Fly', muscleGroup: 'Rear Delts', movementPattern: 'Reverse Fly', e1rm: null, e1rmTrend: null, performed: false, recentE1rms: [] },
    ],
  },
]

const ALL_EXERCISES = MUSCLE_GROUPS.flatMap(mg => mg.exercises)
export const PERFORMED_COUNT = ALL_EXERCISES.filter(e => e.performed).length
export const TOTAL_COUNT = ALL_EXERCISES.length
