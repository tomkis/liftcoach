import type { MuscleGroup, MovementPattern } from './muscle-group'

export type ProgressState = 'progressing' | 'regressing' | 'stalled'

export type ExerciseLibraryItem = {
  id: string
  name: string
  muscleGroup: MuscleGroup
  movementPattern: MovementPattern
  estimatedOneRepMax: number
  progressState: ProgressState
  doneInPast: boolean
}
