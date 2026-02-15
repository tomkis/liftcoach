import type { MuscleGroup, MovementPattern } from './muscle-group'

export type ProgressState = 'progressing' | 'regressing' | 'stalled'

export type ExerciseLibraryData = {
  id: string
  name: string
  muscleGroup: MuscleGroup
  movementPattern: MovementPattern
  loadingHistory: { weight: number; reps: number } | null
}

type ExerciseLibraryItemBase = {
  id: string
  name: string
  muscleGroup: MuscleGroup
  movementPattern: MovementPattern
}

export type ExerciseLibraryItem =
  | (ExerciseLibraryItemBase & {
      doneInPast: true
      estimatedOneRepMax: number
      progressState: ProgressState
    })
  | (ExerciseLibraryItemBase & {
      doneInPast: false
    })
