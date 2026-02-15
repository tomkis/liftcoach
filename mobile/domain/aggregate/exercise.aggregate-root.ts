import type { ExerciseLibraryData, ExerciseLibraryItem } from '../exercise-library'
import { calculate1RMEplay } from '../microcycle-generator/calculate-weight-from-loaded-exercise'

export class ExerciseAggregateRoot {
  constructor(private readonly data: ExerciseLibraryData) {}

  toLibraryItem(): ExerciseLibraryItem {
    const base = {
      id: this.data.id,
      name: this.data.name,
      muscleGroup: this.data.muscleGroup,
      movementPattern: this.data.movementPattern,
    }

    if (this.data.loadingHistory) {
      return {
        ...base,
        doneInPast: true,
        estimatedOneRepMax: Math.round(
          calculate1RMEplay(this.data.loadingHistory.weight, this.data.loadingHistory.reps)
        ),
        progressState: 'stalled' as const,
      }
    }

    return { ...base, doneInPast: false }
  }
}
