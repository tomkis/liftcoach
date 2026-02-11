import { WorkoutExerciseState } from '../index'

export interface HistoricalResult {
  state: WorkoutExerciseState.loaded | WorkoutExerciseState.tested
  loadedReps: number
  loadedWeight: number
  targetSets: number
  targetReps: number
}
