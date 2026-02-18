import type { MuscleGroup, MovementPattern } from './muscle-group'

export type ProgressState = 'progressing' | 'regressing' | 'stalled'

export type ExerciseLibraryData = {
  id: string
  name: string
  muscleGroup: MuscleGroup
  movementPattern: MovementPattern
  loadingHistory: Array<{ weight: number; reps: number }>
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
      progressState: ProgressState | null
    })
  | (ExerciseLibraryItemBase & {
      doneInPast: false
    })
