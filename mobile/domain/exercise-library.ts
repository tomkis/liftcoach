import type { MuscleGroup } from './muscle-group'

export type ProgressState = 'progressing' | 'regressing' | 'stalled'

export type ExerciseLibraryData = {
  id: string
  name: string
  muscleGroup: MuscleGroup
  loadingHistory: Array<{ weight: number; reps: number }>
}

type ExerciseLibraryItemBase = {
  id: string
  name: string
  muscleGroup: MuscleGroup
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
